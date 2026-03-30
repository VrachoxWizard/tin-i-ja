"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileSignature, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(ndaStatus);
  const router = useRouter();

  async function handleRequest() {
    setLoading(true);
    try {
      const res = await fetch("/api/nda/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Greška pri slanju NDA zahtjeva.");
        return;
      }

      if (data.success) {
        setStatus("pending");
        toast.success("NDA zahtjev poslan! Čekamo odobrenje prodavatelja.");
      } else {
        toast.info(data.message);
      }
      router.refresh();
    } catch {
      toast.error("Mrežna greška. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  }

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
        <Badge className="w-full justify-center py-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-none">
          <CheckCircle className="w-3.5 h-3.5 mr-2" />
          NDA Potpisan
        </Badge>
        <Link href={`/dashboard/buyer/deal-room/${listingId}`}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 font-heading uppercase tracking-widest text-sm">
            Otvori Deal Room
          </Button>
        </Link>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div aria-live="polite">
        <Badge className="w-full justify-center py-2.5 bg-amber-500/10 text-amber-400 border-amber-500/20 rounded-none">
          <Clock className="w-3.5 h-3.5 mr-2" />
          NDA zahtjev na čekanju
        </Badge>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div aria-live="polite">
        <Badge className="w-full justify-center py-2.5 bg-red-500/10 text-red-400 border-red-500/20 rounded-none">
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
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 font-heading uppercase tracking-widest text-sm"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <FileSignature className="w-4 h-4 mr-2" />
        )}
        Zatraži NDA
      </Button>
    </div>
  );
}
