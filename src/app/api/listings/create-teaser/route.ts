import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { createRequestLogger } from '@/lib/logger';

export async function POST(req: Request) {
  const log = createRequestLogger('/api/listings/create-teaser');
  try {
    const data = await req.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Input validation
    if (!data.industry || typeof data.industry !== 'string') {
      return NextResponse.json({ error: 'Industry is required.' }, { status: 400 });
    }
    if (!data.region || typeof data.region !== 'string') {
      return NextResponse.json({ error: 'Region is required.' }, { status: 400 });
    }
    if (!data.year_founded || isNaN(parseInt(data.year_founded, 10))) {
      return NextResponse.json({ error: 'Valid year_founded is required.' }, { status: 400 });
    }
    if (!data.employees || isNaN(parseInt(data.employees, 10))) {
      return NextResponse.json({ error: 'Valid employees count is required.' }, { status: 400 });
    }
    if (!data.revenue || isNaN(parseFloat(data.revenue)) || parseFloat(data.revenue) < 0) {
      return NextResponse.json({ error: 'Valid revenue is required.' }, { status: 400 });
    }
    if (!data.ebitda || isNaN(parseFloat(data.ebitda))) {
      return NextResponse.json({ error: 'Valid EBITDA is required.' }, { status: 400 });
    }
    if (!data.asking_price || isNaN(parseFloat(data.asking_price)) || parseFloat(data.asking_price) < 0) {
      return NextResponse.json({ error: 'Valid asking_price is required.' }, { status: 400 });
    }

    const prompt = `
      Generiraj anonimni "Blind Teaser" za prodaju tvrtke na hrvatskom jeziku.
      Teaser mora biti profesionalan, primamljiv, ali ne smije otkriti identitet tvrtke.
      
      Podaci:
      - Industrija: ${data.industry}
      - Regija: ${data.region}
      - Godina osnivanja: ${data.year_founded}
      - Broj zaposlenih: ${data.employees}
      - Prihod (EUR): ${data.revenue}
      - EBITDA (EUR): ${data.ebitda}
      - Razlog prodaje: ${data.reason}
      - Konkurentska prednost: ${data.advantage}
      
      Formatiraj izlaz kao HTML koristeći samo <p> i <strong> tagove.
      Izdvoji 2-3 ključna paragrafa. Očuvaj potpunu anonimnost (ne spominji ime tvrtke, točnu mikrolokaciju ako je previše specifična).
    `;

    const { text: blind_teaser_html } = await generateText({
      model: google('gemini-2.5-pro'),
      prompt: prompt,
    });

    const { error: dbError } = await supabase.from('listings').insert({
      owner_id: user.id,
      industry_nkd: data.industry,
      region: data.region,
      year_founded: parseInt(data.year_founded, 10),
      employees: parseInt(data.employees, 10),
      revenue_eur: parseFloat(data.revenue),
      ebitda_eur: parseFloat(data.ebitda),
      sde_eur: parseFloat(data.sde) || 0,
      asking_price_eur: parseFloat(data.asking_price),
      owner_dependency_score: 3, // Mocked for MVP
      digital_maturity: 3,       // Mocked for MVP
      blind_teaser: blind_teaser_html,
      is_exclusive: true,
      status: 'active' // Changed from draft to active so it shows on the marketplace immediately for testing MVP
    });

    if (dbError) {
      log.error('Failed to insert listing', dbError);
      throw dbError;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Teaser generated and published successfully',
      teaser: blind_teaser_html 
    });

  } catch (error) {
    log.error('Error generating teaser', error);
    return NextResponse.json(
      { error: 'Internal server error while generating teaser' },
      { status: 500 }
    );
  }
}
