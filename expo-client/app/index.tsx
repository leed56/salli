import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { ActionLink, Card, Metric, PageHeader, PhoneShell, money } from "@/components/web/WebDemoShell";
import { fetchDashboard, type DashboardData } from "@/features/dashboard/dashboardRepository";
import { useAppSession } from "@/stores/appSession";

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
  const { userId, shopId, hydrated } = useAppSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (!hydrated || !userId || !shopId) {
      return;
    }

    setIsLoading(true);
    fetchDashboard(shopId)
      .then((next) => {
        if (active) setData(next);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hydrated, userId, shopId]);

  if (!hydrated) {
    return (
      <PhoneShell>
        <PageHeader title="Salli" description="Loading your shop..." badge="Salli" />
      </PhoneShell>
    );
  }

  if (!userId) {
    return (
      <PhoneShell>
        <PageHeader
          title="Your shop, under control"
          description="Sign in to capture sales, manage stock and credit, and always know your VAT payable."
          badge="Salli"
        />
        <Card>
          <Text style={{ color: "#CBD5E1", fontSize: 15, lineHeight: 22 }}>
            Salli is a billing, stock, credit and VAT control center for Sri Lankan shops.
          </Text>
          <ActionLink href="/login" label="Sign in" tone="teal" />
        </Card>
      </PhoneShell>
    );
  }

  if (!shopId) {
    return (
      <PhoneShell>
        <PageHeader title="Finish setting up" description="Create your shop profile to start using Salli." badge="Setup" />
        <Card>
          <ActionLink href="/onboarding" label="Create your shop" tone="teal" />
        </Card>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <PageHeader
        title="Your shop is under control"
        description="Live view of your shop: VAT payable, today's sales, stock, and credit."
        badge="Owner"
      />

      <Card>
        <Text style={{ color: "#CBD5E1", fontSize: 14, fontWeight: "800" }}>Live quarter meter</Text>
        <Metric label="VAT payable this quarter" value={data ? money(data.vatPayable) : "—"} tone="teal" />
        <Text style={{ color: "#94A3B8", fontSize: 14, lineHeight: 21 }}>
          {isLoading ? "Updating from your latest sales and bills..." : "Updates after every sale, supplier bill, and claimable VAT expense."}
        </Text>
        <ActionLink href="/vat" label="Open VAT meter" />
      </Card>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Metric label="Today sales" value={data ? money(data.todaySales) : "—"} tone="amber" />
        </View>
        <View style={{ flex: 1 }}>
          <Metric label="Credit due" value={data ? money(data.creditDue) : "—"} tone="rose" />
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Metric label="Products" value={data ? String(data.productCount) : "—"} tone="teal" />
        </View>
        <View style={{ flex: 1 }}>
          <Metric label="Low stock" value={data ? `${data.lowStockCount} items` : "—"} tone="rose" />
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
