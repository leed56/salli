import { DemoModuleScreen } from "@/components/web/WebDemoShell";

export default function StaffSettingsScreen() {
  return (
    <DemoModuleScreen
      title="Staff permissions"
      description="Owner-only staff accounts, cashier restrictions, and protected business information."
      metricLabel="Cashier restrictions"
      metricValue="6 hidden views"
      actionLabel="Review permissions"
      tone="rose"
    />
  );
}
