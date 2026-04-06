'use server'

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enforceRateLimit } from "@/lib/rate-limit";
import { DEAL_ROOM_BUCKET } from "@/lib/deal-room";
import { validateDealRoomUpload, sanitizeFileName } from "@/lib/upload-validation";
import type { ActionResult } from "@/app/actions/dealflow";
import { getDashboardPathForRole } from "@/lib/contracts";
import { performNdaReview } from "@/lib/nda-review";
import { logAuditEvent } from "@/lib/audit";
import { createNotification } from "@/lib/notifications";

const decisionSchema = z.enum(["approve", "reject"]);
const uuidSchema = z.string().uuid("Neispravan ID.");

async function requireBroker() {
  const supabase = await createClient();
  const admin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, suspended_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.suspended_at) {
    await supabase.auth.signOut();
    redirect("/login?error=account_suspended");
  }

  if (profile?.role !== "broker") {
    redirect(getDashboardPathForRole(profile?.role));
  }

  return { supabase, admin, user };
}

async function verifyBrokerAssignment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  brokerId: string,
  listingId: string,
): Promise<boolean> {
  const { data: listing } = await supabase
    .from("listings")
    .select("broker_id")
    .eq("id", listingId)
    .single();

  return listing?.broker_id === brokerId;
}

// ── Broker NDA Review ────────────────────────────────────────────

export async function brokerReviewNdaAction(
  ndaId: string,
  decision: "approve" | "reject",
): Promise<ActionResult> {
  const parsedDecision = decisionSchema.safeParse(decision);
  if (!parsedDecision.success) {
    return { error: "Nepoznata NDA odluka." };
  }
  if (!uuidSchema.safeParse(ndaId).success) {
    return { error: "Neispravan NDA ID." };
  }

  const { supabase, admin, user } = await requireBroker();

  const { data: nda } = await supabase
    .from("ndas")
    .select("id, listing_id, status")
    .eq("id", ndaId)
    .single();

  if (!nda) {
    return { error: "NDA zahtjev nije pronađen." };
  }

  const isAssigned = await verifyBrokerAssignment(supabase, user.id, nda.listing_id);
  if (!isAssigned) {
    return { error: "Nemate ovlasti za ovaj oglas." };
  }

  if (nda.status !== "pending") {
    return { error: "NDA zahtjev je već obrađen." };
  }

  const result = await performNdaReview(admin, ndaId, nda.listing_id, decision, ["/dashboard/broker", "/dashboard/seller"]);

  if (result.success) {
    await logAuditEvent(supabase, {
      action: decision === "approve" ? "nda.approve" : "nda.reject",
      entityType: "nda",
      entityId: ndaId,
      metadata: { listing_id: nda.listing_id, reviewed_by: "broker" },
    });
  }

  return result;
}

// ── Broker Deal Room File Upload ─────────────────────────────────

export async function brokerUploadDealRoomFileAction(
  listingId: string,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase, admin, user } = await requireBroker();

  if (!uuidSchema.safeParse(listingId).success) {
    return { error: "Neispravan ID oglasa." };
  }

  const isAssigned = await verifyBrokerAssignment(supabase, user.id, listingId);
  if (!isAssigned) {
    return { error: "Nemate ovlasti za ovaj oglas." };
  }

  const uploadAllowed = await enforceRateLimit({
    key: user.id,
    route: "brokerUploadDealRoomFile",
    limit: 10,
    windowMs: 60_000,
  });
  if (!uploadAllowed) {
    return { error: "Previše uploada. Pokušajte ponovno za minutu." };
  }

  const uploadResult = await validateDealRoomUpload(formData);
  if (!uploadResult.ok) {
    return { error: uploadResult.error };
  }
  const { file, docType } = uploadResult;

  const filePath = `${listingId}/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error: uploadError } = await admin.storage
    .from(DEAL_ROOM_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    return { error: "Upload dokumenta nije uspio." };
  }

  const { error: insertError } = await admin.from("deal_room_files").insert({
    listing_id: listingId,
    file_path: filePath,
    doc_type: docType,
  });

  if (insertError) {
    await admin.storage.from(DEAL_ROOM_BUCKET).remove([filePath]);
    return { error: "Spremanje dokumenta nije uspjelo." };
  }

  await logAuditEvent(supabase, {
    action: "file.upload",
    entityType: "file",
    entityId: listingId,
    metadata: { doc_type: docType, file_name: file.name, file_size: file.size, uploaded_by: "broker" },
  });

  revalidatePath(`/dashboard/broker/deal-room/${listingId}`);
  revalidatePath(`/dashboard/seller/deal-room/${listingId}`);
  revalidatePath(`/dashboard/buyer/deal-room/${listingId}`);

  after(async () => {
    const [{ data: signedNdas }, { data: listing }] = await Promise.all([
      admin
        .from("ndas")
        .select("buyer_id")
        .eq("listing_id", listingId)
        .eq("status", "signed"),
      admin
        .from("listings")
        .select("public_code")
        .eq("id", listingId)
        .maybeSingle(),
    ]);

    for (const nda of signedNdas ?? []) {
      await createNotification({
        admin,
        userId: nda.buyer_id,
        type: "deal_room_upload",
        title: "Novi dokument u deal roomu",
        body: `Broker je dodao novu datoteku (${docType}) za oglas ${listing?.public_code ?? listingId}.`,
        entityId: listingId,
      });
    }
  });

  return {
    success: true,
    message: "Dokument je dodan u deal room.",
  };
}
