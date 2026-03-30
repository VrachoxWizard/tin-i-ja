import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createRequestLogger } from '@/lib/logger';

export async function POST(req: Request) {
  const log = createRequestLogger('/api/nda/approve');
  try {
    const { nda_id, action } = await req.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!nda_id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'nda_id and action (approve/reject) are required' },
        { status: 400 }
      );
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (typeof nda_id !== 'string' || !uuidRegex.test(nda_id)) {
      return NextResponse.json({ error: 'Invalid nda_id format' }, { status: 400 });
    }

    // Verify the current user owns the listing associated with this NDA
    const { data: nda } = await supabase
      .from('ndas')
      .select('id, listing_id, listings!inner(owner_id)')
      .eq('id', nda_id)
      .single();

    if (!nda) {
      return NextResponse.json({ error: 'NDA not found' }, { status: 404 });
    }

    const listing = nda.listings as unknown as { owner_id: string };
    if (listing.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Only the listing owner can approve/reject NDAs' },
        { status: 403 }
      );
    }

    const newStatus = action === 'approve' ? 'signed' : 'rejected';
    const updateData: Record<string, unknown> = { status: newStatus };
    if (action === 'approve') {
      updateData.signed_at = new Date().toISOString();
    }

    const { error: dbError } = await supabase
      .from('ndas')
      .update(updateData)
      .eq('id', nda_id);

    if (dbError) {
      log.error('Failed to update NDA status', dbError);
      return NextResponse.json(
        { error: 'Failed to update NDA status.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `NDA status updated to: ${newStatus}`,
      status: newStatus,
    });

  } catch (error) {
    log.error('Error approving NDA', error);
    return NextResponse.json(
      { error: 'Internal server error while processing NDA' },
      { status: 500 }
    );
  }
}
