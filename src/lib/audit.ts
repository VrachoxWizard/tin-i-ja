import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/database.types";

export type AuditAction =
  // User management (admin)
  | "user.update"
  | "user.suspend"
  | "user.unsuspend"
  | "user.delete"
  // Listing lifecycle
  | "listing.create"
  | "listing.update"
  | "listing.status_change"
  | "listing.delete"
  | "listing.assign_broker"
  | "listing.publish"
  | "listing.archive"
  // NDA workflow
  | "nda.request"
  | "nda.approve"
  | "nda.reject"
  | "nda.override"
  // Deal room
  | "file.upload"
  // Auth events
  | "auth.login"
  | "auth.logout";

export type AuditEntityType = "user" | "listing" | "nda" | "file" | "session";

/**
 * Log an audit event via the security-definer RPC function.
 * Fire-and-forget: errors are logged but don't block the caller.
 */
export async function logAuditEvent(
  supabase: SupabaseClient<Database>,
  params: {
    action: AuditAction;
    entityType: AuditEntityType;
    entityId?: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  const { error } = await supabase.rpc("log_audit_event", {
    p_action: params.action,
    p_entity_type: params.entityType,
    p_entity_id: params.entityId ?? null,
    p_metadata: (params.metadata ?? {}) as Json,
  });

  if (error) {
    console.error("[audit] Failed to log event:", error.message, params);
  }
}
