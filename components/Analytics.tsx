"use client";

import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-BJDG7ZD8E8";

/**
 * Google Analytics, public pages only. Never loaded inside the signed-in app, so it can't see bills,
 * cases or health information. Ad features are off.
 * Loads on the visitor's first scroll, tap or keypress (or after 4 seconds), so it never slows the first view.
 */
export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const w = window as unknown as { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void; __gaLoaded?: boolean };
    let done = false;
    const events = ["scroll", "pointerdown", "keydown", "mousemove", "touchstart"] as const;
    const load = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);
      if (w.__gaLoaded) return;
      w.__gaLoaded = true;
      w.dataLayer = w.dataLayer || [];
      w.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    };
    const timer = setTimeout(load, 4000);
    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);
    };
  }, []);
  return null;
}
