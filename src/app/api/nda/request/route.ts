import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createRequestLogger } from '@/lib/logger';

export async function POST(req: Request) {
  const log = createRequestLogger('/api/nda/request');
  try {
    const { listing_id } = await req.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!listing_id || typeof listing_id !== 'string') {
      return NextResponse.json({ error: 'listing_id is required' }, { status: 400 });
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(listing_id)) {
      return NextResponse.json({ error: 'Invalid listing_id format' }, { status: 400 });
    }

    // Check if NDA already exists for this buyer + listing
    const { data: existing } = await supabase
      .from('ndas')
      .select('id, status')
      .eq('listing_id', listing_id)
      .eq('buyer_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json({
        success: false,
        message: `NDA zahtjev već postoji sa statusom: ${existing.status}`,
        nda: existing,
      });
    }

    const { data: nda, error: dbError } = await supabase
      .from('ndas')
      .insert({
        listing_id,
        buyer_id: user.id,
        status: 'pending',
      })
      .select('id, status')
      .single();

    if (dbError) {
      log.error('Failed to create NDA request', dbError);
      return NextResponse.json(
        { error: 'Failed to create NDA request.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'NDA request sent to the seller successfully. Awaiting approval.',
      nda,
    });

  } catch (error) {
    log.error('Error requesting NDA', error);
    return NextResponse.json(
      { error: 'Internal server error while requesting NDA' },
      { status: 500 }
    );
  }
}
