import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPathForRole } from "@/lib/contracts";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminListingEditForm } from "@/components/features/AdminListingEditForm";

export const metadata: Metadata = {
  title: "Uredi oglas | Admin | DealFlow",
};

export default async function AdminListingDetailPage({
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

  if (profile?.role !== "admin") redirect(getDashboardPathForRole(profile?.role));

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (!listing) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/dashboard/admin/listings"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Svi oglasi
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <Building2 className="w-3 h-3 mr-1.5" />
                Uredi oglas
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

          <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                Podaci oglasa
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AdminListingEditForm
                listingId={listing.id}
                defaultValues={{
                  company_name: listing.company_name,
                  industry_nkd: listing.industry_nkd,
                  region: listing.region,
                  year_founded: listing.year_founded,
                  employees: listing.employees,
                  revenue_eur: listing.revenue_eur,
                  ebitda_eur: listing.ebitda_eur,
                  sde_eur: listing.sde_eur,
                  asking_price_eur: listing.asking_price_eur,
                  reason_for_sale: listing.reason_for_sale ?? "",
                  transition_support: listing.transition_support ?? "",
                  owner_dependency_score: listing.owner_dependency_score,
                  digital_maturity: listing.digital_maturity,
                }}
              />
            </CardContent>
          </GlowCard>
        </div>
      </main>
    </div>
  );
}
