import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { sanitizeHtml } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  Building2,
  MapPin,
  TrendingUp,
  BarChart3,
  Lock,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { NdaRequestButton } from "@/components/features/NdaRequestButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: teasers } = await supabase.rpc("get_active_teasers");
  const teaser = teasers?.find(
    (t: { listing_id: string }) => t.listing_id.split("-")[0] === id
  );

  if (!teaser) {
    return { title: "Prilika nije prona\u0111ena" };
  }

  const title = `${teaser.industry_nkd} — ${teaser.region}`;
  const description = `M&A prilika: ${teaser.industry_nkd} u regiji ${teaser.region}. Prihod: ${new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(teaser.revenue_eur)}.`;

  return {
    title,
    description,
    alternates: { canonical: `/listings/${id}` },
    openGraph: { title, description },
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch all active teasers and find the one matching this ID prefix
  const { data: teasers } = await supabase.rpc("get_active_teasers");

  const teaser = teasers?.find(
    (t: { listing_id: string }) => t.listing_id.split("-")[0] === id
  );

  if (!teaser) {
    notFound();
  }

  // Check if current user has an existing NDA for this listing
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let ndaStatus: string | null = null;
  if (user) {
    const { data: nda } = await supabase
      .from("ndas")
      .select("status")
      .eq("listing_id", teaser.listing_id)
      .eq("buyer_id", user.id)
      .single();
    ndaStatus = nda?.status || null;
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Header */}
      <section className="relative bg-background border-b border-white/10 pt-24 pb-12 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-60" />
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
              {teaser.industry_nkd}
            </Badge>
            <Badge
              variant="outline"
              className="border-white/10 text-muted-foreground rounded-none uppercase tracking-widest text-xs px-3 py-1"
            >
              <MapPin className="w-3 h-3 mr-1.5" />
              {teaser.region}
            </Badge>
            <Badge
              variant="outline"
              className="border-emerald-500/20 text-emerald-400 rounded-none uppercase tracking-widest text-xs px-3 py-1"
            >
              <ShieldCheck className="w-3 h-3 mr-1.5" />
              Verificirano
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight mb-2">
            {teaser.industry_nkd} — {teaser.region}
          </h1>
          <p className="text-muted-foreground text-lg">
            Anonimni profil tvrtke ID: {id}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Financial Overview */}
              <GlowCard className="rounded-none border-white/10 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-heading font-bold text-foreground mb-6 uppercase tracking-wider">
                    Financijski Pregled
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-none">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Godišnji Prihod
                      </div>
                      <p className="text-xl font-heading font-bold text-foreground">
                        {formatCurrency(teaser.revenue_eur)}
                      </p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-none">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <BarChart3 className="w-3.5 h-3.5" />
                        EBITDA
                      </div>
                      <p className="text-xl font-heading font-bold text-foreground">
                        {formatCurrency(teaser.ebitda_eur)}
                      </p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-none">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <Lock className="w-3.5 h-3.5" />
                        Očekivana Cijena
                      </div>
                      <p className="text-xl font-heading font-bold text-primary">
                        {formatCurrency(teaser.asking_price_eur)}
                      </p>
                    </div>
                  </div>
                </div>
              </GlowCard>

              {/* Blind Teaser */}
              <GlowCard className="rounded-none border-white/10 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-heading font-bold text-foreground mb-6 uppercase tracking-wider">
                    Blind Teaser
                  </h2>
                  <div
                    className="prose prose-invert max-w-none text-muted-foreground font-sans leading-relaxed prose-headings:font-heading prose-headings:text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(teaser.blind_teaser || ""),
                    }}
                  />
                </div>
              </GlowCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* NDA Action Card */}
              <GlowCard className="rounded-none border-white/10 overflow-hidden sticky top-28">
                <div className="p-6 space-y-5">
                  <h3 className="text-sm font-heading font-bold text-foreground uppercase tracking-widest">
                    Zainteresirani ste?
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Za pristup potpunim detaljima tvrtke potrebno je zatražiti i
                    potpisati NDA ugovor. Vaš identitet ostaje zaštićen.
                  </p>

                  <NdaRequestButton
                    listingId={teaser.listing_id}
                    ndaStatus={ndaStatus}
                    isLoggedIn={!!user}
                  />

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      100% diskretni proces
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
