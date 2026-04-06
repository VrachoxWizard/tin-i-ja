import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPathForRole } from "@/lib/contracts";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminUserEditForm } from "@/components/features/AdminUserEditForm";

export const metadata: Metadata = {
  title: "Uredi korisnika | Admin | DealFlow",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
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

  if (profile?.role !== "admin") redirect(getDashboardPathForRole(profile?.role));

  const { data: targetUser } = await supabase
    .from("users")
    .select("id, full_name, email, role, created_at, suspended_at")
    .eq("id", userId)
    .single();

  if (!targetUser) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link
                href="/dashboard/admin/users"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Svi korisnici
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 rounded-none uppercase tracking-widest text-xs font-bold px-3 py-1">
                <Users className="w-3 h-3 mr-1.5" />
                Uredi korisnika
              </Badge>
            </div>
            <h1 className="text-3xl font-heading font-semibold text-foreground tracking-tight">
              {targetUser.full_name || "Bez imena"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {targetUser.email} · Registriran: {new Date(targetUser.created_at).toLocaleDateString("hr-HR")}
            </p>
          </div>

          <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
                Podaci korisnika
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AdminUserEditForm
                userId={targetUser.id}
                defaultValues={{
                  full_name: targetUser.full_name,
                  email: targetUser.email,
                  role: targetUser.role,
                }}
              />
            </CardContent>
          </GlowCard>
        </div>
      </main>
    </div>
  );
}
