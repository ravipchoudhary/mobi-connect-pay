import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/notifications")({
  component: () => (
    <ModulePagePlaceholder
      title="Notifications"
      subtitle="SMS, email, in-app and push notifications."
      icon={Bell}
      accent="chart-4"
      features={["SMS / email gateways","In-app & push notifications","Transaction & wallet alerts","KYC & settlement alerts","Template management","Delivery reports"]}
    />
  ),
});
