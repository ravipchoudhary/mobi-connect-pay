import { createFileRoute } from "@tanstack/react-router";

import { RoleDashboard } from "@/components/role-dashboard";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return <RoleDashboard />;
}
