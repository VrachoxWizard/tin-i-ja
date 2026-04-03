/**
 * Canonical industry and region constants.
 * Import these everywhere instead of defining local arrays.
 * The matching engine relies on exact string equality — keep these in sync.
 */

export const INDUSTRIES = [
  "IT i Softver",
  "Turizam i Ugostiteljstvo",
  "Proizvodnja",
  "Građevina",
  "Trgovina i Logistika",
  "Usluge",
  "Zdravstvo",
  "Ostalo",
] as const;

export type Industry = (typeof INDUSTRIES)[number];

/** Subset shown in the public valuator wizard (no "Ostalo" / niche categories). */
export const VALUATOR_INDUSTRIES = [
  "IT i Softver",
  "Turizam i Ugostiteljstvo",
  "Trgovina i Logistika",
  "Proizvodnja",
  "Usluge",
] as const;

/** Wildcard value used in buyer profiles to match every industry. */
export const ALL_INDUSTRIES_LABEL = "Sve industrije" as const;

/** Industries shown in the buyer onboarding form (includes wildcard). */
export const BUYER_INDUSTRIES = [...INDUSTRIES, ALL_INDUSTRIES_LABEL] as const;

export const REGIONS = [
  "Grad Zagreb",
  "Zagrebačka",
  "Splitsko-dalmatinska",
  "Istarska",
  "Primorsko-goranska",
  "Osječko-baranjska",
  "Zadarska",
  "Cijela Hrvatska",
] as const;

export type Region = (typeof REGIONS)[number];

/** Wildcard value used in buyer profiles to match every region. */
export const ALL_REGIONS_LABEL = "Cijela Hrvatska" as const;
