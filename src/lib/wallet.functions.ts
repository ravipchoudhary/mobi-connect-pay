import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { applyLocalWalletMove, getLocalWalletSummary, listLocalUsers } from "@/lib/local-store";
import { resolveCallerRoles } from "@/lib/role-utils";

/** Load all wallets + last 100 ledger entries for the current user. */
export const getMyWalletOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return getLocalWalletSummary(context.userId);
  });

/** Transfer money between two wallets belonging to the same user. */
export const transferBetweenOwnWallets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw) =>
    z
      .object({
        from: z.enum(["main", "commission", "hold"]),
        to: z.enum(["main", "commission", "hold"]),
        amount: z.number().positive().max(1_000_000),
        note: z.string().max(200).optional(),
      })
      .refine((d) => d.from !== d.to, { message: "Source and destination must differ" })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const ref = crypto.randomUUID();
    applyLocalWalletMove(context.userId, data.from, "debit", data.amount, "wallet_transfer", ref, data.note ?? `Transfer ${data.from} → ${data.to}`);
    applyLocalWalletMove(context.userId, data.to, "credit", data.amount, "wallet_transfer", ref, data.note ?? `Transfer ${data.from} → ${data.to}`);
    return { ok: true as const };
  });

/**
 * Admin-initiated wallet credit. Regular users cannot self-credit — a real
 * payment gateway must call an authenticated webhook that verifies a captured
 * payment before invoking this function. This admin path exists only so
 * super_admins/support can settle reconciliation cases manually.
 */
export const requestWalletTopup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw) =>
    z
      .object({
        amount: z.number().positive().max(500_000),
        targetUserId: z.string().uuid().optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const roles = await resolveCallerRoles(context as { userId: string; claims?: Record<string, unknown> });
    const isAdmin = roles.some((r) => ["super_admin", "support"].includes(r));
    if (!isAdmin) {
      throw new Error("Wallet top-up requires a verified payment. Contact your administrator or complete the payment flow.");
    }
    const userId = data.targetUserId ?? context.userId;
    applyLocalWalletMove(userId, "main", "credit", data.amount, "admin_topup", crypto.randomUUID(), `Admin credit by ${context.userId}`);
    return { ok: true as const };
  });

export const listVerifiedRetailersForCredit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const roles = await resolveCallerRoles(context as { userId: string; claims?: Record<string, unknown> });
    const isAdmin = roles.some((r) => ["super_admin", "support"].includes(r));
    if (!isAdmin) {
      throw new Error("Only admins can view verified retailers for wallet credits.");
    }

    const retailers = listLocalUsers()
      .filter((user) => user.kyc_status === "approved" && user.roles.includes("retailer"))
      .map((user) => ({
        id: user.id,
        full_name: user.full_name,
        mobile: user.mobile,
        business_name: user.business_name,
        kyc_status: user.kyc_status,
        balance: getLocalWalletSummary(user.id).wallets.find((w) => w.kind === "main")?.balance ?? 0,
      }));

    return { retailers };
  });

export const creditVerifiedRetailerWallet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw) =>
    z
      .object({
        targetUserId: z.string().uuid(),
        amount: z.number().positive().max(500_000),
        note: z.string().max(200).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const roles = await resolveCallerRoles(context as { userId: string; claims?: Record<string, unknown> });
    const isAdmin = roles.some((r) => ["super_admin", "support"].includes(r));
    if (!isAdmin) {
      throw new Error("Only admins can credit verified retailers.");
    }

    const targetProfile = listLocalUsers().find((user) => user.id === data.targetUserId);
    if (!targetProfile || targetProfile.kyc_status !== "approved") {
      throw new Error("Only KYC-approved retailers can receive wallet credits.");
    }

    if (!targetProfile.roles.includes("retailer")) {
      throw new Error("Wallet credit is allowed only for retailer accounts.");
    }

    applyLocalWalletMove(data.targetUserId, "main", "credit", data.amount, "admin_retailer_credit", crypto.randomUUID(), data.note ?? `Retailer wallet credit by ${context.userId}`);
    return { ok: true as const };
  });
