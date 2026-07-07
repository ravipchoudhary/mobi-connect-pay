import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/reports")({
  component: () => (
    <ModulePagePlaceholder
      title="Reports"
      subtitle="Daily, weekly, monthly reports across every service."
      icon={BarChart3}
      accent="chart-3"
      features={["Daily, weekly, monthly reports","Service-wise breakdown","User & wallet reports","GST reports","PDF / Excel / CSV export","Scheduled email reports"]}
    />
  ),
});
