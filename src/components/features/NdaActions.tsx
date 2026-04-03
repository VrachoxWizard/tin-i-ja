"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { reviewNdaAction } from "@/app/actions/dealflow";
import { Button } from "@/components/ui/button";

interface NdaActionsProps {
  ndaId: string;
  status: string;
  listingId?: string;
}

export function NdaActions({ ndaId, status, listingId }: NdaActionsProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: "approve" | "reject") => {
    setPendingAction(action);

    startTransition(async () => {
      const result = await reviewNdaAction(ndaId, action);

      if (result.error) {
        toast.error(result.error);
        setPendingAction(null);
        return;
      }

      setCurrentStatus(action === "approve" ? "signed" : "rejected");
      setPendingAction(null);
      toast.success(
        result.message ||
          (action === "approve"
            ? "NDA je odobren."
            : "NDA zahtjev je odbijen."),
      );
    });
  };

  if (currentStatus === "pending") {
    return (
      <div className="flex gap-2 mt-1">
        <Button
          size="sm"
          className="flex-1 bg-df-trust-blue hover:bg-df-trust-blue/90 text-white rounded-none h-9"
          onClick={() => handleAction("approve")}
          disabled={isPending}
        >
          {pendingAction === "approve" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Odobri"
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-red-600 border-red-200 hover:bg-red-50 rounded-none h-9"
          onClick={() => handleAction("reject")}
          disabled={isPending}
        >
          {pendingAction === "reject" ? (
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
          className="w-full rounded-none border-border hover:bg-muted h-9"
        >
          <FileText className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
          Otvori deal room
        </Button>
      </Link>
    );
  }

  return null;
}
