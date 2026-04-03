import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNdaStatusSelect } from "@/components/features/AdminActions";

export const metadata: Metadata = {
  title: "Upravljanje NDA-ima | Admin | DealFlow",
  description: "Pregled i upravljanje NDA zahtjevima.",
};

const NDA_BADGES: Record<string, { label: string; className: string }> = {
  pending: { label: "Na čekanju", className: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  signed: { label: "Potpisan", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  rejected: { label: "Odbijen", className: "bg-red-500/10 text-red-700 border-red-500/20" },
};

export default async function AdminNdasPage() {
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

  if (profile?.role !== "admin") redirect("/dashboard/buyer");

  const { data: ndas } = await supabase
    .from("ndas")
    .select("id, listing_id, buyer_id, status, created_at, signed_at, updated_at")
    .order("created_at", { ascending: false });

  const allNdas = ndas ?? [];

  // Fetch related listing & buyer names for display
  const listingIds = [...new Set(allNdas.map((n) => n.listing_id))];
  const buyerIds = [...new Set(allNdas.map((n) => n.buyer_id))];

  const [{ data: listingsData }, { data: buyersData }] = await Promise.all([
    listingIds.length > 0
      ? supabase.from("listings").select("id, company_name").in("id", listingIds)
      : Promise.resolve({ data: [] as { id: string; company_name: string }[] }),
    buyerIds.length > 0
      ? supabase.from("users").select("id, full_name, email").in("id", buyerIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string; email: string }[] }),
  ]);

  const listingMap = new Map((listingsData ?? []).map((l) => [l.id, l.company_name]));
  const buyerMap = new Map((buyersData ?? []).map((b) => [b.id, b.full_name || b.email]));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/dashboard/admin"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <FileText className="w-3 h-3 mr-1.5" />
                NDA
              </Badge>
            </div>
            <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
              Upravljanje NDA zahtjevima
            </h1>
            <p className="text-muted-foreground mt-2">
              Ukupno {allNdas.length} NDA zahtjeva.
            </p>
          </div>

          <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                Svi NDA zahtjevi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {allNdas.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Nema NDA zahtjeva.
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
                          <p className="text-sm font-medium text-foreground truncate">
                            Kupac: {buyerMap.get(nda.buyer_id) ?? nda.buyer_id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Oglas: {listingMap.get(nda.listing_id) ?? nda.listing_id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Kreirano: {new Date(nda.created_at).toLocaleDateString("hr-HR")}
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

                          <AdminNdaStatusSelect
                            ndaId={nda.id}
                            currentStatus={nda.status}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </GlowCard>
        </div>
      </main>
    </div>
  );
}
