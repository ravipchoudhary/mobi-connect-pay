import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/roles")({
  component: () => (
    <ModulePagePlaceholder
      title="Roles & Permissions"
      subtitle="Fine-grained RBAC across 7 role types."
      icon={UserCog}
      accent="chart-4"
      features={["Super Admin, Distributor, Retailer…","Menu & widget permissions","Report access control","Maker-checker workflows","Audit trail","Session policies"]}
    />
  ),
});
