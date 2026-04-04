"use client";

import { useTransition, useRef, useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/app/actions/notifications";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  entity_id: string | null;
  read_at: string | null;
  created_at: string;
}

interface NotificationBellProps {
  notifications: Notification[];
}

const TYPE_COLORS: Record<string, string> = {
  nda_request: "bg-amber-500",
  nda_approved: "bg-emerald-500",
  nda_rejected: "bg-red-500",
  match_found: "bg-blue-500",
  deal_room_upload: "bg-indigo-500",
};

export function NotificationBell({ notifications }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read_at).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleMarkRead(id: string) {
    startTransition(() => markNotificationReadAction(id));
  }

  function handleMarkAllRead() {
    startTransition(() => markAllNotificationsReadAction());
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Obavijesti${unread > 0 ? ` (${unread} nepročitanih)` : ""}`}
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border shadow-xl z-50 rounded-none">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-heading font-semibold text-foreground uppercase tracking-wider">
              Obavijesti
            </h3>
            {unread > 0 && (
              <button
                type="button"
                disabled={isPending}
                onClick={handleMarkAllRead}
                className="text-xs text-primary hover:underline disabled:opacity-50"
              >
                Označi sve kao pročitano
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Nema obavijesti.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 p-4 text-sm ${n.read_at ? "opacity-60" : ""}`}
                >
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${TYPE_COLORS[n.type] ?? "bg-muted"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatDate(n.created_at)}
                    </p>
                  </div>
                  {!n.read_at && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleMarkRead(n.id)}
                      className="shrink-0 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                      aria-label="Označi kao pročitano"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
