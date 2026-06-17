import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { AuthGate } from "@/components/auth/AuthGate";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Screen } from "@/components/ui/Screen";
import { addExpense, listExpenses, type Expense } from "@/features/expenses/expenseRepository";
import { formatLkr } from "@/lib/currency";
import { useAppSession } from "@/stores/appSession";

const CATEGORIES = ["Rent", "Utilities", "Transport", "Supplies", "Salaries", "Other"];

export default function ExpensesScreen() {
  const { shopId } = useAppSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState("Rent");
  const [amount, setAmount] = useState("");
  const [vatClaimable, setVatClaimable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!shopId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setExpenses(await listExpenses(shopId));
    } catch (loadError) {
      console.error("load expenses failed", loadError);
      setError("Could not load expenses.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [shopId]);

  async function add() {
    const amountValue = Number(amount);
    if (!shopId || !category.trim() || !Number.isFinite(amountValue) || amountValue <= 0) {
      return;
    }
    setError(null);
    const { error: addError } = await addExpense(shopId, {
      category: category.trim(),
      amount: amountValue,
      vatClaimable,
    });
    if (addError) {
      setError("Could not save expense.");
      return;
    }
    setAmount("");
    setVatClaimable(false);
    await load();
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalVat = expenses.reduce((sum, expense) => sum + expense.vatAmount, 0);

  return (
    <Screen>
      <AuthGate>
        <View className="gap-6">
          <View>
            <Text className="text-sm font-black uppercase tracking-[4px] text-salli-amber">Expenses</Text>
            <Text className="mt-2 text-4xl font-black text-salli-text">Shop expenses</Text>
            <Text className="mt-3 text-base leading-7 text-salli-muted">
              Record running costs. Mark VAT-claimable expenses to reduce the VAT you owe.
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 rounded-[28px] bg-salli-card p-4">
              <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Total spent</Text>
              <Text className="mt-2 text-2xl font-black text-salli-text">{formatLkr(totalAmount)}</Text>
            </View>
            <View className="flex-1 rounded-[28px] bg-salli-card p-4">
              <Text className="text-xs font-black uppercase tracking-[3px] text-salli-muted">Claimable VAT</Text>
              <Text className="mt-2 text-2xl font-black text-salli-amber">{formatLkr(totalVat)}</Text>
            </View>
          </View>

          <PremiumCard eyebrow="Add" title="New expense" description="Pick a category, enter the amount, and flag if VAT is claimable." tone="amber">
            <View className="gap-3">
              <View className="flex-row flex-wrap gap-2">
                {CATEGORIES.map((option) => {
                  const selected = option === category;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setCategory(option)}
                      className={`rounded-2xl px-4 py-2 ${selected ? "bg-salli-teal" : "bg-slate-950"}`}
                    >
                      <Text className={selected ? "font-bold text-slate-950" : "text-salli-text"}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="Amount"
                placeholderTextColor="#64748B"
                className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
              />

              <Pressable
                onPress={() => setVatClaimable((value) => !value)}
                className="min-h-14 flex-row items-center justify-between rounded-2xl bg-slate-950 px-4"
              >
                <Text className="text-base text-salli-text">VAT claimable (18%)</Text>
                <View className={`h-7 w-12 justify-center rounded-full px-1 ${vatClaimable ? "bg-salli-teal" : "bg-slate-700"}`}>
                  <View className={`h-5 w-5 rounded-full bg-white ${vatClaimable ? "self-end" : "self-start"}`} />
                </View>
              </Pressable>

              <PremiumButton onPress={add}>Add expense</PremiumButton>
            </View>
          </PremiumCard>

          {error ? <Text className="rounded-2xl bg-salli-rose/10 p-4 text-base font-bold text-salli-text">{error}</Text> : null}
          {isLoading ? <Text className="rounded-2xl bg-salli-card p-4 text-base font-bold text-salli-muted">Loading expenses...</Text> : null}

          <PremiumCard eyebrow="History" title="Recent expenses" description={`${expenses.length} expense(s).`} tone="slate">
            <View className="gap-3">
              {!isLoading && expenses.length === 0 ? (
                <Text className="rounded-2xl bg-slate-950/50 p-4 text-base leading-6 text-salli-muted">
                  No expenses yet. Add your first expense above.
                </Text>
              ) : null}

              {expenses.map((expense) => (
                <View key={expense.id} className="flex-row justify-between gap-3 rounded-3xl bg-slate-950/50 p-5">
                  <View className="flex-1">
                    <Text className="text-lg font-black text-salli-text">{expense.category}</Text>
                    {expense.vatAmount > 0 ? (
                      <Text className="mt-1 text-sm text-salli-amber">VAT {formatLkr(expense.vatAmount)}</Text>
                    ) : (
                      <Text className="mt-1 text-sm text-salli-muted">No VAT</Text>
                    )}
                  </View>
                  <Text className="text-xl font-black text-salli-text">{formatLkr(expense.amount)}</Text>
                </View>
              ))}
            </View>
          </PremiumCard>
        </View>
      </AuthGate>
    </Screen>
  );
}
