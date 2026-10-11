"use client";

import { useEffect, useState } from "react";

const KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

type State = "loading" | "unsupported" | "off" | "on" | "denied";

function keyBytes(base64: string) {
  const b64 = (base64 + "=".repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function registration() {
  const existing = await navigator.serviceWorker.getRegistration("/");
  if (!existing) await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  return navigator.serviceWorker.ready;
}

async function save(sub: PushSubscription) {
  const res = await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: sub.toJSON() }) });
  if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error || "Couldn't turn on alerts. Please try again.");
}

export default function PushToggle({ canTest = false }: { canTest?: boolean }) {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (!KEY) return;
    setIos(/iPhone|iPad|iPod/.test(navigator.userAgent));
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    (async () => {
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = await reg?.pushManager.getSubscription();
      if (sub && Notification.permission === "granted") {
        setState("on");
        save(sub).catch(() => {}); // Keep the server copy in sync.
      } else setState("off");
    })().catch(() => setState("off"));
  }, []);

  if (!KEY || state === "loading") return null;

  async function turnOn() {
    setBusy(true);
    setMsg(null);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState(perm === "denied" ? "denied" : "off");
        if (perm !== "denied") setMsg("No problem. You can turn alerts on any time.");
        return;
      }
      const reg = await registration();
      const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(KEY!) }));
      await save(sub);
      setState("on");
      setMsg("Phone alerts are on. We'll nudge you before deadlines.");
    } catch (e) {
      setMsg(e instanceof Error && e.message ? e.message : "Couldn't turn on alerts. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function turnOff() {
    setBusy(true);
    setMsg(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/subscribe", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) });
        await sub.unsubscribe();
      }
      setState("off");
      setMsg("Phone alerts are off.");
    } catch {
      setMsg("Couldn't turn off alerts. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function test() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setMsg(res.ok ? "Test sent. It should pop up in a few seconds." : j.error || "Couldn't send the test. Please try again.");
    } catch {
      setMsg("Couldn't send the test. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack g8" style={{ padding: "12px 0", borderBottom: "1px solid #EBEBEB", fontSize: 15 }}>
      <span className="stack">
        <span>Phone alerts</span>
        <span className="muted small">A short heads-up on this device before a deadline. Alerts never include case details.</span>
      </span>
      {state === "unsupported" ? (
        <span className="muted small">{ios ? "On iPhone, add Take it back to your Home Screen first, then turn this on." : "This browser can't show phone alerts. Try Chrome, Edge, Firefox or Safari."}</span>
      ) : state === "denied" ? (
        <span className="muted small">Alerts are blocked for Take it back. To get them, allow notifications for this site in your phone or browser settings, then come back here.</span>
      ) : (
        <span className="row g8" style={{ flexWrap: "wrap" }}>
          <button type="button" className="btn-plain" disabled={busy} onClick={state === "on" ? turnOff : turnOn}>
            {state === "on" ? "Turn off phone alerts" : "Turn on phone alerts"}
          </button>
          {state === "on" && canTest && (
            <button type="button" className="btn-text small" disabled={busy} onClick={test}>
              Send a test alert
            </button>
          )}
        </span>
      )}
      {msg && <span className="small" role="status">{msg}</span>}
    </div>
  );
}
