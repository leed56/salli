import { DemoModuleScreen } from "@/components/web/WebDemoShell";

export default function ReportsScreen() {
  return (
    <DemoModuleScreen
      title="Reports"
      description="Simple owner reports for sales, stock, VAT, credit, and profit views."
      metricLabel="Today sales"
      metricValue="LKR 156,200"
      actionLabel="View sales report"
      tone="teal"
    />
  );
}
