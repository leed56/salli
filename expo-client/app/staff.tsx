import { DemoModuleScreen } from "@/components/web/WebDemoShell";

export default function StaffScreen() {
  return (
    <DemoModuleScreen
      title="Staff"
      description="Control cashier access and protect VAT, reports, profit, supplier ledger, and cost prices."
      metricLabel="Active staff"
      metricValue="3 users"
      actionLabel="Add staff member"
      tone="teal"
    />
  );
}
