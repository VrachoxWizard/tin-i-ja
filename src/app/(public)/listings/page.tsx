import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TeaserCard } from "@/components/features/TeaserCard";
import {
  ListingsSearchBar,
  ListingsSidebar,
  ListingsSort,
} from "@/components/features/ListingsFilters";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pregled tvrtki | DealFlow",
  description: "Pregledajte aktivne i anonimne akvizicijske prilike u Hrvatskoj.",
  alternates: { canonical: "/listings" },
};

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
  const { data } = await supabase
    .from("listings")
    .select(
      "id, public_code, industry_nkd, region, revenue_eur, ebitda_eur, asking_price_eur, blind_teaser, updated_at",
    )
    .in("status", ["active", "under_nda"])
    .order("updated_at", { ascending: false });

  let listings = data ?? [];

  if (q) {
    listings = listings.filter(
      (listing) =>
        listing.industry_nkd.toLowerCase().includes(q) ||
        listing.region.toLowerCase().includes(q) ||
        listing.blind_teaser?.toLowerCase().includes(q),
    );
  }

  if (industry && industry !== "all") {
    listings = listings.filter((listing) =>
      listing.industry_nkd.toLowerCase().includes(industry.toLowerCase()),
    );
  }

  if (region && region !== "all") {
    listings = listings.filter((listing) =>
      listing.region.toLowerCase().includes(region.toLowerCase()),
    );
  }

  if (ebitda && ebitda !== "any") {
    listings = listings.filter((listing) => {
      const value = listing.ebitda_eur / 1000;
      if (ebitda === "0-100") return value <= 100;
      if (ebitda === "100-500") return value > 100 && value <= 500;
      if (ebitda === "500+") return value > 500;
      return true;
    });
  }

  if (sort === "ebitda-desc") {
    listings.sort((a, b) => b.ebitda_eur - a.ebitda_eur);
  } else if (sort === "revenue-desc") {
    listings.sort((a, b) => b.revenue_eur - a.revenue_eur);
  } else if (sort === "newest") {
    listings.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="relative border-b border-border pt-28 pb-16 overflow-hidden bg-muted/20">
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.08),transparent_60%)]" />

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">
              Marketplace
            </p>
            <h1 className="text-4xl md:text-5xl font-heading text-foreground mb-4 tracking-tight">
              Diskretne akvizicijske prilike
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Pregledajte verificirane i anonimizirane profile tvrtki koje su
              trenutno otvorene za akviziciju ili ulaganje na hrvatskom tržištu.
            </p>
          </div>

          <Suspense>
            <ListingsSearchBar />
          </Suspense>
        </div>
      </div>

      <main className="flex-1 w-full py-12">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 shrink-0">
            <Suspense>
              <ListingsSidebar />
            </Suspense>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-muted-foreground text-sm">
                Prikazano{" "}
                <span className="font-semibold text-foreground">
                  {listings.length}
                </span>{" "}
                rezultata
              </p>
              <Suspense>
                <ListingsSort />
              </Suspense>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {listings.map((listing) => (
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

              {listings.length === 0 ? (
                <div className="col-span-1 lg:col-span-2 text-center py-24 bg-card border border-border rounded-none flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-none flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading text-foreground mb-3">
                    Trenutno nema rezultata za zadane filtere
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Pokušajte proširiti kriterije ili ostavite investicijski
                    profil kako bi vam platforma sama označila relevantne
                    prilike.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link href="/listings">
                      <Button variant="outline" className="rounded-none">
                        Poništi filtere
                      </Button>
                    </Link>
                    <Link href="/buy">
                      <Button className="rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
                        Kreiraj investicijski profil
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
