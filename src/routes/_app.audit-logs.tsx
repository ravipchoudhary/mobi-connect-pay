import { createFileRoute } from "@tanstack/react-router";
import { ScrollText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/audit-logs")({
  component: AuditLogsPage,
});

const logs = [
  { id: 1, actor: "Super Admin", action: "Approved KYC", timestamp: "10 mins ago", target: "Retailer A" },
  { id: 2, actor: "Distributor", action: "Created retailer", timestamp: "1 hr ago", target: "Retailer B" },
  { id: 3, actor: "Retailer", action: "Processed recharge", timestamp: "2 hrs ago", target: "Airtel 9876543210" },
];

function AuditLogsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => logs.filter((item) => [item.actor, item.action, item.target].join(" ").toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><ScrollText className="h-6 w-6 text-primary" />Audit logs</h1><p className="text-sm text-muted-foreground">Review the latest actions across your organization.</p></div>
      <Card className="p-6">
        <div className="relative w-full md:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs" className="pl-9" /></div>
        <div className="mt-6 space-y-3">{filtered.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl border p-3"><div><div className="font-medium">{item.action}</div><div className="text-sm text-muted-foreground">{item.actor} · {item.target}</div></div><Badge variant="secondary">{item.timestamp}</Badge></div>)}</div>
      </Card>
    </div>
  );
}
