import type {
  BuyerProfileMatchInput,
  ListingMatchInput,
} from "@/lib/contracts";
import { ALL_INDUSTRIES_LABEL, ALL_REGIONS_LABEL } from "@/data/constants";

export interface MatchBreakdown {
  evFit: number;
  sectorFit: number;
  geographyFit: number;
  financialFit: number;
}

export interface MatchResult {
  score: number;
  breakdown: MatchBreakdown;
  isQualified: boolean;
}

const WHOLE_COUNTRY_REGION = ALL_REGIONS_LABEL;
const ALL_INDUSTRIES = ALL_INDUSTRIES_LABEL;

function scoreRange(
  value: number,
  min: number | null,
  max: number | null,
  perfectScore: number,
) {
  if (min == null && max == null) {
    return perfectScore;
  }

  if (min != null && value < min) {
    const gap = min - value;
    return gap <= min * 0.15 ? perfectScore / 2 : 0;
  }

  if (max != null && value > max) {
    const gap = value - max;
    return gap <= max * 0.15 ? perfectScore / 2 : 0;
  }

  return perfectScore;
}

export function calculateMatchScore(
  buyer: BuyerProfileMatchInput,
  listing: ListingMatchInput,
): MatchResult {
  const breakdown: MatchBreakdown = {
    evFit: scoreRange(
      listing.askingPriceEur,
      buyer.targetEvMin,
      buyer.targetEvMax,
      30,
    ),
    sectorFit:
      buyer.targetIndustries.includes(ALL_INDUSTRIES) ||
      buyer.targetIndustries.includes(listing.industryNkd)
        ? 25
        : 0,
    geographyFit:
      buyer.targetRegions.includes(WHOLE_COUNTRY_REGION) ||
      buyer.targetRegions.includes(listing.region)
        ? 20
        : 0,
    financialFit: scoreRange(
      listing.revenueEur,
      buyer.targetRevenueMin,
      buyer.targetRevenueMax,
      25,
    ),
  };

  const score =
    breakdown.evFit +
    breakdown.sectorFit +
    breakdown.geographyFit +
    breakdown.financialFit;

  return {
    score,
    breakdown,
    isQualified: score > 70,
  };
}

export function buildFallbackMatchNarrative(
  buyer: BuyerProfileMatchInput,
  listing: ListingMatchInput,
  result: MatchResult,
) {
  const highlights: string[] = [];

  if (result.breakdown.evFit >= 30) {
    highlights.push("uklapa se u vaš EV raspon");
  }

  if (result.breakdown.sectorFit >= 25) {
    highlights.push(`odgovara preferiranom sektoru ${listing.industryNkd}`);
  }

  if (result.breakdown.geographyFit >= 20) {
    highlights.push(`nalazi se u regiji ${listing.region}`);
  }

  if (result.breakdown.financialFit >= 25) {
    highlights.push("ima prihode unutar ciljane veličine poslovanja");
  }

  if (highlights.length === 0) {
    return "Ova prilika pokazuje dovoljno podudarnosti s vašim kriterijima za daljnju analizu.";
  }

  return `Ova prilika je relevantna jer ${highlights.join(", ")}.`;
}
