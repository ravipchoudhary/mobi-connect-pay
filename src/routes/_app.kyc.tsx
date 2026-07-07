import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/kyc")({
  component: () => (
    <ModulePagePlaceholder
      title="KYC"
      subtitle="Document upload, verification and approval workflow."
      icon={ShieldCheck}
      accent="chart-2"
      features={["Aadhaar / PAN upload","Live selfie verification","Video KYC","Maker-checker approval","Audit trail","SMS / email alerts"]}
    />
  ),
});
