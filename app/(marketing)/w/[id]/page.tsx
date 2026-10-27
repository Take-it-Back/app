import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CtaLink, Mark } from "@/components/ui";
import { getWin } from "@/lib/wins";
import { winWhat } from "@/lib/referrals";
import { money } from "@/lib/format";
import { SITE_URL } from "@/lib/seo";

const FIGHT: Record<string, string> = { medical: "/fight/medical-bills", insurance: "/fight/insurance-denials", landlord: "/fight/landlords", debt: "/fight/debt-collectors" };

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const w = await getWin((await params).id);
  if (!w) return { robots: { index: false } };
  const title = `${w.amount ? `${money(w.amount)} taken back` : "Taken back"} from ${winWhat(w.category)}`;
  const description = "Real people are fighting unfair bills, denials and landlords, and winning. Take it back finds the problems and writes the letters.";
  return {
    title,
    description,
    robots: { index: false },
    alternates: { canonical: `${SITE_URL}/w/${w.id}` },
    openGraph: { title, description, url: `${SITE_URL}/w/${w.id}`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function WinPage({ params }: { params: Promise<{ id: string }> }) {
  const w = await getWin((await params).id);
  if (!w) notFound();
  return (
    <main id="main" style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px 96px" }} className="stack g24">
      <div className="panel-gray stack g12" style={{ alignItems: "center", textAlign: "center", padding: "40px 24px", borderRadius: 12 }}>
        <Mark size={48} />
        <span className="eyebrow">Someone just took it back</span>
        <span className="serif" style={{ fontSize: "clamp(56px, 16vw, 96px)", lineHeight: 1 }}>{w.amount ? money(w.amount) : "Won"}</span>
        <span style={{ fontSize: 18 }}>from {winWhat(w.category)}</span>
      </div>
      <p style={{ fontSize: 18, margin: 0, textAlign: "center" }}>They scanned the paper, saw what was wrong, and sent the letter. You can too.</p>
      <div className="stack g8" style={{ alignItems: "center" }}>
        <CtaLink href="/login?mode=signup" variant="orange">Start free</CtaLink>
        {FIGHT[w.category] && <a href={FIGHT[w.category]} className="btn-text">How it works for {winWhat(w.category)}</a>}
      </div>
      <p className="muted small" style={{ textAlign: "center", margin: 0 }}>Shared by a Take it back member. Results vary; information, not legal advice.</p>
    </main>
  );
}
