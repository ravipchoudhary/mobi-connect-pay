import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BadgePercent, Search, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getDemoTransactions } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/commission")({
  component: CommissionPage,
});

function CommissionPage() {
  const transactions = getDemoTransactions();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => transactions.filter((item) => [item.type, item.customer, item.reference].join(" ").toLowerCase().includes(query.toLowerCase())), [transactions, query]);
  const total = filtered.reduce((sum, item) => sum + item.amount * 0.02, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><BadgePercent className="h-6 w-6 text-primary" />Commission</h1><p className="text-sm text-muted-foreground">Track commissions in real time and review payout opportunities.</p></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5"><div className="text-sm text-muted-foreground">Total commission</div><div className="mt-2 text-2xl font-semibold">₹{Math.round(total).toLocaleString("en-IN")}</div></Card>
        <Card className="p-5"><div className="text-sm text-muted-foreground">Pending payout</div><div className="mt-2 text-2xl font-semibold">₹18,500</div></Card>
        <Card className="p-5"><div className="text-sm text-muted-foreground">Slab active</div><div className="mt-2 text-2xl font-semibold">3%</div></Card>
        <Card className="p-5"><div className="text-sm text-muted-foreground">Growth</div><div className="mt-2 text-2xl font-semibold">+12%</div></Card>
      </div>
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search commissions" className="pl-9" /></div>
          <Button variant="outline" className="gap-2"><TrendingUp className="h-4 w-4" />View payout</Button>
        </div>
        <div className="mt-6 space-y-3">{filtered.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl border p-3"><div><div className="font-medium">{item.customer}</div><div className="text-sm text-muted-foreground">{item.type} · {item.reference}</div></div><div className="text-right"><div className="font-semibold">₹{Math.round(item.amount * 0.02).toLocaleString("en-IN")}</div><Badge variant="secondary" className="gap-1"><DollarSign className="h-3 w-3" />Eligible</Badge></div></div>)}</div>
      </Card>
    </div>
  );
}
