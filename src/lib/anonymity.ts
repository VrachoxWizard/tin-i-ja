const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_PATTERN = /(?:\+\d{1,3}\s?)?(?:\d[\s-]?){7,}/;
const URL_PATTERN = /\b(?:https?:\/\/|www\.)\S+\b/i;
const EXACT_LOCATION_HINTS = [
  "ulica",
  "trg",
  "avenija",
  "kontakt",
  "adresa",
  "oib",
  "vlasnik",
  "osnivač",
];

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function tokenizeCompanyName(companyName: string) {
  return companyName
    .toLowerCase()
    .split(/[^a-z0-9šđčćž]+/i)
    .filter((token) => token.length >= 3);
}

export function validateBlindTeaserAnonymity(input: {
  html: string;
  companyName: string;
}) {
  const content = stripHtml(input.html).toLowerCase();
  const companyTokens = tokenizeCompanyName(input.companyName);
  const failures: string[] = [];

  if (EMAIL_PATTERN.test(content)) {
    failures.push("Teaser contains an email address.");
  }

  if (PHONE_PATTERN.test(content)) {
    failures.push("Teaser contains a phone number.");
  }

  if (URL_PATTERN.test(content)) {
    failures.push("Teaser contains a URL.");
  }

  if (companyTokens.some((token) => content.includes(token))) {
    failures.push("Teaser appears to mention the company name.");
  }

  if (EXACT_LOCATION_HINTS.some((hint) => content.includes(hint))) {
    failures.push("Teaser includes overly specific identity clues.");
  }

  return {
    ok: failures.length === 0,
    failures,
  };
}
