import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { sanitizeHtml } from "@/lib/sanitize";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  MapPin,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  ArrowLeft,
  FileText,
  User,
  Mail,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Deal Room | DealFlow",
  description: "Pristupite punim detaljima tvrtke nakon potpisanog NDA.",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function DealRoomPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify buyer has a signed NDA for this listing
  const { data: nda } = await supabase
    .from("ndas")
    .select("id, status, signed_at")
    .eq("listing_id", listingId)
    .eq("buyer_id", user.id)
    .eq("status", "signed")
    .single();

  if (!nda) {
    notFound();
  }

  // Fetch full listing data (non-anonymized, since NDA is signed)
  const { data: listing } = await supabase
    .from("listings")
    .select("*, users!listings_owner_id_fkey(full_name, email)")
    .eq("id", listingId)
    .single();

  if (!listing) {
    notFound();
  }

  // Fetch deal room files
  const { data: files } = await supabase
    .from("deal_room_files")
    .select("*")
    .eq("listing_id", listingId)
    .order("uploaded_at", { ascending: false });

  const seller = listing.users as unknown as { full_name: string; email: string } | null;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 w-full py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/buyer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Povratak na dashboard
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <ShieldCheck className="w-3 h-3 mr-1.5" />
                NDA Potpisan
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-muted-foreground rounded-none uppercase tracking-widest text-xs px-3 py-1"
              >
                {nda.signed_at
                  ? new Date(nda.signed_at).toLocaleDateString("hr-HR")
                  : ""}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground tracking-tight">
              Deal Room
            </h1>
            <p className="text-muted-foreground mt-2">
              Potpuni podaci o tvrtki — {listing.industry_nkd}, {listing.region}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Financial Details */}
              <GlowCard className="rounded-none border-white/10 overflow-hidden">
                <CardHeader className="border-b border-white/10 px-6 py-4">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Financijski Podaci
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-none">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <TrendingUp className="w-3 h-3" />
                        Prihod
                      </div>
                      <p className="text-lg font-heading font-bold text-foreground">
                        {formatCurrency(listing.revenue_eur)}
                      </p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-none">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <BarChart3 className="w-3 h-3" />
                        EBITDA
                      </div>
                      <p className="text-lg font-heading font-bold text-foreground">
                        {formatCurrency(listing.ebitda_eur)}
                      </p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-none">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <Building2 className="w-3 h-3" />
                        SDE
                      </div>
                      <p className="text-lg font-heading font-bold text-foreground">
                        {listing.sde_eur
                          ? formatCurrency(listing.sde_eur)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-none">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <MapPin className="w-3 h-3" />
                        Cijena
                      </div>
                      <p className="text-lg font-heading font-bold text-primary">
                        {formatCurrency(listing.asking_price_eur)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </GlowCard>

              {/* Full Business Description */}
              <GlowCard className="rounded-none border-white/10 overflow-hidden">
                <CardHeader className="border-b border-white/10 px-6 py-4">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Blind Teaser (Generirano AI-em)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div
                    className="prose prose-invert max-w-none text-muted-foreground font-sans leading-relaxed prose-headings:font-heading prose-headings:text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(listing.blind_teaser || ""),
                    }}
                  />
                </CardContent>
              </GlowCard>

              {/* Deal Room Files */}
              <GlowCard className="rounded-none border-white/10 overflow-hidden">
                <CardHeader className="border-b border-white/10 px-6 py-4">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Dokumenti
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {files && files.length > 0 ? (
                    <div className="space-y-3">
                      {files.map(
                        (file: {
                          id: string;
                          file_url: string;
                          doc_type: string;
                          uploaded_at: string;
                        }) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-none hover:bg-white/[0.04] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {file.file_url.split("/").pop() || file.doc_type}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    file.uploaded_at
                                  ).toLocaleDateString("hr-HR")}
                                </p>
                              </div>
                            </div>
                            <a
                              href={file.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-none border-white/10 text-xs"
                              >
                                Preuzmi
                              </Button>
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-none">
                      <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Prodavatelj još nije dodao dokumente u Deal Room.
                      </p>
                    </div>
                  )}
                </CardContent>
              </GlowCard>
            </div>

            {/* Sidebar — Seller Contact */}
            <div className="space-y-6">
              <GlowCard className="rounded-none border-white/10 overflow-hidden sticky top-28">
                <CardHeader className="border-b border-white/10 px-6 py-4">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Kontakt Prodavatelja
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {seller ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {seller.full_name || "Prodavatelj"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Vlasnik tvrtke
                          </p>
                        </div>
                      </div>
                      {seller.email && (
                        <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-none">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground break-all">
                            {seller.email}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Kontakt podaci nisu dostupni.
                    </p>
                  )}

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      NDA potpisan —  komunikacija je zaštićena
                    </div>
                  </div>
                </CardContent>
              </GlowCard>

              {/* Listing Info Summary */}
              <GlowCard className="rounded-none border-white/10 overflow-hidden">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Industrija</span>
                    <span className="font-medium text-foreground">
                      {listing.industry_nkd}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Regija</span>
                    <span className="font-medium text-foreground">
                      {listing.region}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-none text-xs">
                      {listing.status}
                    </Badge>
                  </div>
                </CardContent>
              </GlowCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
