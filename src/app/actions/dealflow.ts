'use server'

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeHtml } from "@/lib/sanitize";
import { validateBlindTeaserAnonymity } from "@/lib/anonymity";
import { syncMatchesForBuyerProfile, syncMatchesForListing } from "@/lib/matches";
import { DEAL_ROOM_BUCKET } from "@/lib/deal-room";
import { BUYER_TYPES } from "@/lib/contracts";
import { enforceRateLimit } from "@/lib/rate-limit";
import { validateDealRoomUpload, sanitizeFileName } from "@/lib/upload-validation";
import { performNdaReview } from "@/lib/nda-review";
import { logAuditEvent } from "@/lib/audit";
import { sendNdaRequestEmail } from "@/lib/email";
import { createNotification } from "@/lib/notifications";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dealflow.hr";
const requestableListingStatuses = new Set(["active", "under_nda"]);

const uuidSchema = z.string().uuid("Neispravan ID.");

const sellerListingSchema = z.object({
  company_name: z.string().min(2).max(120),
  industry: z.string().min(2).max(120),
  region: z.string().min(2).max(120),
  year_founded: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  employees: z.coerce.number().int().min(1).max(100000),
  revenue: z.coerce.number().min(0),
  ebitda: z.coerce.number().min(0),
  sde: z.coerce.number().min(0).optional().default(0),
  asking_price: z.coerce.number().min(0),
  reason_for_sale: z.string().min(12).max(1200),
  transition_support: z.string().min(12).max(1200),
  owner_dependency_score: z.coerce.number().int().min(1).max(5),
  digital_maturity: z.coerce.number().int().min(1).max(5),
});

const buyerProfileSchema = z.object({
  buyer_type: z.enum(BUYER_TYPES),
  target_ev_min: z.coerce.number().min(0),
  target_ev_max: z.coerce.number().min(0),
  target_revenue_min: z.coerce.number().min(0),
  target_revenue_max: z.coerce.number().min(0),
  target_industries: z.array(z.string().min(1)).min(1),
  target_regions: z.array(z.string().min(1)).min(1),
  investment_thesis: z.string().min(12).max(1200),
});

const decisionSchema = z.enum(["approve", "reject"]);

export interface ActionResult {
  error?: string;
  message?: string;
  success?: boolean;
  listingId?: string;
  publicCode?: string;
}

async function requireUser() {
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
    .select("role, full_name, email, suspended_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.role) {
    redirect("/login");
  }

  if (profile.suspended_at) {
    await supabase.auth.signOut();
    redirect("/login?error=account_suspended");
  }

  return {
    supabase,
    admin,
    user,
    profile,
  };
}

