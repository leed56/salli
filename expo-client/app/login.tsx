import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { completeLogin, startLogin } from "@/features/login/loginApi";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSendCode() {
    setIsSubmitting(true);
    setMessage(null);
    const { error } = await startLogin(phone.trim());
    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setStep("code");
    setMessage("Code sent. Enter it below to continue.");
  }

  async function handleVerifyCode() {
    setIsSubmitting(true);
    setMessage(null);
    const { error } = await completeLogin(phone.trim(), code.trim());
    setIsSubmitting(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Login complete. Route guard will send you to shop setup or Home.");
  }

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-center gap-6">
        <View>
          <Text className="text-sm font-semibold uppercase tracking-[3px] text-salli-teal">
            Salli
          </Text>
          <Text className="mt-2 text-4xl font-black text-salli-text">
            Sign in to your shop
          </Text>
          <Text className="mt-3 text-base leading-6 text-salli-muted">
            Use your Sri Lankan mobile number. Salli will send a short login code.
          </Text>
        </View>

        <View className="gap-4 rounded-[32px] bg-salli-card p-5">
          <TextInput
            value={phone}
            onChangeText={setPhone}
            editable={step === "phone"}
            keyboardType="phone-pad"
            placeholder="+94 77 123 4567"
            placeholderTextColor="#64748B"
            className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
          />

          {step === "code" ? (
            <TextInput
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              placeholder="Login code"
              placeholderTextColor="#64748B"
              className="min-h-14 rounded-2xl bg-slate-950 px-4 text-lg text-salli-text"
            />
          ) : null}

          <Pressable
            disabled={isSubmitting}
            onPress={step === "phone" ? handleSendCode : handleVerifyCode}
            className="min-h-14 items-center justify-center rounded-2xl bg-salli-teal px-5"
          >
            <Text className="text-lg font-bold text-slate-950">
              {isSubmitting ? "Please wait..." : step === "phone" ? "Send code" : "Verify code"}
            </Text>
          </Pressable>

          {message ? <Text className="text-base text-salli-muted">{message}</Text> : null}
        </View>
      </View>
    </Screen>
  );
}
