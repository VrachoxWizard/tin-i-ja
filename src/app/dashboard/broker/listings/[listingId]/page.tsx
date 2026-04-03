import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Building2, FileText, FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrokerNdaActions } from "@/components/features/BrokerActions";

export const metadata: Metadata = {
  title: "Detalji oglasa | Broker | DealFlow",
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  draft: { label: "Skica", className: "bg-slate-500/10 text-slate-700 border-slate-500/20" },
  teaser_generated: { label: "Teaser", className: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  seller_review: { label: "Čeka objavu", className: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  active: { label: "Aktivno", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  under_nda: { label: "Pod NDA", className: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20" },
  closed: { label: "Zatvoreno", className: "bg-slate-500/10 text-slate-700 border-slate-500/20" },
};

const NDA_BADGES: Record<string, { label: string; className: string }> = {
  pending: { label: "Na čekanju", className: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  signed: { label: "Potpisan", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  rejected: { label: "Odbijen", className: "bg-red-500/10 text-red-700 border-red-500/20" },
};

export default async function BrokerListingDetailPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "broker") redirect("/dashboard/buyer");

  const { data: listing } = await supabase
    .from("listings")
    .select("id, company_name, industry_nkd, region, status, public_code, revenue_eur, ebitda_eur, asking_price_eur, employees, year_founded, broker_id, created_at")
    .eq("id", listingId)
    .single();

  if (!listing || listing.broker_id !== user.id) notFound();

  const [{ data: ndas }, { data: files }] = await Promise.all([
    supabase
      .from("ndas")
      .select("id, buyer_id, status, created_at, signed_at")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false }),
    supabase
      .from("deal_room_files")
      .select("id, file_path, doc_type, uploaded_at")
      .eq("listing_id", listingId)
      .order("uploaded_at", { ascending: false }),
  ]);

  const allNdas = ndas ?? [];
  const allFiles = files ?? [];

  // Fetch buyer names for NDAs
  const buyerIds = [...new Set(allNdas.map((n) => n.buyer_id))];
  const { data: buyersData } = buyerIds.length > 0
    ? await supabase.from("users").select("id, full_name, email").in("id", buyerIds)
    : { data: [] as { id: string; full_name: string; email: string }[] };

  const buyerMap = new Map((buyersData ?? []).map((b) => [b.id, b.full_name || b.email]));

  const statusBadge = STATUS_BADGES[listing.status] ?? STATUS_BADGES.draft;

  const formatEur = (v: number) =>
    new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/dashboard/broker"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Broker Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <Building2 className="w-3 h-3 mr-1.5" />
                Oglas
              </Badge>
              <Badge
                variant="outline"
                className={`rounded-none text-xs ${statusBadge.className}`}
              >
                {statusBadge.label}
              </Badge>
            </div>
            <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
              {listing.company_name}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {listing.industry_nkd} · {listing.region}
              {listing.public_code ? ` · ${listing.public_code}` : ""}
            </p>
          </div>

          {/* Listing Info */}
          <GlowCard className="rounded-none border border-border overflow-hidden bg-card mb-8">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                Podaci o tvrtki
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Prihod", value: formatEur(listing.revenue_eur) },
                  { label: "EBITDA", value: formatEur(listing.ebitda_eur) },
                  { label: "Tražena cijena", value: formatEur(listing.asking_price_eur) },
                  { label: "Zaposleni", value: listing.employees },
                  { label: "Godina osnivanja", value: listing.year_founded },
                  { label: "Kreirano", value: new Date(listing.created_at).toLocaleDateString("hr-HR") },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </GlowCard>

          {/* NDA Management */}
          <GlowCard className="rounded-none border border-border overflow-hidden bg-card mb-8">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                NDA zahtjevi ({allNdas.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {allNdas.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Nema NDA zahtjeva za ovaj oglas.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {allNdas.map((nda) => {
                    const badge = NDA_BADGES[nda.status] ?? NDA_BADGES.pending;
                    return (
                      <div
                        key={nda.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {buyerMap.get(nda.buyer_id) ?? nda.buyer_id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Zatraženo: {new Date(nda.created_at).toLocaleDateString("hr-HR")}
                            {nda.signed_at
                              ? ` · Potpisano: ${new Date(nda.signed_at).toLocaleDateString("hr-HR")}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant="outline"
                            className={`rounded-none text-xs ${badge.className}`}
                          >
                            {badge.label}
                          </Badge>
                          {nda.status === "pending" && (
                            <BrokerNdaActions ndaId={nda.id} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </GlowCard>

          {/* Deal Room Files */}
          <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
            <CardHeader className="border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Deal Room ({allFiles.length})
              </CardTitle>
              <Link
                href={`/dashboard/broker/deal-room/${listingId}`}
                className="text-xs text-primary hover:underline"
              >
                Upravljaj datotekama →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {allFiles.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Nema datoteka u deal roomu.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {allFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.file_path.split("/").pop()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {file.doc_type} · {new Date(file.uploaded_at).toLocaleDateString("hr-HR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </GlowCard>
        </div>
      </main>
    </div>
  );
}
