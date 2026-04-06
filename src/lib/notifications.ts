import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type NotificationType =
  | "nda_request"
  | "nda_approved"
  | "nda_rejected"
  | "match_found"
  | "deal_room_upload";

export async function createNotification(input: {
  admin?: ReturnType<typeof createAdminClient>;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  entityId?: string;
}) {
  const admin = input.admin ?? createAdminClient();
  const { error } = await admin.from("notifications").insert({
    user_id: input.userId,
    type: input.type,
    title: input.title,
    body: input.body,
    entity_id: input.entityId ?? null,
  });

  if (error) {
    console.error("[notifications] Failed to create notification:", error.message);
  }
}
