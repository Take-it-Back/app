"use client";

import { isNativeApp } from "@/lib/native";

/** App store subscriptions are changed or canceled in the App Store or Google Play, not with us. */
export default function ManageApple({ label = "Cancel or change plan", store = "apple" }: { label?: string; store?: "apple" | "google" }) {
  async function open() {
    if (isNativeApp()) {
      try {
        const { NativePurchases } = await import("@capgo/native-purchases");
        await NativePurchases.manageSubscriptions();
        return;
      } catch {}
    }
    window.location.href = store === "google" ? "https://play.google.com/store/account/subscriptions" : "https://apps.apple.com/account/subscriptions";
  }
  return <button type="button" className="btn-plain" onClick={open}>{label}</button>;
}
