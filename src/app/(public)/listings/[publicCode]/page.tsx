import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  Lock,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { sanitizeHtml } from "@/lib/sanitize";
import { NdaRequestButton } from "@/components/features/NdaRequestButton";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";

interface ListingDetailPageProps {
  params: Promise<{ publicCode: string }>;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

async function getPublicListing(publicCode: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select(
      "id, public_code, industry_nkd, region, revenue_eur, ebitda_eur, asking_price_eur, blind_teaser, status",
    )
    .eq("public_code", publicCode)
    .in("status", ["active", "under_nda"])
    .single();

  return data ?? null;
}

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { publicCode } = await params;
  const listing = await getPublicListing(publicCode);

  if (!listing) {
    return { title: "Prilika nije pronađena" };
  }

  const title = `${listing.industry_nkd} · ${listing.region}`;
  const description = `Anonimna M&A prilika u sektoru ${listing.industry_nkd} za regiju ${listing.region}. Prihod ${formatCurrency(listing.revenue_eur)} i EBITDA ${formatCurrency(listing.ebitda_eur)}.`;

  return {
    title,
    description,
    alternates: { canonical: `/listings/${publicCode}` },
    openGraph: { title, description },
  };
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { publicCode } = await params;
  const supabase = await createClient();
  const listing = await getPublicListing(publicCode);

  if (!listing) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let ndaStatus: string | null = null;
  if (user) {
    const { data: ndaData } = await supabase
      .from("ndas")
      .select("status")
      .eq("listing_id", listing.id)
      .eq("buyer_id", user.id)
      .maybeSingle();
    ndaStatus = ndaData?.status || null;
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <section className="relative border-b border-border pt-28 pb-12 overflow-hidden bg-muted/20">
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(circle_at_top,rgba(21,101,192,0.08),transparent_60%)]" />
        <div className="container relative z-10 mx-auto px-4 max-w-5xl">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Povratak na prilike
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
              <Building2 className="w-3 h-3 mr-1.5" />
              {listing.industry_nkd}
            </Badge>
            <Badge
              variant="outline"
              className="border-border text-muted-foreground rounded-none uppercase tracking-widest text-xs px-3 py-1"
            >
              <MapPin className="w-3 h-3 mr-1.5" />
              {listing.region}
            </Badge>
            <Badge
              variant="outline"
              className="border-emerald-500/20 text-emerald-600 rounded-none uppercase tracking-widest text-xs px-3 py-1"
            >
              <ShieldCheck className="w-3 h-3 mr-1.5" />
              Verificirano
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground tracking-tight mb-2">
            Anonimna prilika u sektoru {listing.industry_nkd}
          </h1>
          <p className="text-muted-foreground text-lg">
            Javni kod oglasa: {listing.public_code}
          </p>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
                <div className="p-6">
                  <h2 className="text-lg font-heading font-semibold text-foreground mb-6 uppercase tracking-wider">
                    Financijski pregled
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 border border-border rounded-none">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Godišnji prihod
                      </div>
                      <p className="text-xl font-heading font-semibold text-foreground">
                        {formatCurrency(listing.revenue_eur)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 border border-border rounded-none">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <BarChart3 className="w-3.5 h-3.5" />
                        EBITDA
                      </div>
                      <p className="text-xl font-heading font-semibold text-foreground">
                        {formatCurrency(listing.ebitda_eur)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 border border-border rounded-none">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <Lock className="w-3.5 h-3.5" />
                        Očekivana cijena
                      </div>
                      <p className="text-xl font-heading font-semibold text-primary">
                        {formatCurrency(listing.asking_price_eur)}
                      </p>
                    </div>
                  </div>
                </div>
              </GlowCard>

              <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
                <div className="p-6">
                  <h2 className="text-lg font-heading font-semibold text-foreground mb-6 uppercase tracking-wider">
                    Blind teaser
                  </h2>
                  <div
                    className="prose max-w-none text-muted-foreground leading-relaxed prose-headings:font-heading prose-headings:text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(listing.blind_teaser || ""),
                    }}
                  />
                </div>
              </GlowCard>
            </div>

            <div className="space-y-6">
              <GlowCard className="rounded-none border border-border overflow-hidden sticky top-28 bg-card">
                <div className="p-6 space-y-5">
                  <h3 className="text-sm font-heading font-semibold text-foreground uppercase tracking-widest">
                    Zainteresirani ste?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Za pristup identitetu tvrtke, razlogu prodaje i dokumentima
                    potrebno je zatražiti i potpisati NDA. Vaš identitet ostaje
                    zaštićen do odobrenja.
                  </p>

                  <NdaRequestButton
                    listingId={listing.id}
                    ndaStatus={ndaStatus}
                    isLoggedIn={!!user}
                  />

                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      100% diskretan proces
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      Pravno obvezujući NDA
                    </div>
                  </div>
                </div>
              </GlowCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
