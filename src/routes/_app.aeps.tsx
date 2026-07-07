import { createFileRoute } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/aeps")({
  component: () => (
    <ModulePagePlaceholder
      title="AEPS"
      subtitle="Aadhaar Enabled Payment System — withdrawal, deposit, balance enquiry, Aadhaar Pay."
      icon={Fingerprint}
      accent="chart-3"
      features={["Cash withdrawal & deposit","Balance enquiry","Mini statement","Aadhaar Pay","Biometric device integration","Receipt & transaction history"]}
    />
  ),
});
