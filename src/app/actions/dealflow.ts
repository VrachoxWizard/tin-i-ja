'use server'

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { sanitizeHtml } from "@/lib/sanitize";
import { validateBlindTeaserAnonymity } from "@/lib/anonymity";
import { syncMatchesForBuyerProfile, syncMatchesForListing } from "@/lib/matches";
import { DEAL_ROOM_BUCKET } from "@/lib/deal-room";
import { BUYER_TYPES } from "@/lib/contracts";
import { enforceRateLimit } from "@/lib/rate-limit";
import { validateDealRoomUpload, sanitizeFileName } from "@/lib/upload-validation";
import { performNdaReview } from "@/lib/nda-review";
import { logAuditEvent } from "@/lib/audit";


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
  target_industries: z.string().min(1),
  target_regions: z.string().min(1),
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  return {
    supabase,
    user,
    profile,
  };
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

export async function saveSellerListingAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = sellerListingSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return { error: "Provjerite sva obavezna polja prije slanja." };
  }

  const { supabase, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller", "admin"]);

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

  const { data: listing, error: insertError } = await supabase
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

  await supabase
    .from("listings")
    .update({ status: "teaser_generated" })
    .eq("id", listing.id);

  const blindTeaser = await generateBlindTeaser(listingPayload);
  const anonymity = validateBlindTeaserAnonymity({
    html: blindTeaser,
    companyName: listingPayload.company_name,
  });

  if (!anonymity.ok) {
    await supabase
      .from("listings")
      .update({ status: "draft", blind_teaser: null })
      .eq("id", listing.id);

    return {
      error:
        "AI teaser je odbijen jer je otkrivao previše identitetskih tragova. Pokušajte ponovno s diskretnijim opisom.",
    };
  }

  const { error: updateError } = await supabase
    .from("listings")
    .update({
      blind_teaser: blindTeaser,
      status: "seller_review",
    })
    .eq("id", listing.id);

  if (updateError) {
    return { error: "Generiranje teasera nije uspjelo." };
  }

  revalidatePath("/dashboard/seller");
  revalidatePath("/sell");

  // Audit: new listing created
  await logAuditEvent(supabase, {
    action: "listing.create",
    entityType: "listing",
    entityId: listing.id,
    metadata: { industry: listingPayload.industry, region: listingPayload.region },
  });

  return {
    success: true,
    message: "Teaser je generiran i spreman za pregled prije objave.",
    listingId: listing.id,
    publicCode: listing.public_code,
  };
}

export async function publishListingAction(listingId: string): Promise<ActionResult> {
  if (!uuidSchema.safeParse(listingId).success) return { error: "Neispravan ID oglasa." };

  const { supabase, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller", "admin"]);

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

  const { error } = await supabase
    .from("listings")
    .update({ status: "active" })
    .eq("id", listingId);

  if (error) {
    return { error: "Objava oglasa nije uspjela." };
  }

  await syncMatchesForListing(supabase, listingId);

  // Audit: listing published
  await logAuditEvent(supabase, {
    action: "listing.publish",
    entityType: "listing",
    entityId: listingId,
    metadata: { public_code: listing.public_code },
  });

  revalidatePath("/dashboard/seller");
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
  const parsed = buyerProfileSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

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

  const { supabase, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["buyer", "admin"]);

  if (roleError) {
    return { error: roleError };
  }

  const { data: buyerProfile, error } = await supabase
    .from("buyer_profiles")
    .upsert(
      {
        user_id: user.id,
        target_industries: [parsed.data.target_industries],
        target_regions: [parsed.data.target_regions],
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

  await syncMatchesForBuyerProfile(supabase, buyerProfile.id);

  revalidatePath("/dashboard/buyer");
  revalidatePath("/listings");

  return {
    success: true,
    message: "Investicijski profil je spremljen i uparivanja su ažurirana.",
  };
}

export async function requestNdaAction(listingId: string): Promise<ActionResult> {
  if (!uuidSchema.safeParse(listingId).success) return { error: "Neispravan ID oglasa." };

  const { supabase, user } = await requireUser();

  const ndaAllowed = await enforceRateLimit({
    key: user.id,
    route: "requestNda",
    limit: 10,
    windowMs: 60_000,
  });
  if (!ndaAllowed) {
    return { error: "Previše zahtjeva. Pokušajte ponovno za minutu." };
  }

  const { data: existing } = await supabase
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
    await supabase.from("ndas").delete().eq("id", existing.id);
  }

  const { error } = await supabase.from("ndas").insert({
    buyer_id: user.id,
    listing_id: listingId,
    status: "pending",
  });

  if (error) {
    return { error: "Slanje NDA zahtjeva nije uspjelo." };
  }

  // Audit: NDA requested
  await logAuditEvent(supabase, {
    action: "nda.request",
    entityType: "nda",
    entityId: listingId,
    metadata: { buyer_id: user.id },
  });

  revalidatePath("/dashboard/buyer");
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

  const { supabase, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller", "admin"]);

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

  return performNdaReview(supabase, ndaId, nda.listing_id, decision, ["/dashboard/seller"]);
}

export async function uploadDealRoomFileAction(
  listingId: string,
  formData: FormData,
): Promise<ActionResult> {
  if (!uuidSchema.safeParse(listingId).success) return { error: "Neispravan ID oglasa." };

  const { supabase, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller", "admin"]);

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
    .select("id, owner_id")
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

  // Audit: file uploaded to deal room
  await logAuditEvent(supabase, {
    action: "file.upload",
    entityType: "file",
    entityId: listingId,
    metadata: { doc_type: docType, file_name: file.name, file_size: file.size },
  });

  revalidatePath(`/dashboard/seller/deal-room/${listingId}`);
  revalidatePath(`/dashboard/buyer/deal-room/${listingId}`);

  return {
    success: true,
    message: "Dokument je dodan u deal room.",
  };
}

export async function archiveListingAction(
  listingId: string,
): Promise<ActionResult> {
  if (!uuidSchema.safeParse(listingId).success) return { error: "Neispravan ID oglasa." };

  const { supabase, user, profile } = await requireUser();
  const roleError = getRoleError(profile?.role, ["seller", "admin"]);

  if (roleError) {
    return { error: roleError };
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, owner_id, status")
    .eq("id", listingId)
    .single();

  if (!listing || listing.owner_id !== user.id) {
    return { error: "Oglas nije pronađen." };
  }

  if (listing.status === "closed") {
    return { success: true, message: "Oglas je već arhiviran." };
  }

  const { error } = await supabase
    .from("listings")
    .update({ status: "closed" })
    .eq("id", listingId);

  if (error) {
    return { error: "Arhiviranje oglasa nije uspjelo." };
  }

  revalidatePath("/dashboard/seller");
  return { success: true, message: "Oglas je arhiviran." };
}
