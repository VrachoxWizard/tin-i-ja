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
import { ListingStatusBadge } from "@/components/features/ListingStatusBadge";
import { formatDate } from "@/lib/formatters";
import { Pagination, parsePage } from "@/components/ui/Pagination";

const PAGE_SIZE = 25;

export const metadata: Metadata = {
  title: "Upravljanje oglasima | Admin | DealFlow",
  description: "Pregled i upravljanje svim oglasima na platformi.",
};

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const page = parsePage(resolvedParams);
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

  const [{ count: listingsCount }, [{ data: listings, error: listingsError }, { data: brokers }]] = await Promise.all([
    supabase.from("listings").select("*", { count: "exact", head: true }),
    Promise.all([
    supabase
      .from("listings")
      .select("id, company_name, public_code, industry_nkd, region, status, created_at, broker_id, owner_id")
      .order("created_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1),
    supabase
      .from("users")
      .select("id, full_name")
      .eq("role", "broker"),
    ]),
  ]);

  const totalListings = listingsCount ?? 0;

  if (listingsError) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <p className="text-destructive">Učitavanje oglasa nije uspjelo.</p>
          </div>
        </main>
      </div>
    );
  }

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
                  {allListings.map((listing) => (
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
                            Kreirano: {formatDate(listing.created_at)}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <ListingStatusBadge status={listing.status} />

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
                  ))}
                </div>
              )}
            </CardContent>
            {totalListings > PAGE_SIZE && (
              <Pagination
                total={totalListings}
                pageSize={PAGE_SIZE}
                currentPage={page}
              />
            )}
          </GlowCard>
        </div>
      </main>
    </div>
  );
}
