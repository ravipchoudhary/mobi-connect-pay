import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Landmark, UserRound, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDemoTransaction } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/dmt")({
  component: DMTPage,
});

const methods = ["IMPS", "NEFT", "RTGS"];

function DMTPage() {
  const [method, setMethod] = useState(methods[0]);
  const [beneficiary, setBeneficiary] = useState("Kavya Nair");
  const [amount, setAmount] = useState("15000");
  const [status, setStatus] = useState<"idle" | "complete">("idle");

  const send = () => {
    addDemoTransaction({ type: "Transfer", amount: Number(amount), status: "Processed Successfully", reference: `TRF-${Math.floor(1000 + Math.random() * 9000)}`, customer: beneficiary, createdAt: new Date().toISOString(), channel: method, note: `Transfer via ${method}` });
    setStatus("complete");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Send className="h-6 w-6 text-primary" />Money Transfer</h1><p className="text-sm text-muted-foreground">Send money to beneficiaries using the most common transfer methods and capture instant receipts.</p></div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Transfer form</h2><p className="text-sm text-muted-foreground">IMPS, NEFT and RTGS ready.</p></div><Badge variant="secondary" className="gap-1"><Landmark className="h-3.5 w-3.5" /> Secure</Badge></div>
          <div className="grid gap-4">
            <div className="space-y-2"><Label>Beneficiary</Label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} className="pl-9" /></div></div>
            <div className="space-y-2"><Label>Method</Label><Select value={method} onValueChange={setMethod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{methods.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          </div>
          <div className="mt-6"><Button onClick={send} className="gap-2"><Send className="h-4 w-4" />Send money</Button></div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Status</h2>
          <div className="mt-4 rounded-2xl border p-4">
            {status === "complete" ? <div className="space-y-2 text-sm"><div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" />Transfer completed</div><div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40">₹{amount} sent to {beneficiary} through {method}.</div></div> : <div className="text-sm text-muted-foreground">No transfer submitted yet. Fill the form to create a new transaction entry.</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
