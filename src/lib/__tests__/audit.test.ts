import { describe, it, expect, vi } from "vitest";
import { logAuditEvent } from "@/lib/audit";

function createMockSupabase(rpcResult: { error: null | { message: string } }) {
  return {
    rpc: vi.fn().mockResolvedValue(rpcResult),
  } as unknown as Parameters<typeof logAuditEvent>[0];
}

describe("logAuditEvent", () => {
  it("calls supabase.rpc with the correct parameters", async () => {
    const supabase = createMockSupabase({ error: null });

    await logAuditEvent(supabase, {
      action: "user.update",
      entityType: "user",
      entityId: "abc-123",
      metadata: { field: "email", newValue: "test@test.com" },
    });

    expect(supabase.rpc).toHaveBeenCalledOnce();
    expect(supabase.rpc).toHaveBeenCalledWith("log_audit_event", {
      p_action: "user.update",
      p_entity_type: "user",
      p_entity_id: "abc-123",
      p_metadata: { field: "email", newValue: "test@test.com" },
    });
  });

  it("defaults entityId to null and metadata to empty object", async () => {
    const supabase = createMockSupabase({ error: null });

    await logAuditEvent(supabase, {
      action: "listing.delete",
      entityType: "listing",
    });

    expect(supabase.rpc).toHaveBeenCalledWith("log_audit_event", {
      p_action: "listing.delete",
      p_entity_type: "listing",
      p_entity_id: null,
      p_metadata: {},
    });
  });

  it("logs error to console but does not throw on RPC failure", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const supabase = createMockSupabase({
      error: { message: "RPC failed" },
    });

    await expect(
      logAuditEvent(supabase, {
        action: "nda.override",
        entityType: "nda",
        entityId: "nda-1",
      }),
    ).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalledOnce();
    expect(consoleError.mock.calls[0][0]).toContain("[audit]");

    consoleError.mockRestore();
  });
});
