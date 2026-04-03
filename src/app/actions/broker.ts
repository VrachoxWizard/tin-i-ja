'use server'

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { enforceRateLimit } from "@/lib/rate-limit";
import { DEAL_ROOM_BUCKET } from "@/lib/deal-room";
import { validateDealRoomUpload, sanitizeFileName } from "@/lib/upload-validation";
import type { ActionResult } from "@/app/actions/dealflow";

const decisionSchema = z.enum(["approve", "reject"]);

async function requireBroker() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "broker") {
    throw new Error("Forbidden: broker role required");
  }

  return { supabase, user };
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

  const { supabase, user } = await requireBroker();

  const { data: nda } = await supabase
    .from("ndas")
    .select("id, listing_id")
    .eq("id", ndaId)
    .single();

  if (!nda) {
    return { error: "NDA zahtjev nije pronađen." };
  }

  const isAssigned = await verifyBrokerAssignment(supabase, user.id, nda.listing_id);
  if (!isAssigned) {
    return { error: "Nemate ovlasti za ovaj oglas." };
  }

  const nextStatus = decision === "approve" ? "signed" : "rejected";
  const { error } = await supabase
    .from("ndas")
    .update({
      status: nextStatus,
      signed_at: decision === "approve" ? new Date().toISOString() : null,
    })
    .eq("id", ndaId);

  if (error) {
    return { error: "Ažuriranje NDA statusa nije uspjelo." };
  }

  if (decision === "approve") {
    await supabase
      .from("listings")
      .update({ status: "under_nda" })
      .eq("id", nda.listing_id);
  }

  revalidatePath("/dashboard/broker");
  revalidatePath("/dashboard/seller");
  revalidatePath("/dashboard/buyer");

  return {
    success: true,
    message:
      decision === "approve"
        ? "NDA je odobren i deal room je otključan."
        : "NDA zahtjev je odbijen.",
  };
}

// ── Broker Deal Room File Upload ─────────────────────────────────

export async function brokerUploadDealRoomFileAction(
  listingId: string,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase, user } = await requireBroker();

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

  const uploadResult = validateDealRoomUpload(formData);
  if (!uploadResult.ok) {
    return { error: uploadResult.error };
  }
  const { file, docType } = uploadResult;

  const filePath = `${listingId}/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(DEAL_ROOM_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    return { error: "Upload dokumenta nije uspio." };
  }

  const { error: insertError } = await supabase.from("deal_room_files").insert({
    listing_id: listingId,
    file_path: filePath,
    doc_type: docType,
  });

  if (insertError) {
    return { error: "Spremanje dokumenta nije uspjelo." };
  }

  revalidatePath(`/dashboard/broker/deal-room/${listingId}`);
  revalidatePath(`/dashboard/seller/deal-room/${listingId}`);
  revalidatePath(`/dashboard/buyer/deal-room/${listingId}`);

  return {
    success: true,
    message: "Dokument je dodan u deal room.",
  };
}
