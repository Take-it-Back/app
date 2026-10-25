"use client";

import { isNativeApp } from "@/lib/native";

/** Apple subscriptions are changed or canceled in the App Store, not with us. */
export default function ManageApple({ label = "Cancel or change plan" }: { label?: string }) {
  async function open() {
    if (isNativeApp()) {
      try {
        const { NativePurchases } = await import("@capgo/native-purchases");
        await NativePurchases.manageSubscriptions();
        return;
      } catch {}
    }
    window.location.href = "https://apps.apple.com/account/subscriptions";
  }
  return <button type="button" className="btn-plain" onClick={open}>{label}</button>;
}
