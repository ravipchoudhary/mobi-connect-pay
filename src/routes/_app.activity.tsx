import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/activity")({
  component: () => (
    <ModulePagePlaceholder
      title="Activity"
      subtitle="Real-time activity stream across the platform."
      icon={Activity}
      accent="chart-2"
      features={["Real-time activity stream","Filters by user, service, status","Live counters","Session tracking","Export & alerts","Anomaly highlights"]}
    />
  ),
});
