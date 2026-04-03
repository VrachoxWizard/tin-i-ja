export const USER_ROLES = ["buyer", "seller", "broker", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const LISTING_STATUSES = [
  "draft",
  "teaser_generated",
  "seller_review",
  "active",
  "under_nda",
  "closed",
] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const NDA_STATUSES = ["pending", "signed", "rejected"] as const;
export type NdaStatus = (typeof NDA_STATUSES)[number];

export const MATCH_STATUSES = ["new", "viewed", "interested"] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const BUYER_TYPES = ["individual", "strategic", "financial"] as const;
export type BuyerType = (typeof BUYER_TYPES)[number];

export const DEAL_ROOM_DOC_TYPES = ["financial", "legal", "asset"] as const;
export type DealRoomDocType = (typeof DEAL_ROOM_DOC_TYPES)[number];

export interface ValuationRanges {
  ebitda: [number, number];
  sde: [number, number];
}

export interface ValuationResponse {
  reportHtml: string;
  ranges: ValuationRanges;
  sellReadinessScore: number;
}

export interface ListingMatchInput {
  id: string;
  publicCode?: string | null;
  industryNkd: string;
  region: string;
  revenueEur: number;
  askingPriceEur: number;
}

export interface BuyerProfileMatchInput {
  id: string;
  userId: string;
  targetIndustries: string[];
  targetRegions: string[];
  targetEvMin: number | null;
  targetEvMax: number | null;
  targetRevenueMin: number | null;
  targetRevenueMax: number | null;
  transactionType: BuyerType;
}
