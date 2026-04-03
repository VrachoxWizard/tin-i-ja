"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle, Clock, FileSignature, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { requestNdaAction } from "@/app/actions/dealflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NdaRequestButtonProps {
  listingId: string;
  ndaStatus: string | null;
  isLoggedIn: boolean;
}

export function NdaRequestButton({
  listingId,
  ndaStatus,
  isLoggedIn,
}: NdaRequestButtonProps) {
  const [status, setStatus] = useState(ndaStatus);
  const [isPending, startTransition] = useTransition();

  const handleRequest = () => {
    startTransition(async () => {
      const result = await requestNdaAction(listingId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setStatus((current) => current ?? "pending");
      toast.success(result.message || "NDA zahtjev je uspješno poslan.");
    });
  };

  if (!isLoggedIn) {
    return (
      <div aria-live="polite">
        <Link href="/login">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 font-heading uppercase tracking-widest text-sm">
            <FileSignature className="w-4 h-4 mr-2" />
            Prijavi se za pristup
          </Button>
        </Link>
      </div>
    );
  }

  if (status === "signed") {
    return (
      <div className="space-y-3" aria-live="polite">
        <Badge className="w-full justify-center py-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-none">
          <CheckCircle className="w-3.5 h-3.5 mr-2" />
          NDA potpisan
        </Badge>
        <Link href={`/dashboard/buyer/deal-room/${listingId}`}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 font-heading uppercase tracking-widest text-sm">
            Otvori deal room
          </Button>
        </Link>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div aria-live="polite">
        <Badge className="w-full justify-center py-2.5 bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-none">
          <Clock className="w-3.5 h-3.5 mr-2" />
          NDA zahtjev na čekanju
        </Badge>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div aria-live="polite">
        <Badge className="w-full justify-center py-2.5 bg-red-500/10 text-red-500 border-red-500/20 rounded-none">
          <XCircle className="w-3.5 h-3.5 mr-2" />
          NDA zahtjev odbijen
        </Badge>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <Button
        onClick={handleRequest}
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 font-heading uppercase tracking-widest text-sm"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <FileSignature className="w-4 h-4 mr-2" />
        )}
        Zatraži NDA
      </Button>
    </div>
  );
}
