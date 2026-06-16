import { DemoModuleScreen } from "@/components/web/WebDemoShell";

export default function DayCloseScreen() {
  return (
    <DemoModuleScreen
      title="Day close"
      description="Count cash, compare sales, note differences, and close the shop day safely."
      metricLabel="Expected cash"
      metricValue="LKR 128,400"
      actionLabel="Start day close"
      tone="teal"
    />
  );
}
