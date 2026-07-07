import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/recharge")({
  component: () => (
    <ModulePagePlaceholder
      title="Recharge"
      subtitle="Mobile, DTH & FASTag recharges with operator detection and retry."
      icon={Smartphone}
      accent="chart-1"
      features={["Mobile & DTH recharge","FASTag recharge","Operator auto-detection","Retry failed transactions","PDF/Excel receipt export","Transaction history & filters"]}
    />
  ),
});
