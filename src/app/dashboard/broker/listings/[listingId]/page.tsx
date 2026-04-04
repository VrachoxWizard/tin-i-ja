import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Building2, FileText, FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrokerNdaActions } from "@/components/features/BrokerActions";
import { ListingStatusBadge } from "@/components/features/ListingStatusBadge";
import { NdaStatusBadge } from "@/components/features/NdaStatusBadge";
import { formatDate, formatEur } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Detalji oglasa | Broker | DealFlow",
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

  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, company_name, industry_nkd, region, status, public_code, revenue_eur, ebitda_eur, asking_price_eur, employees, year_founded, broker_id, created_at")
    .eq("id", listingId)
    .single();

  if (listingError || !listing || listing.broker_id !== user.id) notFound();

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
              <ListingStatusBadge status={listing.status} />
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
                  { label: "Prihod", value: formatEur(listing.revenue_eur ?? 0) },
                  { label: "EBITDA", value: formatEur(listing.ebitda_eur ?? 0) },
                  { label: "Tražena cijena", value: formatEur(listing.asking_price_eur ?? 0) },
                  { label: "Zaposleni", value: listing.employees },
                  { label: "Godina osnivanja", value: listing.year_founded },
                  { label: "Kreirano", value: formatDate(listing.created_at) },
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
                            Zatraženo: {formatDate(nda.created_at)}
                            {nda.signed_at ? ` · Potpisano: ${formatDate(nda.signed_at)}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <NdaStatusBadge status={nda.status} />
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
                            {file.doc_type} · {formatDate(file.uploaded_at)}
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
