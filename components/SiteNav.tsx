"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FEATURES, PROBLEMS } from "@/lib/marketing";
import FeatureIcon from "./FeatureIcon";
import { CtaLink } from "./ui";

type Menu = "features" | "who" | null;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PlanPill({ plan }: { plan: "free" | "premium" | "both" }) {
  if (plan === "premium") return <span className="pill-pro">Premium</span>;
  if (plan === "free") return <span className="pill-free">Free</span>;
  return null;
}

export default function SiteNav() {
  const [open, setOpen] = useState<Menu>(null);
  const [mobile, setMobile] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const hover = (m: Menu) => ({
    onMouseEnter: () => {
      if (timer.current) clearTimeout(timer.current);
      setOpen(m);
    },
    onMouseLeave: () => {
      timer.current = setTimeout(() => setOpen(null), 160);
    },
  });

  return (
    <div ref={ref} className="row g8">
      <nav aria-label="Main" className="nav-top">
        <button type="button" aria-expanded={open === "features"} aria-controls="mega-features" onClick={() => setOpen(open === "features" ? null : "features")} {...hover("features")}>
          Features <Chevron open={open === "features"} />
        </button>
        <button type="button" aria-expanded={open === "who"} aria-controls="mega-who" onClick={() => setOpen(open === "who" ? null : "who")} {...hover("who")}>
          Who it helps <Chevron open={open === "who"} />
        </button>
        <Link href="/how-it-works">How it works</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/login">Sign in</Link>
      </nav>
      <span className="nav-cta"><CtaLink href="/login?mode=signup">Start free</CtaLink></span>
      <button type="button" className="nav-burger" aria-expanded={mobile} aria-controls="mobile-nav" aria-label={mobile ? "Close menu" : "Open menu"} onClick={() => setMobile(!mobile)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open === "features" && (
        <div id="mega-features" className="mega" {...hover("features")}>
          <div className="mega-in">
            <div className="stack g12">
              <span className="eyebrow">Everything it does</span>
              <div className="mega-grid">
                {FEATURES.map((f) => (
                  <Link key={f.slug} href={`/features/${f.slug}`} className="mega-item">
                    <span className="ico o"><FeatureIcon slug={f.slug} /></span>
                    <span className="stack g4">
                      <span style={{ fontWeight: 500 }}>{f.name}<PlanPill plan={f.plan} /></span>
                      <span className="muted small">{f.short}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/features" style={{ fontWeight: 500, fontSize: 15, padding: "4px 12px" }}>See all features</Link>
            </div>
            <div className="mega-side">
              <span className="eyebrow" style={{ color: "#F0A07E" }}>New here?</span>
              <span className="serif" style={{ fontSize: 26, lineHeight: 1.1 }}>From scary letter to <em style={{ color: "#F0A07E" }}>settled</em>, in five steps.</span>
              <span style={{ color: "#D4D4D4", fontSize: 14 }}>See how a real fight plays out, screen by screen.</span>
              <div style={{ marginTop: "auto" }}><CtaLink href="/how-it-works" variant="light">How it works</CtaLink></div>
            </div>
          </div>
        </div>
      )}

      {open === "who" && (
        <div id="mega-who" className="mega" {...hover("who")}>
          <div className="mega-in">
            <div className="stack g12">
              <span className="eyebrow">Problems we help with</span>
              <div className="mega-grid">
                {PROBLEMS.map((p) => (
                  <Link key={p.slug} href={`/help-with/${p.slug}`} className="mega-item">
                    <span className="ico o"><FeatureIcon slug={p.slug} /></span>
                    <span className="stack g4">
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                      <span className="muted small">{p.menu}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <Link href="/help-with" style={{ fontWeight: 500, fontSize: 15, padding: "4px 12px" }}>See everything we help with</Link>
            </div>
            <div className="mega-side">
              <span className="eyebrow" style={{ color: "#F0A07E" }}>For everyday people</span>
              <span className="serif" style={{ fontSize: 26, lineHeight: 1.1 }}>No lawyer-speak. No cut of what you <em style={{ color: "#F0A07E" }}>save</em>.</span>
              <span style={{ color: "#D4D4D4", fontSize: 14 }}>Built for anyone in the US with a bill or notice that feels wrong.</span>
              <div style={{ marginTop: "auto" }}><CtaLink href="/about" variant="light">Why we built it</CtaLink></div>
            </div>
          </div>
        </div>
      )}

      {mobile && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile">
          <span className="eyebrow">Features</span>
          {FEATURES.map((f) => <Link key={f.slug} href={`/features/${f.slug}`}>{f.name}<PlanPill plan={f.plan} /></Link>)}
          <span className="eyebrow">Who it helps</span>
          {PROBLEMS.map((p) => <Link key={p.slug} href={`/help-with/${p.slug}`}>{p.name}</Link>)}
          <span className="eyebrow">More</span>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/about">About</Link>
          <Link href="/login">Sign in</Link>
        </nav>
      )}
    </div>
  );
}
