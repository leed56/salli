import { DemoModuleScreen } from "@/components/web/WebDemoShell";

export default function ExpensesScreen() {
  return (
    <DemoModuleScreen
      title="Expenses"
      description="Record shop expenses, petty cash, categories, and claimable VAT without accounting jargon."
      metricLabel="This month expenses"
      metricValue="LKR 42,800"
      actionLabel="Add expense"
      tone="amber"
    />
  );
}
