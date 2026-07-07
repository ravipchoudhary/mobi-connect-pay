import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

const salesData = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}`,
  volume: 40000 + Math.round(Math.sin(i / 2) * 15000 + Math.random() * 20000),
  revenue: 4000 + Math.round(Math.cos(i / 2.5) * 1200 + Math.random() * 1800),
}));

const serviceMix = [
  { name: "Recharge", value: 38, color: "var(--chart-1)" },
  { name: "BBPS", value: 22, color: "var(--chart-2)" },
  { name: "AEPS", value: 18, color: "var(--chart-3)" },
  { name: "DMT", value: 15, color: "var(--chart-4)" },
  { name: "Others", value: 7, color: "var(--chart-5)" },
];

const monthlyRevenue = Array.from({ length: 8 }, (_, i) => ({
  m: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"][i],
  r: 120000 + Math.round(Math.random() * 90000),
}));

const recent = [
  { id: "TXN10293", service: "Recharge", amount: 349, status: "success", when: "2 min ago", who: "+91 98•••432" },
  { id: "TXN10292", service: "BBPS · Electricity", amount: 1249, status: "success", when: "8 min ago", who: "APDCL" },
  { id: "TXN10291", service: "AEPS Withdraw", amount: 5000, status: "pending", when: "14 min ago", who: "•••4421" },
  { id: "TXN10290", service: "DMT", amount: 15000, status: "success", when: "22 min ago", who: "HDFC" },
  { id: "TXN10289", service: "Recharge DTH", amount: 499, status: "failed", when: "34 min ago", who: "Tata Sky" },
];

function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <HeroBanner name={user?.fullName ?? "there"} balance={user?.walletBalance ?? 0} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Receipt} label="Today's Transactions" value="1,284" delta="+12.4%" up tint="chart-1" />
        <StatCard icon={IndianRupee} label="Today's Revenue" value="₹42,180" delta="+8.1%" up tint="chart-2" />
        <StatCard icon={TrendingUp} label="Monthly Volume" value="₹18.4L" delta="+21.3%" up tint="chart-4" />
        <StatCard icon={Clock} label="Pending Settlements" value="₹1.24L" delta="-3.2%" tint="chart-3" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight">Transaction volume</h3>
              <p className="text-xs text-muted-foreground">Last 14 days · updated live</p>
            </div>
            <Badge variant="secondary" className="rounded-full">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-success" /> Live
            </Badge>
          </div>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer>
              <AreaChart data={salesData}>
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
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="volume" stroke="var(--chart-1)" strokeWidth={2} fill="url(#vol)" />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-2)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 shadow-md">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Service mix</h3>
            <p className="text-xs text-muted-foreground">Share by transaction count</p>
          </div>
          <div className="mt-2 h-56 w-full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={serviceMix}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {serviceMix.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
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
              <h3 className="text-base font-semibold tracking-tight">Recent transactions</h3>
              <p className="text-xs text-muted-foreground">Across all services</p>
            </div>
            <Button variant="ghost" size="sm">
              View all <ArrowUpRightFromSquare className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-4 divide-y divide-border">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-4 py-3">
                <StatusDot status={t.status} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{t.service}</span>
                    <span className="text-xs text-muted-foreground">· {t.who}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{t.id} · {t.when}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">₹{t.amount.toLocaleString("en-IN")}</div>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-md">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Monthly revenue</h3>
            <p className="text-xs text-muted-foreground">Last 8 months</p>
          </div>
          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 6" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
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
  const firstName = name.split(" ")[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 text-white shadow-elegant sm:p-8"
    >
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
            <Zap className="h-3 w-3" /> All systems operational
          </div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Welcome back, {firstName} 👋</h1>
          <p className="max-w-lg text-sm text-white/80">
            Here's a quick look at your business today. Your wallet is topped up and all services are live.
          </p>
        </div>
        <div className="min-w-[260px] rounded-2xl bg-white/10 p-5 backdrop-blur-lg">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
            <Wallet className="h-3.5 w-3.5" /> Wallet Balance
          </div>
          <div className="mt-1 text-3xl font-semibold">
            ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white text-primary hover:bg-white/90">
              <Plus className="h-3.5 w-3.5" /> Add money
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/15">
              Transfer
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  up,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  up?: boolean;
  tint: string;
}) {
  return (
    <Card className="group relative overflow-hidden p-5 shadow-md transition hover:shadow-elegant">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition group-hover:opacity-30" style={{ background: `var(--${tint})` }} />
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-md" style={{ background: `var(--${tint})` }}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
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

function StatusDot({ status }: { status: string }) {
  const map: Record<string, { bg: string; icon: React.ComponentType<{ className?: string }> }> = {
    success: { bg: "bg-success/15 text-success", icon: CheckCircle2 },
    pending: { bg: "bg-warning/15 text-warning", icon: Clock },
    failed: { bg: "bg-destructive/15 text-destructive", icon: XCircle },
  };
  const s = map[status];
  const I = s.icon;
  return (
    <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg}`}>
      <I className="h-5 w-5" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    success: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    failed: "bg-destructive/10 text-destructive",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${map[status]}`}>{status}</span>;
}

function QuickActions() {
  const actions = [
    { icon: Smartphone, label: "Mobile Recharge", tint: "chart-1" },
    { icon: Receipt, label: "Pay Bill", tint: "chart-2" },
    { icon: Fingerprint, label: "AEPS", tint: "chart-3" },
    { icon: Send, label: "Money Transfer", tint: "chart-4" },
    { icon: Wallet, label: "Add Money", tint: "chart-5" },
  ];
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Quick actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {actions.map((a) => (
          <button
            key={a.label}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-md transition group-hover:scale-110" style={{ background: `var(--${a.tint})` }}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="text-sm font-medium">{a.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
