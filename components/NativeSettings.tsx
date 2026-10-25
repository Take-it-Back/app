"use client";

import { useEffect, useState } from "react";
import { haptic } from "@/lib/native";

export const LOCK_KEY = "tib_faceid_lock";

const row = { padding: "12px 0", borderBottom: "1px solid #EBEBEB", fontSize: 15, gap: 12 } as const;
const sw = { width: 22, height: 22, accentColor: "#1A1A1A", flex: "none" } as const;

/** Registers this phone with Apple and saves its token. Resolves with the token, or null if not allowed. */
export async function registerPush(ask: boolean): Promise<string | null> {
  const { PushNotifications } = await import("@capacitor/push-notifications");
  let perm = await PushNotifications.checkPermissions();
  if (perm.receive === "prompt" && ask) perm = await PushNotifications.requestPermissions();
  if (perm.receive !== "granted") return null;
  const token = await new Promise<string | null>((resolve) => {
    const t = setTimeout(() => resolve(null), 15000);
    PushNotifications.addListener("registration", (tok) => { clearTimeout(t); resolve(tok.value); });
    PushNotifications.addListener("registrationError", () => { clearTimeout(t); resolve(null); });
    PushNotifications.register().catch(() => resolve(null));
  });
  if (token) await fetch("/api/push/device", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
  return token;
}

/** iPhone app settings: phone alerts through Apple, and locking the app with Face ID. */
export default function NativeSettings() {
  const [push, setPush] = useState<"loading" | "on" | "off" | "denied">("loading");
  const [lock, setLock] = useState(false);
  const [bio, setBio] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { PushNotifications } = await import("@capacitor/push-notifications");
        const p = await PushNotifications.checkPermissions();
        setPush(p.receive === "granted" ? "on" : p.receive === "denied" ? "denied" : "off");
      } catch {
        setPush("off");
      }
      try {
        const { NativeBiometric } = await import("@capgo/capacitor-native-biometric");
        const a = await NativeBiometric.isAvailable({ useFallback: true });
        if (a.isAvailable) setBio(a.biometryType === 2 ? "Face ID" : a.biometryType === 1 ? "Touch ID" : "your passcode");
        const { Preferences } = await import("@capacitor/preferences");
        setLock((await Preferences.get({ key: LOCK_KEY })).value === "1");
      } catch {}
    })();
  }, []);

  async function togglePush(on: boolean) {
    setMsg(null);
    if (on) {
      const tok = await registerPush(true).catch(() => null);
      if (tok) { setPush("on"); setMsg("Phone alerts are on. We'll nudge you before deadlines."); haptic("success"); }
      else { setPush("denied"); setMsg("Alerts are blocked. Turn on notifications for Take it back in your iPhone's Settings."); }
    } else {
      const { PushNotifications } = await import("@capacitor/push-notifications");
      await fetch("/api/push/device", { method: "DELETE", headers: { "content-type": "application/json" }, body: "{}" }).catch(() => {});
      await PushNotifications.unregister().catch(() => {});
      setPush("off");
    }
  }

  async function toggleLock(on: boolean) {
    setMsg(null);
    try {
      const { NativeBiometric } = await import("@capgo/capacitor-native-biometric");
      await NativeBiometric.verifyIdentity({ reason: on ? "Turn on the app lock" : "Turn off the app lock", useFallback: true });
      const { Preferences } = await import("@capacitor/preferences");
      await Preferences.set({ key: LOCK_KEY, value: on ? "1" : "0" });
      setLock(on);
      haptic("success");
    } catch {
      setMsg("That didn't go through. Nothing changed.");
    }
  }

  return (
    <>
      {push !== "loading" && (
        <label className="row between" style={row}>
          <span className="stack"><span>Phone alerts before deadlines</span>{push === "denied" && <span className="muted small">Blocked in your iPhone&apos;s Settings → Notifications.</span>}</span>
          <input type="checkbox" role="switch" checked={push === "on"} onChange={(e) => togglePush(e.target.checked)} style={sw} />
        </label>
      )}
      {bio && (
        <label className="row between" style={row}>
          <span className="stack"><span>Lock the app with {bio}</span><span className="muted small">Asks for {bio} each time you open the app.</span></span>
          <input type="checkbox" role="switch" checked={lock} onChange={(e) => toggleLock(e.target.checked)} style={sw} />
        </label>
      )}
      {msg && <span className="small" role="status" style={{ padding: "8px 0" }}>{msg}</span>}
    </>
  );
}
