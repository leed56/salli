import { Text, View } from "react-native";

import { ActionLink, Card, Metric, PageHeader, PhoneShell, money } from "@/components/web/WebDemoShell";

const actions = [
  { href: "/sell", label: "New sale", tone: "amber" as const },
  { href: "/bills", label: "Add supplier bill", tone: "teal" as const },
  { href: "/stock", label: "Stock", tone: "dark" as const },
  { href: "/customers", label: "Customers", tone: "dark" as const },
  { href: "/credit", label: "Credit book", tone: "dark" as const },
  { href: "/suppliers", label: "Suppliers", tone: "dark" as const },
  { href: "/expenses", label: "Expenses", tone: "dark" as const },
  { href: "/dayclose", label: "Day close", tone: "dark" as const },
  { href: "/vat", label: "VAT meter", tone: "teal" as const },
  { href: "/reports", label: "Reports", tone: "dark" as const },
  { href: "/settings", label: "Settings", tone: "dark" as const },
  { href: "/staff", label: "Staff", tone: "dark" as const },
];

export default function HomeScreen() {
  return (
    <PhoneShell>
      <PageHeader
        title="Your shop is under control"
        description="Browser-safe Salli preview for Sri Lankan SMEs. Capture sales, supplier bills, credit, stock, VAT, and day close in a calm mobile layout."
        badge="Pro preview"
      />

      <Card>
        <Text style={{ color: "#CBD5E1", fontSize: 14, fontWeight: "800" }}>Live quarter meter</Text>
        <Metric label="VAT payable this quarter" value={money(74250)} tone="teal" />
        <Text style={{ color: "#94A3B8", fontSize: 14, lineHeight: 21 }}>
          Updates after every sale, supplier bill, and claimable VAT expense.
        </Text>
        <ActionLink href="/vat" label="Open VAT meter" />
      </Card>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Metric label="Today sales" value={money(156200)} tone="amber" />
        </View>
        <View style={{ flex: 1 }}>
          <Metric label="Cash in hand" value={money(128400)} tone="teal" />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Metric label="Credit due" value={money(84500)} tone="rose" />
        </View>
        <View style={{ flex: 1 }}>
          <Metric label="Low stock" value="7 items" tone="rose" />
        </View>
      </View>

      <Card>
        <Text style={{ color: "#F8FAFC", fontSize: 20, fontWeight: "900" }}>Quick actions</Text>
        <View style={{ gap: 10 }}>
          {actions.map((action) => (
            <ActionLink key={action.href} href={action.href} label={action.label} tone={action.tone} />
          ))}
        </View>
      </Card>
    </PhoneShell>
  );
}
