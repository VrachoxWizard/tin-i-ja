import { z } from "zod";

/**
 * Server-side password strength validation.
 * Enforces: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char.
 */
export const passwordSchema = z
  .string()
  .min(8, "password_too_short")
  .regex(/[A-Z]/, "password_no_uppercase")
  .regex(/[a-z]/, "password_no_lowercase")
  .regex(/[0-9]/, "password_no_digit")
  .regex(/[^A-Za-z0-9]/, "password_no_special");

export type PasswordError =
  | "password_too_short"
  | "password_no_uppercase"
  | "password_no_lowercase"
  | "password_no_digit"
  | "password_no_special";

/**
 * Validate a password string and return the first error code or null.
 */
export function validatePassword(password: string): PasswordError | null {
  const result = passwordSchema.safeParse(password);
  if (result.success) return null;
  const firstIssue = result.error.issues[0];
  return (firstIssue?.message as PasswordError) ?? "password_too_short";
}
