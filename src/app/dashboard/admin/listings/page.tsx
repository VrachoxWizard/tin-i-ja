import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AdminListingStatusSelect,
  AdminDeleteListingButton,
  AdminBrokerAssign,
} from "@/components/features/AdminActions";

export const metadata: Metadata = {
  title: "Upravljanje oglasima | Admin | DealFlow",
  description: "Pregled i upravljanje svim oglasima na platformi.",
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  draft: { label: "Skica", className: "bg-slate-500/10 text-slate-700 border-slate-500/20" },
  teaser_generated: { label: "Teaser", className: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  seller_review: { label: "Čeka objavu", className: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  active: { label: "Aktivno", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  under_nda: { label: "Pod NDA", className: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20" },
  closed: { label: "Zatvoreno", className: "bg-slate-500/10 text-slate-700 border-slate-500/20" },
};

export default async function AdminListingsPage() {
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

  const [{ data: listings }, { data: brokers }] = await Promise.all([
    supabase
      .from("listings")
      .select("id, company_name, public_code, industry_nkd, region, status, created_at, broker_id, owner_id")
      .order("created_at", { ascending: false }),
    supabase
      .from("users")
      .select("id, full_name")
      .eq("role", "broker"),
  ]);

  const allListings = listings ?? [];
  const allBrokers = brokers ?? [];

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
                <Building2 className="w-3 h-3 mr-1.5" />
                Oglasi
              </Badge>
            </div>
            <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
              Upravljanje oglasima
            </h1>
            <p className="text-muted-foreground mt-2">
              Ukupno {allListings.length} oglasa na platformi.
            </p>
          </div>

          <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                Svi oglasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {allListings.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Nema oglasa.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {allListings.map((listing) => {
                    const badge = STATUS_BADGES[listing.status] ?? STATUS_BADGES.draft;

                    return (
                      <div
                        key={listing.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {listing.company_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {listing.industry_nkd} · {listing.region}
                            {listing.public_code ? ` · ${listing.public_code}` : ""}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Kreirano: {new Date(listing.created_at).toLocaleDateString("hr-HR")}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <Badge
                            variant="outline"
                            className={`rounded-none text-xs ${badge.className}`}
                          >
                            {badge.label}
                          </Badge>

                          <AdminListingStatusSelect
                            listingId={listing.id}
                            currentStatus={listing.status}
                          />

                          <AdminBrokerAssign
                            listingId={listing.id}
                            currentBrokerId={listing.broker_id}
                            brokers={allBrokers}
                          />

                          <Link
                            href={`/dashboard/admin/listings/${listing.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-none border border-border hover:bg-muted transition-colors"
                            title="Uredi"
                          >
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                          </Link>

                          <AdminDeleteListingButton listingId={listing.id} />
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
