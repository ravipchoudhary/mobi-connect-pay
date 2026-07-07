import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/bbps")({
  component: () => (
    <ModulePagePlaceholder
      title="BBPS"
      subtitle="Bharat Bill Payments — electricity, water, gas, broadband and more."
      icon={Receipt}
      accent="chart-2"
      features={["Electricity, water, gas, broadband","Insurance & credit card bills","Bill fetch & pay","Receipt generation","History & advanced filters","Compliance & reports"]}
    />
  ),
});
