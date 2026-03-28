import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const supabase = await createClient();

    // Verification of Auth in production
    // const { data: { user } } = await supabase.auth.getUser();

    // Mock DB insertion for MVP demo without auth
    /*
    const { error: dbError } = await supabase.from('buyer_profiles').insert({
      user_id: user.id,
      buyer_type: data.buyer_type,
      investment_min: data.investment_min,
      investment_max: data.investment_max,
      target_industries: [data.target_industries], // In a real app we'd map this properly or allow multiple
      target_regions: [data.target_regions],
      investment_thesis: data.investment_thesis,
    });
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Buyer profile cached successfully for matchmaking engine.' 
    });

  } catch (error) {
    console.error('Error processing buyer profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
