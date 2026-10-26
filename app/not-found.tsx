import Link from "next/link";
import type { Metadata } from "next";
import { Logo, CtaLink } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="stack g20" style={{ minHeight: "100vh", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
      <Logo />
      <span className="hand" style={{ fontSize: 34, color: "#A8441F" }}>hmm, nothing here</span>
      <h1 className="h-l" style={{ maxWidth: 560 }}>We couldn&apos;t find that <em className="o">page</em>.</h1>
      <p className="lede" style={{ margin: 0 }}>It may have moved. Here are the places most people are looking for.</p>
      <div className="row wrap g12" style={{ justifyContent: "center" }}>
        <CtaLink href="/">Go home</CtaLink>
        <Link href="/app" className="btn-plain" style={{ minHeight: 52 }}>Your cases</Link>
        <Link href="/fight" className="btn-plain" style={{ minHeight: 52 }}>Who we fight</Link>
      </div>
    </main>
  );
}
