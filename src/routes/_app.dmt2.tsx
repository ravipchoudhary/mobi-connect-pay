import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Banknote, CheckCircle2, Clock3, Landmark, ShieldCheck, UserRound, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDemoNotification, addDemoDmt2Request, getDemoDmt2Requests, updateDemoDmt2RequestStatus, type DemoDmt2Request } from "@/lib/demo-data";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/_app/dmt2")({
  component: DMT2Page,
});

const fmt = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function DMT2Page() {
  const { primaryRole, profile } = useSession();
  const role = (primaryRole && ["super_admin", "master_distributor", "distributor", "retailer", "agent"].includes(primaryRole)
    ? primaryRole
    : "retailer") as import("@/lib/demo-data").DemoRole;
  const [form, setForm] = useState({
    beneficiaryName: "Riya Sharma",
    bankAccount: "50401000012345",
    ifsc: "HDFC0001234",
    amount: "12000",
  });
  const [requests, setRequests] = useState<DemoDmt2Request[]>(() => getDemoDmt2Requests());
  const [feedback, setFeedback] = useState<string | null>(null);

  const canApprove = role === "super_admin" || role === "master_distributor" || role === "distributor";
  const pendingRequests = useMemo(() => requests.filter((item) => item.status === "PendingApproval"), [requests]);
  const recentRequests = useMemo(() => requests.slice(0, 4), [requests]);

  const submitRequest = () => {
    const amount = Number(form.amount);
    if (!form.beneficiaryName || !form.bankAccount || !form.ifsc || !amount || amount <= 0) {
      setFeedback("Please fill all fields with a valid amount.");
      return;
    }

    const request = addDemoDmt2Request({
      beneficiaryName: form.beneficiaryName,
      bankAccount: form.bankAccount,
      ifsc: form.ifsc,
      amount,
      submittedBy: profile?.full_name ?? "Retailer / Agent",
      submittedByRole: role,
      createdAt: new Date().toISOString(),
      note: "Submitted for admin approval",
    });

    addDemoNotification({
      title: "DMT 2 request submitted",
      message: `${request.beneficiaryName} is waiting for approval. Amount ${fmt(request.amount)} is on hold.`,
      type: "wallet",
      createdAt: new Date().toISOString(),
      read: false,
    });

    setFeedback(`Request submitted successfully. ₹${amount.toLocaleString("en-IN")} is now on hold for approval.`);
    setRequests(getDemoDmt2Requests());
    setForm({ beneficiaryName: "", bankAccount: "", ifsc: "", amount: "" });
  };

  const handleApproval = (id: string, status: DemoDmt2Request["status"]) => {
    updateDemoDmt2RequestStatus(id, status, status === "Approved" ? "Approved by admin" : "Rejected by admin");
    addDemoNotification({
      title: status === "Approved" ? "DMT 2 approved" : "DMT 2 rejected",
      message: status === "Approved" ? "The transfer has been approved and the hold has been released." : "The transfer request was rejected.",
      type: "settlement",
      createdAt: new Date().toISOString(),
      read: false,
    });
    setRequests(getDemoDmt2Requests());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" />DMT 2
        </h1>
        <p className="text-sm text-muted-foreground">Create bank transfer requests with beneficiary details, keep the amount on hold until admin approval, and complete the transfer after approval.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Transfer request form</h2>
              <p className="text-sm text-muted-foreground">Fill beneficiary bank details and submit for approval.</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin approval
            </Badge>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Beneficiary name</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={form.beneficiaryName} onChange={(e) => setForm((prev) => ({ ...prev, beneficiaryName: e.target.value }))} className="pl-9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bank account number</Label>
              <Input value={form.bankAccount} onChange={(e) => setForm((prev) => ({ ...prev, bankAccount: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>IFSC code</Label>
              <Input value={form.ifsc} onChange={(e) => setForm((prev) => ({ ...prev, ifsc: e.target.value.toUpperCase() }))} />
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={submitRequest} className="gap-2">
              <Wallet className="h-4 w-4" />Submit for approval
            </Button>
            <p className="text-sm text-muted-foreground">The amount will be held from the wallet until an admin approves it.</p>
          </div>

          {feedback ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30">{feedback}</div> : null}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Approval status</h2>
              <p className="text-sm text-muted-foreground">Pending requests stay in hold until admin approval.</p>
            </div>
            <Badge variant="secondary">{pendingRequests.length} pending</Badge>
          </div>
          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <div className="rounded-2xl border p-4 text-sm text-muted-foreground">No transfer requests yet.</div>
            ) : (
              recentRequests.map((request) => (
                <div key={request.id} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{request.beneficiaryName}</div>
                      <div className="text-xs text-muted-foreground">{request.bankAccount} • {request.ifsc}</div>
                    </div>
                    <Badge variant={request.status === "PendingApproval" ? "secondary" : request.status === "Approved" || request.status === "Completed" ? "default" : "destructive"}>{request.status === "PendingApproval" ? "Pending" : request.status}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">{fmt(request.amount)} • {request.submittedBy}</div>
                    <div className="font-medium">{request.status === "PendingApproval" ? "On hold" : "Completed"}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {canApprove ? (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Admin approval queue</h2>
              <p className="text-sm text-muted-foreground">Approve or reject pending bank transfer requests.</p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Clock3 className="h-3.5 w-3.5" /> Pending review
            </Badge>
          </div>
          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="rounded-2xl border p-4 text-sm text-muted-foreground">No pending requests are waiting for approval.</div>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium">{request.beneficiaryName}</div>
                    <div className="text-sm text-muted-foreground">{request.bankAccount} • {request.ifsc} • {fmt(request.amount)}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Landmark className="h-3.5 w-3.5" /> Submitted by {request.submittedBy}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => handleApproval(request.id, "Approved")} className="gap-1">
                      <CheckCircle2 className="h-4 w-4" />Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleApproval(request.id, "Rejected")}>Reject</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
