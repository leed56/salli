import { Text, View } from "react-native";

import { ActionLink, Card, Metric, PageHeader, PhoneShell, money } from "@/components/web/WebDemoShell";

const rows = [
  { name: "Milk powder 400g", qty: 24, cost: 1180 },
  { name: "Rice 5kg", qty: 18, cost: 2450 },
  { name: "Tea 200g", qty: 36, cost: 620 },
];

export default function ConfirmSupplierBillScreen() {
  const subtotal = 158008;
  const inputVat = 28442;
  const total = subtotal + inputVat;

  return (
    <PhoneShell>
      <PageHeader
        title="Review bill"
        description="Check extracted items before stock and VAT are updated."
        badge="Owner review"
      />

      <Card>
        <View style={{ gap: 4 }}>
          <Text style={{ color: "#94A3B8", fontSize: 13, fontWeight: "800" }}>Supplier</Text>
          <Text style={{ color: "#F8FAFC", fontSize: 22, fontWeight: "900" }}>Ceylon Wholesale Traders</Text>
        </View>

        {rows.map((item) => (
          <View key={item.name} style={{ borderTopWidth: 1, borderTopColor: "#1E293B", paddingTop: 12, gap: 4 }}>
            <Text style={{ color: "#F8FAFC", fontSize: 16, fontWeight: "800" }}>{item.name}</Text>
            <Text style={{ color: "#94A3B8", fontSize: 14 }}>
              Qty {item.qty} - Cost {money(item.cost)}
            </Text>
          </View>
        ))}

        <Metric label="Subtotal" value={money(subtotal)} tone="teal" />
        <Metric label="Input VAT" value={money(inputVat)} tone="amber" />
        <Metric label="Bill total" value={money(total)} tone="teal" />

        <Text
          style={{
            backgroundColor: "#2DD4BF",
            color: "#042F2E",
            borderRadius: 18,
            paddingVertical: 15,
            textAlign: "center",
            fontSize: 16,
            fontWeight: "900",
            overflow: "hidden",
          }}
        >
          Confirm bill
        </Text>
      </Card>

      <ActionLink href="/bills" label="Back to bills" tone="dark" />
    </PhoneShell>
  );
}
