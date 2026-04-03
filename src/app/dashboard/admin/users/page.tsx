import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminSuspendButton, AdminDeleteUserButton } from "@/components/features/AdminActions";

export const metadata: Metadata = {
  title: "Upravljanje korisnicima | Admin | DealFlow",
  description: "Pregled i upravljanje svim korisnicima platforme.",
};

const ROLE_BADGES: Record<string, { label: string; className: string }> = {
  buyer: { label: "Kupac", className: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  seller: { label: "Prodavatelj", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  admin: { label: "Admin", className: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
  broker: { label: "Broker", className: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20" },
};

export default async function AdminUsersPage() {
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

  const { data: users } = await supabase
    .from("users")
    .select("id, full_name, email, role, created_at, suspended_at")
    .order("created_at", { ascending: false });

  const allUsers = users ?? [];

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
                <Users className="w-3 h-3 mr-1.5" />
                Korisnici
              </Badge>
            </div>
            <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
              Upravljanje korisnicima
            </h1>
            <p className="text-muted-foreground mt-2">
              Ukupno {allUsers.length} korisnika na platformi.
            </p>
          </div>

          <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                Svi korisnici
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {allUsers.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Nema korisnika.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {allUsers.map((u) => {
                    const roleBadge = ROLE_BADGES[u.role] ?? ROLE_BADGES.buyer;
                    const isSuspended = !!u.suspended_at;

                    return (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-4 gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate">
                              {u.full_name || "Bez imena"}
                            </p>
                            {isSuspended && (
                              <Badge variant="outline" className="rounded-none text-xs bg-red-500/10 text-red-600 border-red-500/20">
                                Suspendiran
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {u.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Registriran: {new Date(u.created_at).toLocaleDateString("hr-HR")}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant="outline"
                            className={`rounded-none text-xs ${roleBadge.className}`}
                          >
                            {roleBadge.label}
                          </Badge>

                          <Link
                            href={`/dashboard/admin/users/${u.id}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-none border border-border hover:bg-muted transition-colors"
                            title="Uredi"
                          >
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                          </Link>

                          {u.role !== "admin" && (
                            <>
                              <AdminSuspendButton
                                userId={u.id}
                                isSuspended={isSuspended}
                              />
                              <AdminDeleteUserButton userId={u.id} />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </GlowCard>
        </div>
      </main>
    </div>
  );
}
