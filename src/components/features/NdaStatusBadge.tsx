import { Badge } from "@/components/ui/badge";
import type { NdaStatus } from "@/lib/contracts";

const NDA_MAP: Record<NdaStatus, { label: string; className: string }> = {
  pending: {
    label: "Na čekanju",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
  signed: {
    label: "Potpisan",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  rejected: {
    label: "Odbijen",
    className: "bg-red-500/10 text-red-700 border-red-500/20",
  },
};

interface NdaStatusBadgeProps {
  status: string;
}

export function NdaStatusBadge({ status }: NdaStatusBadgeProps) {
  const entry = NDA_MAP[status as NdaStatus] ?? NDA_MAP.pending;
  return (
    <Badge variant="outline" className={`rounded-none text-xs ${entry.className}`}>
      {entry.label}
    </Badge>
  );
}
