import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Lock, Search, ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TeaserCard } from "@/components/features/TeaserCard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "DealFlow | Diskretna M&A platforma za Hrvatsku",
  description:
    "AI procjena, anonimni teaseri, kvalificirana uparivanja i sigurni deal room za diskretnu prodaju i kupnju tvrtki u Hrvatskoj.",
  alternates: { canonical: "/" },
};


const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "DealFlow",
  serviceType: "M&A marketplace and advisory workflow platform",
  areaServed: "Hrvatska",
  provider: {
    "@type": "Organization",
    name: "DealFlow",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dealflow.hr",
  },
  description:
    "Platforma za diskretnu prodaju i kupnju tvrtki u Hrvatskoj s AI procjenom, NDA workflowom i deal roomom.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select(
      "id, public_code, industry_nkd, region, revenue_eur, ebitda_eur, asking_price_eur, blind_teaser",
    )
    .in("status", ["active", "under_nda"])
    .order("updated_at", { ascending: false })
    .limit(2);

  const featuredListings = data ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.10),transparent_42%)]" />
        <div className="container relative mx-auto max-w-7xl px-4 pt-18 pb-16 sm:pt-24 sm:pb-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/6 px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Diskretan prijenos vlasništva
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl">
                  Kupnja, prodaja i procjena tvrtke bez javnog izlaganja.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
                  DealFlow povezuje kvalificirane prodavatelje i investitore kroz
                  AI procjenu vrijednosti, anonimne teasere, NDA odobravanje i
                  privatni deal room.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Link href="/sell">
                  <Button className="w-full h-14 rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90 text-sm uppercase tracking-[0.18em]">
                    Prodajem
                  </Button>
                </Link>
                <Link href="/buy">
                  <Button variant="outline" className="w-full h-14 rounded-none text-sm uppercase tracking-[0.18em]">
                    Kupujem
                  </Button>
                </Link>
                <Link href="/valuate">
                  <Button className="w-full h-14 rounded-none bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm uppercase tracking-[0.18em]">
                    Procijeni vrijednost
                  </Button>
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: Sparkles,
                    title: "AI procjena u minutama",
                    body: "Prvi raspon vrijednosti i sell-readiness score bez slanja povjerljivih podataka tržištu.",
                  },
                  {
                    icon: Lock,
                    title: "Anonimni teaser i NDA",
                    body: "Identitet tvrtke ostaje skriven sve do odobrenja zahtjeva i otvaranja deal rooma.",
                  },
                  {
                    icon: Search,
                    title: "Kvalificirana uparivanja",
                    body: "Sustav automatski izračunava podudaranja između profila investitora i aktivnih oglasa.",
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="border border-border bg-card px-5 py-6">
                    <Icon className="w-5 h-5 text-primary mb-4" />
                    <h2 className="text-xl font-heading text-foreground mb-2">
                      {title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border bg-card p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
                Kako platforma radi
              </p>
              <div className="space-y-5">
                {[
                  {
                    step: "01",
                    title: "Prodavatelj sprema interne podatke",
                    body: "Podaci ostaju privatni, a AI generira blind teaser spreman za pregled i objavu.",
                  },
                  {
                    step: "02",
                    title: "Investitor definira kriterije ulaganja",
                    body: "EV raspon, prihodi, industrija i regija pretvaraju se u aktivan match profil.",
                  },
                  {
                    step: "03",
                    title: "NDA otključava puni deal room",
                    body: "Nakon odobrenja obje strane prelaze iz anonimnog teasera u strukturiranu dubinsku analizu.",
                  },
                ].map(({ step, title, body }) => (
                  <div key={step} className="flex gap-4 border-b border-border pb-5 last:border-b-0 last:pb-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-primary/20 bg-primary/8 text-primary font-heading">
                      {step}
                    </div>
                    <div>
                      <h3 className="text-lg font-heading text-foreground mb-2">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/listings">
                  <Button variant="outline" className="rounded-none">
                    Pregledaj prilike
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
                    Razgovarajmo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                Aktivne prilike
              </p>
              <h2 className="text-3xl font-heading text-foreground">
                Primjeri anonimiziranih teasera
              </h2>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="rounded-none">
                Otvori marketplace
              </Button>
            </Link>
          </div>

          {featuredListings.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-2">
              {featuredListings.map((listing) => (
                <TeaserCard
                  key={listing.id}
                  publicCode={listing.public_code}
                  industry={listing.industry_nkd}
                  region={listing.region}
                  revenue={listing.revenue_eur}
                  ebitda={listing.ebitda_eur}
                  askingPrice={listing.asking_price_eur}
                  blindTeaserHtml={listing.blind_teaser || ""}
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border bg-card px-6 py-12 text-center">
              <Building2 className="w-10 h-10 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground max-w-xl mx-auto">
                Marketplace je spreman za nove oglase. Otvorite seller onboarding
                i objavite prvi anonimizirani teaser.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
