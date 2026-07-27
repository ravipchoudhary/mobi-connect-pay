import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, CheckCircle2, Clock3, Banknote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/settlement")({
  component: SettlementPage,
});

function SettlementPage() {
  const [batch, setBatch] = useState("Daily batch");
  const [amount, setAmount] = useState("28000");
  const [status, setStatus] = useState<"pending" | "approved">("pending");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Landmark className="h-6 w-6 text-primary" />Settlement</h1><p className="text-sm text-muted-foreground">Approve pending batches and reconcile settlement requests.</p></div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Settlement approval</h2><p className="text-sm text-muted-foreground">Approve and schedule payouts.</p></div><Badge variant="secondary" className="gap-1"><Clock3 className="h-3.5 w-3.5" /> Pending</Badge></div>
          <div className="grid gap-4">
            <div className="space-y-2"><Label>Settlement batch</Label><Select value={batch} onValueChange={setBatch}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Daily batch">Daily batch</SelectItem><SelectItem value="Weekly batch">Weekly batch</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          </div>
          <div className="mt-6"><Button onClick={() => setStatus("approved")} className="gap-2"><Banknote className="h-4 w-4" />Approve settlement</Button></div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Outcome</h2>
          <div className="mt-4 rounded-2xl border p-4">
            {status === "approved" ? <div className="space-y-2 text-sm"><div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" />Settlement approved</div><div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40">{batch} for ₹{amount} has been approved for processing.</div></div> : <div className="text-sm text-muted-foreground">No settlement approved yet.</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
