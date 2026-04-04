'use server'

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit";
import type { ActionResult } from "@/app/actions/dealflow";
import { USER_ROLES, LISTING_STATUSES, NDA_STATUSES } from "@/lib/contracts";

const updateUserSchema = z.object({
  full_name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional(),
  role: z.enum(USER_ROLES).optional(),
});

const updateListingSchema = z.object({
  company_name: z.string().min(2).max(120).optional(),
  industry_nkd: z.string().min(2).max(120).optional(),
  region: z.string().min(2).max(120).optional(),
  year_founded: z.coerce.number().int().min(1900).max(new Date().getFullYear()).optional(),
  employees: z.coerce.number().int().min(1).max(100000).optional(),
  revenue_eur: z.coerce.number().min(0).optional(),
  ebitda_eur: z.coerce.number().min(0).optional(),
  sde_eur: z.coerce.number().min(0).optional(),
  asking_price_eur: z.coerce.number().min(0).optional(),
  reason_for_sale: z.string().max(1200).optional(),
  transition_support: z.string().max(1200).optional(),
  owner_dependency_score: z.coerce.number().int().min(1).max(5).optional(),
  digital_maturity: z.coerce.number().int().min(1).max(5).optional(),
});

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden: admin role required");
  }

  return { supabase, user };
}

// ── User Management ──────────────────────────────────────────────

export async function adminUpdateUserAction(
  userId: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = updateUserSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return { error: "Neispravni podaci za ažuriranje korisnika." };
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase.rpc("admin_update_user", {
    p_user_id: userId,
    p_full_name: parsed.data.full_name ?? null,
    p_email: parsed.data.email ?? null,
    p_role: parsed.data.role ?? null,
  });

  if (error) {
    return { error: "Ažuriranje korisnika nije uspjelo." };
  }

  await logAuditEvent(supabase, {
    action: "user.update",
    entityType: "user",
    entityId: userId,
    metadata: parsed.data,
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/users");
  return { success: true, message: "Korisnik je ažuriran." };
}

export async function adminSuspendUserAction(
  userId: string,
  suspend: boolean,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.rpc("admin_toggle_suspend_user", {
    p_user_id: userId,
    p_suspend: suspend,
  });

  if (error) {
    return { error: "Suspendiranje korisnika nije uspjelo." };
  }

  await logAuditEvent(supabase, {
    action: suspend ? "user.suspend" : "user.unsuspend",
    entityType: "user",
    entityId: userId,
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/users");
  return {
    success: true,
    message: suspend ? "Korisnik je suspendiran." : "Suspenzija je uklonjena.",
  };
}

export async function adminDeleteUserAction(
  userId: string,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { data: targetUser } = await supabase
    .from("users")
    .select("email, full_name")
    .eq("id", userId)
    .single();

  const { error } = await supabase.rpc("admin_delete_user", {
    p_user_id: userId,
  });

  if (error) {
    return { error: "Brisanje korisnika nije uspjelo." };
  }

  await logAuditEvent(supabase, {
    action: "user.delete",
    entityType: "user",
    entityId: userId,
    metadata: {
      deleted_email: targetUser?.email,
      deleted_name: targetUser?.full_name,
    },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/users");
  return { success: true, message: "Korisnik je obrisan." };
}

// ── Listing Management ───────────────────────────────────────────

export async function adminUpdateListingAction(
  listingId: string,
  formData: FormData,
): Promise<ActionResult> {
  const raw = Object.fromEntries(formData.entries());
  const filtered = Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== ""),
  );
  const parsed = updateListingSchema.safeParse(filtered);

  if (!parsed.success) {
    return { error: "Neispravni podaci za ažuriranje oglasa." };
  }

  const { supabase } = await requireAdmin();

  const updateFields: Record<string, unknown> = { ...parsed.data, updated_at: new Date().toISOString() };

  const { error } = await supabase
    .from("listings")
    .update(updateFields)
    .eq("id", listingId);

  if (error) {
    return { error: "Ažuriranje oglasa nije uspjelo." };
  }

  await logAuditEvent(supabase, {
    action: "listing.update",
    entityType: "listing",
    entityId: listingId,
    metadata: parsed.data,
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/listings");
  revalidatePath("/listings");
  return { success: true, message: "Oglas je ažuriran." };
}

export async function adminChangeListingStatusAction(
  listingId: string,
  status: string,
): Promise<ActionResult> {
  const parsed = z.enum(LISTING_STATUSES).safeParse(status);
  if (!parsed.success) {
    return { error: "Nepoznat status oglasa." };
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase.rpc("admin_update_listing_status", {
    p_listing_id: listingId,
    p_status: parsed.data,
  });

  if (error) {
    return { error: "Promjena statusa oglasa nije uspjela." };
  }

  await logAuditEvent(supabase, {
    action: "listing.status_change",
    entityType: "listing",
    entityId: listingId,
    metadata: { new_status: parsed.data },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/listings");
  revalidatePath("/listings");
  return { success: true, message: `Status oglasa promijenjen u "${parsed.data}".` };
}

export async function adminDeleteListingAction(
  listingId: string,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { data: listing } = await supabase
    .from("listings")
    .select("company_name, public_code")
    .eq("id", listingId)
    .single();

  const { error } = await supabase.rpc("admin_delete_listing", {
    p_listing_id: listingId,
  });

  if (error) {
    return { error: "Brisanje oglasa nije uspjelo." };
  }

  await logAuditEvent(supabase, {
    action: "listing.delete",
    entityType: "listing",
    entityId: listingId,
    metadata: {
      deleted_name: listing?.company_name,
      deleted_code: listing?.public_code,
    },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/listings");
  revalidatePath("/listings");
  return { success: true, message: "Oglas je obrisan." };
}

// ── NDA Management ───────────────────────────────────────────────

export async function adminManageNdaAction(
  ndaId: string,
  status: string,
): Promise<ActionResult> {
  const parsed = z.enum(NDA_STATUSES).safeParse(status);
  if (!parsed.success) {
    return { error: "Nepoznat NDA status." };
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase.rpc("admin_manage_nda", {
    p_nda_id: ndaId,
    p_status: parsed.data,
  });

  if (error) {
    return { error: "Upravljanje NDA-om nije uspjelo." };
  }

  await logAuditEvent(supabase, {
    action: "nda.override",
    entityType: "nda",
    entityId: ndaId,
    metadata: { new_status: parsed.data },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/ndas");
  return { success: true, message: `NDA status promijenjen u "${parsed.data}".` };
}

// ── Broker Assignment ────────────────────────────────────────────

export async function adminAssignBrokerAction(
  listingId: string,
  brokerId: string | null,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  if (brokerId) {
    const { data: broker } = await supabase
      .from("users")
      .select("role")
      .eq("id", brokerId)
      .single();

    if (broker?.role !== "broker") {
      return { error: "Odabrani korisnik nije broker." };
    }
  }

  const { error } = await supabase
    .from("listings")
    .update({ broker_id: brokerId })
    .eq("id", listingId);

  if (error) {
    return { error: "Dodjeljivanje brokera nije uspjelo." };
  }

  await logAuditEvent(supabase, {
    action: "listing.assign_broker",
    entityType: "listing",
    entityId: listingId,
    metadata: { broker_id: brokerId },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/listings");
  return {
    success: true,
    message: brokerId ? "Broker je dodijeljen oglasu." : "Broker je uklonjen s oglasa.",
  };
}
