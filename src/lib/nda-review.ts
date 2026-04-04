'use server';

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionResult } from "@/app/actions/dealflow";

/**
 * Core NDA review logic shared between seller and broker review actions.
 * Assumes the caller has already:
 *  - validated the decision schema
 *  - verified the NDA exists and is in "pending" state
 *  - verified the caller has authority over the listing
 *
 * @param supabase  An authenticated Supabase client
 * @param ndaId     The NDA to update
 * @param listingId The listing the NDA belongs to (for status update)
 * @param decision  "approve" | "reject"
 * @param revalidatePaths Additional paths to revalidate after update
 */
export async function performNdaReview(
  supabase: SupabaseClient,
  ndaId: string,
  listingId: string,
  decision: "approve" | "reject",
  revalidatePaths: string[] = [],
): Promise<ActionResult> {
  const nextStatus = decision === "approve" ? "signed" : "rejected";

  const { error } = await supabase
    .from("ndas")
    .update({
      status: nextStatus,
      signed_at: decision === "approve" ? new Date().toISOString() : null,
    })
    .eq("id", ndaId);

  if (error) {
    return { error: "Ažuriranje NDA statusa nije uspjelo." };
  }

  if (decision === "approve") {
    await supabase
      .from("listings")
      .update({ status: "under_nda" })
      .eq("id", listingId);
  }

  for (const path of ["/dashboard/buyer", "/dashboard/seller", ...revalidatePaths]) {
    revalidatePath(path);
  }

  return {
    success: true,
    message:
      decision === "approve"
        ? "NDA je odobren i deal room je otključan."
        : "NDA zahtjev je odbijen.",
  };
}
