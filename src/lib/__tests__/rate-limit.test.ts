import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the supabase server client so enforceRateLimit falls through to the
// in-memory fallback on every call.
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    rpc: vi.fn().mockResolvedValue({ data: null, error: { message: "mocked" } }),
  }),
}));

// Import after mocking
const { enforceRateLimit } = await import("@/lib/rate-limit");

describe("enforceRateLimit (in-memory fallback)", () => {
  beforeEach(() => {
    // Reset module state between tests by using unique route names
  });

  it("allows requests up to the limit", async () => {
    const route = `test-allow-${Date.now()}`;
    const opts = { key: "user-1", route, limit: 3, windowMs: 60_000 };

    expect(await enforceRateLimit(opts)).toBe(true);
    expect(await enforceRateLimit(opts)).toBe(true);
    expect(await enforceRateLimit(opts)).toBe(true);
  });

  it("blocks requests exceeding the limit", async () => {
    const route = `test-block-${Date.now()}`;
    const opts = { key: "user-2", route, limit: 2, windowMs: 60_000 };

    expect(await enforceRateLimit(opts)).toBe(true);
    expect(await enforceRateLimit(opts)).toBe(true);
    expect(await enforceRateLimit(opts)).toBe(false);
    expect(await enforceRateLimit(opts)).toBe(false);
  });

  it("uses different buckets for different routes", async () => {
    const ts = Date.now();
    const routeA = `route-a-${ts}`;
    const routeB = `route-b-${ts}`;

    const optsA = { key: "user-3", route: routeA, limit: 1, windowMs: 60_000 };
    const optsB = { key: "user-3", route: routeB, limit: 1, windowMs: 60_000 };

    expect(await enforceRateLimit(optsA)).toBe(true);
    expect(await enforceRateLimit(optsA)).toBe(false);
    // Route B should still have capacity
    expect(await enforceRateLimit(optsB)).toBe(true);
  });

  it("uses different buckets for different keys", async () => {
    const route = `test-keys-${Date.now()}`;

    const optsA = { key: "user-a", route, limit: 1, windowMs: 60_000 };
    const optsB = { key: "user-b", route, limit: 1, windowMs: 60_000 };

    expect(await enforceRateLimit(optsA)).toBe(true);
    expect(await enforceRateLimit(optsA)).toBe(false);
    // Different user key should still work
    expect(await enforceRateLimit(optsB)).toBe(true);
  });

  it("defaults to limit 5 and windowMs 60_000", async () => {
    const route = `test-defaults-${Date.now()}`;

    for (let i = 0; i < 5; i++) {
      expect(await enforceRateLimit({ key: "user-d", route })).toBe(true);
    }
    expect(await enforceRateLimit({ key: "user-d", route })).toBe(false);
  });
});
