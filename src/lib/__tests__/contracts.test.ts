import { describe, it, expect } from "vitest";
import {
  USER_ROLES,
  LISTING_STATUSES,
  NDA_STATUSES,
  MATCH_STATUSES,
  BUYER_TYPES,
  DEAL_ROOM_DOC_TYPES,
} from "@/lib/contracts";

describe("contracts constants", () => {
  it("USER_ROLES contains all 4 roles", () => {
    expect(USER_ROLES).toEqual(["buyer", "seller", "broker", "admin"]);
  });

  it("LISTING_STATUSES contains all 6 statuses", () => {
    expect(LISTING_STATUSES).toHaveLength(6);
    expect(LISTING_STATUSES).toContain("draft");
    expect(LISTING_STATUSES).toContain("active");
    expect(LISTING_STATUSES).toContain("closed");
  });

  it("NDA_STATUSES contains expected values", () => {
    expect(NDA_STATUSES).toEqual(["pending", "signed", "rejected"]);
  });

  it("MATCH_STATUSES contains expected values", () => {
    expect(MATCH_STATUSES).toEqual(["new", "viewed", "interested"]);
  });

  it("BUYER_TYPES contains expected values", () => {
    expect(BUYER_TYPES).toEqual(["individual", "strategic", "financial"]);
  });

  it("DEAL_ROOM_DOC_TYPES contains expected values", () => {
    expect(DEAL_ROOM_DOC_TYPES).toEqual(["financial", "legal", "asset"]);
  });

  it("constants are typed as readonly tuples", () => {
    // `as const` enforces readonly at compile-time; verify length is stable
    expect(USER_ROLES.length).toBe(4);
    expect(LISTING_STATUSES.length).toBe(6);
    expect(NDA_STATUSES.length).toBe(3);
    expect(DEAL_ROOM_DOC_TYPES.length).toBe(3);
  });
});
