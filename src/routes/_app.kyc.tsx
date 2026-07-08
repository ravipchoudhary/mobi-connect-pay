import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, Clock3, FileCheck2, ShieldCheck, Upload, XCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-session";
import { listMyKyc, recordKycDoc, submitKycForReview, listPendingKyc, reviewKyc } from "@/lib/kyc.functions";

export const Route = createFileRoute("/_app/kyc")({
  component: KycPage,
});

const DOC_TYPES = [
  { key: "aadhaar_front", label: "Aadhaar (front)" },
  { key: "aadhaar_back", label: "Aadhaar (back)" },
  { key: "pan", label: "PAN card" },
  { key: "selfie", label: "Selfie / Live photo" },
  { key: "gst", label: "GST certificate" },
  { key: "bank_proof", label: "Bank proof (cheque)" },
] as const;

type DocKey = (typeof DOC_TYPES)[number]["key"];

function KycPage() {
  const { profile, roles } = useSession();
  const isAdmin = roles.some((r) => r === "super_admin" || r === "support" || r === "auditor");

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Compliance</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">KYC Verification</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upload documents and submit personal details to unlock all services.</p>
        </div>
        <KycStatusBadge status={profile?.kyc_status} />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_1fr]">
        <ProfileForm />
        <DocumentsCard />
      </div>

      {isAdmin && <AdminReviewPanel />}
    </div>
  );
}

function KycStatusBadge({ status }: { status?: string | null }) {
  const map: Record<string, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
    approved: { label: "Approved", cls: "bg-success/15 text-success border-success/30", icon: CheckCircle2 },
    pending: { label: "Under review", cls: "bg-warning/15 text-warning border-warning/30", icon: Clock3 },
    rejected: { label: "Rejected", cls: "bg-destructive/15 text-destructive border-destructive/30", icon: XCircle },
    not_started: { label: "Not started", cls: "bg-muted text-muted-foreground border-border", icon: ShieldCheck },
  };
  const s = map[status ?? "not_started"] ?? map.not_started;
  const I = s.icon;
  return <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${s.cls}`}><I className="h-3.5 w-3.5" /> {s.label}</div>;
}

function ProfileForm() {
  const { profile, refresh } = useSession();
  const submit = useServerFn(submitKycForReview);
  const qc = useQueryClient();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    pan_number: profile?.pan_number ?? "",
    aadhaar_last4: profile?.aadhaar_last4 ?? "",
    business_name: profile?.business_name ?? "",
    address: profile?.address ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "",
    pincode: profile?.pincode ?? "",
    gst_number: profile?.gst_number ?? "",
  });
  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        pan_number: profile.pan_number ?? "",
        aadhaar_last4: profile.aadhaar_last4 ?? "",
        business_name: profile.business_name ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        pincode: profile.pincode ?? "",
        gst_number: profile.gst_number ?? "",
      });
    }
  }, [profile]);

  const mut = useMutation({
    mutationFn: () => submit({ data: form }),
    onSuccess: async () => {
      toast.success("Submitted for review");
      await refresh();
      qc.invalidateQueries({ queryKey: ["kyc-mine"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Submission failed"),
  });

  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><FileCheck2 className="h-5 w-5" /></div>
        <div>
          <h3 className="text-base font-semibold tracking-tight">Personal & business details</h3>
          <p className="text-xs text-muted-foreground">Required for KYC approval and settlement.</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </Field>
        <Field label="Business / trade name">
          <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
        </Field>
        <Field label="PAN">
          <Input value={form.pan_number} maxLength={10} onChange={(e) => setForm({ ...form, pan_number: e.target.value.toUpperCase() })} placeholder="ABCDE1234F" />
        </Field>
        <Field label="Aadhaar (last 4)">
          <Input value={form.aadhaar_last4} maxLength={4} onChange={(e) => setForm({ ...form, aadhaar_last4: e.target.value.replace(/\D/g, "") })} placeholder="1234" />
        </Field>
        <Field label="GST number">
          <Input value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value.toUpperCase() })} />
        </Field>
        <Field label="Pincode">
          <Input value={form.pincode} maxLength={6} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "") })} />
        </Field>
        <Field label="City">
          <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </Field>
        <Field label="State">
          <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address">
            <Textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="hero" size="lg" onClick={() => mut.mutate()} disabled={mut.isPending || form.full_name.trim().length < 2}>
          {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for review"}
        </Button>
      </div>
    </Card>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}{required && <span className="ml-1 text-destructive">*</span>}</Label>
      {children}
    </div>
  );
}

function DocumentsCard() {
  const list = useServerFn(listMyKyc);
  const record = useServerFn(recordKycDoc);
  const qc = useQueryClient();
  const { data: docs } = useQuery({ queryKey: ["kyc-mine"], queryFn: () => list({ data: undefined as never }) });
  const uploaded = useMemo(() => new Set((docs ?? []).map((d) => d.doc_type)), [docs]);

  const onUploaded = () => qc.invalidateQueries({ queryKey: ["kyc-mine"] });

  return (
    <Card className="p-6 shadow-md">
      <h3 className="text-base font-semibold tracking-tight">Documents</h3>
      <p className="text-xs text-muted-foreground">JPG, PNG or PDF · Max 5MB each.</p>
      <div className="mt-4 grid gap-3">
        {DOC_TYPES.map((d) => (
          <DocRow key={d.key} docKey={d.key} label={d.label} uploaded={uploaded.has(d.key)} record={record} onDone={onUploaded} />
        ))}
      </div>
    </Card>
  );
}

function DocRow({ docKey, label, uploaded, record, onDone }: {
  docKey: DocKey;
  label: string;
  uploaded: boolean;
  record: ReturnType<typeof useServerFn<typeof recordKycDoc>>;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useSession();

  const onFile = async (file: File) => {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("File is larger than 5MB");
    setBusy(true);
    try {
      const path = `${user.id}/${docKey}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const up = await supabase.storage.from("kyc-docs").upload(path, file, { upsert: true });
      if (up.error) throw up.error;
      await record({ data: { doc_type: docKey, file_url: up.data.path } });
      toast.success(`${label} uploaded`);
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-dashed border-border bg-card px-4 py-4 transition hover:border-primary/50 hover:bg-accent/40">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary text-primary-foreground"><FileCheck2 className="h-5 w-5" /></div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{uploaded ? "Uploaded — under review" : "Not uploaded yet"}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {uploaded && <Badge variant="secondary" className="rounded-full">Pending</Badge>}
        <input ref={inputRef} type="file" accept="image/*,application/pdf" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (<><Upload className="h-3.5 w-3.5" /> {uploaded ? "Replace" : "Upload"}</>)}
        </Button>
      </div>
    </div>
  );
}

