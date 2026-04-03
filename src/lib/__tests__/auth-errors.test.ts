import { describe, it, expect } from "vitest";
import { getAuthErrorMessage } from "@/lib/auth-errors";

describe("getAuthErrorMessage", () => {
  it("returns null for null input", () => {
    expect(getAuthErrorMessage(null)).toBeNull();
  });

  it("returns the correct message for known error codes", () => {
    expect(getAuthErrorMessage("auth_failed")).toBe(
      "Autentikacija nije uspjela. Provjerite email i lozinku.",
    );
    expect(getAuthErrorMessage("password_mismatch")).toBe(
      "Lozinke se ne podudaraju.",
    );
    expect(getAuthErrorMessage("password_too_short")).toBe(
      "Lozinka mora imati najmanje 8 znakova.",
    );
    expect(getAuthErrorMessage("invalid_email")).toBe(
      "Unesite valjanu email adresu.",
    );
  });

  it("returns all password error messages correctly", () => {
    expect(getAuthErrorMessage("password_no_uppercase")).toBe(
      "Lozinka mora sadržavati barem jedno veliko slovo.",
    );
    expect(getAuthErrorMessage("password_no_lowercase")).toBe(
      "Lozinka mora sadržavati barem jedno malo slovo.",
    );
    expect(getAuthErrorMessage("password_no_digit")).toBe(
      "Lozinka mora sadržavati barem jednu znamenku.",
    );
    expect(getAuthErrorMessage("password_no_special")).toBe(
      "Lozinka mora sadržavati barem jedan poseban znak (!@#$%...).",
    );
  });

  it("returns the fallback message for unknown error codes", () => {
    const fallback = "Došlo je do greške. Pokušajte ponovo.";
    expect(getAuthErrorMessage("some_unknown_code")).toBe(fallback);
    expect(getAuthErrorMessage("xyzzy")).toBe(fallback);
  });

  it("returns null for empty string (falsy)", () => {
    expect(getAuthErrorMessage("")).toBeNull();
  });
});
