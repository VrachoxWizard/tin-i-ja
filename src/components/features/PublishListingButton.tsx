"use client";

import { useTransition } from "react";
import { Loader2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { publishListingAction } from "@/app/actions/dealflow";
import { Button } from "@/components/ui/button";

interface PublishListingButtonProps {
  listingId: string;
}

export function PublishListingButton({
  listingId,
}: PublishListingButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handlePublish = () => {
    startTransition(async () => {
      const result = await publishListingAction(listingId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Oglas je objavljen.");
    });
  };

  return (
    <Button
      onClick={handlePublish}
      disabled={isPending}
      className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Rocket className="w-4 h-4 mr-2" />
      )}
      Objavi oglas
    </Button>
  );
}
