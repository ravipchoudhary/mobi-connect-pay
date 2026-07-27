import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Fingerprint, CreditCard, Wallet, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDemoTransaction } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/aeps")({
  component: AEPSPage,
});

const banks = ["SBI", "HDFC", "ICICI", "Axis", "PNB"];
const actions = ["Cash Withdrawal", "Cash Deposit", "Mini Statement", "Balance Enquiry"];

function AEPSPage() {
  const [bank, setBank] = useState("SBI");
  const [mode, setMode] = useState(actions[0]);
  const [amount, setAmount] = useState("2500");
  const [status, setStatus] = useState<"idle" | "complete">("idle");

  const runTransaction = () => {
    addDemoTransaction({ type: "AEPS", amount: Number(amount), status: "Success", reference: `AEP-${Math.floor(1000 + Math.random() * 9000)}`, customer: "Aadhaar Customer", createdAt: new Date().toISOString(), channel: bank, note: `${mode} through ${bank}` });
    setStatus("complete");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Fingerprint className="h-6 w-6 text-primary" />AEPS</h1><p className="text-sm text-muted-foreground">Handle cash and account services with bank selection and biometric-ready workflows.</p></div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">AEPS service</h2><p className="text-sm text-muted-foreground">Choose the bank and service to continue.</p></div><Badge variant="secondary" className="gap-1"><ShieldCheck className="h-3.5 w-3.5" /> Secure</Badge></div>
          <div className="grid gap-4">
            <div className="space-y-2"><Label>Bank</Label><Select value={bank} onValueChange={setBank}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{banks.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Service</Label><Select value={mode} onValueChange={setMode}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{actions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          </div>
          <div className="mt-6"><Button onClick={runTransaction} className="gap-2"><CreditCard className="h-4 w-4" />Process transaction</Button></div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Transaction outcome</h2>
          <div className="mt-4 rounded-2xl border p-4">
            {status === "complete" ? <div className="space-y-2 text-sm"><div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" />AEPS request completed</div><div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40">{mode} for ₹{amount} via {bank} has been recorded successfully.</div></div> : <div className="space-y-2 text-sm text-muted-foreground"><div className="flex items-center gap-2"><Wallet className="h-4 w-4" />Ready to start.</div><div>Complete the form to create a real AEPS transaction entry.</div></div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
