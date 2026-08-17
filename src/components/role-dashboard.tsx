import { motion } from "framer-motion";
import { ArrowUpRight, BadgePercent, Bell, Briefcase, CreditCard, Landmark, PiggyBank, Receipt, Send, ShieldCheck, Smartphone, TrendingUp, UserPlus, Wallet, Users, FileText, Activity, KeyRound, CircleDollarSign, RefreshCw, Banknote } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { getDemoActivity, getDemoNotifications, getDemoPermissions, getDemoTransactions, getDemoWalletSummary, getDemoSliderImages } from "@/lib/demo-data";
import { ImageSlider } from "@/components/image-slider";

const fmt = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function RoleDashboard() {
  const { primaryRole, profile } = useSession();
  const role = primaryRole ?? "retailer";
  const name = profile?.full_name?.split(" ")[0] ?? "there";
  const transactions = getDemoTransactions();
  const notifications = getDemoNotifications();
  const activity = getDemoActivity();
  const summary = getDemoWalletSummary();
  const permissions = getDemoPermissions().filter((item) => item.role === role);

  if (role === "super_admin") return <SuperAdminDashboard name={name} summary={summary} transactions={transactions} notifications={notifications} activity={activity} permissions={permissions} />;
  if (role === "master_distributor") return <MasterDistributorDashboard name={name} summary={summary} transactions={transactions} notifications={notifications} activity={activity} permissions={permissions} />;
  if (role === "distributor") return <DistributorDashboard name={name} summary={summary} transactions={transactions} notifications={notifications} activity={activity} permissions={permissions} />;
  if (role === "agent") return <AgentDashboard name={name} summary={summary} transactions={transactions} notifications={notifications} activity={activity} permissions={permissions} />;
  return <RetailerDashboard name={name} summary={summary} transactions={transactions} notifications={notifications} activity={activity} permissions={permissions} />;
}

function SuperAdminDashboard({ name, summary, transactions, notifications, activity, permissions }: any) {
  const sliderImages = getDemoSliderImages();
  
  return (
    <div className="space-y-6">
      <Hero title={`Enterprise Control Panel`} subtitle={`Welcome back, ${name}. Manage revenue, users, wallets and settlements from one panel.`} accent="from-indigo-600 to-violet-500" />
      
      {/* Image Slider */}
      {sliderImages.length > 0 && (
        <ImageSlider images={sliderImages} autoPlay={true} autoPlayInterval={6000} />
      )}
      
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Revenue", value: fmt(1280000), icon: CircleDollarSign, tint: "bg-indigo-500" },
          { label: "Today's Revenue", value: fmt(182000), icon: TrendingUp, tint: "bg-emerald-500" },
          { label: "Wallet Balance", value: fmt(640000), icon: Wallet, tint: "bg-amber-500" },
          { label: "System Wallet", value: fmt(2680000), icon: PiggyBank, tint: "bg-sky-500" },
        ].map((item) => (
          <Card key={item.label} className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className={`rounded-xl p-2 text-white ${item.tint}`}><item.icon className="h-4 w-4" /></div>
            </div>
            <div className="mt-3 text-2xl font-semibold">{item.value}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="text-base font-semibold">Live transactions</h3><p className="text-sm text-muted-foreground">Recent activity across the network</p></div>
            <Badge variant="secondary">{summary.txCount} total</Badge>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx: any) => <div key={tx.id} className="flex items-center justify-between rounded-2xl border p-3"><div><div className="font-medium">{tx.type}</div><div className="text-xs text-muted-foreground">{tx.customer} · {tx.reference}</div></div><div className="text-right"><div className="font-semibold">{fmt(tx.amount)}</div><Badge variant={tx.status === "Processed Successfully" ? "default" : tx.status === "Pending" ? "secondary" : "destructive"}>{tx.status}</Badge></div></div>)}
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between"><div><h3 className="text-base font-semibold">Quick actions</h3><p className="text-sm text-muted-foreground">System operations</p></div></div>
          <div className="grid gap-2">
            {[
              { label: "Create User", icon: UserPlus, to: "/users" },
              { label: "Credit Wallet", icon: Wallet, to: "/wallet" },
              { label: "Credit Retailer", icon: Banknote, to: "/credit-retailer" },
              { label: "Approve KYC", icon: ShieldCheck, to: "/kyc" },
              { label: "Settlement Approval", icon: Landmark, to: "/settlement" },
              { label: "Reports", icon: FileText, to: "/reports" },
            ].map((item) => (
              <Button key={item.label} variant="outline" className="justify-start gap-2" asChild><Link to={item.to}><item.icon className="h-4 w-4" />{item.label}</Link></Button>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-5"><h3 className="text-base font-semibold">Recent activity</h3><div className="mt-4 space-y-3">{activity.slice(0, 4).map((item: any) => <div key={item.id} className="rounded-2xl border p-3"><div className="font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.detail}</div><div className="mt-1 text-xs text-muted-foreground">{item.timestamp}</div></div>)}</div></Card>
        <Card className="p-5"><h3 className="text-base font-semibold">Notifications</h3><div className="mt-4 space-y-3">{notifications.slice(0, 4).map((item: any) => <div key={item.id} className="flex items-start gap-2 rounded-2xl border p-3"><Bell className="mt-0.5 h-4 w-4 text-primary" /><div><div className="font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.message}</div></div></div>)}</div></Card>
      </div>
      <Card className="p-5"><h3 className="text-base font-semibold">Permission matrix</h3><div className="mt-4 grid gap-2 md:grid-cols-2">{permissions.map((permission: any) => <div key={permission.id} className="flex items-center justify-between rounded-2xl border p-3"><span>{permission.feature}</span><Badge variant={permission.access ? "default" : "secondary"}>{permission.access ? "Allowed" : "Blocked"}</Badge></div>)}</div></Card>
    </div>
  );
}

