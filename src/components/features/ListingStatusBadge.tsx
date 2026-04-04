import { Badge } from "@/components/ui/badge";
import type { ListingStatus } from "@/lib/contracts";

const STATUS_MAP: Record<ListingStatus, { label: string; className: string }> = {
  draft: {
    label: "Skica",
    className: "bg-slate-500/10 text-slate-700 border-slate-500/20",
  },
  teaser_generated: {
    label: "Teaser generiran",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  seller_review: {
    label: "Čeka objavu",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
  active: {
    label: "Aktivno",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  under_nda: {
    label: "Pod NDA",
    className: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  },
  closed: {
    label: "Zatvoreno",
    className: "bg-slate-500/10 text-slate-700 border-slate-500/20",
  },
};

interface ListingStatusBadgeProps {
  status: string;
}

export function ListingStatusBadge({ status }: ListingStatusBadgeProps) {
  const entry = STATUS_MAP[status as ListingStatus] ?? STATUS_MAP.draft;
  return (
    <Badge variant="outline" className={`rounded-none text-xs ${entry.className}`}>
      {entry.label}
    </Badge>
  );
}
