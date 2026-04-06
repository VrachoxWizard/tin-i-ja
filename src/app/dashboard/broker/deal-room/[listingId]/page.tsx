import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Lock, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDashboardPathForRole } from "@/lib/contracts";
import { createDealRoomSignedUrl } from "@/lib/deal-room";
import { BrokerDealRoomUploadForm } from "@/components/features/BrokerDealRoomUploadForm";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DealRoomFileList } from "@/components/features/DealRoomFileList";
import { DealRoomApprovedBuyers } from "@/components/features/DealRoomApprovedBuyers";
import type { BuyerInfo } from "@/components/features/DealRoomApprovedBuyers";

export const metadata: Metadata = {
  title: "Deal Room | Broker | DealFlow",
  description: "Upravljajte dokumentima deal rooma kao broker.",
};

export default async function BrokerDealRoomPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "broker") redirect(getDashboardPathForRole(profile?.role));

  const { data: listing } = await supabase
    .from("listings")
    .select("id, public_code, company_name, industry_nkd, region, broker_id, status")
    .eq("id", listingId)
    .single();

  if (!listing || listing.broker_id !== user.id) notFound();

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
      (ndaRows ?? []).filter((nda) => nda.status === "signed").map((nda) => nda.buyer_id),
    ),
  );

  const { data: buyers } = signedBuyerIds.length
    ? await admin.from("users").select("id, full_name, email").in("id", signedBuyerIds)
    : { data: [] };

  const buyerMap = new Map(
    (buyers as BuyerInfo[] ?? []).map((buyer) => [buyer.id, buyer]),
  );

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
              href={`/dashboard/broker/listings/${listingId}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Povratak na oglas
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <Lock className="w-3 h-3 mr-1.5" />
                Deal room · Broker
              </Badge>
              <Badge variant="outline" className="border-border text-muted-foreground rounded-none uppercase tracking-widest text-xs px-3 py-1">
                {listing.public_code}
              </Badge>
              <Badge variant="outline" className="border-border text-muted-foreground rounded-none uppercase tracking-widest text-xs px-3 py-1">
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
                      Datoteke se spremaju u privatni storage i kupci im mogu pristupiti samo
                      kroz vremenski ograničene signed URL-ove nakon odobrenog NDA-a.
                    </p>
                  </div>
                  <BrokerDealRoomUploadForm listingId={listingId} />
                </CardContent>
              </GlowCard>

              <DealRoomFileList files={fileEntries} />
            </div>

            <div className="space-y-6">
              <DealRoomApprovedBuyers
                signedBuyerIds={signedBuyerIds}
                buyerMap={buyerMap}
                ndaRows={ndaRows ?? []}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
