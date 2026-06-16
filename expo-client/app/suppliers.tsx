import { DemoModuleScreen } from "@/components/web/WebDemoShell";

export default function SuppliersScreen() {
  return (
    <DemoModuleScreen
      title="Suppliers"
      description="Track supplier bills, payment status, bill history, and supplier ledger balances."
      metricLabel="Supplier balance"
      metricValue="LKR 236,900"
      actionLabel="View supplier ledger"
      tone="amber"
    />
  );
}
