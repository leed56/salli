import { Text, View } from "react-native";

import { ActionLink, BackHome, Card, Metric, PageHeader, PhoneShell, money } from "@/components/web/WebDemoShell";

export default function SupplierBillsScreen() {
  return (
    <PhoneShell>
      <PageHeader
        title="Supplier bills"
        description="Capture supplier bills, increase stock, and record input VAT for owner review."
        badge="AI bill capture"
      />

      <Card>
        <View style={{ gap: 4 }}>
          <Text style={{ color: "#94A3B8", fontSize: 13, fontWeight: "800" }}>Demo bill</Text>
          <Text style={{ color: "#F8FAFC", fontSize: 22, fontWeight: "900" }}>Ceylon Wholesale Traders</Text>
          <Text style={{ color: "#94A3B8", fontSize: 14 }}>18 items - input VAT detected</Text>
        </View>

        <Metric label="Bill total" value={money(186450)} />
        <Metric label="Input VAT" value={money(28442)} tone="amber" />

        <Text style={{ color: "#94A3B8", fontSize: 14, lineHeight: 21 }}>
          This browser preview avoids camera, AuthGate, Supabase, and SQLite so the route stays stable on web.
        </Text>

        <ActionLink href="/bills/confirm" label="Review bill" />
      </Card>

      <BackHome />
    </PhoneShell>
  );
}
