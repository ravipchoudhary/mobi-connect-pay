import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLocalUser, listLocalUsers, updateLocalUserStatus } from "@/lib/local-store";
import { resolveCallerRoles } from "@/lib/role-utils";

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


/**
 * Create a downline user. Role hierarchy enforced server-side.
 * Caller must be authenticated and have a role that permits creating targetRole.
 */
export const createDownlineUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw) =>
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
    const callerRoles = await resolveCallerRoles(context as { userId: string; claims?: Record<string, unknown> });
    const isSuper = callerRoles.includes("super_admin");
    const allowed = new Set<AppRole>();
    if (isSuper) {
      ROLE_ORDER.forEach((role) => allowed.add(role));
    } else {
      callerRoles.forEach((r) => CREATABLE_BY[r]?.forEach((t) => allowed.add(t)));
    }
    if (!allowed.has(data.role)) {
      throw new Error(`You are not permitted to create a ${data.role} user.`);
    }

    if (listLocalUsers().some((u) => u.mobile === data.mobile)) {
      throw new Error("A user with this mobile already exists.");
    }

    const email = (data.email && data.email.length > 0 ? data.email : `${data.mobile}@paysol.local`).toLowerCase();
    const username = data.username && data.username.length > 0 ? data.username.toLowerCase() : null;

    if (username && listLocalUsers().some((u) => u.username === username)) {
      throw new Error("This username is already taken.");
    }

    const newUser = createLocalUser({
      full_name: data.fullName,
      mobile: data.mobile,
      email,
      username,
      status: "active",
      kyc_status: "pending",
      business_name: data.businessName || null,
      city: data.city || null,
      state: data.state || null,
      parent_id: context.userId,
      roles: [data.role],
    });

    return { ok: true as const, userId: newUser.id };
  });

/**
 * List users directly under the caller (parent_id = caller).
 * Super admin sees everyone.
 */
export const listDownlineUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await resolveCallerRoles(context as { userId: string; claims?: Record<string, unknown> });
    const isSuper = roles.includes("super_admin");

    const users = (isSuper ? listLocalUsers() : listLocalUsers().filter((u) => u.parent_id === context.userId)).map((u) => ({
      ...u,
      roles: u.roles,
    }));

    const allowedToCreate = new Set<AppRole>();
    if (isSuper) {
      ROLE_ORDER.forEach((role) => allowedToCreate.add(role));
    } else {
      roles.forEach((r) => CREATABLE_BY[r]?.forEach((t) => allowedToCreate.add(t)));
    }

    return {
      users,
      callerRoles: roles,
      creatableRoles: Array.from(allowedToCreate),
    };
  });

/**
 * Toggle status active <-> suspended for a downline user.
 */
export const setUserStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw) =>
    z
      .object({ userId: z.string().uuid(), status: z.enum(["active", "suspended", "inactive"]) })
      .parse(raw),
  )

  .handler(async ({ data, context }) => {
    const roles = await resolveCallerRoles(context as { userId: string; claims?: Record<string, unknown> });
    const isSuper = roles.includes("super_admin");
    if (!isSuper) {
      const target = listLocalUsers().find((u) => u.id === data.userId);
      if (!target || target.parent_id !== context.userId) {
        throw new Error("You can only manage users you created.");
      }
    }
    updateLocalUserStatus(data.userId, data.status);
    return { ok: true as const };
  });
