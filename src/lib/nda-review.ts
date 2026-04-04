'use server';

import { after } from 'next/server';
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionResult } from "@/app/actions/dealflow";
import { sendNdaDecisionEmail } from "@/lib/email";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dealflow.hr";

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

  // Use Next.js 16 `after()` to send the decision email after the response
  // is flushed — non-blocking, per the official Next.js recommendation for
  // post-response side effects in Server Actions.
  after(async () => {
    try {
      const { data: ndaRow } = await supabase
        .from("ndas")
        .select("buyer_id")
        .eq("id", ndaId)
        .single();
      if (!ndaRow?.buyer_id) return;

      const [{ data: buyer }, { data: listing }] = await Promise.all([
        supabase
          .from("users")
          .select("email, full_name")
          .eq("id", ndaRow.buyer_id)
          .single(),
        supabase
          .from("listings")
          .select("public_code")
          .eq("id", listingId)
          .single(),
      ]);

      if (buyer?.email && listing?.public_code) {
        await sendNdaDecisionEmail({
          buyerEmail: buyer.email,
          buyerName: buyer.full_name ?? "Kupac",
          listingCode: listing.public_code,
          decision,
          dashboardUrl: `${siteUrl}/dashboard/buyer`,
        });
      }
    } catch (err: unknown) {
      console.error("[nda-review] Email notification failed:", err);
    }
  });

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
