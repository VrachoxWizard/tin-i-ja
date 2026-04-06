'use server';

import { after } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ActionResult } from '@/app/actions/dealflow';
import type { Database } from '@/lib/database.types';
import { sendNdaDecisionEmail } from '@/lib/email';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dealflow.hr';

export async function performNdaReview(
  supabase: SupabaseClient<Database>,
  ndaId: string,
  listingId: string,
  decision: 'approve' | 'reject',
  revalidatePaths: string[] = [],
): Promise<ActionResult> {
  const nextStatus = decision === 'approve' ? 'signed' : 'rejected';

  const { error } = await supabase
    .from('ndas')
    .update({
      status: nextStatus,
      signed_at: decision === 'approve' ? new Date().toISOString() : null,
    })
    .eq('id', ndaId);

  if (error) {
    return { error: 'Azuriranje NDA statusa nije uspjelo.' };
  }

  if (decision === 'approve') {
    await supabase.from('listings').update({ status: 'under_nda' }).eq('id', listingId);
  }

  after(async () => {
    try {
      const { data: ndaRow } = await supabase
        .from('ndas')
        .select('buyer_id')
        .eq('id', ndaId)
        .single();

      if (!ndaRow?.buyer_id) {
        return;
      }

      const [{ data: buyer }, { data: listing }] = await Promise.all([
        supabase.from('users').select('email, full_name').eq('id', ndaRow.buyer_id).single(),
        supabase.from('listings').select('public_code').eq('id', listingId).single(),
      ]);

      if (!buyer?.email || !listing?.public_code) {
        return;
      }

      const { error: notificationError } = await supabase.from('notifications').insert({
        user_id: ndaRow.buyer_id,
        type: decision === 'approve' ? 'nda_approved' : 'nda_rejected',
        title: decision === 'approve' ? 'NDA je odobren' : 'NDA zahtjev je odbijen',
        body:
          decision === 'approve'
            ? `Deal room za oglas ${listing.public_code} je otkljucan.`
            : `Zahtjev za oglas ${listing.public_code} trenutno nije odobren.`,
        entity_id: listingId,
      });

      if (notificationError) {
        console.error('[nda-review] Notification creation failed:', notificationError);
      }

      await sendNdaDecisionEmail({
        buyerEmail: buyer.email,
        buyerName: buyer.full_name ?? 'Kupac',
        listingCode: listing.public_code,
        decision,
        dashboardUrl: `${siteUrl}/dashboard/buyer`,
      });
    } catch (err: unknown) {
      console.error('[nda-review] Email notification failed:', err);
    }
  });

  for (const path of ['/dashboard/buyer', '/dashboard/seller', ...revalidatePaths]) {
    revalidatePath(path);
  }

  return {
    success: true,
    message:
      decision === 'approve'
        ? 'NDA je odobren i deal room je otkljucan.'
        : 'NDA zahtjev je odbijen.',
  };
}
