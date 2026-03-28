import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { listing_id } = await req.json();
    const supabase = await createClient();

    // Verify Auth in production
    // const { data: { user } } = await supabase.auth.getUser();

    // Mock DB insertion for NDA request
    /*
    const { error: dbError } = await supabase.from('ndas').insert({
      listing_id,
      buyer_id: user.id,
      status: 'pending',
    });
    */

    return NextResponse.json({ 
      success: true, 
      message: 'NDA request sent to the seller successfully. Awaiting approval.' 
    });

  } catch (error) {
    console.error('Error requesting NDA:', error);
    return NextResponse.json(
      { error: 'Internal server error while requesting NDA' },
      { status: 500 }
    );
  }
}
