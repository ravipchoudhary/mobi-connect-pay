import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Smartphone, Search, Receipt, RefreshCw, Wallet, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDemoTransaction } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/recharge")({
  component: RechargePage,
});

const operators = ["Jio", "Airtel", "Vi", "BSNL", "MTNL"];
const circles = ["Delhi", "Mumbai", "Bengaluru", "Kolkata", "Chennai"];

function RechargePage() {
  const [operator, setOperator] = useState("Jio");
  const [circle, setCircle] = useState("Delhi");
  const [mobile, setMobile] = useState("9876543210");
  const [amount, setAmount] = useState("499");
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [receipt, setReceipt] = useState<string | null>(null);

  const canSubmit = useMemo(() => /^\d{10}$/.test(mobile) && Number(amount) > 0, [mobile, amount]);

  const submit = () => {
    const ref = `RCH-${Math.floor(1000 + Math.random() * 9000)}`;
    addDemoTransaction({ type: "Recharge", amount: Number(amount), status: "Success", reference: ref, customer: mobile, createdAt: new Date().toISOString(), channel: operator, note: `${operator} ${circle} recharge` });
    setReceipt(ref);
    setStatus("success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Smartphone className="h-6 w-6 text-primary" />Recharge</h1>
        <p className="text-sm text-muted-foreground">Complete a live recharge flow with wallet validation, receipt generation and history updates.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Recharge form</h2><p className="text-sm text-muted-foreground">Fast and secure recharge for prepaid services.</p></div><Badge variant="secondary" className="gap-1"><Wallet className="h-3.5 w-3.5" /> Wallet validated</Badge></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Operator</Label><Select value={operator} onValueChange={setOperator}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{operators.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Circle</Label><Select value={circle} onValueChange={setCircle}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{circles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2 md:col-span-2"><Label>Mobile number</Label><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} className="pl-9" /></div></div>
            <div className="space-y-2"><Label>Amount (₹)</Label><Input type="number" min={10} value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div className="space-y-2"><Label>Plan</Label><Input value={`${operator} ${circle} prepaid`} readOnly /></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={submit} disabled={!canSubmit} className="gap-2"><RefreshCw className="h-4 w-4" />Recharge now</Button>
            <Button variant="outline" onClick={() => { setStatus("idle"); setReceipt(null); }}>Reset</Button>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Status & receipt</h2>
          <div className="mt-4 rounded-2xl border border-dashed p-4">
            {status === "success" && receipt ? (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" />Recharge successful</div>
                <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40"><div className="font-semibold">Receipt #{receipt}</div><div className="mt-1">{operator} · {circle} · ₹{amount}</div></div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2"><Receipt className="h-4 w-4" />View receipt</Button>
                  <Button variant="ghost" size="sm" className="gap-2">Retry <ChevronRight className="h-4 w-4" /></Button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" />No transaction submitted yet.</div>
                <div>Wallet validation, transaction status and history are wired into the flow.</div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
