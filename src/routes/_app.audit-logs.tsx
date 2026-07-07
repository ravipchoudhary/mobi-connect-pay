import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/audit-logs")({
  component: () => (
    <ModulePagePlaceholder
      title="Audit Logs"
      subtitle="Immutable trail of every sensitive action."
      icon={ScrollText}
      accent="chart-3"
      features={["Every sensitive action logged","User, IP & device fingerprint","Search & filter","Export to CSV/PDF","Retention policies","Compliance ready"]}
    />
  ),
});
