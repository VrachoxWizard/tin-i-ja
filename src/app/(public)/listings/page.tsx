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
import { FadeInView } from "@/components/ui/FadeInView";

export const metadata: Metadata = {
  title: "Pregled tvrtki | DealFlow",
  description:
    "Pregledajte aktivne i anonimne akvizicijske prilike u Hrvatskoj.",
  alternates: { canonical: "/listings" },
};

const PAGE_SIZE = 12;

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // ── Parse URL search params ────────────────────────────────────
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const industry =
    typeof params.industry === "string" && params.industry !== "all"
      ? params.industry
      : "";
  const region =
    typeof params.region === "string" && params.region !== "all"
      ? params.region
      : "";
  const ebitda =
    typeof params.ebitda === "string" && params.ebitda !== "any"
      ? params.ebitda
      : "";
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const page = Math.max(
    1,
    typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1,
  );
  const offset = (page - 1) * PAGE_SIZE;

  // ── Build server-side Supabase query ───────────────────────────
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select(
      "id, public_code, industry_nkd, region, revenue_eur, ebitda_eur, asking_price_eur, blind_teaser, updated_at",
      { count: "exact" },
    )
    .in("status", ["active", "under_nda"]);

  // Keyword search — matches against industry OR region OR blind teaser
  if (q) {
    query = query.or(
      `industry_nkd.ilike.%${q}%,region.ilike.%${q}%,blind_teaser.ilike.%${q}%`,
    );
  }

  // Exact industry filter
  if (industry) {
    query = query.eq("industry_nkd", industry);
  }

  // Exact region filter
  if (region) {
    query = query.eq("region", region);
  }

  // EBITDA range filter (values stored in EUR, bands in k)
  if (ebitda === "0-100") {
    query = query.lte("ebitda_eur", 100_000);
  } else if (ebitda === "100-500") {
    query = query.gt("ebitda_eur", 100_000).lte("ebitda_eur", 500_000);
  } else if (ebitda === "500+") {
    query = query.gt("ebitda_eur", 500_000);
  }

  // Sorting
  if (sort === "ebitda-desc") {
    query = query.order("ebitda_eur", { ascending: false });
  } else if (sort === "revenue-desc") {
    query = query.order("revenue_eur", { ascending: false });
  } else {
    query = query.order("updated_at", { ascending: false });
  }

  // Pagination
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data, count } = await query;
  const listings = data ?? [];
  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const hasFilters = !!(q || industry || region || ebitda);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="relative border-b border-border pt-28 pb-16 overflow-hidden bg-muted/20">
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.08),transparent_60%)]" />

        <div className="container relative z-10 mx-auto px-4 max-w-7xl">
          <FadeInView>
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
          </FadeInView>

          <Suspense>
            <ListingsSearchBar />
          </Suspense>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 w-full py-12">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="w-full md:w-72 shrink-0">
            <Suspense>
              <ListingsSidebar />
            </Suspense>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-muted-foreground text-sm">
                {hasFilters ? (
                  <>
                    <span className="font-semibold text-foreground">
                      {totalCount}
                    </span>{" "}
                    {totalCount === 1 ? "rezultat" : "rezultata"} za zadane filtere
                  </>
                ) : (
                  <>
                    Prikazano{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(offset + PAGE_SIZE, totalCount)}
                    </span>{" "}
                    od{" "}
                    <span className="font-semibold text-foreground">
                      {totalCount}
                    </span>
                  </>
                )}
              </p>
              <Suspense>
                <ListingsSort />
              </Suspense>
            </div>

            {listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {listings.map((listing, i) => (
                    <FadeInView key={listing.id} delay={Math.min(i * 0.06, 0.3)}>
                      <TeaserCard
                        publicCode={listing.public_code}
                        industry={listing.industry_nkd}
                        region={listing.region}
                        revenue={listing.revenue_eur}
                        ebitda={listing.ebitda_eur}
                        askingPrice={listing.asking_price_eur}
                        blindTeaserHtml={listing.blind_teaser || ""}
                      />
                    </FadeInView>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <FadeInView>
                    <div className="mt-12 flex items-center justify-center gap-2">
                      {page > 1 && (
                        <Link
                          href={`/listings?${buildPageUrl(params, page - 1)}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none"
                          >
                            ← Prethodna
                          </Button>
                        </Link>
                      )}

                      <span className="text-sm text-muted-foreground px-4">
                        Stranica {page} od {totalPages}
                      </span>

                      {page < totalPages && (
                        <Link
                          href={`/listings?${buildPageUrl(params, page + 1)}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none"
                          >
                            Sljedeća →
                          </Button>
                        </Link>
                      )}
                    </div>
                  </FadeInView>
                )}
              </>
            ) : (
              <FadeInView>
                <div className="col-span-1 lg:col-span-2 text-center py-24 bg-card border border-border rounded-none flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-none flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading text-foreground mb-3">
                    Trenutno nema rezultata za zadane filtere
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Pokušajte proširiti kriterije ili ostavite investicijski profil
                    kako bi vam platforma sama označila relevantne prilike.
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
              </FadeInView>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/** Builds a new URL param string preserving existing filters but updating page */
function buildPageUrl(
  currentParams: { [key: string]: string | string[] | undefined },
  newPage: number,
): string {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries(currentParams)) {
    if (key !== "page" && typeof value === "string") {
      p.set(key, value);
    }
  }
  p.set("page", String(newPage));
  return p.toString();
}
