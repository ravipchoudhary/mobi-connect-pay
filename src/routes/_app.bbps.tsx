import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Receipt, Search, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDemoTransaction } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/bbps")({
  component: BBPSPage,
});

const operators = ["Electricity", "Water", "Gas", "Broadband", "Credit Card"];

function BBPSPage() {
  const [operator, setOperator] = useState("Electricity");
  const [consumer, setConsumer] = useState("A123456789");
  const [amount, setAmount] = useState("1280");
  const [status, setStatus] = useState<"idle" | "fetched" | "paid">("idle");

  const fetchBill = () => setStatus("fetched");
  const payBill = () => {
    addDemoTransaction({ type: "BBPS", amount: Number(amount), status: "Processed Successfully", reference: `BPS-${Math.floor(1000 + Math.random() * 9000)}`, customer: consumer, createdAt: new Date().toISOString(), channel: operator, note: `${operator} bill payment` });
    setStatus("paid");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Receipt className="h-6 w-6 text-primary" />BBPS</h1><p className="text-sm text-muted-foreground">Fetch bills, validate consumer details and complete instant bill payments.</p></div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold">Bill payment form</h2><p className="text-sm text-muted-foreground">Supports utility and service bills.</p></div><Badge variant="secondary" className="gap-1"><Search className="h-3.5 w-3.5" /> Live fetch</Badge></div>
          <div className="grid gap-4">
            <div className="space-y-2"><Label>Operator</Label><Select value={operator} onValueChange={setOperator}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{operators.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Consumer number</Label><Input value={consumer} onChange={(e) => setConsumer(e.target.value)} /></div>
            <div className="space-y-2"><Label>Bill amount (₹)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3"><Button onClick={fetchBill} variant="outline" className="gap-2"><FileText className="h-4 w-4" />Fetch bill</Button><Button onClick={payBill} className="gap-2">Pay bill</Button></div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Bill status</h2>
          <div className="mt-4 rounded-2xl border p-4">
            {status === "paid" ? <div className="space-y-2 text-sm"><div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" />Payment successful</div><div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/40">{operator} bill of ₹{amount} has been paid.</div></div> : status === "fetched" ? <div className="space-y-2 text-sm"><div className="flex items-center gap-2"><FileText className="h-4 w-4" />Bill fetched successfully</div><div className="text-muted-foreground">Consumer {consumer} has a payable bill of ₹{amount}.</div></div> : <div className="space-y-2 text-sm text-muted-foreground"><div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" />No bill processed yet.</div><div>Use the fetch bill and pay bill actions to simulate a real transaction.</div></div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
