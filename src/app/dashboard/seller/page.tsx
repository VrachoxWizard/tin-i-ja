import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  FileText,
  Lock,
  Search,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { sanitizeHtml } from "@/lib/sanitize";
import { NdaActions } from "@/components/features/NdaActions";
import { PublishListingButton } from "@/components/features/PublishListingButton";
import { ArchiveListingButton } from "@/components/features/ArchiveListingButton";
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
  title: "Nadzorna ploča prodavatelja | DealFlow",
  description: "Pregled statusa oglasa, match rezultata i NDA zahtjeva.",
};

function getListingBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    draft: {
      label: "Skica",
      className: "bg-slate-500/10 text-slate-700 border-slate-500/20",
    },
    teaser_generated: {
      label: "Teaser generiran",
      className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    },
    seller_review: {
      label: "Čeka objavu",
      className: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    },
    active: {
      label: "Aktivno",
      className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    },
    under_nda: {
      label: "Pod NDA",
      className: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    },
    closed: {
      label: "Zatvoreno",
      className: "bg-slate-500/10 text-slate-700 border-slate-500/20",
    },
  };

  const entry = map[status] ?? map.draft;
  return <Badge className={`${entry.className} rounded-none`}>{entry.label}</Badge>;
}

export default async function SellerDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: platformUser }, { data: listings }] = await Promise.all([
    supabase.from("users").select("full_name, email").eq("id", user.id).single(),
    supabase
      .from("listings")
      .select(
        "id, public_code, company_name, industry_nkd, region, status, blind_teaser, updated_at",
      )
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  const latestListing = listings?.[0] ?? null;
  const listingIds = (listings ?? []).map((listing) => listing.id);

  const { data: ndaRows } = listingIds.length
    ? await supabase
        .from("ndas")
        .select("id, status, created_at, listing_id, buyer_id")
        .in("listing_id", listingIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const { data: matchRows } = listingIds.length
    ? await supabase
        .from("matches")
        .select("id, listing_id, buyer_profile_id, match_score, ai_narrative")
        .in("listing_id", listingIds)
        .order("match_score", { ascending: false })
        .limit(8)
    : { data: [] };

  const buyerIds = Array.from(new Set((ndaRows ?? []).map((nda) => nda.buyer_id)));
  const buyerProfileIds = Array.from(
    new Set((matchRows ?? []).map((match) => match.buyer_profile_id)),
  );

  const [{ data: buyers }, { data: buyerProfiles }] = await Promise.all([
    buyerIds.length
      ? supabase.from("users").select("id, full_name, email").in("id", buyerIds)
      : Promise.resolve({ data: [] }),
    buyerProfileIds.length
      ? supabase
          .from("buyer_profiles")
          .select("id, user_id, transaction_type, investment_thesis")
          .in("id", buyerProfileIds)
      : Promise.resolve({ data: [] }),
  ]);

  const buyerMap = new Map((buyers ?? []).map((buyer) => [buyer.id, buyer]));
  const buyerProfileMap = new Map(
    (buyerProfiles ?? []).map((profile) => [profile.id, profile]),
  );
  const listingMap = new Map((listings ?? []).map((listing) => [listing.id, listing]));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                Seller dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-heading text-foreground tracking-tight">
                Upravljanje oglasima i pristupima
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Pratite status objave, algoritamska uparivanja i NDA zahtjeve
                za svoje oglase na jednom mjestu.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sell">
                <Button variant="outline" className="rounded-none">
                  Novi oglas
                </Button>
              </Link>
              <Link href="/listings">
                <Button className="rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90">
                  <Search className="w-4 h-4 mr-2" />
                  Pregledaj marketplace
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Ukupno oglasa",
                value: listings?.length ?? 0,
                icon: FileText,
              },
              {
                label: "Kvalificirani match",
                value: matchRows?.length ?? 0,
                icon: Target,
              },
              {
                label: "NDA zahtjevi",
                value: ndaRows?.length ?? 0,
                icon: Lock,
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
                    Najnoviji oglas
                  </CardTitle>
                  <CardDescription>
                    Pregled statusa oglasa i sljedeći korak u lifecycleu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {!latestListing ? (
                    <div className="border border-dashed border-border rounded-none p-8 text-center">
                      <FileText className="w-10 h-10 text-primary mx-auto mb-4" />
                      <h2 className="text-xl font-heading text-foreground mb-2">
                        Još nemate spremljen oglas
                      </h2>
                      <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Unesite interne podatke, generirajte anonimni teaser i
                        zatim ga objavite kada budete spremni.
                      </p>
                      <Link href="/sell">
                        <Button className="rounded-none">
                          Pokreni seller onboarding
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            {getListingBadge(latestListing.status)}
                            <Badge
                              variant="outline"
                              className="rounded-none border-border"
                            >
                              {latestListing.public_code}
                            </Badge>
                          </div>
                          <h2 className="text-2xl font-heading text-foreground">
                            {latestListing.company_name}
                          </h2>
                          <p className="text-muted-foreground">
                            {latestListing.industry_nkd} · {latestListing.region}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          {(latestListing.status === "active" ||
                            latestListing.status === "under_nda") && (
                            <Link href={`/listings/${latestListing.public_code}`}>
                              <Button variant="outline" className="rounded-none">
                                <Eye className="w-4 h-4 mr-2" />
                                Javni prikaz
                              </Button>
                            </Link>
                          )}
                          {latestListing.status === "seller_review" ? (
                            <PublishListingButton listingId={latestListing.id} />
                          ) : null}
                          <Link href={`/dashboard/seller/deal-room/${latestListing.id}`}>
                            <Button variant="outline" className="rounded-none">
                              Deal room
                            </Button>
                          </Link>
                          {latestListing.status !== "closed" && (
                            <ArchiveListingButton listingId={latestListing.id} />
                          )}
                        </div>
                      </div>

                      <div className="border border-border rounded-none p-5 bg-muted/20">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
                          Blind teaser
                        </p>
                        <div
                          className="text-sm text-muted-foreground leading-relaxed line-clamp-6"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(latestListing.blind_teaser || ""),
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </GlowCard>

              <GlowCard className="border border-border bg-card rounded-none overflow-hidden">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-heading text-foreground">
                    Kvalificirani investitori
                  </CardTitle>
                  <CardDescription>
                    Match score veći od 70 automatski se sprema na profil oglasa.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {!matchRows || matchRows.length === 0 ? (
                    <div className="border border-dashed border-border rounded-none p-8 text-center">
                      <Target className="w-10 h-10 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nakon objave oglasa ovdje će se pojaviti investitori s
                        kvalificiranim podudaranjem.
                      </p>
                    </div>
                  ) : null}

                  {matchRows?.map((match) => {
                    const listing = listingMap.get(match.listing_id);
                    const profile = buyerProfileMap.get(match.buyer_profile_id);
                    const buyer = profile ? buyerMap.get(profile.user_id) : null;

                    return (
                      <div
                        key={match.id}
                        className="border border-border rounded-none p-5 bg-muted/20"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className="rounded-none bg-primary/10 text-primary border-primary/20">
                              Match {match.match_score}/100
                            </Badge>
                            {listing ? (
                              <Badge
                                variant="outline"
                                className="rounded-none border-border"
                              >
                                {listing.public_code}
                              </Badge>
                            ) : null}
                          </div>
                          <h3 className="text-lg font-heading text-foreground">
                            {buyer?.full_name || "Skriveni investitor"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Tip kupca: {profile?.transaction_type || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {match.ai_narrative}
                          </p>
                          {profile?.investment_thesis ? (
                            <p className="text-sm text-foreground leading-relaxed">
                              Teza: {profile.investment_thesis}
                            </p>
                          ) : null}
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
                    NDA zahtjevi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {!ndaRows || ndaRows.length === 0 ? (
                    <div className="border border-dashed border-border rounded-none p-8 text-center">
                      <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Trenutno nema novih NDA zahtjeva.
                      </p>
                    </div>
                  ) : null}

                  {ndaRows?.map((nda) => {
                    const buyer = buyerMap.get(nda.buyer_id);
                    const listing = listingMap.get(nda.listing_id);

                    return (
                      <div
                        key={nda.id}
                        className="border border-border rounded-none p-5 bg-muted/20"
                      >
                        <div className="space-y-3">
                          <div>
                            <p className="font-heading text-foreground">
                              {buyer?.full_name || "Skriveni investitor"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {listing?.public_code || "Bez šifre"} ·{" "}
                              {new Date(nda.created_at).toLocaleDateString("hr-HR")}
                            </p>
                          </div>

                          <NdaActions
                            ndaId={nda.id}
                            status={nda.status}
                            listingId={nda.listing_id}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </GlowCard>

              <GlowCard className="border border-border bg-card rounded-none overflow-hidden">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-xl font-heading text-foreground">
                    Profil prodavatelja
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="font-heading text-foreground text-lg">
                      {platformUser?.full_name ||
                        user.user_metadata.full_name ||
                        "Prodavatelj"}
                    </p>
                    <p className="text-muted-foreground break-all">
                      {platformUser?.email || user.email}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      DealFlow čuva interne podatke o tvrtki, generira anonimni
                      teaser i tek nakon vaše potvrde objavljuje priliku u
                      marketplaceu.
                    </p>
                  </div>
                  <Link href="/sell">
                    <Button variant="outline" className="w-full rounded-none">
                      Dodaj novi oglas
                      <ArrowRight className="w-4 h-4 ml-2" />
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
