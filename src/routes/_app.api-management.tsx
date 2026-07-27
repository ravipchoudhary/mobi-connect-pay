import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, Plus, ToggleRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { addDemoApiKey, getDemoApiKeys, toggleDemoApiKey } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/api-management")({
  component: ApiManagementPage,
});

function ApiManagementPage() {
  const [name, setName] = useState("");
  const apiKeys = getDemoApiKeys();

  const createKey = () => {
    if (!name.trim()) return;
    addDemoApiKey({ name: name.trim(), key: `pk_live_${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString(), lastUsed: "Just now", status: "Active" });
    setName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><KeyRound className="h-6 w-6 text-primary" />API management</h1><p className="text-sm text-muted-foreground">Create and manage API keys for partner integrations.</p></div>
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-sm"><label className="text-sm font-medium">API key name</label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Partner gateway" className="mt-2" /></div>
          <Button className="gap-2" onClick={createKey}><Plus className="h-4 w-4" />Generate key</Button>
        </div>
        <div className="mt-6 space-y-3">{apiKeys.map((item) => <div key={item.id} className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"><div><div className="font-medium">{item.name}</div><div className="text-sm text-muted-foreground">{item.key}</div></div><div className="flex items-center gap-2"><Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge><Button size="sm" variant="outline" className="gap-2" onClick={() => toggleDemoApiKey(item.id)}><ToggleRight className="h-4 w-4" />Toggle</Button></div></div>)}</div>
      </Card>
    </div>
  );
}
