import { ShieldCheck, Users } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";

export interface NdaRow {
  buyer_id: string;
  status: string;
  signed_at: string | null;
}

export interface BuyerInfo {
  id: string;
  full_name: string | null;
  email: string;
}

interface DealRoomApprovedBuyersProps {
  signedBuyerIds: string[];
  buyerMap: Map<string, BuyerInfo>;
  ndaRows: NdaRow[];
}

export function DealRoomApprovedBuyers({
  signedBuyerIds,
  buyerMap,
  ndaRows,
}: DealRoomApprovedBuyersProps) {
  return (
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
            <p className="text-xs text-muted-foreground">trenutno ima pristup dokumentima</p>
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
          const signedNda = ndaRows.find(
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
              {signedNda?.signed_at && (
                <p className="text-xs text-muted-foreground mt-2">
                  NDA odobren {formatDate(signedNda.signed_at)}
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </GlowCard>
  );
}
