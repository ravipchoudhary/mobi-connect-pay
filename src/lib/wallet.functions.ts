import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Load all wallets + last 100 ledger entries for the current user. */
export const getMyWalletOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ data: wallets }, { data: ledger }] = await Promise.all([
      context.supabase.from("wallets").select("*").eq("user_id", context.userId),
      context.supabase
        .from("wallet_ledger")
        .select("*")
        .eq("user_id", context.userId)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    return { wallets: wallets ?? [], ledger: ledger ?? [] };
  });

/** Transfer money between two wallets belonging to the same user. */
export const transferBetweenOwnWallets = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ref = crypto.randomUUID();
    const debit = await supabaseAdmin.rpc("wallet_move", {
      _user_id: context.userId,
      _kind: data.from,
      _direction: "debit",
      _amount: data.amount,
      _reference_type: "wallet_transfer",
      _reference_id: ref,
      _description: data.note ?? `Transfer ${data.from} → ${data.to}`,
    });
    if (debit.error) throw new Error(debit.error.message);
    const credit = await supabaseAdmin.rpc("wallet_move", {
      _user_id: context.userId,
      _kind: data.to,
      _direction: "credit",
      _amount: data.amount,
      _reference_type: "wallet_transfer",
      _reference_id: ref,
      _description: data.note ?? `Transfer ${data.from} → ${data.to}`,
    });
    if (credit.error) {
      // best-effort rollback
      await supabaseAdmin.rpc("wallet_move", {
        _user_id: context.userId,
        _kind: data.from,
        _direction: "credit",
        _amount: data.amount,
        _reference_type: "wallet_transfer",
        _reference_id: ref,
        _description: "Rollback of failed transfer",
      });
      throw new Error(credit.error.message);
    }
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
  .inputValidator((raw) =>
    z
      .object({
        amount: z.number().positive().max(500_000),
        targetUserId: z.string().uuid().optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    // Verify caller is an admin (super_admin/support/auditor).
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isAdmin = (roles ?? []).some((r) => ["super_admin", "support"].includes(r.role));
    if (!isAdmin) {
      throw new Error(
        "Wallet top-up requires a verified payment. Contact your administrator or complete the payment flow.",
      );
    }
    const userId = data.targetUserId ?? context.userId;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const res = await supabaseAdmin.rpc("wallet_move", {
      _user_id: userId,
      _kind: "main",
      _direction: "credit",
      _amount: data.amount,
      _reference_type: "admin_topup",
      _reference_id: crypto.randomUUID(),
      _description: `Admin credit by ${context.userId}`,
    });
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const };
  });
