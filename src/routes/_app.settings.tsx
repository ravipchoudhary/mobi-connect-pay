import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings, ShieldCheck, BellRing, Banknote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [sms, setSms] = useState("MSG91");
  const [gateway, setGateway] = useState("Razorpay");
  const [gst, setGst] = useState("27ABCDE1234F1Z5");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Settings className="h-6 w-6 text-primary" />Settings</h1><p className="text-sm text-muted-foreground">Configure the core gateway, notification and compliance preferences.</p></div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">System preferences</h2></div>
          <div className="space-y-4">
            <div className="space-y-2"><Label>SMS gateway</Label><Input value={sms} onChange={(e) => setSms(e.target.value)} /></div>
            <div className="space-y-2"><Label>Payment gateway</Label><Input value={gateway} onChange={(e) => setGateway(e.target.value)} /></div>
            <div className="space-y-2"><Label>GSTIN</Label><Input value={gst} onChange={(e) => setGst(e.target.value)} /></div>
            <Button>Save preferences</Button>
          </div>
        </Card>
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2"><BellRing className="h-5 w-5 text-primary" /><h2 className="text-lg font-semibold">Operational status</h2></div>
          <div className="space-y-3">
            {[
              { label: "SMS delivery", value: "Healthy" },
              { label: "Wallet syncing", value: "Healthy" },
              { label: "Settlement queue", value: "3 pending" },
            ].map((item) => <div key={item.label} className="flex items-center justify-between rounded-2xl border p-3"><div>{item.label}</div><Badge>{item.value}</Badge></div>)}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-dashed p-3 text-sm text-muted-foreground"><Banknote className="h-4 w-4" /> Bank accounts and compliance settings are ready for configuration.</div>
        </Card>
      </div>
    </div>
  );
}
