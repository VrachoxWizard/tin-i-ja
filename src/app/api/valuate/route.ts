import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";
import { sanitizeHtml } from "@/lib/sanitize";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createRequestLogger } from "@/lib/logger";
import type { ValuationResponse } from "@/lib/contracts";

const valuationSchema = z.object({
  industry: z.string().min(2).max(120),
  revenue: z.coerce.number().min(0).max(1_000_000_000),
  ebitda: z.coerce.number().min(0).max(1_000_000_000),
  sde: z.coerce.number().min(0).max(1_000_000_000),
  dependency: z.coerce.number().int().min(1).max(5),
  maturity: z.coerce.number().int().min(1).max(5),
});

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function calculateSellReadinessScore(input: z.infer<typeof valuationSchema>) {
  const margin = input.revenue > 0 ? input.ebitda / input.revenue : 0;
  const profitabilityScore = clamp(Math.round(margin * 100), 0, 25);
  const maturityScore = input.maturity * 8;
  const ownerIndependenceScore = (6 - input.dependency) * 8;
  const scaleScore = input.revenue >= 1_000_000 ? 10 : input.revenue >= 300_000 ? 6 : 2;

  return clamp(
    20 + profitabilityScore + maturityScore + ownerIndependenceScore + scaleScore,
    1,
    100,
  );
}

export async function POST(req: Request) {
  const log = createRequestLogger("/api/valuate");

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const allowed = await enforceRateLimit({
      key: ip,
      route: "/api/valuate",
      limit: 5,
      windowMs: 60_000,
    });

    if (!allowed) {
      return NextResponse.json(
        { error: "Previše zahtjeva. Pokušajte ponovno za minutu." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = valuationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Provjerite unesene podatke i pokušajte ponovno." },
        { status: 400 },
      );
    }

    const input = parsed.data;
    const ranges = {
      sde: [input.sde * 2, input.sde * 4] as [number, number],
      ebitda: [input.ebitda * 3, input.ebitda * 6] as [number, number],
    };
    const sellReadinessScore = calculateSellReadinessScore(input);

    const { text } = await generateText({
      model: google("gemini-2.5-pro"),
      prompt: `
        Ti si savjetnik za M&A transakcije u Hrvatskoj.
        Napiši sažet i profesionalan izvještaj na hrvatskom jeziku.
        Vrati isključivo čist HTML koristeći <h3>, <p>, <ul>, <li> i <strong>.

        Ulazni podaci:
        - Industrija: ${input.industry}
        - Prihod: ${input.revenue} EUR
        - EBITDA: ${input.ebitda} EUR
        - SDE: ${input.sde} EUR
        - Ovisnost o vlasniku: ${input.dependency}/5
        - Digitalna zrelost: ${input.maturity}/5

        Izračunati rasponi:
        - SDE metoda: ${ranges.sde[0]} do ${ranges.sde[1]} EUR
        - EBITDA metoda: ${ranges.ebitda[0]} do ${ranges.ebitda[1]} EUR

        Sell-readiness score:
        - Rezultat: ${sellReadinessScore}/100

        U izvještaju obradi:
        1. kratko objašnjenje valuacijskih raspona
        2. što score znači za spremnost prodaje
        3. dvije do četiri praktične preporuke za povećanje atraktivnosti tvrtke
      `,
    });

    const reportHtml = sanitizeHtml(text.replace(/```html|```/gi, "").trim());
    const response: ValuationResponse = {
      ranges,
      sellReadinessScore,
      reportHtml,
    };

    return NextResponse.json(response);
  } catch (error) {
    log.error("Valuation processing failed", error);
    return NextResponse.json(
      { error: "Obrada procjene nije uspjela." },
      { status: 500 },
    );
  }
}
