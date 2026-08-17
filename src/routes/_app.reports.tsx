import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart3, FileDown, Printer, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getDemoTransactions } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
});

function ReportsPage() {
  const transactions = getDemoTransactions();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => transactions.filter((item) => [item.type, item.customer, item.reference, item.channel].join(" ").toLowerCase().includes(query.toLowerCase())), [transactions, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" />Reports</h1><p className="text-sm text-muted-foreground">Search, filter and export your service and wallet reports.</p></div>
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="relative w-full md:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transactions" className="pl-9" /></div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2"><FileDown className="h-4 w-4" />Export Excel</Button>
            <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" />Print</Button>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="pb-2">Date</th><th className="pb-2">Type</th><th className="pb-2">Customer</th><th className="pb-2">Reference</th><th className="pb-2">Amount</th><th className="pb-2">Status</th></tr></thead>
            <tbody className="divide-y divide-border">{filtered.map((item) => <tr key={item.id} className="hover:bg-accent/40"><td className="py-3 text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("en-IN")}</td><td className="py-3 font-medium">{item.type}</td><td className="py-3">{item.customer}</td><td className="py-3">{item.reference}</td><td className="py-3">₹{item.amount}</td><td className="py-3"><Badge variant={item.status === "Processed Successfully" ? "default" : item.status === "Pending" ? "secondary" : "destructive"}>{item.status}</Badge></td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
