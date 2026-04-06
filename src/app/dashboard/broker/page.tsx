import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPathForRole } from "@/lib/contracts";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingStatusBadge } from "@/components/features/ListingStatusBadge";

export const metadata: Metadata = {
  title: "Broker Dashboard | DealFlow",
  description: "Pregled dodijeljenih oglasa i NDA zahtjeva za brokere.",
};

interface BrokerOverview {
  total_assigned: number;
  active_assigned: number;
  total_ndas: number;
  pending_ndas: number;
  recent_listings: {
    id: string;
    public_code: string | null;
    company_name: string;
    industry_nkd: string;
    region: string;
    status: string;
    created_at: string;
  }[];
}


export default async function BrokerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "broker") redirect(getDashboardPathForRole(profile?.role));

  const { data: overview, error } = await supabase.rpc("broker_overview");

  if (error || !overview) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <p className="text-destructive">Učitavanje podataka nije uspjelo.</p>
          </div>
        </main>
      </div>
    );
  }

  const data = overview as unknown as BrokerOverview;

  const statCards = [
    { label: "Dodijeljeni oglasi", value: data.total_assigned, icon: Building2 },
    { label: "Aktivni oglasi", value: data.active_assigned, icon: ShieldCheck },
    { label: "Ukupno NDA-ova", value: data.total_ndas, icon: FileText },
    { label: "NDA na čekanju", value: data.pending_ndas, icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <ShieldCheck className="w-3 h-3 mr-1.5" />
                Broker
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground tracking-tight">
              Broker Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Dobrodošli, {profile?.full_name || "Broker"}. Upravljajte dodijeljenim oglasima i NDA zahtjevima.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <GlowCard
                key={card.label}
                className="rounded-none border border-border overflow-hidden bg-card"
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest mb-2">
                    <card.icon className="w-3.5 h-3.5" />
                    {card.label}
                  </div>
                  <p className="text-2xl font-heading font-semibold text-foreground">
                    {card.value}
                  </p>
                </div>
              </GlowCard>
            ))}
          </div>

          <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                Dodijeljeni oglasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {data.recent_listings.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Nemate dodijeljenih oglasa. Administrator vam mora dodijeliti oglas.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {data.recent_listings.map((listing) => (
                      <Link
                        key={listing.id}
                        href={`/dashboard/broker/listings/${listing.id}`}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {listing.company_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {listing.industry_nkd} · {listing.region}
                            {listing.public_code ? ` · ${listing.public_code}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <ListingStatusBadge status={listing.status} />
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
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
