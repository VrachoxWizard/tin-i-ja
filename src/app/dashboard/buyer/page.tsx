import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Search,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Nadzorna ploča kupca | DealFlow",
  description:
    "Pregled investicijskog profila, NDA statusa i aktivnih match rezultata.",
};

function formatCurrency(value: number | null) {
  if (value === null) {
    return "N/A";
  }

  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getNdaBadge(status: string) {
  if (status === "signed") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-none">
        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
        Odobreno
      </Badge>
    );
  }

  if (status === "pending") {
    return (
      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-none">
        <Clock className="w-3.5 h-3.5 mr-1.5" />
        Na čekanju
      </Badge>
    );
  }

  return (
    <Badge className="bg-red-500/10 text-red-600 border-red-500/20 rounded-none">
      Odbijeno
    </Badge>
  );
}

export default async function BuyerDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: platformUser }, { data: buyerProfile }, { data: ndaRows }] =
    await Promise.all([
      supabase.from("users").select("full_name, email").eq("id", user.id).single(),
      supabase
        .from("buyer_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("ndas")
        .select("id, status, created_at, listing_id")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  const { data: matchRows } = buyerProfile
    ? await supabase
        .from("matches")
        .select("id, listing_id, match_score, ai_narrative, status")
        .eq("buyer_profile_id", buyerProfile.id)
        .order("match_score", { ascending: false })
        .limit(6)
    : { data: [] };

  const listingIds = Array.from(
    new Set([
      ...(ndaRows ?? []).map((row) => row.listing_id),
      ...(matchRows ?? []).map((row) => row.listing_id),
    ]),
  );

  const { data: listings } = listingIds.length
    ? await supabase
        .from("listings")
        .select("id, public_code, industry_nkd, region, asking_price_eur, status")
        .in("id", listingIds)
    : { data: [] };

  const listingMap = new Map((listings ?? []).map((listing) => [listing.id, listing]));
  const signedNdaCount =
    ndaRows?.filter((nda) => nda.status === "signed").length ?? 0;
  const pendingNdaCount =
    ndaRows?.filter((nda) => nda.status === "pending").length ?? 0;
  const matchCount = matchRows?.length ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                Investitorski dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-heading text-foreground tracking-tight">
                Pregled prilika i NDA statusa
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Ovdje pratite svoj investicijski profil, nova algoritamska
                uparivanja i pristupe deal roomovima.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/buy">
                <Button variant="outline" className="rounded-none">
                  Uredi profil
                </Button>
              </Link>
              <Link href="/listings">
                <Button className="rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
                  <Search className="w-4 h-4 mr-2" />
                  Pregledaj tržište
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Aktivna uparivanja",
                value: matchCount,
                icon: Target,
              },
              {
                label: "Potpisani NDA",
                value: signedNdaCount,
                icon: CheckCircle,
              },
              {
                label: "NDA na čekanju",
                value: pendingNdaCount,
                icon: Clock,
              },
            ].map(({ label, value, icon: Icon }) => (
              <GlowCard
                key={label}
                className="border border-border bg-card rounded-none"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {label}
                    </p>
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-4xl font-heading text-foreground">{value}</p>
                </CardContent>
              </GlowCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <GlowCard className="border border-border bg-card rounded-none overflow-hidden">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-heading text-foreground">
                    Algoritamska uparivanja
                  </CardTitle>
                  <CardDescription>
                    Rezultati se osvježavaju kada spremite profil ili kada se
                    objavi novi oglas koji odgovara vašim kriterijima.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {!buyerProfile ? (
                    <div className="border border-dashed border-border rounded-none p-8 text-center">
                      <Target className="w-10 h-10 text-primary mx-auto mb-4" />
                      <h2 className="text-xl font-heading text-foreground mb-2">
                        Investicijski profil još nije spremljen
                      </h2>
                      <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Najprije definirajte EV raspon, prihode, regiju i
                        investicijsku tezu kako bi platforma mogla izračunati
                        podudaranja.
                      </p>
                      <Link href="/buy">
                        <Button className="rounded-none">
                          Kreiraj investicijski profil
                        </Button>
                      </Link>
                    </div>
                  ) : null}

                  {buyerProfile && (!matchRows || matchRows.length === 0) ? (
                    <div className="border border-dashed border-border rounded-none p-8 text-center">
                      <Search className="w-10 h-10 text-primary mx-auto mb-4" />
                      <h2 className="text-xl font-heading text-foreground mb-2">
                        Trenutno nema kvalificiranih match rezultata
                      </h2>
                      <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Profil je aktivan, a novi rezultati pojavit će se čim
                        se objavi prilika koja prelazi prag podudaranja.
                      </p>
                      <Link href="/listings">
                        <Button variant="outline" className="rounded-none">
                          Pregledaj otvorene prilike
                        </Button>
                      </Link>
                    </div>
                  ) : null}

                  {matchRows?.map((match) => {
                    const listing = listingMap.get(match.listing_id);
                    if (!listing) {
                      return null;
                    }

                    return (
                      <div
                        key={match.id}
                        className="border border-border rounded-none p-5 bg-muted/20"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <Badge className="rounded-none bg-primary/10 text-primary border-primary/20">
                                Match {match.match_score}/100
                              </Badge>
                              <Badge
                                variant="outline"
                                className="rounded-none border-border"
                              >
                                {listing.public_code}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-heading text-foreground">
                              {listing.industry_nkd} u regiji {listing.region}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {match.ai_narrative}
                            </p>
                            <p className="text-sm text-foreground">
                              Očekivana cijena:{" "}
                              <span className="font-semibold">
                                {formatCurrency(listing.asking_price_eur)}
                              </span>
                            </p>
                          </div>

                          <Link href={`/listings/${listing.public_code}`}>
                            <Button className="rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
                              Otvori priliku
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </GlowCard>

              <GlowCard className="border border-border bg-card rounded-none overflow-hidden">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-heading text-foreground">
                    NDA statusi
                  </CardTitle>
                  <CardDescription>
                    Statusi zahtjeva i pristup deal roomu nakon odobrenja.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {!ndaRows || ndaRows.length === 0 ? (
                    <div className="border border-dashed border-border rounded-none p-8 text-center">
                      <FileText className="w-10 h-10 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Još niste poslali NDA zahtjev ni za jednu priliku.
                      </p>
                    </div>
                  ) : null}

                  {ndaRows?.map((nda) => {
                    const listing = listingMap.get(nda.listing_id);
                    if (!listing) {
                      return null;
                    }

                    return (
                      <div
                        key={nda.id}
                        className="border border-border rounded-none p-5 bg-muted/20"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                              <p className="font-heading text-foreground">
                                {listing.industry_nkd}
                              </p>
                              <Badge
                                variant="outline"
                                className="rounded-none border-border"
                              >
                                {listing.public_code}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {listing.region} · zahtjev poslan{" "}
                              {new Date(nda.created_at).toLocaleDateString("hr-HR")}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            {getNdaBadge(nda.status)}
                            {nda.status === "signed" ? (
                              <Link href={`/dashboard/buyer/deal-room/${nda.listing_id}`}>
                                <Button className="rounded-none">
                                  Otvori deal room
                                </Button>
                              </Link>
                            ) : (
                              <Link href={`/listings/${listing.public_code}`}>
                                <Button variant="outline" className="rounded-none">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Otvori teaser
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </GlowCard>
            </div>

            <div className="space-y-8">
              <GlowCard className="border border-border bg-card rounded-none overflow-hidden">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-heading text-foreground">
                    Moj profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-5 text-sm">
                  <div className="border-b border-border pb-4">
                    <p className="font-heading text-foreground text-lg">
                      {platformUser?.full_name ||
                        user.user_metadata.full_name ||
                        "Investitor"}
                    </p>
                    <p className="text-muted-foreground break-all">
                      {platformUser?.email || user.email}
                    </p>
                  </div>

                  {buyerProfile ? (
                    <>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">EV raspon</span>
                        <span className="text-right text-foreground">
                          {formatCurrency(buyerProfile.target_ev_min)} -{" "}
                          {formatCurrency(buyerProfile.target_ev_max)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Prihodi</span>
                        <span className="text-right text-foreground">
                          {formatCurrency(buyerProfile.target_revenue_min)} -{" "}
                          {formatCurrency(buyerProfile.target_revenue_max)}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Sektor</span>
                        <span className="text-right text-foreground">
                          {buyerProfile.target_industries.join(", ")}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Regija</span>
                        <span className="text-right text-foreground">
                          {buyerProfile.target_regions.join(", ")}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className="text-muted-foreground mb-2">
                          Investicijska teza
                        </p>
                        <p className="text-foreground leading-relaxed">
                          {buyerProfile.investment_thesis}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      Profil još nije konfiguriran. Dodajte kriterije kako bi
                      platforma mogla prikazivati relevantne prilike.
                    </p>
                  )}
                </CardContent>
              </GlowCard>

              <GlowCard className="border border-border bg-card rounded-none overflow-hidden">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-heading text-foreground">
                    Brzi koraci
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <Link href="/listings" className="block">
                    <Button
                      variant="outline"
                      className="w-full rounded-none justify-start"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Pregledaj aktivne teasere
                    </Button>
                  </Link>
                  <Link href="/buy" className="block">
                    <Button
                      variant="outline"
                      className="w-full rounded-none justify-start"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Ažuriraj kriterije ulaganja
                    </Button>
                  </Link>
                </CardContent>
              </GlowCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
