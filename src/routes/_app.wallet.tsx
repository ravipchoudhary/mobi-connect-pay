import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { ModulePagePlaceholder } from "@/components/module-placeholder";

export const Route = createFileRoute("/_app/wallet")({
  component: () => (
    <ModulePagePlaceholder
      title="Wallet"
      subtitle="Main, commission and hold wallets with full ledger and settlements."
      icon={Wallet}
      accent="chart-1"
      features={["Main / Commission / Hold wallets","Credit, debit & transfer","Full ledger & statement","Wallet-to-wallet transfer","Settlement & refunds","Downloadable statements"]}
    />
  ),
});