function parseMultiSelectField(formData: FormData, fieldName: string) {
  const repeatedValues = formData
    .getAll(fieldName)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  if (repeatedValues.length > 0) {
    return Array.from(new Set(repeatedValues));
  }

  const rawValue = formData.get(fieldName);
  if (typeof rawValue !== "string") {
    return [];
  }

  return Array.from(
    new Set(
      rawValue
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function parseBuyerProfileInput(formData: FormData) {
  return buyerProfileSchema.safeParse({
    buyer_type: formData.get("buyer_type"),
    target_ev_min: formData.get("target_ev_min"),
    target_ev_max: formData.get("target_ev_max"),
    target_revenue_min: formData.get("target_revenue_min"),
    target_revenue_max: formData.get("target_revenue_max"),
    target_industries: parseMultiSelectField(formData, "target_industries"),
    target_regions: parseMultiSelectField(formData, "target_regions"),
    investment_thesis: formData.get("investment_thesis"),
  });
}

async function generateBlindTeaser(input: z.infer<typeof sellerListingSchema>) {
  const prompt = `
    Generiraj anonimni poslovni teaser na hrvatskom jeziku.
    Strogo zabrani spominjanje imena tvrtke, vlasnika, email adrese, web stranice, telefona,
    točnog grada, ulice, OIB-a, registracijskog broja ili bilo kojeg identifikatora.
    Dozvoljeno je spomenuti samo regiju i sektor.

    Uključi:
    - sektor
    - regiju na visokoj razini
    - kratki financijski trend
    - broj zaposlenih
    - razlog prodaje
    - prijelaznu podršku
    - diskretan profesionalni ton

    Ulazni podaci:
    - Industrija: ${input.industry}
    - Regija: ${input.region}
    - Godina osnivanja: ${input.year_founded}
    - Broj zaposlenih: ${input.employees}
    - Prihod: ${input.revenue} EUR
    - EBITDA: ${input.ebitda} EUR
    - SDE: ${input.sde} EUR
    - Tražena cijena: ${input.asking_price} EUR
    - Razlog prodaje: ${input.reason_for_sale}
    - Prijelazna podrška: ${input.transition_support}
    - Ovisnost o vlasniku: ${input.owner_dependency_score}/5
    - Digitalna zrelost: ${input.digital_maturity}/5

    Vrati samo čisti HTML koristeći <h3>, <p>, <ul>, <li> i <strong>.
  `;

  const { text } = await generateText({
    model: google("gemini-2.5-pro"),
    prompt,
  });

  return sanitizeHtml(text.replace(/```html|```/gi, "").trim());
}

function getRoleError(role: string | undefined, allowed: string[]) {
  if (role && allowed.includes(role)) {
    return null;
  }

  return "Nemate ovlasti za ovu radnju.";
}

async function removeListingDealRoomArtifacts(
  admin: ReturnType<typeof createAdminClient>,
  listingId: string,
) {
  const { data: files } = await admin
    .from("deal_room_files")
    .select("file_path")
    .eq("listing_id", listingId);

  const filePaths = (files ?? []).map((file) => file.file_path);

  if (filePaths.length > 0) {
    const { error: storageError } = await admin.storage
      .from(DEAL_ROOM_BUCKET)
      .remove(filePaths);

    if (storageError) {
      console.error("[deal-room] Failed to remove storage artifacts:", storageError.message);
    }
  }

  const { error: fileDeleteError } = await admin
    .from("deal_room_files")
    .delete()
    .eq("listing_id", listingId);

  if (fileDeleteError) {
    console.error("[deal-room] Failed to remove file rows:", fileDeleteError.message);
  }
}

export async function saveSellerListingAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = sellerListingSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return { error: "Provjerite sva obavezna polja prije slanja." };
  }

  const { supabase, admin, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller"]);

  if (roleError) {
    return { error: roleError };
  }

  const allowed = await enforceRateLimit({
    key: user.id,
    route: "saveSellerListing",
    limit: 3,
    windowMs: 60_000,
  });
  if (!allowed) {
    return { error: "Previše zahtjeva. Pokušajte ponovno za minutu." };
  }

  const listingPayload = parsed.data;

  let listingId: string | null = null;
  let publicCode: string | null = null;

  try {
    const { data: listing, error: insertError } = await admin
      .from("listings")
      .insert({
        owner_id: user.id,
        company_name: listingPayload.company_name,
        industry_nkd: listingPayload.industry,
        region: listingPayload.region,
        year_founded: listingPayload.year_founded,
        employees: listingPayload.employees,
        revenue_eur: listingPayload.revenue,
        ebitda_eur: listingPayload.ebitda,
        sde_eur: listingPayload.sde,
        asking_price_eur: listingPayload.asking_price,
        reason_for_sale: listingPayload.reason_for_sale,
        transition_support: listingPayload.transition_support,
        owner_dependency_score: listingPayload.owner_dependency_score,
        digital_maturity: listingPayload.digital_maturity,
        status: "draft",
      })
      .select("id, public_code")
      .single();

    if (insertError || !listing) {
      return { error: "Spremanje oglasa nije uspjelo." };
    }

    listingId = listing.id;
    publicCode = listing.public_code;

    const blindTeaser = await generateBlindTeaser(listingPayload);
    const anonymity = validateBlindTeaserAnonymity({
      html: blindTeaser,
      companyName: listingPayload.company_name,
    });

    if (!anonymity.ok) {
      await admin
        .from("listings")
        .update({ status: "draft", blind_teaser: null })
        .eq("id", listing.id);

      return {
        error:
          "AI teaser je odbijen jer je otkrivao previše identitetskih tragova. Pokušajte ponovno s diskretnijim opisom.",
      };
    }

    const { error: updateError } = await admin
      .from("listings")
      .update({
        blind_teaser: blindTeaser,
        status: "seller_review",
      })
      .eq("id", listing.id);

    if (updateError) {
      await admin
        .from("listings")
        .update({ status: "draft", blind_teaser: null })
        .eq("id", listing.id);
      return { error: "Generiranje teasera nije uspjelo." };
    }
  } catch (error) {
    if (listingId) {
      await admin
        .from("listings")
        .update({ status: "draft", blind_teaser: null })
        .eq("id", listingId);
    }

    console.error("[listing] Blind teaser generation failed:", error);
    return { error: "Generiranje teasera nije uspjelo." };
  }

  revalidatePath("/dashboard/seller");
  revalidatePath("/sell");

  // Audit: new listing created
  await logAuditEvent(supabase, {
    action: "listing.create",
    entityType: "listing",
    entityId: listingId ?? undefined,
    metadata: { industry: listingPayload.industry, region: listingPayload.region },
  });

  return {
    success: true,
    message: "Teaser je generiran i spreman za pregled prije objave.",
    listingId: listingId ?? undefined,
    publicCode: publicCode ?? undefined,
  };
}

export async function publishListingAction(listingId: string): Promise<ActionResult> {
  if (!uuidSchema.safeParse(listingId).success) return { error: "Neispravan ID oglasa." };

  const { supabase, admin, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller"]);

  if (roleError) {
    return { error: roleError };
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, owner_id, blind_teaser, public_code")
    .eq("id", listingId)
    .single();

  if (!listing || listing.owner_id !== user.id) {
    return { error: "Oglas nije pronađen." };
  }

  if (!listing.blind_teaser) {
    return { error: "Oglas nema generirani teaser za objavu." };
  }

  const { error } = await admin
    .from("listings")
    .update({ status: "active" })
    .eq("id", listingId);

  if (error) {
    return { error: "Objava oglasa nije uspjela." };
  }

  await syncMatchesForListing(admin, listingId);

  // Audit: listing published
  await logAuditEvent(supabase, {
    action: "listing.publish",
    entityType: "listing",
    entityId: listingId,
    metadata: { public_code: listing.public_code },
  });

  revalidatePath("/dashboard/seller");
  revalidatePath("/dashboard/buyer");
  revalidatePath("/listings");
  revalidatePath(`/listings/${listing.public_code}`);

  return {
    success: true,
    message: "Oglas je objavljen u marketplaceu.",
  };
}

export async function saveBuyerProfileAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseBuyerProfileInput(formData);

  if (!parsed.success) {
    return { error: "Provjerite investicijske kriterije i pokušajte ponovno." };
  }

  if (parsed.data.target_ev_min > parsed.data.target_ev_max) {
    return { error: "Minimalni EV mora biti manji ili jednak maksimalnom EV-u." };
  }

  if (parsed.data.target_revenue_min > parsed.data.target_revenue_max) {
    return {
      error: "Minimalni ciljani prihod mora biti manji ili jednak maksimalnom.",
    };
  }

  const { admin, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["buyer"]);

  if (roleError) {
    return { error: roleError };
  }

  const { data: buyerProfile, error } = await admin
    .from("buyer_profiles")
    .upsert(
      {
        user_id: user.id,
        target_industries: parsed.data.target_industries,
        target_regions: parsed.data.target_regions,
        target_ev_min: parsed.data.target_ev_min,
        target_ev_max: parsed.data.target_ev_max,
        target_revenue_min: parsed.data.target_revenue_min,
        target_revenue_max: parsed.data.target_revenue_max,
        transaction_type: parsed.data.buyer_type,
        investment_thesis: parsed.data.investment_thesis,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error || !buyerProfile) {
    return { error: "Spremanje investicijskog profila nije uspjelo." };
  }

  await syncMatchesForBuyerProfile(admin, buyerProfile.id);

  revalidatePath("/dashboard/buyer");
  revalidatePath("/listings");

  return {
    success: true,
    message: "Investicijski profil je spremljen i uparivanja su ažurirana.",
  };
}

export async function requestNdaAction(listingId: string): Promise<ActionResult> {
  if (!uuidSchema.safeParse(listingId).success) return { error: "Neispravan ID oglasa." };

  const { supabase, admin, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["buyer"]);

  if (roleError) {
    return { error: roleError };
  }

  const ndaAllowed = await enforceRateLimit({
    key: user.id,
    route: "requestNda",
    limit: 10,
    windowMs: 60_000,
  });
  if (!ndaAllowed) {
    return { error: "Previše zahtjeva. Pokušajte ponovno za minutu." };
  }

  const { data: listing } = await admin
    .from("listings")
    .select("id, owner_id, status, public_code, broker_id")
    .eq("id", listingId)
    .maybeSingle();

  if (!listing) {
    return { error: "Oglas nije pronađen." };
  }

  if (listing.owner_id === user.id) {
    return { error: "Ne možete zatražiti NDA za vlastiti oglas." };
  }

  if (!requestableListingStatuses.has(listing.status)) {
    return { error: "NDA zahtjev trenutno nije dostupan za ovaj oglas." };
  }

  const { data: existing } = await admin
    .from("ndas")
    .select("id, status")
    .eq("listing_id", listingId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  if (existing?.status === "pending") {
    return { success: true, message: "NDA zahtjev je već poslan i čeka odobrenje." };
  }
  if (existing?.status === "signed") {
    return { success: true, message: "NDA je već potpisan — imate pristup deal roomu." };
  }
  if (existing?.status === "rejected") {
    await admin.from("ndas").delete().eq("id", existing.id);
  }

  const { data: ndaRow, error } = await admin
    .from("ndas")
    .insert({
      buyer_id: user.id,
      listing_id: listingId,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !ndaRow) {
    return { error: "Slanje NDA zahtjeva nije uspjelo." };
  }

  // Audit: NDA requested
  await logAuditEvent(supabase, {
    action: "nda.request",
    entityType: "nda",
    entityId: ndaRow.id,
    metadata: { buyer_id: user.id, listing_id: listingId },
  });

  revalidatePath("/dashboard/buyer");
  revalidatePath("/dashboard/seller");
  if (listing.broker_id) {
    revalidatePath("/dashboard/broker");
  }

  after(async () => {
    const { data: seller } = await admin
      .from("users")
      .select("id, email, full_name")
      .eq("id", listing.owner_id)
      .maybeSingle();

    if (!seller?.id) {
      return;
    }

    await createNotification({
      admin,
      userId: seller.id,
      type: "nda_request",
      title: "Novi NDA zahtjev",
      body: `Kupac je zatražio pristup oglasu ${listing.public_code}.`,
      entityId: listingId,
    });

    if (seller.email) {
      await sendNdaRequestEmail({
        sellerEmail: seller.email,
        sellerName: seller.full_name ?? "Prodavatelj",
        listingCode: listing.public_code,
        dashboardUrl: `${siteUrl}/dashboard/seller`,
      });
    }
  });

  return {
    success: true,
    message: "NDA zahtjev je poslan prodavatelju.",
  };
}

export async function reviewNdaAction(
  ndaId: string,
  decision: "approve" | "reject",
): Promise<ActionResult> {
  if (!uuidSchema.safeParse(ndaId).success) return { error: "Neispravan NDA ID." };
  const parsedDecision = decisionSchema.safeParse(decision);

  if (!parsedDecision.success) {
    return { error: "Nepoznata NDA odluka." };
  }

  const { supabase, admin, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller"]);

  if (roleError) {
    return { error: roleError };
  }

  const { data: nda } = await supabase
    .from("ndas")
    .select("id, listing_id, status")
    .eq("id", ndaId)
    .single();

  const { data: listing } = nda
    ? await supabase
      .from("listings")
      .select("owner_id")
      .eq("id", nda.listing_id)
      .single()
    : { data: null };

  if (!nda || listing?.owner_id !== user.id) {
    return { error: "NDA zahtjev nije pronađen." };
  }

  if (nda.status !== "pending") {
    return { error: "NDA zahtjev je već obrađen." };
  }

  const result = await performNdaReview(admin, ndaId, nda.listing_id, decision, ["/dashboard/seller"]);

  if (result.success) {
    await logAuditEvent(supabase, {
      action: decision === "approve" ? "nda.approve" : "nda.reject",
      entityType: "nda",
      entityId: ndaId,
      metadata: { listing_id: nda.listing_id },
    });
  }

  return result;
}

export async function uploadDealRoomFileAction(
  listingId: string,
  formData: FormData,
): Promise<ActionResult> {
  if (!uuidSchema.safeParse(listingId).success) return { error: "Neispravan ID oglasa." };

  const { supabase, admin, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller"]);

  if (roleError) {
    return { error: roleError };
  }

  const uploadAllowed = await enforceRateLimit({
    key: user.id,
    route: "uploadDealRoomFile",
    limit: 10,
    windowMs: 60_000,
  });
  if (!uploadAllowed) {
    return { error: "Previše uploada. Pokušajte ponovno za minutu." };
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, owner_id, public_code")
    .eq("id", listingId)
    .single();

  if (!listing || listing.owner_id !== user.id) {
    return { error: "Oglas nije pronađen." };
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

  // Audit: file uploaded to deal room
  await logAuditEvent(supabase, {
    action: "file.upload",
    entityType: "file",
    entityId: listingId,
    metadata: { doc_type: docType, file_name: file.name, file_size: file.size },
  });

  revalidatePath(`/dashboard/seller/deal-room/${listingId}`);
  revalidatePath(`/dashboard/broker/deal-room/${listingId}`);
  revalidatePath(`/dashboard/buyer/deal-room/${listingId}`);

  after(async () => {
    const { data: signedNdas } = await admin
      .from("ndas")
      .select("buyer_id")
      .eq("listing_id", listingId)
      .eq("status", "signed");

    for (const nda of signedNdas ?? []) {
      await createNotification({
        admin,
        userId: nda.buyer_id,
        type: "deal_room_upload",
        title: "Novi dokument u deal roomu",
        body: `Dodana je nova datoteka (${docType}) za oglas ${listing.public_code ?? listingId}.`,
        entityId: listingId,
      });
    }
  });

  return {
    success: true,
    message: "Dokument je dodan u deal room.",
  };
}

export async function archiveListingAction(
  listingId: string,
): Promise<ActionResult> {
  if (!uuidSchema.safeParse(listingId).success) return { error: "Neispravan ID oglasa." };

  const { supabase, admin, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller"]);

  if (roleError) {
    return { error: roleError };
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, owner_id, status, public_code")
    .eq("id", listingId)
    .single();

  if (!listing || listing.owner_id !== user.id) {
    return { error: "Oglas nije pronađen." };
  }

  if (listing.status === "closed") {
    return { success: true, message: "Oglas je već arhiviran." };
  }

  await removeListingDealRoomArtifacts(admin, listingId);
  await admin.from("matches").delete().eq("listing_id", listingId);
  await admin.from("ndas").delete().eq("listing_id", listingId);

  const { error } = await admin
    .from("listings")
    .update({ status: "closed" })
    .eq("id", listingId);

  if (error) {
    return { error: "Arhiviranje oglasa nije uspjelo." };
  }

  await logAuditEvent(supabase, {
    action: "listing.archive",
    entityType: "listing",
    entityId: listingId,
    metadata: { public_code: listing.public_code },
  });

  revalidatePath("/dashboard/seller");
  revalidatePath("/dashboard/buyer");
  revalidatePath("/listings");
  if (listing.public_code) {
    revalidatePath(`/listings/${listing.public_code}`);
  }
  return { success: true, message: "Oglas je arhiviran." };
}
