export interface BuyerProfile {
  id: string;
  target_industries: string[];
  target_regions: string[];
  investment_min: number;
  investment_max: number;
  buyer_type: 'individual' | 'strategic' | 'financial';
}

export interface Listing {
  id: string;
  industry: string;
  region: string;
  asking_price: number;
  ebitda: number;
  revenue: number;
}

export interface MatchResult {
  score: number; // 0 to 100
  breakdown: {
    industryMatch: number;
    regionMatch: number;
    financialMatch: number;
  };
  isQualified: boolean;
}

/**
 * Calculates a match score between a Buyer Profile and a Deal Listing.
 * Weighting:
 * - Industry: 40% (Critical fit)
 * - Region: 20% (Important, but less critical for PEs/Strategic)
 * - Financials: 40% (Must be within or close to investment bounds)
 */
export function calculateMatchScore(buyer: BuyerProfile, listing: Listing): MatchResult {
  let score = 0;
  const breakdown = { industryMatch: 0, regionMatch: 0, financialMatch: 0 };

  // 1. Industry Match (40 pts)
  const isAllIndustries = buyer.target_industries.includes('Sve Industrijske Grane');
  if (isAllIndustries || buyer.target_industries.includes(listing.industry)) {
    breakdown.industryMatch = 40;
    score += 40;
  }

  // 2. Region Match (20 pts)
  const isWholeCountry = buyer.target_regions.includes('Cijela Hrvatska');
  if (isWholeCountry || buyer.target_regions.includes(listing.region)) {
    breakdown.regionMatch = 20;
    score += 20;
  } else if (buyer.buyer_type !== 'individual') {
    // Strategic/Financial buyers are usually more flexible geographically
    breakdown.regionMatch = 10;
    score += 10;
  }

  // 3. Financial Match (40 pts)
  // We compare the listing's asking price against the buyer's minimum/maximum investment size.
  const diffMax = listing.asking_price - buyer.investment_max;
  const diffMin = buyer.investment_min - listing.asking_price;

  if (listing.asking_price >= buyer.investment_min && listing.asking_price <= buyer.investment_max) {
    // Perfect hit within bounds
    breakdown.financialMatch = 40;
    score += 40;
  } else if (diffMax > 0 && diffMax <= buyer.investment_max * 0.2) {
    // Slightly above max (within 20% tolerance) - 20 pts
    breakdown.financialMatch = 20;
    score += 20;
  } else if (diffMin > 0 && diffMin <= buyer.investment_min * 0.5) {
    // Below minimum, but not completely off - 20 pts
    breakdown.financialMatch = 20;
    score += 20;
  }

  // Qualification threshold: 70 points
  const isQualified = score >= 70;

  return {
    score,
    breakdown,
    isQualified
  };
}
