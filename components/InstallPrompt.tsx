"use client";

import { useEffect, useState } from "react";

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const KEY = "tib-install-dismissed";

export default function InstallPrompt() {
  const [evt, setEvt] = useState<BIP | null>(null);
  const [ios, setIos] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    let dismissed = false;
    try { dismissed = localStorage.getItem(KEY) === "1"; } catch {}
    if (standalone || dismissed) return;
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua)) {
      setIos(true);
      setShow(true);
    }
    const onBip = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIP);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  function dismiss() {
    setShow(false);
    try { localStorage.setItem(KEY, "1"); } catch {}
  }

  async function install() {
    if (!evt) return;
    await evt.prompt();
    await evt.userChoice.catch(() => null);
    setEvt(null);
    dismiss();
  }

  if (!show) return null;
  return (
    <div className="card row g12" style={{ alignItems: "center", borderRadius: 20, padding: "14px 16px" }} role="region" aria-label="Install the app">
      <img src="/icons/icon-192.png" alt="" width={44} height={44} style={{ borderRadius: 11, flex: "none" }} />
      <span className="stack grow" style={{ minWidth: 0 }}>
        <span style={{ fontWeight: 500, fontSize: 15 }}>Add Take it back to your home screen</span>
        <span className="muted small">
          {ios ? <>Tap <strong style={{ fontWeight: 600 }}>Share</strong>, then <strong style={{ fontWeight: 600 }}>Add to Home Screen</strong>.</> : "Open it like an app, one tap away."}
        </span>
      </span>
      {evt && <button type="button" className="btn-plain" onClick={install} style={{ background: "#1A1A1A", color: "#fff", borderColor: "#1A1A1A", flex: "none" }}>Install</button>}
      <button type="button" className="btn-text" onClick={dismiss} aria-label="Dismiss" style={{ width: 44, flex: "none", color: "#5E5E5E" }}>✕</button>
    </div>
  );
}
