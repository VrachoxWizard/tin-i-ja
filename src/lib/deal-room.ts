import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

// This bucket is expected to stay private. Buyers access files only through
// signed URLs after a seller-approved NDA.
export const DEAL_ROOM_BUCKET = "deal-room-files";

export async function createDealRoomSignedUrl(
  supabase: SupabaseClient<Database>,
  filePath: string,
) {
  const { data, error } = await supabase.storage
    .from(DEAL_ROOM_BUCKET)
    .createSignedUrl(filePath, 60 * 15);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
