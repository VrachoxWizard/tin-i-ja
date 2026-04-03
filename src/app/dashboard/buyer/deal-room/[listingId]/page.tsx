import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  FileText,
  Mail,
  MapPin,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createDealRoomSignedUrl } from "@/lib/deal-room";
import { sanitizeHtml } from "@/lib/sanitize";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Deal room | DealFlow",
  description: "Pristup punim detaljima tvrtke nakon potpisanog NDA-a.",
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface DealRoomPageProps {
  params: Promise<{ listingId: string }>;
}

export default async function DealRoomPage({ params }: DealRoomPageProps) {
  const { listingId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: nda } = await supabase
    .from("ndas")
    .select("id, status, signed_at")
    .eq("listing_id", listingId)
    .eq("buyer_id", user.id)
    .eq("status", "signed")
    .maybeSingle();

  if (!nda) {
    notFound();
  }

  const { data: listing } = await supabase
    .from("listings")
    .select(
      "id, public_code, company_name, industry_nkd, region, revenue_eur, ebitda_eur, sde_eur, asking_price_eur, blind_teaser, reason_for_sale, transition_support, owner_id, status",
    )
    .eq("id", listingId)
    .single();

  if (!listing) {
    notFound();
  }

  const [{ data: seller }, { data: files }] = await Promise.all([
    supabase
      .from("users")
      .select("full_name, email")
      .eq("id", listing.owner_id)
      .single(),
    supabase
      .from("deal_room_files")
      .select("id, file_path, doc_type, uploaded_at")
      .eq("listing_id", listingId)
      .order("uploaded_at", { ascending: false }),
  ]);

  const fileEntries = await Promise.all(
    (files ?? []).map(async (file) => ({
      ...file,
      signedUrl: await createDealRoomSignedUrl(supabase, file.file_path),
    })),
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <Link
              href="/dashboard/buyer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Povratak na dashboard
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <ShieldCheck className="w-3 h-3 mr-1.5" />
                NDA potpisan
              </Badge>
              <Badge
                variant="outline"
                className="border-border text-muted-foreground rounded-none uppercase tracking-widest text-xs px-3 py-1"
              >
                {nda.signed_at
                  ? new Date(nda.signed_at).toLocaleDateString("hr-HR")
                  : ""}
              </Badge>
              <Badge
                variant="outline"
                className="border-border text-muted-foreground rounded-none uppercase tracking-widest text-xs px-3 py-1"
              >
                {listing.public_code}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground tracking-tight">
              {listing.company_name}
            </h1>
            <p className="text-muted-foreground mt-2">
              Potpuni podaci o tvrtki nakon odobrenog NDA procesa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Financijski podaci
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/30 border border-border rounded-none">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <TrendingUp className="w-3 h-3" />
                        Prihod
                      </div>
                      <p className="text-lg font-heading font-semibold text-foreground">
                        {formatCurrency(listing.revenue_eur)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 border border-border rounded-none">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <BarChart3 className="w-3 h-3" />
                        EBITDA
                      </div>
                      <p className="text-lg font-heading font-semibold text-foreground">
                        {formatCurrency(listing.ebitda_eur)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 border border-border rounded-none">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <Building2 className="w-3 h-3" />
                        SDE
                      </div>
                      <p className="text-lg font-heading font-semibold text-foreground">
                        {formatCurrency(listing.sde_eur)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 border border-border rounded-none">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                        <MapPin className="w-3 h-3" />
                        Cijena
                      </div>
                      <p className="text-lg font-heading font-semibold text-primary">
                        {formatCurrency(listing.asking_price_eur)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </GlowCard>

              <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Poslovni pregled
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                      Blind teaser
                    </p>
                    <div
                      className="prose max-w-none text-muted-foreground leading-relaxed prose-headings:font-heading prose-headings:text-foreground"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(listing.blind_teaser || ""),
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-border rounded-none p-5 bg-muted/20">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                        Razlog prodaje
                      </p>
                      <p className="text-foreground leading-relaxed">
                        {listing.reason_for_sale || "Nije navedeno."}
                      </p>
                    </div>
                    <div className="border border-border rounded-none p-5 bg-muted/20">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
                        Tranzicijska podrška
                      </p>
                      <p className="text-foreground leading-relaxed">
                        {listing.transition_support || "Nije navedeno."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </GlowCard>

              <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Dokumenti
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {fileEntries.length > 0 ? (
                    <div className="space-y-3">
                      {fileEntries.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-none"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {file.file_path.split("/").pop() || file.doc_type}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(file.uploaded_at).toLocaleDateString("hr-HR")}
                              </p>
                            </div>
                          </div>
                          {file.signedUrl ? (
                            <a
                              href={file.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" className="rounded-none">
                                Preuzmi
                              </Button>
                            </a>
                          ) : (
                            <Button variant="outline" className="rounded-none" disabled>
                              Nedostupno
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-border rounded-none">
                      <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Prodavatelj još nije dodao dokumente u deal room.
                      </p>
                    </div>
                  )}
                </CardContent>
              </GlowCard>
            </div>

            <div className="space-y-6">
              <GlowCard className="rounded-none border border-border overflow-hidden sticky top-28 bg-card">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Kontakt prodavatelja
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {seller?.full_name || "Prodavatelj"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Vlasnik tvrtke
                      </p>
                    </div>
                  </div>

                  {seller?.email ? (
                    <div className="flex items-center gap-3 p-3 bg-muted/20 border border-border rounded-none">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground break-all">
                        {seller.email}
                      </span>
                    </div>
                  ) : null}

                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      NDA je potpisan i komunikacija je otključana
                    </div>
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
