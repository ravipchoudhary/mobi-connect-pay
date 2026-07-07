import { createFileRoute } from "@tanstack/react-router";
import { BadgePercent } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/commission")({
  component: () => (
    <ModulePagePlaceholder
      title="Commission"
      subtitle="Slab-based commissions with real-time payouts."
      icon={BadgePercent}
      accent="chart-4"
      features={["Slab-based commission engine","Real-time payouts","Distributor hierarchy","Commission reports","GST computation","Payout history"]}
    />
  ),
});
