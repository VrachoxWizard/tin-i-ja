"use client";

import { useState, useTransition } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadDealRoomFileAction } from "@/app/actions/dealflow";
import { DEAL_ROOM_DOC_TYPES } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SellerDealRoomUploadFormProps {
  listingId: string;
}

const DOC_TYPE_LABELS: Record<(typeof DEAL_ROOM_DOC_TYPES)[number], string> = {
  financial: "Financijski dokument",
  legal: "Pravni dokument",
  asset: "Imovina / operativa",
};

export function SellerDealRoomUploadForm({
  listingId,
}: SellerDealRoomUploadFormProps) {
  const [docType, setDocType] =
    useState<(typeof DEAL_ROOM_DOC_TYPES)[number]>("financial");
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      toast.error("Odaberite dokument za upload.");
      return;
    }

    const payload = new FormData();
    payload.set("doc_type", docType);
    payload.set("file", file);

    startTransition(async () => {
      const result = await uploadDealRoomFileAction(listingId, payload);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setFile(null);
      const fileInput = document.getElementById(
        "deal-room-file-input",
      ) as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }

      toast.success(result.message || "Dokument je dodan u deal room.");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Vrsta dokumenta</Label>
        <Select
          value={docType}
          onValueChange={(value) =>
            setDocType((value as typeof docType | null) ?? "financial")
          }
        >
          <SelectTrigger className="rounded-none h-11">
            <SelectValue placeholder="Odaberite vrstu dokumenta" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            {DEAL_ROOM_DOC_TYPES.map((value) => (
              <SelectItem key={value} value={value}>
                {DOC_TYPE_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deal-room-file-input">Datoteka</Label>
        <Input
          id="deal-room-file-input"
          type="file"
          className="rounded-none h-11"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-none bg-df-trust-blue text-white hover:bg-df-trust-blue/90"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 mr-2" />
        )}
        Dodaj dokument
      </Button>
    </form>
  );
}