function MasterDistributorDashboard({ name, summary, transactions, notifications, activity, permissions }: any) {
  return (
    <div className="space-y-6">
      <Hero title="Master Distributor Control" subtitle={`Welcome back, ${name}. Oversee distributors, wallets and settlements.`} accent="from-emerald-600 to-lime-500" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Wallet", value: fmt(560000), icon: Wallet },
          { label: "Commission", value: fmt(182500), icon: BadgePercent },
          { label: "Settlement", value: fmt(325000), icon: Landmark },
          { label: "Distributors", value: "24", icon: Users },
        ].map((item) => (
          <Card key={item.label} className="p-5"><div className="flex items-center justify-between"><div className="text-sm text-muted-foreground">{item.label}</div><div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600"><item.icon className="h-4 w-4" /></div></div><div className="mt-3 text-2xl font-semibold">{item.value}</div></Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-5"><h3 className="text-base font-semibold">Distributor pipeline</h3><div className="mt-4 space-y-3">{transactions.slice(0, 4).map((tx: any) => <div key={tx.id} className="flex items-center justify-between rounded-2xl border p-3"><div><div className="font-medium">{tx.customer}</div><div className="text-xs text-muted-foreground">{tx.type} · {tx.reference}</div></div><div className="font-semibold">{fmt(tx.amount)}</div></div>)}</div></Card>
        <Card className="p-5"><h3 className="text-base font-semibold">Quick actions</h3><div className="mt-4 grid gap-2">{[
          { label: "Create Distributor", icon: UserPlus, to: "/users" },
          { label: "Distributor Wallet", icon: Wallet, to: "/wallet" },
          { label: "Reports", icon: FileText, to: "/reports" },
          { label: "Settlement", icon: Landmark, to: "/settlement" },
        ].map((item) => <Button key={item.label} variant="outline" className="justify-start gap-2" asChild><Link to={item.to}><item.icon className="h-4 w-4" />{item.label}</Link></Button> )}</div></Card>
      </div>
      <Card className="p-5"><h3 className="text-base font-semibold">Recent activity</h3><div className="mt-4 space-y-3">{activity.slice(0, 3).map((item: any) => <div key={item.id} className="rounded-2xl border p-3"><div className="font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.detail}</div></div>)}</div></Card>
      <Card className="p-5"><h3 className="text-base font-semibold">Permissions</h3><div className="mt-4 grid gap-2 md:grid-cols-2">{permissions.map((permission: any) => <div key={permission.id} className="rounded-2xl border p-3 flex items-center justify-between"><span>{permission.feature}</span><Badge variant={permission.access ? "default" : "secondary"}>{permission.access ? "Allowed" : "Blocked"}</Badge></div>)}</div></Card>
    </div>
  );
}

function DistributorDashboard({ name, summary, transactions, notifications, activity, permissions }: any) {
  return (
    <div className="space-y-6">
      <Hero title="Distributor Operations" subtitle={`Welcome back, ${name}. Support retailers and manage wallet requests.`} accent="from-sky-600 to-cyan-500" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Wallet", value: fmt(220000), icon: Wallet },
          { label: "Commission", value: fmt(84500), icon: BadgePercent },
          { label: "Settlement", value: fmt(126000), icon: Landmark },
          { label: "Retailers", value: "18", icon: Users },
        ].map((item) => (
          <Card key={item.label} className="p-5"><div className="flex items-center justify-between"><div className="text-sm text-muted-foreground">{item.label}</div><div className="rounded-xl bg-sky-500/10 p-2 text-sky-600"><item.icon className="h-4 w-4" /></div></div><div className="mt-3 text-2xl font-semibold">{item.value}</div></Card>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-5"><h3 className="text-base font-semibold">Retailer requests</h3><div className="mt-4 space-y-3">{transactions.slice(0, 4).map((tx: any) => <div key={tx.id} className="flex items-center justify-between rounded-2xl border p-3"><div><div className="font-medium">{tx.customer}</div><div className="text-xs text-muted-foreground">{tx.type} · {tx.reference}</div></div><Badge variant={tx.status === "Pending" ? "secondary" : "default"}>{tx.status}</Badge></div>)}</div></Card>
        <Card className="p-5"><h3 className="text-base font-semibold">Quick actions</h3><div className="mt-4 grid gap-2">{[
          { label: "Create Retailer", icon: UserPlus, to: "/users" },
          { label: "Retailer Reports", icon: FileText, to: "/reports" },
          { label: "Wallet Requests", icon: Wallet, to: "/wallet" },
          { label: "Settlement", icon: Landmark, to: "/settlement" },
        ].map((item) => <Button key={item.label} variant="outline" className="justify-start gap-2" asChild><Link to={item.to}><item.icon className="h-4 w-4" />{item.label}</Link></Button> )}</div></Card>
      </div>
      <Card className="p-5"><h3 className="text-base font-semibold">Notifications</h3><div className="mt-4 space-y-3">{notifications.slice(0, 3).map((item: any) => <div key={item.id} className="rounded-2xl border p-3"><div className="font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.message}</div></div>)}</div></Card>
    </div>
  );
}

function RetailerDashboard({ name, summary, transactions, notifications, activity, permissions }: any) {
  const services = [
    { title: "Recharge", icon: Smartphone, gradient: "from-orange-500 to-amber-400", desc: "Mobile, DTH & FASTag" },
    { title: "BBPS", icon: Receipt, gradient: "from-sky-500 to-cyan-400", desc: "Electricity, water, gas" },
    { title: "AEPS", icon: CreditCard, gradient: "from-violet-600 to-fuchsia-500", desc: "Cash withdrawal & deposit" },
    { title: "DMT 2", icon: Banknote, gradient: "from-emerald-500 to-green-400", desc: "Bank transfer with approval" },
    { title: "Money Transfer", icon: Send, gradient: "from-emerald-500 to-green-400", desc: "DMT, IMPS, NEFT" },
    { title: "Travel", icon: Briefcase, gradient: "from-pink-500 to-rose-400", desc: "Bus, rail & flights" },
    { title: "Insurance", icon: ShieldCheck, gradient: "from-indigo-500 to-blue-400", desc: "Health, motor, LIC" },
    { title: "PAN", icon: FileText, gradient: "from-slate-700 to-slate-500", desc: "Cards & correction" },
    { title: "Wallet", icon: Wallet, gradient: "from-amber-500 to-orange-500", desc: "Transfers & statements" },
    { title: "Reports", icon: Activity, gradient: "from-teal-500 to-emerald-400", desc: "Daily & monthly" },
    { title: "Support", icon: Bell, gradient: "from-rose-500 to-pink-400", desc: "Tickets & alerts" },
  ];
  return (
    <div className="space-y-6">
      <Hero title="Retailer Home" subtitle={`Welcome back, ${name}. Launch services instantly from your business dashboard.`} accent="from-rose-600 to-orange-500" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Wallet Balance", value: fmt(124500), icon: Wallet },
          { label: "Today Revenue", value: fmt(37500), icon: TrendingUp },
          { label: "Pending Settlements", value: fmt(12800), icon: Landmark },
          { label: "Open Tickets", value: "3", icon: Bell },
        ].map((item) => <Card key={item.label} className="p-5"><div className="flex items-center justify-between"><div className="text-sm text-muted-foreground">{item.label}</div><div className="rounded-xl bg-rose-500/10 p-2 text-rose-600"><item.icon className="h-4 w-4" /></div></div><div className="mt-3 text-2xl font-semibold">{item.value}</div></Card>)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {services.map((service) => (
          <motion.div key={service.title} whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
            <Link to={service.title === "Recharge" ? "/recharge" : service.title === "BBPS" ? "/bbps" : service.title === "AEPS" ? "/aeps" : service.title === "DMT 2" ? "/dmt2" : service.title === "Money Transfer" ? "/dmt" : service.title === "Wallet" ? "/wallet" : service.title === "Reports" ? "/reports" : service.title === "Support" ? "/support" : "/dashboard"}>
              <Card className={`overflow-hidden border-0 bg-linear-to-br ${service.gradient} p-0 text-white shadow-lg`}>
                <div className="flex h-full flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur"><service.icon className="h-5 w-5" /></div>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <p className="mt-1 text-sm text-white/80">{service.desc}</p>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-5"><h3 className="text-base font-semibold">Recent transactions</h3><div className="mt-4 space-y-3">{transactions.slice(0, 4).map((tx: any) => <div key={tx.id} className="flex items-center justify-between rounded-2xl border bg-white/70 p-3 dark:bg-card"><div><div className="font-medium">{tx.type}</div><div className="text-xs text-muted-foreground">{tx.customer}</div></div><div className="text-right"><div className="font-semibold">{fmt(tx.amount)}</div><Badge variant={tx.status === "Success" ? "default" : tx.status === "Pending" ? "secondary" : "destructive"}>{tx.status}</Badge></div></div>)}</div></Card>
        <Card className="p-5"><h3 className="text-base font-semibold">Quick launch</h3><div className="mt-4 grid gap-2">{[
          { label: "Recharge", icon: Smartphone, to: "/recharge" },
          { label: "BBPS", icon: Receipt, to: "/bbps" },
          { label: "AEPS", icon: CreditCard, to: "/aeps" },
          { label: "DMT 2", icon: Banknote, to: "/dmt2" },
          { label: "Wallet", icon: Wallet, to: "/wallet" },
          { label: "Support", icon: Bell, to: "/support" },
        ].map((item) => <Button key={item.label} variant="outline" className="justify-start gap-2" asChild><Link to={item.to}><item.icon className="h-4 w-4" />{item.label}</Link></Button> )}</div></Card>
      </div>
    </div>
  );
}

function AgentDashboard({ name, summary, transactions, notifications, activity, permissions }: any) {
  return (
    <div className="space-y-6">
      <Hero title="Agent Quick Desk" subtitle={`Welcome back, ${name}. Handle quick cash-outs and recharges with speed.`} accent="from-amber-600 to-orange-500" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Wallet", value: fmt(54000), icon: Wallet },
          { label: "Quick Recharge", value: "24", icon: Smartphone },
          { label: "Quick BBPS", value: "11", icon: Receipt },
          { label: "Quick AEPS", value: "7", icon: CreditCard },
        ].map((item) => <Card key={item.label} className="p-5"><div className="flex items-center justify-between"><div className="text-sm text-muted-foreground">{item.label}</div><div className="rounded-xl bg-amber-500/10 p-2 text-amber-600"><item.icon className="h-4 w-4" /></div></div><div className="mt-3 text-2xl font-semibold">{item.value}</div></Card>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="p-5"><h3 className="text-base font-semibold">Recent transactions</h3><div className="mt-4 space-y-3">{transactions.slice(0, 5).map((tx: any) => <div key={tx.id} className="flex items-center justify-between rounded-2xl border p-3"><div><div className="font-medium">{tx.customer}</div><div className="text-xs text-muted-foreground">{tx.type}</div></div><div className="text-right"><div className="font-semibold">{fmt(tx.amount)}</div><Badge>{tx.status}</Badge></div></div>)}</div></Card>
        <Card className="p-5"><h3 className="text-base font-semibold">Quick actions</h3><div className="mt-4 grid gap-2">{[
          { label: "Quick Recharge", icon: Smartphone, to: "/recharge" },
          { label: "Quick BBPS", icon: Receipt, to: "/bbps" },
          { label: "Quick AEPS", icon: CreditCard, to: "/aeps" },
          { label: "DMT 2", icon: Banknote, to: "/dmt2" },
          { label: "Wallet", icon: Wallet, to: "/wallet" },
        ].map((item) => <Button key={item.label} variant="outline" className="justify-start gap-2" asChild><Link to={item.to}><item.icon className="h-4 w-4" />{item.label}</Link></Button> )}</div></Card>
      </div>
      <Card className="p-5"><h3 className="text-base font-semibold">Notifications</h3><div className="mt-4 space-y-3">{notifications.slice(0, 3).map((item: any) => <div key={item.id} className="rounded-2xl border p-3"><div className="font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.message}</div></div>)}</div></Card>
    </div>
  );
}

function Hero({ title, subtitle, accent }: { title: string; subtitle: string; accent: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`overflow-hidden rounded-3xl bg-linear-to-r ${accent} p-6 text-white shadow-lg`}>
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-white/80">{subtitle}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur"><RefreshCw className="h-4 w-4" /> Live business portal</div>
      </div>
    </motion.div>
  );
}
