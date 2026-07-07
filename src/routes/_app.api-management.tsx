import { createFileRoute } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/api-management")({
  component: () => (
    <ModulePagePlaceholder
      title="API Management"
      subtitle="API keys, gateway configuration & health."
      icon={KeyRound}
      accent="chart-3"
      features={["API key management","Gateway configuration","Rate limiting","Health & uptime monitoring","Webhook configuration","Request logs"]}
    />
  ),
});
