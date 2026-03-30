import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createRequestLogger } from '@/lib/logger';

export async function POST(req: Request) {
  const log = createRequestLogger('/api/buyers/profile');
  try {
    const data = await req.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error: dbError } = await supabase.from('buyer_profiles').insert({
      user_id: user.id,
      target_industries: Array.isArray(data.target_industries)
        ? data.target_industries
        : [data.target_industries],
      target_regions: Array.isArray(data.target_regions)
        ? data.target_regions
        : [data.target_regions],
      min_revenue: parseFloat(data.investment_min) || null,
      max_ev: parseFloat(data.investment_max) || null,
      transaction_type: data.buyer_type || 'individual',
    });

    if (dbError) {
      log.error('Failed to save buyer profile', dbError);
      return NextResponse.json(
        { error: 'Failed to save buyer profile.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Buyer profile saved successfully for matchmaking engine.' 
    });

  } catch (error) {
    log.error('Error processing buyer profile', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
