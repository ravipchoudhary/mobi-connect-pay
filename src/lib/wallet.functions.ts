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

/** Admin/dev helper: top up the current user's main wallet. */
export const requestWalletTopup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z.object({ amount: z.number().positive().max(500_000) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const res = await supabaseAdmin.rpc("wallet_move", {
      _user_id: context.userId,
      _kind: "main",
      _direction: "credit",
      _amount: data.amount,
      _reference_type: "topup",
      _reference_id: crypto.randomUUID(),
      _description: "Wallet top-up (dev)",
    });
    if (res.error) throw new Error(res.error.message);
    return { ok: true as const };
  });
