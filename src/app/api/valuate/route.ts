import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { createRequestLogger } from '@/lib/logger';

export async function POST(req: Request) {
  const log = createRequestLogger('/api/valuate');
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!rateLimit(ip, 5, 60_000)) {
      return NextResponse.json(
        { error: 'Previše zahtjeva. Pokušajte ponovno za minutu.' },
        { status: 429 }
      );
    }

    const data = await req.json();
    const { industry, revenue, ebitda, sde, dependency, maturity } = data;

    // Input validation
    if (!industry || typeof industry !== 'string') {
      return NextResponse.json({ error: 'Industry is required.' }, { status: 400 });
    }
    if (typeof revenue !== 'number' || revenue < 0 || revenue > 1_000_000_000) {
      return NextResponse.json({ error: 'Invalid revenue value.' }, { status: 400 });
    }
    if (typeof ebitda !== 'number' || ebitda < 0 || ebitda > 1_000_000_000) {
      return NextResponse.json({ error: 'Invalid EBITDA value.' }, { status: 400 });
    }
    if (typeof sde !== 'number' || sde < 0 || sde > 1_000_000_000) {
      return NextResponse.json({ error: 'Invalid SDE value.' }, { status: 400 });
    }
    if (typeof dependency !== 'number' || dependency < 1 || dependency > 5) {
      return NextResponse.json({ error: 'Dependency must be between 1 and 5.' }, { status: 400 });
    }
    if (typeof maturity !== 'number' || maturity < 1 || maturity > 5) {
      return NextResponse.json({ error: 'Maturity must be between 1 and 5.' }, { status: 400 });
    }

    // Calculate ranges based on MVP requested formulas
    const sdeValLow = sde * 2;
    const sdeValHigh = sde * 4;
    const ebitdaValLow = ebitda * 3;
    const ebitdaValHigh = ebitda * 6;

    const systemPrompt = `Ti si stručnjak za M&A valuaciju u Hrvatskoj.
Klijent je poslao sljedeće podatke:
- Sektor: ${industry}
- Prihodi: ${revenue} EUR
- EBITDA: ${ebitda} EUR
- SDE: ${sde} EUR
- Ovisnost o vlasniku (1-5): ${dependency}
- Digitalna zrelost (1-5): ${maturity}

Rasponi valuacije su automatski izračunati sustavom:
- SDE metoda (2x-4x): ${sdeValLow.toLocaleString('hr-HR')} - ${sdeValHigh.toLocaleString('hr-HR')} EUR
- EBITDA metoda (3x-6x): ${ebitdaValLow.toLocaleString('hr-HR')} - ${ebitdaValHigh.toLocaleString('hr-HR')} EUR

Generiraj narativni izvještaj koji objašnjava financijsku i kvalitativnu procjenu vrijednosti tvrtke s obzirom na ove podatke.
Odredi 'Sell-Readiness Score' od 1 do 100 s kratkim objašnjenjem što taj rezultat znači za budućeg investitora.
Formatiraj odgovor ISKLJUČIVO u čistom HTML-u (koristi <h3>, <p>, <ul>, <strong>). Nemoj koristiti markdown (bez \`\`\`html blokova).
Odgovori isključivo na hrvatskom jeziku.`;

    const result = await generateText({
      model: google('gemini-2.5-pro'),
      prompt: systemPrompt,
    });

    // Remove any accidental markdown artifacts injected by the models
    const cleanHtml = result.text.replace(/```html|```/gi, '').trim();

    return NextResponse.json({ 
      html: cleanHtml,
      ranges: {
        sde: [sdeValLow, sdeValHigh],
        ebitda: [ebitdaValLow, ebitdaValHigh]
      }
    });
  } catch (error) {
    log.error('Valuation processing failed', error);
    return NextResponse.json({ error: "Valuation processing failed." }, { status: 500 });
  }
}
