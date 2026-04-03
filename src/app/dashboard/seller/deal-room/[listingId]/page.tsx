import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Lock,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createDealRoomSignedUrl } from "@/lib/deal-room";
import { SellerDealRoomUploadForm } from "@/components/features/SellerDealRoomUploadForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Upravljanje deal roomom | DealFlow",
  description: "Dodajte dokumente i upravljajte pristupom investitora.",
};

interface SellerDealRoomPageProps {
  params: Promise<{ listingId: string }>;
}

export default async function SellerDealRoomPage({
  params,
}: SellerDealRoomPageProps) {
  const { listingId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: listing } = await supabase
    .from("listings")
    .select("id, public_code, company_name, industry_nkd, region, owner_id, status")
    .eq("id", listingId)
    .single();

  if (!listing || listing.owner_id !== user.id) {
    notFound();
  }

  const [{ data: ndaRows }, { data: files }] = await Promise.all([
    supabase
      .from("ndas")
      .select("id, buyer_id, status, signed_at")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false }),
    supabase
      .from("deal_room_files")
      .select("id, file_path, doc_type, uploaded_at")
      .eq("listing_id", listingId)
      .order("uploaded_at", { ascending: false }),
  ]);

  const signedBuyerIds = Array.from(
    new Set(
      (ndaRows ?? [])
        .filter((nda) => nda.status === "signed")
        .map((nda) => nda.buyer_id),
    ),
  );

  const { data: buyers } = signedBuyerIds.length
    ? await supabase
        .from("users")
        .select("id, full_name, email")
        .in("id", signedBuyerIds)
    : { data: [] };

  const buyerMap = new Map((buyers ?? []).map((buyer) => [buyer.id, buyer]));
  const fileEntries = await Promise.all(
    (files ?? []).map(async (file) => ({
      ...file,
      signedUrl: await createDealRoomSignedUrl(supabase, file.file_path),
    })),
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <Link
              href="/dashboard/seller"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Povratak na dashboard
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <Lock className="w-3 h-3 mr-1.5" />
                Deal room
              </Badge>
              <Badge
                variant="outline"
                className="border-border text-muted-foreground rounded-none uppercase tracking-widest text-xs px-3 py-1"
              >
                {listing.public_code}
              </Badge>
              <Badge
                variant="outline"
                className="border-border text-muted-foreground rounded-none uppercase tracking-widest text-xs px-3 py-1"
              >
                {listing.status}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground tracking-tight">
              {listing.company_name}
            </h1>
            <p className="text-muted-foreground mt-2">
              Upravljajte dokumentima i pratite koji investitori imaju pristup.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Dodaj dokument
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-6 text-sm text-muted-foreground">
                    <Upload className="w-4 h-4 mt-0.5 text-primary" />
                    <p>
                      Datoteke se spremaju u privatni storage i kupci im mogu
                      pristupiti samo kroz vremenski ograničene signed URL-ove
                      nakon odobrenog NDA-a.
                    </p>
                  </div>
                  <SellerDealRoomUploadForm listingId={listingId} />
                </CardContent>
              </GlowCard>

              <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Trenutni dokumenti
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {fileEntries.length > 0 ? (
                    <div className="space-y-3">
                      {fileEntries.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-none"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {file.file_path.split("/").pop() || file.doc_type}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {file.doc_type} ·{" "}
                                {new Date(file.uploaded_at).toLocaleDateString("hr-HR")}
                              </p>
                            </div>
                          </div>
                          {file.signedUrl ? (
                            <a
                              href={file.signedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" className="rounded-none">
                                Pregledaj
                              </Button>
                            </a>
                          ) : (
                            <Button variant="outline" className="rounded-none" disabled>
                              Nedostupno
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-border rounded-none">
                      <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Još nema dodanih dokumenata.
                      </p>
                    </div>
                  )}
                </CardContent>
              </GlowCard>
            </div>

            <div className="space-y-6">
              <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                    Odobreni investitori
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/20 border border-border rounded-none">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {signedBuyerIds.length} investitora
                      </p>
                      <p className="text-xs text-muted-foreground">
                        trenutno ima pristup dokumentima
                      </p>
                    </div>
                  </div>

                  {signedBuyerIds.length === 0 ? (
                    <div className="border border-dashed border-border rounded-none p-6 text-center">
                      <ShieldCheck className="w-8 h-8 text-primary mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Nijedan investitor još nema otključan deal room.
                      </p>
                    </div>
                  ) : null}

                  {signedBuyerIds.map((buyerId) => {
                    const buyer = buyerMap.get(buyerId);
                    const signedNda = ndaRows?.find(
                      (nda) => nda.buyer_id === buyerId && nda.status === "signed",
                    );

                    return (
                      <div
                        key={buyerId}
                        className="border border-border rounded-none p-4 bg-muted/20"
                      >
                        <p className="font-medium text-foreground">
                          {buyer?.full_name || "Investitor"}
                        </p>
                        <p className="text-sm text-muted-foreground break-all">
                          {buyer?.email || "Email nije dostupan"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          NDA odobren{" "}
                          {signedNda?.signed_at
                            ? new Date(signedNda.signed_at).toLocaleDateString("hr-HR")
                            : ""}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </GlowCard>

              <Link href={`/listings/${listing.public_code}`}>
                <Button variant="outline" className="w-full rounded-none">
                  Otvori javni teaser
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
