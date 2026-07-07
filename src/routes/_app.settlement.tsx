import { createFileRoute } from "@tanstack/react-router";
import { Landmark } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/settlement")({
  component: () => (
    <ModulePagePlaceholder
      title="Settlement"
      subtitle="Auto and manual settlements with reconciliation."
      icon={Landmark}
      accent="chart-2"
      features={["Auto & on-demand settlement","Bank account management","Reconciliation dashboard","Settlement reports","Failed settlement retry","GST invoicing"]}
    />
  ),
});
