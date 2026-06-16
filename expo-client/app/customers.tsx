import { DemoModuleScreen } from "@/components/web/WebDemoShell";

export default function CustomersScreen() {
  return (
    <DemoModuleScreen
      title="Customers"
      description="Track customer balances, phone numbers, payment history, and quick due reminders."
      metricLabel="Total credit due"
      metricValue="LKR 84,500"
      actionLabel="View customer profile"
      tone="rose"
    />
  );
}
