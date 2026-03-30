import { Metadata } from "next";
import { Suspense } from "react";
import { TeaserCard } from "@/components/features/TeaserCard";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  ListingsSearchBar,
  ListingsSidebar,
  ListingsSort,
} from "@/components/features/ListingsFilters";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pregled Tvrtki (M&A Prilike) | DealFlow",
  description: "Pregledajte verificirane B2B akvizicijske prilike u Hrvatskoj.",
  alternates: { canonical: "/listings" },
};

interface Teaser {
  listing_id: string;
  industry_nkd: string;
  region: string;
  revenue_eur: number;
  ebitda_eur: number;
  asking_price_eur: number;
  blind_teaser: string;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.toLowerCase() : "";
  const industry = typeof params.industry === "string" ? params.industry : "";
  const region = typeof params.region === "string" ? params.region : "";
  const ebitda = typeof params.ebitda === "string" ? params.ebitda : "";
  const sort = typeof params.sort === "string" ? params.sort : "newest";

  const supabase = await createClient();
  const { data: allListings } = await supabase.rpc("get_active_teasers");

  // Filter
  let listings: Teaser[] = allListings || [];

  if (q) {
    listings = listings.filter(
      (t) =>
        t.industry_nkd?.toLowerCase().includes(q) ||
        t.region?.toLowerCase().includes(q) ||
        t.blind_teaser?.toLowerCase().includes(q)
    );
  }

  if (industry && industry !== "all") {
    listings = listings.filter((t) =>
      t.industry_nkd?.toLowerCase().includes(industry.toLowerCase())
    );
  }

  if (region && region !== "all") {
    listings = listings.filter((t) =>
      t.region?.toLowerCase().includes(region.toLowerCase())
    );
  }

  if (ebitda && ebitda !== "any") {
    listings = listings.filter((t) => {
      const val = t.ebitda_eur / 1000; // in thousands
      if (ebitda === "0-100") return val <= 100;
      if (ebitda === "100-500") return val > 100 && val <= 500;
      if (ebitda === "500+") return val > 500;
      return true;
    });
  }

  // Sort
  if (sort === "ebitda-desc") {
    listings.sort((a, b) => b.ebitda_eur - a.ebitda_eur);
  } else if (sort === "revenue-desc") {
    listings.sort((a, b) => b.revenue_eur - a.revenue_eur);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Search Header */}
      <div className="relative bg-background border-b border-white/10 pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-60" />

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 font-heading tracking-tight">
              Akvizicijske Prilike
            </h1>
            <p className="text-lg text-muted-foreground font-sans max-w-2xl leading-relaxed">
              Pregledajte strogo verificirane i anonimizirane profile tvrtki
              (slijepi teaseri) koje su trenutno otvorene za akviziciju ili
              investiciju na hrvatskom tržištu.
            </p>
          </div>

          <Suspense>
            <ListingsSearchBar />
          </Suspense>
        </div>
      </div>

      <main className="flex-1 w-full py-12 relative z-10 -mt-6">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-72 shrink-0">
            <Suspense>
              <ListingsSidebar />
            </Suspense>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-muted-foreground font-sans text-sm">
                Prikazano{" "}
                <span className="font-bold text-foreground">
                  {listings.length}
                </span>{" "}
                rezultata
              </p>
              <Suspense>
                <ListingsSort />
              </Suspense>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {listings.map((teaser) => (
                <TeaserCard
                  key={teaser.listing_id}
                  id={teaser.listing_id.split("-")[0]}
                  industry={teaser.industry_nkd}
                  region={teaser.region}
                  revenue={teaser.revenue_eur}
                  ebitda={teaser.ebitda_eur}
                  askingPrice={teaser.asking_price_eur}
                  blindTeaserHtml={teaser.blind_teaser}
                />
              ))}
              {listings.length === 0 && (
                <div className="col-span-1 lg:col-span-2 text-center py-32 bg-card rounded-none border border-white/10 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-none flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground font-heading mb-2">
                    Nema rezultata
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto font-sans">
                    Trenutno nemamo aktivnih M&A prilika koje odgovaraju vašim
                    kriterijima. Pokušajte izmijeniti filtere.
                  </p>
                  <Link href="/listings">
                    <Button
                      variant="outline"
                      className="mt-8 border-white/20 text-foreground hover:bg-white/5 font-heading uppercase tracking-widest px-8 h-12 rounded-none"
                    >
                      Poništi filtere
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
