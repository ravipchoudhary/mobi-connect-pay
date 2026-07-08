import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Plus, ArrowRightLeft, Wallet as WalletIcon, Lock, BadgePercent, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  getMyWalletOverview,
  requestWalletTopup,
  transferBetweenOwnWallets,
} from "@/lib/wallet.functions";

export const Route = createFileRoute("/_app/wallet")({
  component: WalletPage,
});

type Kind = "main" | "commission" | "hold";

const KIND_META: Record<Kind, { title: string; icon: React.ComponentType<{ className?: string }>; tint: string; description: string }> = {
  main: { title: "Main Wallet", icon: WalletIcon, tint: "chart-1", description: "Primary working balance" },
  commission: { title: "Commission Wallet", icon: BadgePercent, tint: "chart-2", description: "Earnings from services" },
  hold: { title: "Hold Wallet", icon: Lock, tint: "chart-3", description: "Reserved for pending settlements" },
};

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function WalletPage() {
  const qc = useQueryClient();
  const overview = useServerFn(getMyWalletOverview);
  const { data, isLoading } = useQuery({ queryKey: ["wallet-overview"], queryFn: () => overview({ data: undefined as never }) });

  // Realtime: refetch when ledger changes for me.
  useEffect(() => {
    const ch = supabase
      .channel("wallet-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "wallet_ledger" }, () => qc.invalidateQueries({ queryKey: ["wallet-overview"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "wallets" }, () => qc.invalidateQueries({ queryKey: ["wallet-overview"] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const wallets = data?.wallets ?? [];
  const ledger = data?.ledger ?? [];
  const byKind = Object.fromEntries(wallets.map((w) => [w.kind as Kind, Number(w.balance)])) as Record<Kind, number>;
  const total = (byKind.main ?? 0) + (byKind.commission ?? 0) + (byKind.hold ?? 0);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 text-white shadow-elegant sm:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md"><WalletIcon className="h-3.5 w-3.5" /> Consolidated balance</div>
            <div className="text-4xl font-semibold sm:text-5xl">{fmt(total)}</div>
            <p className="max-w-lg text-sm text-white/80">Sum of your Main, Commission, and Hold wallets. Ledger is atomic and reconciled in real time.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <TopUpDialog />
            <TransferDialog />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {(Object.keys(KIND_META) as Kind[]).map((k) => (
          <WalletCard key={k} kind={k} amount={byKind[k] ?? 0} loading={isLoading} />
        ))}
      </div>

      <Card className="p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Ledger</h3>
            <p className="text-xs text-muted-foreground">Latest 100 entries · updated live</p>
          </div>
          <Badge variant="secondary" className="rounded-full"><span className="mr-1 h-1.5 w-1.5 rounded-full bg-success" /> Live</Badge>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 font-medium">When</th>
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium">Reference</th>
                <th className="pb-2 text-right font-medium">Amount</th>
                <th className="pb-2 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ledger.length === 0 && !isLoading && (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No transactions yet. Top up your wallet to get started.</td></tr>
              )}
              {ledger.map((l) => (
                <tr key={l.id} className="hover:bg-accent/30">
                  <td className="py-3 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="py-3">{l.description ?? "—"}</td>
                  <td className="py-3 text-xs text-muted-foreground">{l.reference_type ?? "—"}</td>
                  <td className={`py-3 text-right font-medium ${l.direction === "credit" ? "text-success" : "text-destructive"}`}>
                    <span className="inline-flex items-center gap-1">
                      {l.direction === "credit" ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                      {fmt(Number(l.amount))}
                    </span>
                  </td>
                  <td className="py-3 text-right text-muted-foreground">{fmt(Number(l.balance_after))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function WalletCard({ kind, amount, loading }: { kind: Kind; amount: number; loading: boolean }) {
  const m = KIND_META[kind];
  const Icon = m.icon;
  return (
    <Card className="relative overflow-hidden p-6 shadow-md">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl" style={{ background: `var(--${m.tint})` }} />
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-md" style={{ background: `var(--${m.tint})` }}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{m.title}</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight">{loading ? "—" : fmt(amount)}</div>
        <div className="mt-1 text-xs text-muted-foreground">{m.description}</div>
      </div>
    </Card>
  );
}

function TopUpDialog() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("500");
  const qc = useQueryClient();
  const topup = useServerFn(requestWalletTopup);
  const mut = useMutation({
    mutationFn: (amt: number) => topup({ data: { amount: amt } }),
    onSuccess: () => {
      toast.success("Wallet topped up");
      qc.invalidateQueries({ queryKey: ["wallet-overview"] });
      setOpen(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Top-up failed"),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90"><Plus className="h-3.5 w-3.5" /> Add money</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Add money to wallet</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topup-amt">Amount (₹)</Label>
            <Input id="topup-amt" type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <p className="text-xs text-muted-foreground">Dev mode: credits your main wallet instantly. Wire a real gateway from Settings → API.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[500, 1000, 5000, 10000].map((p) => (
              <Button key={p} type="button" variant="outline" size="sm" onClick={() => setAmount(String(p))}>₹{p.toLocaleString("en-IN")}</Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="hero" onClick={() => mut.mutate(Number(amount))} disabled={mut.isPending || !amount || Number(amount) <= 0}>
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Top up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TransferDialog() {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState<Kind>("main");
  const [to, setTo] = useState<Kind>("commission");
  const [amount, setAmount] = useState("100");
  const [note, setNote] = useState("");
  const qc = useQueryClient();
  const transfer = useServerFn(transferBetweenOwnWallets);
  const mut = useMutation({
    mutationFn: () => transfer({ data: { from, to, amount: Number(amount), note: note || undefined } }),
    onSuccess: () => {
      toast.success("Transfer complete");
      qc.invalidateQueries({ queryKey: ["wallet-overview"] });
      setOpen(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Transfer failed"),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/15"><ArrowRightLeft className="h-3.5 w-3.5" /> Transfer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Transfer between wallets</DialogTitle></DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={from} onValueChange={(v) => setFrom(v as Kind)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(KIND_META) as Kind[]).map((k) => <SelectItem key={k} value={k}>{KIND_META[k].title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Select value={to} onValueChange={(v) => setTo(v as Kind)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(KIND_META) as Kind[]).map((k) => <SelectItem key={k} value={k}>{KIND_META[k].title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for transfer" maxLength={200} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="hero" onClick={() => mut.mutate()} disabled={mut.isPending || from === to || !amount || Number(amount) <= 0}>
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
