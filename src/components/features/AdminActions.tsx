'use client'

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserX, UserCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  adminSuspendUserAction,
  adminDeleteUserAction,
  adminChangeListingStatusAction,
  adminDeleteListingAction,
  adminManageNdaAction,
  adminAssignBrokerAction,
} from "@/app/actions/admin";

// ── Suspend / Unsuspend Button ───────────────────────────────────

export function AdminSuspendButton({
  userId,
  isSuspended,
}: {
  userId: string;
  isSuspended: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await adminSuspendUserAction(userId, !isSuspended);
          router.refresh();
        })
      }
      className="inline-flex items-center justify-center w-8 h-8 rounded-none border border-border hover:bg-muted transition-colors disabled:opacity-50"
      title={isSuspended ? "Ukloni suspenziju" : "Suspendiraj"}
    >
      {isSuspended ? (
        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <UserX className="w-3.5 h-3.5 text-amber-600" />
      )}
    </button>
  );
}

// ── Delete User Button ───────────────────────────────────────────

export function AdminDeleteUserButton({ userId }: { userId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="sm"
          className="rounded-none text-xs h-8 px-2"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await adminDeleteUserAction(userId);
              setConfirming(false);
              router.refresh();
            })
          }
        >
          Obriši
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-none text-xs h-8 px-2"
          onClick={() => setConfirming(false)}
        >
          Odustani
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center justify-center w-8 h-8 rounded-none border border-border hover:bg-destructive/10 transition-colors"
      title="Obriši korisnika"
    >
      <Trash2 className="w-3.5 h-3.5 text-destructive" />
    </button>
  );
}

// ── Change Listing Status ────────────────────────────────────────

export function AdminListingStatusSelect({
  listingId,
  currentStatus,
}: {
  listingId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const statuses = [
    { value: "draft", label: "Skica" },
    { value: "teaser_generated", label: "Teaser" },
    { value: "seller_review", label: "Čeka objavu" },
    { value: "active", label: "Aktivno" },
    { value: "under_nda", label: "Pod NDA" },
    { value: "closed", label: "Zatvoreno" },
  ];

  return (
    <select
      disabled={isPending}
      value={currentStatus}
      onChange={(e) =>
        startTransition(async () => {
          await adminChangeListingStatusAction(listingId, e.target.value);
          router.refresh();
        })
      }
      className="h-8 rounded-none border border-border bg-background text-xs px-2 text-foreground disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

// ── Delete Listing Button ────────────────────────────────────────

export function AdminDeleteListingButton({
  listingId,
}: {
  listingId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="sm"
          className="rounded-none text-xs h-8 px-2"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await adminDeleteListingAction(listingId);
              setConfirming(false);
              router.refresh();
            })
          }
        >
          Obriši
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-none text-xs h-8 px-2"
          onClick={() => setConfirming(false)}
        >
          Odustani
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center justify-center w-8 h-8 rounded-none border border-border hover:bg-destructive/10 transition-colors"
      title="Obriši oglas"
    >
      <Trash2 className="w-3.5 h-3.5 text-destructive" />
    </button>
  );
}

// ── NDA Status Override ──────────────────────────────────────────

export function AdminNdaStatusSelect({
  ndaId,
  currentStatus,
}: {
  ndaId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const statuses = [
    { value: "pending", label: "Na čekanju" },
    { value: "signed", label: "Potpisan" },
    { value: "rejected", label: "Odbijen" },
  ];

  return (
    <select
      disabled={isPending}
      value={currentStatus}
      onChange={(e) =>
        startTransition(async () => {
          await adminManageNdaAction(ndaId, e.target.value);
          router.refresh();
        })
      }
      className="h-8 rounded-none border border-border bg-background text-xs px-2 text-foreground disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

// ── Broker Assignment ────────────────────────────────────────────

export function AdminBrokerAssign({
  listingId,
  currentBrokerId,
  brokers,
}: {
  listingId: string;
  currentBrokerId: string | null;
  brokers: { id: string; full_name: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      disabled={isPending}
      value={currentBrokerId ?? ""}
      onChange={(e) =>
        startTransition(async () => {
          const brokerId = e.target.value || null;
          await adminAssignBrokerAction(listingId, brokerId);
          router.refresh();
        })
      }
      className="h-8 rounded-none border border-border bg-background text-xs px-2 text-foreground disabled:opacity-50"
    >
      <option value="">Bez brokera</option>
      {brokers.map((b) => (
        <option key={b.id} value={b.id}>
          {b.full_name || b.id.slice(0, 8)}
        </option>
      ))}
    </select>
  );
}
