import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/support")({
  component: () => (
    <ModulePagePlaceholder
      title="Support Tickets"
      subtitle="Multi-channel ticketing with SLA tracking."
      icon={LifeBuoy}
      accent="chart-5"
      features={["Multi-channel ticketing","SLA tracking","Categories & priority","Assignment & escalation","Ticket audit trail","CSAT surveys"]}
    />
  ),
});
