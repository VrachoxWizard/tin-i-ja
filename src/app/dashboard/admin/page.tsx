import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  FileText,
  ScrollText,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingStatusBadge } from "@/components/features/ListingStatusBadge";
import { RoleBadge } from "@/components/features/RoleBadge";

export const metadata: Metadata = {
  title: "Admin Dashboard | DealFlow",
  description: "Pregled platforme za administratore.",
};

interface AdminOverview {
  total_listings: number;
  active_listings: number;
  total_buyers: number;
  total_ndas: number;
  pending_ndas: number;
  total_matches: number;
  total_users: number;
  recent_listings: {
    id: string;
    public_code: string | null;
    company_name: string;
    industry_nkd: string;
    region: string;
    status: string;
    created_at: string;
  }[];
  recent_users: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
  }[];
}


export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard/buyer");
  }

  const { data: overview, error } = await supabase.rpc("admin_overview");

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

  const data = overview as unknown as AdminOverview;

  const statCards = [
    { label: "Ukupno korisnika", value: data.total_users, icon: Users },
    { label: "Ukupno oglasa", value: data.total_listings, icon: Building2 },
    { label: "Aktivnih oglasa", value: data.active_listings, icon: ShieldCheck },
    { label: "Kupčevih profila", value: data.total_buyers, icon: Target },
    { label: "Ukupno NDA-ova", value: data.total_ndas, icon: FileText },
    { label: "NDA na čekanju", value: data.pending_ndas, icon: BarChart3 },
    { label: "Ukupno matcheva", value: data.total_matches, icon: Target },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <ShieldCheck className="w-3 h-3 mr-1.5" />
                Admin
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Pregled cjelokupne platforme i ključnih metrika.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { href: "/dashboard/admin/users", label: "Korisnici", icon: Users },
              { href: "/dashboard/admin/listings", label: "Oglasi", icon: Building2 },
              { href: "/dashboard/admin/ndas", label: "NDA zahtjevi", icon: FileText },
              { href: "/dashboard/admin/audit-log", label: "Audit Log", icon: ScrollText },
            ].map((nav) => (
              <Link key={nav.href} href={nav.href}>
                <GlowCard className="rounded-none border border-border overflow-hidden bg-card hover:border-primary/40 transition-colors group">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <nav.icon className="w-4 h-4 text-primary" />
                      {nav.label}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </GlowCard>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                  Najnoviji oglasi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {data.recent_listings.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Nema oglasa.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {data.recent_listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-4"
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
                        <div className="shrink-0">
                          <ListingStatusBadge status={listing.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </GlowCard>

            <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                  Najnoviji korisnici
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {data.recent_users.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Nema korisnika.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {data.recent_users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {u.full_name || "Bez imena"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {u.email}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <RoleBadge role={u.role} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </GlowCard>
          </div>
        </div>
      </main>
    </div>
  );
}