function AdminReviewPanel() {
  const list = useServerFn(listPendingKyc);
  const review = useServerFn(reviewKyc);
  const qc = useQueryClient();
  const { data: pending } = useQuery({ queryKey: ["kyc-pending"], queryFn: () => list({ data: undefined as never }) });
  const mut = useMutation({
    mutationFn: (v: { user_id: string; decision: "approved" | "rejected"; remarks?: string }) => review({ data: v }),
    onSuccess: () => {
      toast.success("KYC updated");
      qc.invalidateQueries({ queryKey: ["kyc-pending"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  return (
    <Card className="p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Admin review queue</h3>
          <p className="text-xs text-muted-foreground">Users with pending KYC submissions.</p>
        </div>
        <Badge variant="secondary">{pending?.length ?? 0} pending</Badge>
      </div>
      <div className="mt-4 divide-y divide-border">
        {(!pending || pending.length === 0) && <div className="py-6 text-center text-sm text-muted-foreground">No pending KYCs.</div>}
        {pending?.map((p) => (
          <div key={p.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="text-sm font-medium">{p.full_name || "Unnamed"}</div>
              <div className="text-xs text-muted-foreground">+91 {p.mobile} · {p.city || "—"}, {p.state || "—"}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => mut.mutate({ user_id: p.id, decision: "rejected" })}>Reject</Button>
              <Button size="sm" variant="hero" onClick={() => mut.mutate({ user_id: p.id, decision: "approved" })}>Approve</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
