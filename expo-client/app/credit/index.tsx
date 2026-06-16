import { DemoModuleScreen } from "@/components/web/WebDemoShell";

export default function CreditScreen() {
  return (
    <DemoModuleScreen
      title="Credit book"
      description="See who owes money, record partial payments, and keep owner-safe overdue alerts."
      metricLabel="Outstanding credit"
      metricValue="LKR 84,500"
      actionLabel="Record payment"
      tone="rose"
    />
  );
}
