import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/dmt")({
  component: () => (
    <ModulePagePlaceholder
      title="Domestic Money Transfer"
      subtitle="IMPS & NEFT transfers with beneficiary management and OTP confirmation."
      icon={Send}
      accent="chart-4"
      features={["Add & verify beneficiaries","IMPS / NEFT transfers","Bank account validation","OTP confirmation","Receipt & transaction history","Compliance limits"]}
    />
  ),
});
