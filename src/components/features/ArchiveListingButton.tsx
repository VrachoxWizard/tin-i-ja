"use client";

import { useState } from "react";
import { archiveListingAction } from "@/app/actions/dealflow";
import { Button } from "@/components/ui/button";
import { Archive, Loader2 } from "lucide-react";

interface ArchiveListingButtonProps {
  listingId: string;
}

export function ArchiveListingButton({ listingId }: ArchiveListingButtonProps) {
  const [pending, setPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleArchive() {
    setPending(true);
    const res = await archiveListingAction(listingId);
    setPending(false);
    setShowConfirm(false);
    if (res.error) {
      setResult(res.error);
    } else {
      setResult(res.message ?? "Oglas je arhiviran.");
    }
  }

  if (result) {
    return (
      <p className="text-xs text-muted-foreground">{result}</p>
    );
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Arhivirati oglas?</span>
        <Button
          size="sm"
          variant="destructive"
          className="rounded-none text-xs"
          disabled={pending}
          onClick={handleArchive}
        >
          {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Da"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-none text-xs"
          onClick={() => setShowConfirm(false)}
        >
          Ne
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      className="rounded-none text-destructive border-destructive/30 hover:bg-destructive/10"
      onClick={() => setShowConfirm(true)}
    >
      <Archive className="w-4 h-4 mr-2" />
      Arhiviraj
    </Button>
  );
}
