import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Activity, Search, Filter, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDemoActivity } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/activity")({
  component: ActivityPage,
});

function ActivityPage() {
  const [query, setQuery] = useState("");
  const activity = getDemoActivity();
  const filtered = useMemo(() => activity.filter((item) => [item.title, item.detail].join(" ").toLowerCase().includes(query.toLowerCase())), [activity, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Activity className="h-6 w-6 text-primary" />Activity</h1><p className="text-sm text-muted-foreground">Track the latest service, wallet and user events.</p></div>
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search activity" className="pl-9" /></div>
          <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" />Filter</Button>
        </div>
        <div className="mt-6 space-y-3">{filtered.map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl border p-3"><div><div className="font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.detail}</div></div><div className="flex items-center gap-2"><Badge variant="secondary">{item.timestamp}</Badge><Eye className="h-4 w-4 text-muted-foreground" /></div></div>)}</div>
      </Card>
    </div>
  );
}
