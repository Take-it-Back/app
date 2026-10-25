"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isNativeApp } from "@/lib/native";
import { LOCK_KEY, registerPush } from "@/components/NativeSettings";

const SITE_HOSTS = ["www.takeitback.app", "takeitback.app"];

/** Only does anything inside the iPhone app: links, notifications, Face ID lock and purchase sync. */
export default function NativeBridge() {
  const router = useRouter();
  const path = usePathname();
  const [native, setNative] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!isNativeApp()) return;
    setNative(true);
    document.documentElement.classList.add("native-app");
    const cleanups: (() => void)[] = [];

    const go = (url: string) => {
      try {
        const u = new URL(url, window.location.origin);
        if (SITE_HOSTS.includes(u.hostname) || u.origin === window.location.origin) router.push(u.pathname + u.search + u.hash);
      } catch {}
    };

    (async () => {
      const [{ App }, { StatusBar, Style }, { SplashScreen }, { PushNotifications }] = await Promise.all([
        import("@capacitor/app"),
        import("@capacitor/status-bar"),
        import("@capacitor/splash-screen"),
        import("@capacitor/push-notifications"),
      ]);
      StatusBar.setStyle({ style: Style.Light }).catch(() => {});
      SplashScreen.hide().catch(() => {});

      // Universal links (emails, shared links) open the right page in the app.
      const a = await App.addListener("appUrlOpen", (e) => go(e.url));
      // Tapping a notification opens the page it points to.
      const b = await PushNotifications.addListener("pushNotificationActionPerformed", (n) => go(String(n.notification.data?.url || "/app")));
      // Ask for Face ID again when the app comes back after more than 30 seconds away.
      // (The Face ID prompt itself briefly makes the app inactive, so short gaps don't count.)
      let away = 0;
      const c = await App.addListener("appStateChange", async ({ isActive }) => {
        if (!isActive) { away = Date.now(); return; }
        if (away && Date.now() - away > 30000 && (await lockOn())) setLocked(true);
        away = 0;
      });
      cleanups.push(() => { a.remove(); b.remove(); c.remove(); });

      if (await lockOn()) setLocked(true);
    })().catch(() => {});

    return () => cleanups.forEach((f) => f());
  }, [router]);

  // Once per launch when signed in: refresh the phone's alert token and re-check Apple subscriptions.
  useEffect(() => {
    if (!native || !path.startsWith("/app") || sessionStorage.getItem("tib_synced")) return;
    sessionStorage.setItem("tib_synced", "1");
    registerPush(false).catch(() => {});
    (async () => {
      const { NativePurchases, PURCHASE_TYPE } = await import("@capgo/native-purchases");
      const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.SUBS, onlyCurrentEntitlements: true });
      const jws = purchases.map((p) => p.jwsRepresentation).filter(Boolean);
      if (jws.length) {
        const r = await fetch("/api/apple/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jws }) });
        if (r.ok) router.refresh();
      }
    })().catch(() => {});
  }, [native, path, router]);

  useEffect(() => {
    if (locked) unlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked]);

  async function unlock() {
    try {
      const { NativeBiometric } = await import("@capgo/capacitor-native-biometric");
      await NativeBiometric.verifyIdentity({ reason: "Unlock Take it back", useFallback: true });
      setLocked(false);
    } catch {}
  }

  if (!locked || !path.startsWith("/app")) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="App locked" style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#F6F4EF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 24 }}>
      <img src="/icons/icon-192.png" width={72} height={72} alt="" style={{ borderRadius: 18 }} />
      <span className="serif" style={{ fontSize: 28 }}>Take it back is locked</span>
      <button type="button" className="btn btn-ink" onClick={unlock}>Unlock</button>
    </div>
  );
}

async function lockOn() {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    return (await Preferences.get({ key: LOCK_KEY })).value === "1";
  } catch {
    return false;
  }
}
