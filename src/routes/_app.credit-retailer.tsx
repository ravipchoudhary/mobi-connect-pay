import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Banknote, CheckCircle2, Loader2, ShieldCheck, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { creditVerifiedRetailerWallet, listVerifiedRetailersForCredit } from "@/lib/wallet.functions";

export const Route = createFileRoute("/_app/credit-retailer")({
  component: CreditRetailerPage,
});

function fmt(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function CreditRetailerPage() {
  const qc = useQueryClient();
  const listRetailers = useServerFn(listVerifiedRetailersForCredit);
  const credit = useServerFn(creditVerifiedRetailerWallet);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [amount, setAmount] = useState("5000");
  const [note, setNote] = useState("Wallet credit for verified retailer");

  const { data, isLoading } = useQuery({
    queryKey: ["verified-retailers-for-credit"],
    queryFn: () => listRetailers(),
  });

  const retailers = useMemo(() => data?.retailers ?? [], [data]);

  const mutation = useMutation({
    mutationFn: () => credit({ data: { targetUserId: selectedUserId, amount: Number(amount), note } }),
    onSuccess: () => {
      toast.success("Wallet credit completed");
      qc.invalidateQueries({ queryKey: ["verified-retailers-for-credit"] });
      setAmount("5000");
      setNote("Wallet credit for verified retailer");
      setSelectedUserId("");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Credit failed"),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" />Credit verified retailer wallet
        </h1>
        <p className="text-sm text-muted-foreground">Send wallet credit only to retailers whose KYC is already approved.</p>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Verified retailer payout</h2>
            <p className="text-sm text-muted-foreground">Pick a retailer from the verified list and credit their main wallet.</p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> KYC approved
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Retailer</Label>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading verified retailers…</div>
            ) : retailers.length === 0 ? (
              <div className="rounded-xl border p-3 text-sm text-muted-foreground">No verified retailers are available right now.</div>
            ) : (
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select retailer" />
                </SelectTrigger>
                <SelectContent>
                  {retailers.map((retailer) => (
                    <SelectItem key={retailer.id} value={retailer.id}>
                      {retailer.full_name} • {retailer.business_name || "Retailer"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label>Note (optional)</Label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for wallet credit" />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !selectedUserId || !amount || Number(amount) <= 0} className="gap-2">
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Credit wallet
          </Button>
          <p className="text-sm text-muted-foreground">The credit will be posted to the retailer’s main wallet.</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Verified retailer list</h2>
        <div className="mt-4 space-y-3">
          {retailers.length === 0 ? (
            <div className="rounded-2xl border p-4 text-sm text-muted-foreground">No verified retailers available.</div>
          ) : (
            retailers.map((retailer) => (
              <div key={retailer.id} className="flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <UserRound className="h-4 w-4" />{retailer.full_name}
                  </div>
                  <div className="text-sm text-muted-foreground">{retailer.business_name || "Retailer"} • +91 {retailer.mobile}</div>
                </div>
                <Badge variant="default">{fmt(Number(retailer.balance ?? 0))}</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
