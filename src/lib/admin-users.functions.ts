import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ROLE_ORDER = [
  "super_admin",
  "master_distributor",
  "distributor",
  "retailer",
  "agent",
] as const;
type AppRole = (typeof ROLE_ORDER)[number];

const CREATABLE_BY: Record<AppRole, AppRole[]> = {
  super_admin: ["master_distributor", "distributor", "retailer", "agent", "super_admin"],
  master_distributor: ["distributor", "retailer", "agent"],
  distributor: ["retailer", "agent"],
  retailer: ["agent"],
  agent: [],
};

const MOBILE_RE = /^[6-9]\d{9}$/;

async function getCallerRoles(supabase: ReturnType<typeof getSupabase>, userId: string): Promise<AppRole[]> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return ((data ?? []) as { role: AppRole }[]).map((r) => r.role);
}
// helper type shim
function getSupabase() {
  // dummy — actual client from ctx
  return null as unknown as {
    from: (t: string) => {
      select: (c: string) => { eq: (k: string, v: unknown) => Promise<{ data: { role: AppRole }[] | null }> };
    };
  };
}

/**
 * Create a downline user. Role hierarchy enforced server-side.
 * Caller must be authenticated and have a role that permits creating targetRole.
 */
export const createDownlineUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z
      .object({
        fullName: z.string().trim().min(2).max(80),
        mobile: z.string().regex(MOBILE_RE),
        email: z.string().trim().email().optional().or(z.literal("")),
        username: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/).optional().or(z.literal("")),
        password: z.string().min(8).max(72).optional().or(z.literal("")),
        role: z.enum(ROLE_ORDER),
        businessName: z.string().trim().max(120).optional().or(z.literal("")),
        city: z.string().trim().max(60).optional().or(z.literal("")),
        state: z.string().trim().max(60).optional().or(z.literal("")),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Caller roles
    const { data: rolesRows } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const callerRoles = ((rolesRows ?? []) as { role: AppRole }[]).map((r) => r.role);
    if (callerRoles.length === 0) throw new Error("No role assigned to caller.");

    const allowed = new Set<AppRole>();
    callerRoles.forEach((r) => CREATABLE_BY[r]?.forEach((t) => allowed.add(t)));
    if (!allowed.has(data.role)) {
      throw new Error(`You are not permitted to create a ${data.role} user.`);
    }

    // Mobile uniqueness
    const { data: dupe } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("mobile", data.mobile)
      .maybeSingle();
    if (dupe) throw new Error("A user with this mobile already exists.");

    const email = (data.email && data.email.length > 0 ? data.email : `${data.mobile}@paysol.local`).toLowerCase();
    const username = data.username && data.username.length > 0 ? data.username.toLowerCase() : null;

    if (username) {
      const { data: unameDupe } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .ilike("username", username)
        .maybeSingle();
      if (unameDupe) throw new Error("This username is already taken.");
    }

    // Create auth user
    const created = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      phone: `+91${data.mobile}`,
      password: data.password && data.password.length > 0 ? data.password : undefined,
      user_metadata: { mobile: data.mobile, full_name: data.fullName },
    });
    if (created.error) throw new Error(created.error.message);
    const newId = created.data.user!.id;

    // Update the auto-provisioned profile (via handle_new_user trigger)
    const { error: upErr } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: data.fullName,
        email,
        username,
        parent_id: context.userId,
        business_name: data.businessName || null,
        city: data.city || null,
        state: data.state || null,
      })
      .eq("id", newId);
    if (upErr) throw new Error(upErr.message);

    // Roles: trigger defaults to 'retailer'. Replace with requested role.
    await supabaseAdmin.from("user_roles").delete().eq("user_id", newId);
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newId, role: data.role });
    if (roleErr) throw new Error(roleErr.message);

    return { ok: true as const, userId: newId };
  });

/**
 * List users directly under the caller (parent_id = caller).
 * Super admin sees everyone.
 */
export const listDownlineUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: rolesRows } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = ((rolesRows ?? []) as { role: AppRole }[]).map((r) => r.role);
    const isSuper = roles.includes("super_admin");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const q = supabaseAdmin
      .from("profiles")
      .select("id, full_name, mobile, email, username, status, kyc_status, business_name, city, state, parent_id, last_login_at, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    const { data: users, error } = isSuper ? await q : await q.eq("parent_id", context.userId);
    if (error) throw new Error(error.message);

    // Load roles for these users
    const ids = (users ?? []).map((u) => u.id);
    const { data: allRoles } = ids.length
      ? await supabaseAdmin.from("user_roles").select("user_id, role").in("user_id", ids)
      : { data: [] as { user_id: string; role: AppRole }[] };
    const roleMap = new Map<string, AppRole[]>();
    (allRoles ?? []).forEach((r) => {
      const list = roleMap.get(r.user_id) ?? [];
      list.push(r.role as AppRole);
      roleMap.set(r.user_id, list);
    });

    const allowedToCreate = new Set<AppRole>();
    roles.forEach((r) => CREATABLE_BY[r]?.forEach((t) => allowedToCreate.add(t)));

    return {
      users: (users ?? []).map((u) => ({ ...u, roles: roleMap.get(u.id) ?? [] })),
      callerRoles: roles,
      creatableRoles: Array.from(allowedToCreate),
    };
  });

/**
 * Toggle status active <-> suspended for a downline user.
 */
export const setUserStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z
      .object({ userId: z.string().uuid(), status: z.enum(["active", "suspended", "pending"]) })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Verify the target is under the caller, unless super_admin
    const { data: rolesRows } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const roles = ((rolesRows ?? []) as { role: AppRole }[]).map((r) => r.role);
    const isSuper = roles.includes("super_admin");
    if (!isSuper) {
      const { data: target } = await supabaseAdmin
        .from("profiles")
        .select("parent_id")
        .eq("id", data.userId)
        .maybeSingle();
      if (!target || target.parent_id !== context.userId) {
        throw new Error("You can only manage users you created.");
      }
    }
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ status: data.status })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
