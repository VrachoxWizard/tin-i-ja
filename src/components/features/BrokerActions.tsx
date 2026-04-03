'use client'

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brokerReviewNdaAction } from "@/app/actions/broker";

export function BrokerNdaActions({ ndaId }: { ndaId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        className="rounded-none text-xs h-8 px-2 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await brokerReviewNdaAction(ndaId, "approve");
            router.refresh();
          })
        }
      >
        <Check className="w-3.5 h-3.5 mr-1" />
        Odobri
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="rounded-none text-xs h-8 px-2 text-red-600 border-red-500/30 hover:bg-red-500/10"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await brokerReviewNdaAction(ndaId, "reject");
            router.refresh();
          })
        }
      >
        <X className="w-3.5 h-3.5 mr-1" />
        Odbij
      </Button>
    </div>
  );
}
