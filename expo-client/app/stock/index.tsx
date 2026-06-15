import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { Screen } from "@/components/ui/Screen";
import { formatLkr } from "@/lib/currency";

type StockItem = {
  id: string;
  name: string;
  sellPrice: number;
  stockQty: number;
  reorderLevel: number;
};

const starterItems: StockItem[] = [
  { id: "rice", name: "Rice 5kg", sellPrice: 1850, stockQty: 14, reorderLevel: 5 },
  { id: "milk", name: "Milk powder", sellPrice: 1240, stockQty: 3, reorderLevel: 6 },
  { id: "soap", name: "Soap", sellPrice: 180, stockQty: 25, reorderLevel: 10 },
];

export default function StockScreen() {
  const [items, setItems] = useState(starterItems);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  function addItem() {
    const sellPrice = Number(price);
    if (!name.trim() || !Number.isFinite(sellPrice)) return;

    setItems((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        name: name.trim(),
        sellPrice,
        stockQty: 0,
        reorderLevel: 0,
      },
    ]);
    setName("");
    setPrice("");
  }

  return (
    <Screen>
      <AuthGate>
        <View className="gap-6">
          <View>
            <Text className="text-sm font-semibold uppercase tracking-[3px] text-salli-teal">
              Stock
            </Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">
              Products and stock levels
            </Text>
          </View>

          <View className="gap-3 rounded-[32px] bg-salli-card p-5">
            <Text className="text-xl font-bold text-salli-text">Quick add product</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Product name"
              placeholderTextColor="#64748B"
              className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
            />
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              placeholder="Sell price"
              placeholderTextColor="#64748B"
              className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
            />
            <Pressable onPress={addItem} className="min-h-14 items-center justify-center rounded-2xl bg-salli-teal px-5">
              <Text className="text-lg font-bold text-slate-950">Add product</Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {items.map((item) => {
              const lowStock = item.stockQty <= item.reorderLevel;
              return (
                <View key={item.id} className="rounded-3xl bg-salli-card p-5">
                  <View className="flex-row justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-salli-text">{item.name}</Text>
                      <Text className="mt-1 text-base text-salli-muted">{formatLkr(item.sellPrice)}</Text>
                    </View>
                    <View className="items-end">
                      <Text className={lowStock ? "text-xl font-black text-salli-rose" : "text-xl font-black text-salli-teal"}>
                        {item.stockQty}
                      </Text>
                      <Text className="text-sm text-salli-muted">in stock</Text>
                    </View>
                  </View>
                  {lowStock ? <Text className="mt-3 text-sm font-bold text-salli-rose">Low stock</Text> : null}
                </View>
              );
            })}
          </View>
        </View>
      </AuthGate>
    </Screen>
  );
}
