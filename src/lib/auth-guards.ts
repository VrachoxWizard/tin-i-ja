'use server';

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPathForRole, type UserRole } from "@/lib/contracts";

export interface AuthContext {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: { id: string; email?: string };
  profile: { role: UserRole; full_name: string; suspended_at: string | null } | null;
}

/**
 * Verifies the current session. Throws if unauthenticated.
 * Use in server actions.
 */
export async function requireAuth(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name, suspended_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    throw new Error("Unauthorized");
  }

  if (profile.suspended_at) {
    await supabase.auth.signOut();
    redirect("/login?error=account_suspended");
  }

  return { supabase, user, profile: profile as AuthContext["profile"] };
}

/**
 * Verifies the current session and enforces admin role.
 * Throws if unauthenticated or not admin.
 * Use in server actions.
 */
export async function requireAdmin(): Promise<Pick<AuthContext, "supabase" | "user">> {
  const { supabase, user, profile } = await requireAuth();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }

  return { supabase, user };
}

/**
 * Verifies the current session and enforces broker role.
 * Throws if unauthenticated or not broker.
 * Use in server actions.
 */
export async function requireBroker(): Promise<Pick<AuthContext, "supabase" | "user">> {
  const { supabase, user, profile } = await requireAuth();

  if (profile?.role !== "broker") {
    throw new Error("Forbidden: broker role required");
  }

  return { supabase, user };
}

/**
 * Verifies the current session and enforces a specific role (or admin override).
 * Redirects to login if unauthenticated, or to fallback if wrong role.
 * Use in RSC page components.
 */
export async function requirePageRole(
  allowedRoles: UserRole[],
  redirectTo = "/dashboard/buyer",
): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, full_name, suspended_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) redirect("/login");
  if (profile.suspended_at) {
    await supabase.auth.signOut();
    redirect("/login?error=account_suspended");
  }

  const role = profile?.role as UserRole | undefined;
  if (!role || !allowedRoles.includes(role)) {
    redirect(role ? getDashboardPathForRole(role) : redirectTo);
  }

  return { supabase, user, profile: profile as AuthContext["profile"] };
}

/**
 * Admin-only page guard. Redirects non-admins.
 * Use in RSC page components.
 */
export async function requireAdminPage(): Promise<AuthContext> {
  return requirePageRole(["admin"]);
}

/**
 * Broker-only page guard. Redirects non-brokers.
 * Use in RSC page components.
 */
export async function requireBrokerPage(): Promise<AuthContext> {
  return requirePageRole(["broker"]);
}
