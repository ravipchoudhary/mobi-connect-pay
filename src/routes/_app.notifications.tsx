import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, CheckCircle2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { addDemoNotification, getDemoNotifications, markNotificationRead } from "@/lib/demo-data";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [query, setQuery] = useState("");
  const notifications = getDemoNotifications();
  const filtered = useMemo(() => notifications.filter((item) => [item.title, item.message].join(" ").toLowerCase().includes(query.toLowerCase())), [notifications, query]);

  const sendAlert = () => addDemoNotification({ title: "New payout queued", message: "A new payout batch is ready for approval.", type: "settlement", createdAt: new Date().toISOString(), read: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2"><Bell className="h-6 w-6 text-primary" />Notifications</h1><p className="text-sm text-muted-foreground">Review wallet, settlement and KYC alerts in one place.</p></div>
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notifications" className="pl-9" /></div>
          <Button variant="outline" onClick={sendAlert}>Send alert</Button>
        </div>
        <div className="mt-6 space-y-3">{filtered.map((item) => <div key={item.id} className={`flex items-start justify-between rounded-2xl border p-4 ${item.read ? "bg-background" : "bg-primary/5"}`}><div><div className="font-medium">{item.title}</div><div className="text-sm text-muted-foreground">{item.message}</div></div><div className="flex items-center gap-2"><Badge>{item.type}</Badge>{!item.read && <Button size="sm" variant="ghost" onClick={() => markNotificationRead(item.id)}>Mark read</Button>}</div></div>)}</div>
      </Card>
    </div>
  );
}
