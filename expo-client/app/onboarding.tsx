import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { createShop } from "@/features/onboarding/onboardingApi";

export default function OnboardingScreen() {
  const [name, setName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreateShop() {
    setIsSubmitting(true);
    setMessage(null);

    const result = await createShop({
      name: name.trim(),
      vatNumber: vatNumber.trim() || undefined,
      quarterStartMonth: 4,
      language,
    });

    setIsSubmitting(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Shop created. Route guard will send you to Home.");
  }

  return (
    <Screen>
      <View className="gap-6">
        <View>
          <Text className="text-sm font-semibold uppercase tracking-[3px] text-salli-teal">
            Setup
          </Text>
          <Text className="mt-2 text-4xl font-black text-salli-text">
            Create your shop
          </Text>
          <Text className="mt-3 text-base leading-6 text-salli-muted">
            Add the details Salli needs to prepare billing, stock, and quarterly summaries.
          </Text>
        </View>

        <View className="gap-4 rounded-[32px] bg-salli-card p-5">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Shop name"
            placeholderTextColor="#64748B"
            className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
          />

          <TextInput
            value={vatNumber}
            onChangeText={setVatNumber}
            placeholder="VAT number optional"
            placeholderTextColor="#64748B"
            className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
          />

          <View className="gap-2">
            <Text className="text-sm font-semibold text-salli-muted">Language</Text>
            <View className="flex-row gap-2">
              {([
                ["en", "English"],
                ["si", "සිංහල"],
                ["ta", "தமிழ்"],
              ] as const).map(([value, label]) => (
                <Pressable
                  key={value}
                  onPress={() => setLanguage(value)}
                  className={`flex-1 rounded-2xl px-3 py-3 ${language === value ? "bg-salli-teal" : "bg-slate-950"}`}
                >
                  <Text className={`text-center font-bold ${language === value ? "text-slate-950" : "text-salli-text"}`}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            disabled={isSubmitting || !name.trim()}
            onPress={handleCreateShop}
            className="min-h-14 items-center justify-center rounded-2xl bg-salli-teal px-5"
          >
            <Text className="text-lg font-bold text-slate-950">
              {isSubmitting ? "Creating..." : "Create shop"}
            </Text>
          </Pressable>

          {message ? <Text className="text-base text-salli-muted">{message}</Text> : null}
        </View>
      </View>
    </Screen>
  );
}
