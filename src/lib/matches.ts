import type { SupabaseClient } from "@supabase/supabase-js";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { Database } from "@/lib/database.types";
import { sendMatchEmail } from "@/lib/email";
import type {
  BuyerProfileMatchInput,
  ListingMatchInput,
} from "@/lib/contracts";
import { createNotification } from "@/lib/notifications";
import {
  buildFallbackMatchNarrative,
  calculateMatchScore,
} from "@/lib/matching";

type TypedSupabaseClient = SupabaseClient<Database>;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dealflow.hr";

function mapListing(
  listing: Database["public"]["Tables"]["listings"]["Row"],
): ListingMatchInput {
  return {
    id: listing.id,
    publicCode: listing.public_code,
    industryNkd: listing.industry_nkd,
    region: listing.region,
    revenueEur: Number(listing.revenue_eur),
    askingPriceEur: Number(listing.asking_price_eur),
  };
}

function mapBuyerProfile(
  profile: Database["public"]["Tables"]["buyer_profiles"]["Row"],
): BuyerProfileMatchInput {
  return {
    id: profile.id,
    userId: profile.user_id,
    targetIndustries: profile.target_industries,
    targetRegions: profile.target_regions,
    targetEvMin: profile.target_ev_min ? Number(profile.target_ev_min) : null,
    targetEvMax: profile.target_ev_max ? Number(profile.target_ev_max) : null,
    targetRevenueMin: profile.target_revenue_min
      ? Number(profile.target_revenue_min)
      : null,
    targetRevenueMax: profile.target_revenue_max
      ? Number(profile.target_revenue_max)
      : null,
    transactionType: profile.transaction_type as BuyerProfileMatchInput["transactionType"],
  };
}

async function buildAiNarrative(
  buyer: BuyerProfileMatchInput,
  listing: ListingMatchInput,
  score: number,
  fallback: string,
) {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `
        Napiši jednu kratku profesionalnu rečenicu na hrvatskom jeziku.
        Objasni zašto je ova tvrtka dobar match za investitora.
        Nemoj koristiti bullet točke, navodnike ni HTML.

        Podaci o investitoru:
        - Tip: ${buyer.transactionType}
        - Industrije: ${buyer.targetIndustries.join(", ")}
        - Regije: ${buyer.targetRegions.join(", ")}
        - EV raspon: ${buyer.targetEvMin ?? "n/a"} do ${buyer.targetEvMax ?? "n/a"} EUR
        - Raspon prihoda: ${buyer.targetRevenueMin ?? "n/a"} do ${buyer.targetRevenueMax ?? "n/a"} EUR

        Podaci o tvrtki:
        - Šifra: ${listing.publicCode ?? listing.id}
        - Industrija: ${listing.industryNkd}
        - Regija: ${listing.region}
        - Prihod: ${listing.revenueEur} EUR
        - Tražena cijena: ${listing.askingPriceEur} EUR
        - Match score: ${score}
      `,
    });

    const cleaned = text.replace(/\s+/g, " ").trim();
    return cleaned || fallback;
  } catch {
    return fallback;
  }
}

async function syncPair(
  supabase: TypedSupabaseClient,
  buyerProfile: Database["public"]["Tables"]["buyer_profiles"]["Row"],
  listing: Database["public"]["Tables"]["listings"]["Row"],
) {
  const buyer = mapBuyerProfile(buyerProfile);
  const listingInput = mapListing(listing);
  const result = calculateMatchScore(buyer, listingInput);

  if (!result.isQualified) {
    await supabase
      .from("matches")
      .delete()
      .eq("buyer_profile_id", buyerProfile.id)
      .eq("listing_id", listing.id);
    return;
  }

  const fallbackNarrative = buildFallbackMatchNarrative(
    buyer,
    listingInput,
    result,
  );
  const { data: existingMatch } = await supabase
    .from("matches")
    .select("id")
    .eq("buyer_profile_id", buyerProfile.id)
    .eq("listing_id", listing.id)
    .maybeSingle();
  const aiNarrative = await buildAiNarrative(
    buyer,
    listingInput,
    result.score,
    fallbackNarrative,
  );

  const { data: upsertedMatch, error: upsertError } = await supabase.from("matches").upsert(
    {
      buyer_profile_id: buyerProfile.id,
      listing_id: listing.id,
      match_score: result.score,
      ai_narrative: aiNarrative,
      status: "new",
    },
    { onConflict: "listing_id,buyer_profile_id" },
  ).select("id").single();

  if (upsertError || existingMatch || !upsertedMatch) {
    return;
  }

  const { data: buyerUser } = await supabase
    .from("users")
    .select("email, full_name")
    .eq("id", buyer.userId)
    .maybeSingle();

  if (!buyerUser) {
    return;
  }

  await createNotification({
    admin: supabase,
    userId: buyer.userId,
    type: "match_found",
    title: "Nova podudarna prilika",
    body: `Pronađen je novi oglas (${listing.public_code ?? listing.id}) koji odgovara vašem profilu.`,
    entityId: listing.id,
  });

  if (buyerUser.email) {
    await sendMatchEmail({
      buyerEmail: buyerUser.email,
      buyerName: buyerUser.full_name ?? "Kupac",
      listingCode: listing.public_code ?? listing.id,
      industry: listing.industry_nkd,
      region: listing.region,
      dashboardUrl: `${siteUrl}/dashboard/buyer`,
    });
  }
}

const CONCURRENCY = 3;

async function batchSync<T>(items: T[], fn: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    await Promise.allSettled(batch.map(fn));
  }
}

export async function syncMatchesForBuyerProfile(
  supabase: TypedSupabaseClient,
  buyerProfileId: string,
) {
  const { data: buyerProfile } = await supabase
    .from("buyer_profiles")
    .select("*")
    .eq("id", buyerProfileId)
    .single();

  if (!buyerProfile) {
    return;
  }

  const { data: listings } = await supabase
    .from("listings")
    .select("id, public_code, industry_nkd, region, revenue_eur, ebitda_eur, sde_eur, asking_price_eur, status, owner_id, company_name, employees, year_founded, reason_for_sale, transition_support, owner_dependency_score, digital_maturity, is_exclusive, blind_teaser, broker_id, created_at, updated_at")
    .eq("status", "active");

  await batchSync(listings ?? [], (listing) =>
    syncPair(supabase, buyerProfile, listing),
  );
}

export async function syncMatchesForListing(
  supabase: TypedSupabaseClient,
  listingId: string,
) {
  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (!listing || listing.status !== "active") {
    return;
  }

  const { data: buyerProfiles } = await supabase
    .from("buyer_profiles")
    .select("id, user_id, target_industries, target_regions, target_ev_min, target_ev_max, target_revenue_min, target_revenue_max, transaction_type, investment_thesis, created_at, updated_at");

  await batchSync(buyerProfiles ?? [], (bp) =>
    syncPair(supabase, bp, listing),
  );
}
