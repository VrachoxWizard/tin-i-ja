"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NdaActionsProps {
  ndaId: string;
  status: string;
  listingId?: string;
}

export function NdaActions({ ndaId, status, listingId }: NdaActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(status);
  const router = useRouter();

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    try {
      const res = await fetch("/api/nda/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nda_id: ndaId, action }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Greška pri ažuriranju NDA statusa.");
        return;
      }

      setCurrentStatus(data.status);
      toast.success(
        action === "approve"
          ? "NDA odobren. Kupac sada ima pristup Deal Roomu."
          : "NDA zahtjev je odbijen."
      );
      router.refresh();
    } catch {
      toast.error("Mrežna greška. Pokušajte ponovo.");
    } finally {
      setLoading(null);
    }
  }

  if (currentStatus === "pending") {
    return (
      <div className="flex gap-2 mt-1">
        <Button
          size="sm"
          className="flex-1 bg-df-trust-blue hover:bg-df-trust-blue/90 text-white font-jakarta rounded-lg h-9 shadow-sm"
          onClick={() => handleAction("approve")}
          disabled={loading !== null}
        >
          {loading === "approve" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Odobri"
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 font-jakarta rounded-lg h-9"
          onClick={() => handleAction("reject")}
          disabled={loading !== null}
        >
          {loading === "reject" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Odbij"
          )}
        </Button>
      </div>
    );
  }

  if (currentStatus === "signed" && listingId) {
    return (
      <Link href={`/dashboard/seller/deal-room/${listingId}`}>
        <Button
          size="sm"
          variant="outline"
          className="w-full font-jakarta rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 h-9"
        >
          <FileText className="w-3.5 h-3.5 mr-2 text-slate-400" />
          Otvori Deal Room
        </Button>
      </Link>
    );
  }

  return null;
}
