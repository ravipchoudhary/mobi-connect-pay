import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { UserCog, Search, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getDemoPermissions } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/roles")({
  component: RolesPage,
});

function RolesPage() {
  const [query, setQuery] = useState("");
  const permissions = getDemoPermissions();
  const filtered = useMemo(() => permissions.filter((item) => [item.role, item.feature].join(" ").toLowerCase().includes(query.toLowerCase())), [permissions, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><UserCog className="h-6 w-6 text-primary" />Roles & permissions</h1><p className="text-sm text-muted-foreground">Review role-based access across the platform.</p></div>
      <Card className="p-6">
        <div className="relative w-full md:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role or feature" className="pl-9" /></div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">{filtered.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl border p-3"><div><div className="font-medium">{item.feature}</div><div className="text-sm text-muted-foreground">{item.role.replace("_", " ")}</div></div><Badge variant={item.access ? "default" : "secondary"} className="gap-1"><ShieldCheck className="h-3 w-3" />{item.access ? "Enabled" : "Blocked"}</Badge></div>)}</div>
      </Card>
    </div>
  );
}
