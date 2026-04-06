/**
 * Static error message map for auth pages.
 * Server actions redirect with a code (e.g. ?error=auth_failed),
 * and the client maps it to a safe hardcoded string.
 * This prevents phishing via crafted URLs with arbitrary error text.
 */

const ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "Autentikacija nije uspjela. Provjerite email i lozinku.",
  email_send_failed: "Slanje emaila nije uspjelo. Pokušajte ponovo.",
  password_mismatch: "Lozinke se ne podudaraju.",
  password_too_short: "Lozinka mora imati najmanje 8 znakova.",
  password_no_uppercase: "Lozinka mora sadržavati barem jedno veliko slovo.",
  password_no_lowercase: "Lozinka mora sadržavati barem jedno malo slovo.",
  password_no_digit: "Lozinka mora sadržavati barem jednu znamenku.",
  password_no_special: "Lozinka mora sadržavati barem jedan poseban znak (!@#$%...).",
  password_update_failed: "Ažuriranje lozinke nije uspjelo. Pokušajte ponovo.",
  signup_failed: "Registracija nije uspjela. Pokušajte ponovo.",
  invalid_email: "Unesite valjanu email adresu.",
  account_suspended: "Račun je suspendiran. Kontaktirajte podršku za ponovno aktiviranje.",
  unknown: "Došlo je do greške. Pokušajte ponovo.",
};

const FALLBACK = ERROR_MESSAGES.unknown;

export function getAuthErrorMessage(code: string | null): string | null {
  if (!code) return null;
  return ERROR_MESSAGES[code] ?? FALLBACK;
}
