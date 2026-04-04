/**
 * Shared locale-aware formatting helpers for the DealFlow platform.
 * All formatters target the hr-HR locale (Croatian).
 */

const HR_LOCALE = "hr-HR";

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(HR_LOCALE);
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString(HR_LOCALE);
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat(HR_LOCALE, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
