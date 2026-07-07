import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/users")({
  component: () => (
    <ModulePagePlaceholder
      title="Users"
      subtitle="Create, edit, suspend users with role & commission assignment."
      icon={Users}
      accent="chart-1"
      features={["Create, edit, suspend, activate","Bulk import / export","Role & commission assignment","Wallet adjustment","KYC review","Advanced search & filters"]}
    />
  ),
});
