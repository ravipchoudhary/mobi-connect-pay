import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeBuoy, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { addDemoTicket, getDemoTickets } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/support")({
  component: SupportPage,
});

function SupportPage() {
  const [query, setQuery] = useState("");
  const tickets = getDemoTickets();
  const filtered = useMemo(() => tickets.filter((item) => [item.subject, item.customer, item.category, item.status].join(" ").toLowerCase().includes(query.toLowerCase())), [tickets, query]);

  const createTicket = () => {
    addDemoTicket({ subject: "New service issue", category: "Support", priority: "Medium", status: "Open", customer: "Asha Kumar", createdAt: new Date().toISOString(), message: "Please help with submitting a new recharge request." });
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><LifeBuoy className="h-6 w-6 text-primary" />Support tickets</h1><p className="text-sm text-muted-foreground">Track service complaints and support requests with status and priority.</p></div>
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tickets" className="pl-9" /></div>
          <Button className="gap-2" onClick={createTicket}><Plus className="h-4 w-4" />New ticket</Button>
        </div>
        <div className="mt-6 space-y-3">{filtered.map((item) => <div key={item.id} className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"><div><div className="font-medium">{item.subject}</div><div className="text-sm text-muted-foreground">{item.customer} · {item.category}</div></div><div className="flex flex-wrap items-center gap-2"><Badge variant={item.priority === "High" ? "destructive" : item.priority === "Medium" ? "secondary" : "outline"}>{item.priority}</Badge><Badge>{item.status}</Badge></div></div>)}</div>
      </Card>
    </div>
  );
}
