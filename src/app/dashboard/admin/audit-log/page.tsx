import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ScrollText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Audit Log | Admin | DealFlow",
  description: "Pregled svih admin akcija na platformi.",
};

const ACTION_LABELS: Record<string, string> = {
  "user.update": "Ažuriranje korisnika",
  "user.suspend": "Suspenzija korisnika",
  "user.unsuspend": "Uklanjanje suspenzije",
  "user.delete": "Brisanje korisnika",
  "listing.update": "Ažuriranje oglasa",
  "listing.status_change": "Promjena statusa oglasa",
  "listing.delete": "Brisanje oglasa",
  "listing.assign_broker": "Dodjela brokera",
  "nda.override": "NDA override",
};

export default async function AdminAuditLogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard/buyer");

  const { data: logs, error: logsError } = await supabase
    .from("audit_logs")
    .select("id, actor_id, action, entity_type, entity_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (logsError) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <p className="text-destructive">Učitavanje zapisnika nije uspjelo.</p>
          </div>
        </main>
      </div>
    );
  }

  const allLogs = logs ?? [];

  // Fetch actor names
  const actorIds = [...new Set(allLogs.map((l) => l.actor_id))];
  const { data: actorsData } = actorIds.length > 0
    ? await supabase.from("users").select("id, full_name, email").in("id", actorIds)
    : { data: [] as { id: string; full_name: string; email: string }[] };

  const actorMap = new Map((actorsData ?? []).map((a) => [a.id, a.full_name || a.email]));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/dashboard/admin"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <ScrollText className="w-3 h-3 mr-1.5" />
                Audit Log
              </Badge>
            </div>
            <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
              Zapisnik akcija
            </h1>
            <p className="text-muted-foreground mt-2">
              Posljednjih {allLogs.length} akcija na platformi.
            </p>
          </div>

          <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {allLogs.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Nema zabilježenih akcija.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {allLogs.map((log) => (
                    <div key={log.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {ACTION_LABELS[log.action] ?? log.action}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Izvršio: {actorMap.get(log.actor_id) ?? log.actor_id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Entitet: {log.entity_type}
                            {log.entity_id ? ` · ${log.entity_id.slice(0, 8)}...` : ""}
                          </p>
                          {log.metadata &&
                            typeof log.metadata === "object" &&
                            Object.keys(log.metadata).length > 0 && (
                              <pre className="text-xs text-muted-foreground mt-1 bg-muted/50 p-2 rounded-none overflow-x-auto">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground shrink-0">
                          {new Date(log.created_at).toLocaleString("hr-HR")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </GlowCard>
        </div>
      </main>
    </div>
  );
}
