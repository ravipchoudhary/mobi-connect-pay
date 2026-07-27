import { ensureLocalSession, findLocalUserById } from "@/lib/local-store";

export type AppRole = "super_admin" | "master_distributor" | "distributor" | "retailer" | "agent" | "support" | "auditor";

const KNOWN_ROLES: AppRole[] = [
  "super_admin",
  "master_distributor",
  "distributor",
  "retailer",
  "agent",
  "support",
  "auditor",
];

function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && KNOWN_ROLES.includes(value as AppRole);
}

function normalizeRole(value: unknown): AppRole[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.flatMap((entry) => normalizeRole(entry));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return isAppRole(trimmed) ? [trimmed] : [];
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return [record.role, record.roles, record.app_metadata, record.user_metadata]
      .flatMap((entry) => normalizeRole(entry));
  }

  return [];
}

export async function resolveCallerRoles(context: { userId: string; claims?: Record<string, unknown> }): Promise<AppRole[]> {
  const seen = new Set<AppRole>();
  const add = (role: unknown) => {
    normalizeRole(role).forEach((value) => seen.add(value));
  };

  if (context.claims) {
    add(context.claims.role);
    add(context.claims.roles);
    add((context.claims as Record<string, unknown>).app_metadata);
    add((context.claims as Record<string, unknown>).user_metadata);
  }

  if (seen.size > 0) {
    return Array.from(seen);
  }

  const localUser = findLocalUserById(context.userId);
  if (localUser?.roles?.length) {
    return localUser.roles;
  }

  const localSession = ensureLocalSession();
  if (localSession?.userId) {
    const fallbackUser = findLocalUserById(localSession.userId);
    if (fallbackUser?.roles?.length) {
      return fallbackUser.roles;
    }
  }

  return [];
}
