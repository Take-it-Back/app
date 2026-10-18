"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-BJDG7ZD8E8";

/**
 * Google Analytics, public pages only. Never loaded inside the signed-in app, so it can't see bills,
 * cases or health information. Ad features are off.
 * It is also kept off pages about medical bills and insurance (the `quiet` path prefixes), because a visit
 * to those pages can say something about a person's health. See the health data privacy memo.
 * Loads on the visitor's first scroll, tap or keypress (or after 4 seconds), so it never slows the first view.
 */
export default function Analytics({ quiet = [] }: { quiet?: string[] }) {
  const pathname = usePathname() || "";
  const isQuiet = quiet.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const quietRef = useRef(isQuiet);
  quietRef.current = isQuiet;

  // GA's own switch: while it is true, nothing is sent, even if the script is already loaded.
  useEffect(() => {
    if (!GA_ID) return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = isQuiet;
  }, [isQuiet]);

  useEffect(() => {
    if (!GA_ID) return;
    const w = window as unknown as { dataLayer: unknown[]; gtag?: (...a: unknown[]) => void; __gaLoaded?: boolean };
    let done = false;
    const events = ["scroll", "pointerdown", "keydown", "mousemove", "touchstart"] as const;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = () => {
      if (done || quietRef.current) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, load));
      if (timer) clearTimeout(timer);
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
    timer = setTimeout(load, 4000);
    events.forEach((e) => window.addEventListener(e, load, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, load));
      if (timer) clearTimeout(timer);
    };
  }, []);
  return null;
}
