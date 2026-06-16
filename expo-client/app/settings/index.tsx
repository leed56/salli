import { DemoModuleScreen } from "@/components/web/WebDemoShell";

export default function SettingsScreen() {
  return (
    <DemoModuleScreen
      title="Settings"
      description="Manage shop profile, language, plan, VAT details, and safe permissions."
      metricLabel="Current plan"
      metricValue="Pro preview"
      actionLabel="Open staff settings"
      tone="amber"
    />
  );
}
