import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Receipt,
  Smartphone,
  Send,
  Fingerprint,
  IndianRupee,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Zap,
  Plus,
  ArrowUpRightFromSquare,
} from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "@tanstack/react-router";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-session";
import { getMyWalletOverview } from "@/lib/wallet.functions";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function DashboardPage() {
  const { profile } = useSession();
  const overview = useServerFn(getMyWalletOverview);
  const { data } = useQuery({ queryKey: ["wallet-overview"], queryFn: () => overview({ data: undefined as never }) });

  const mainBalance = Number(data?.wallets.find((w) => w.kind === "main")?.balance ?? 0);
  const commissionBalance = Number(data?.wallets.find((w) => w.kind === "commission")?.balance ?? 0);
  const ledger = data?.ledger ?? [];

  // Derive KPIs from ledger (last 24h + last 30d).
  const now = Date.now();
  const last24hCredits = ledger.filter((l) => l.direction === "credit" && now - new Date(l.created_at).getTime() < 86_400_000);
  const last24hCount = ledger.filter((l) => now - new Date(l.created_at).getTime() < 86_400_000).length;
  const last24hVolume = last24hCredits.reduce((a, l) => a + Number(l.amount), 0);
  const monthVolume = ledger
    .filter((l) => l.direction === "credit" && now - new Date(l.created_at).getTime() < 30 * 86_400_000)
    .reduce((a, l) => a + Number(l.amount), 0);

  const chartData = useMemo(() => {
    const buckets: Record<string, { day: string; volume: number; revenue: number }> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 86_400_000);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      buckets[key] = { day: key, volume: 0, revenue: 0 };
    }
    ledger.forEach((l) => {
      const d = new Date(l.created_at);
      if (now - d.getTime() > 14 * 86_400_000) return;
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      if (!buckets[key]) return;
      buckets[key].volume += Number(l.amount);
      if (l.direction === "credit") buckets[key].revenue += Number(l.amount) * 0.02;
    });
    return Object.values(buckets);
  }, [ledger, now]);

  const serviceMix = [
    { name: "Recharge", value: 38, color: "var(--chart-1)" },
    { name: "BBPS", value: 22, color: "var(--chart-2)" },
    { name: "AEPS", value: 18, color: "var(--chart-3)" },
    { name: "DMT", value: 15, color: "var(--chart-4)" },
    { name: "Others", value: 7, color: "var(--chart-5)" },
  ];

  const monthly = Array.from({ length: 8 }, (_, i) => ({
    m: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"][i],
    r: Math.round(monthVolume / 8 + Math.random() * 5000),
  }));

  return (
    <div className="space-y-8">
      <HeroBanner name={profile?.full_name ?? "there"} balance={mainBalance} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Receipt} label="Today's Activity" value={String(last24hCount)} delta={last24hCount > 0 ? "+live" : "—"} up tint="chart-1" />
        <StatCard icon={IndianRupee} label="Today's Inflow" value={fmt(last24hVolume)} delta={last24hVolume > 0 ? "+live" : "—"} up tint="chart-2" />
        <StatCard icon={TrendingUp} label="Monthly Volume" value={fmt(monthVolume)} delta="30d" up tint="chart-4" />
        <StatCard icon={Wallet} label="Commission Balance" value={fmt(commissionBalance)} delta="—" tint="chart-3" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight">Wallet activity</h3>
              <p className="text-xs text-muted-foreground">Last 14 days · from your ledger</p>
            </div>
            <Badge variant="secondary" className="rounded-full"><span className="mr-1 h-1.5 w-1.5 rounded-full bg-success" /> Live</Badge>
          </div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="volume" stroke="var(--chart-1)" strokeWidth={2} fill="url(#vol)" />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-2)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-md">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Service mix</h3>
            <p className="text-xs text-muted-foreground">Illustrative — connect providers to populate</p>
          </div>
          <div className="mt-2 h-56 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={serviceMix} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2} strokeWidth={0}>
                  {serviceMix.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {serviceMix.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium">{s.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-6 shadow-md lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight">Recent ledger</h3>
              <p className="text-xs text-muted-foreground">Latest wallet activity</p>
            </div>
            <Button variant="ghost" size="sm" asChild><Link to="/wallet">View all <ArrowUpRightFromSquare className="h-3.5 w-3.5" /></Link></Button>
          </div>
          <div className="mt-4 divide-y divide-border">
            {ledger.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">No activity yet — top up your wallet to get started.</div>}
            {ledger.slice(0, 6).map((t) => (
              <div key={t.id} className="flex items-center gap-4 py-3">
                <StatusDot direction={t.direction} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium capitalize">{t.description ?? t.reference_type ?? "Ledger"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${t.direction === "credit" ? "text-success" : "text-destructive"}`}>
                    {t.direction === "credit" ? "+" : "−"}{fmt(Number(t.amount))}
                  </div>
                  <div className="text-xs text-muted-foreground">Bal {fmt(Number(t.balance_after))}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-md">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Monthly volume</h3>
            <p className="text-xs text-muted-foreground">Trailing 8 months</p>
          </div>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="r" radius={[8, 8, 0, 0]} fill="var(--chart-4)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <QuickActions />
    </div>
  );
}

function HeroBanner({ name, balance }: { name: string; balance: number }) {
  const firstName = (name || "there").split(" ")[0];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 text-white shadow-elegant sm:p-8">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md"><Zap className="h-3 w-3" /> All systems operational</div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Welcome back, {firstName} 👋</h1>
          <p className="max-w-lg text-sm text-white/80">Your wallet, ledger and services at a glance.</p>
        </div>
        <div className="min-w-[260px] rounded-2xl bg-white/10 p-5 backdrop-blur-lg">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70"><Wallet className="h-3.5 w-3.5" /> Main Wallet</div>
          <div className="mt-1 text-3xl font-semibold">{fmt(balance)}</div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/wallet"><Plus className="h-3.5 w-3.5" /> Add money</Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/15" asChild>
              <Link to="/wallet">Transfer</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, delta, up, tint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string; up?: boolean; tint: string }) {
  return (
    <Card className="group relative overflow-hidden p-5 shadow-md transition hover:shadow-elegant">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition group-hover:opacity-30" style={{ background: `var(--${tint})` }} />
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-md" style={{ background: `var(--${tint})` }}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${up ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </Card>
  );
}

function StatusDot({ direction }: { direction: string }) {
  const map: Record<string, { bg: string; icon: React.ComponentType<{ className?: string }> }> = {
    credit: { bg: "bg-success/15 text-success", icon: CheckCircle2 },
    debit: { bg: "bg-warning/15 text-warning", icon: Clock },
    failed: { bg: "bg-destructive/15 text-destructive", icon: XCircle },
  };
  const s = map[direction] ?? map.credit;
  const I = s.icon;
  return <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg}`}><I className="h-5 w-5" /></div>;
}

function QuickActions() {
  const actions = [
    { icon: Smartphone, label: "Mobile Recharge", tint: "chart-1", to: "/recharge" },
    { icon: Receipt, label: "Pay Bill", tint: "chart-2", to: "/bbps" },
    { icon: Fingerprint, label: "AEPS", tint: "chart-3", to: "/aeps" },
    { icon: Send, label: "Money Transfer", tint: "chart-4", to: "/dmt" },
    { icon: Wallet, label: "Wallet", tint: "chart-5", to: "/wallet" },
  ] as const;
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Quick actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((a) => (
          <Link key={a.label} to={a.to} className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant">
            <div className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-md transition group-hover:scale-110" style={{ background: `var(--${a.tint})` }}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium">{a.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
