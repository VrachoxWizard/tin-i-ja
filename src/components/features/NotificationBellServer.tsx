import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "@/components/features/NotificationBell";

export async function NotificationBellServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, title, body, entity_id, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return <NotificationBell notifications={notifications ?? []} />;
}
