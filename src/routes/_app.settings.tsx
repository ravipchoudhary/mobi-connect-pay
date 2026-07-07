import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/settings")({
  component: () => (
    <ModulePagePlaceholder
      title="Settings"
      subtitle="Gateways, security, GST and system configuration."
      icon={Settings}
      accent="chart-1"
      features={["SMS & email gateways","Payment gateway config","Bank accounts & GST","Security & session policies","API keys","System configuration"]}
    />
  ),
});
