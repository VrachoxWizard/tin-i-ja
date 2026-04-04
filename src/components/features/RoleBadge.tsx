import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/lib/contracts";

const ROLE_MAP: Record<UserRole, { label: string; className: string }> = {
  buyer: {
    label: "Kupac",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  seller: {
    label: "Prodavatelj",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  admin: {
    label: "Admin",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
  broker: {
    label: "Broker",
    className: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  },
};

interface RoleBadgeProps {
  role: string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const entry = ROLE_MAP[role as UserRole] ?? ROLE_MAP.buyer;
  return (
    <Badge variant="outline" className={`rounded-none text-xs ${entry.className}`}>
      {entry.label}
    </Badge>
  );
}
