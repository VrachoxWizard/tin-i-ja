import { describe, it, expect } from "vitest";
import { validatePassword, passwordSchema } from "@/lib/password-validation";

describe("passwordSchema", () => {
  it("accepts a strong password", () => {
    const result = passwordSchema.safeParse("Str0ng!Pass");
    expect(result.success).toBe(true);
  });

  it("rejects passwords shorter than 8 characters", () => {
    const result = passwordSchema.safeParse("Aa1!xx");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("password_too_short");
  });

  it("rejects passwords without uppercase letter", () => {
    const result = passwordSchema.safeParse("abcdefg1!");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("password_no_uppercase");
  });

  it("rejects passwords without lowercase letter", () => {
    const result = passwordSchema.safeParse("ABCDEFG1!");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("password_no_lowercase");
  });

  it("rejects passwords without digit", () => {
    const result = passwordSchema.safeParse("Abcdefgh!");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("password_no_digit");
  });

  it("rejects passwords without special character", () => {
    const result = passwordSchema.safeParse("Abcdefg1x");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("password_no_special");
  });

  it("accepts exactly 8 characters meeting all rules", () => {
    const result = passwordSchema.safeParse("Aa1!xxxx");
    expect(result.success).toBe(true);
  });
});

describe("validatePassword", () => {
  it("returns null for a valid password", () => {
    expect(validatePassword("Str0ng!Pass")).toBeNull();
  });

  it("returns 'password_too_short' for short passwords", () => {
    expect(validatePassword("Aa1!")).toBe("password_too_short");
  });

  it("returns 'password_no_uppercase' when missing uppercase", () => {
    expect(validatePassword("abcdefg1!")).toBe("password_no_uppercase");
  });

  it("returns 'password_no_lowercase' when missing lowercase", () => {
    expect(validatePassword("ABCDEFG1!")).toBe("password_no_lowercase");
  });

  it("returns 'password_no_digit' when missing digit", () => {
    expect(validatePassword("Abcdefgh!")).toBe("password_no_digit");
  });

  it("returns 'password_no_special' when missing special char", () => {
    expect(validatePassword("Abcdefg1x")).toBe("password_no_special");
  });

  it("returns the first error for an empty string", () => {
    expect(validatePassword("")).toBe("password_too_short");
  });
});
