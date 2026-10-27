"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import GuideCover from "@/components/GuideCover";
import { CATEGORIES, KINDS, kindLabel, type GuideCategory, type GuideKind, type IconKey } from "@/lib/guideMeta";

export type GuideCardData = {
  slug: string; title: string; description: string;
  category: GuideCategory; kind: GuideKind; icon: IconKey; minutes: number;
};

export function GuideCard({ g }: { g: GuideCardData }) {
  const cat = CATEGORIES.find((c) => c.slug === g.category);
  return (
    <Link href={`/guides/${g.slug}`} className="card stack" style={{ textDecoration: "none", padding: 0, borderRadius: 12, overflow: "hidden", gap: 0 }}>
      <GuideCover slug={g.slug} category={g.category} icon={g.icon} />
      <span className="stack g8" style={{ padding: "18px 20px 20px", flex: 1 }}>
        <span className="eyebrow" style={{ color: cat?.ink }}>{cat?.name}</span>
        <span className="serif" style={{ fontSize: 22, lineHeight: 1.18 }}>{g.title}</span>
        <span className="muted" style={{ fontSize: 15 }}>{g.description}</span>
        <span className="muted small" style={{ marginTop: "auto", paddingTop: 6 }}>{kindLabel(g.kind)} · {g.minutes} min read</span>
      </span>
    </Link>
  );
}

const GRID = { gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 } as const;
// Filtering stays in the page and never goes into the web address, so nothing about
// what someone is looking for (for example medical bills) is sent anywhere.
export default function GuideBrowser({ guides }: { guides: GuideCardData[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<GuideCategory | "all">("all");
  const [kind, setKind] = useState<GuideKind | "all">("all");

  const active = q.trim() !== "" || cat !== "all" || kind !== "all";
  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return guides.filter((g) => {
      if (cat !== "all" && g.category !== cat) return false;
      if (kind !== "all" && g.kind !== kind) return false;
      if (!words.length) return true;
      const hay = `${g.title} ${g.description} ${CATEGORIES.find((c) => c.slug === g.category)?.name}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [guides, q, cat, kind]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const g of guides) m.set(g.category, (m.get(g.category) ?? 0) + 1);
    return m;
  }, [guides]);

  return (
    <>
      <div className="stack g12" style={{ padding: "6px 0 14px", borderBottom: "1px solid var(--line)" }}>
        <div className="row wrap g8" style={{ alignItems: "center" }}>
          <label htmlFor="guide-search" className="sr-only" style={{ position: "absolute", left: -9999 }}>Search guides</label>
          <input
            id="guide-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides, like “refund” or “garnishment”"
            autoComplete="off"
            style={{ flex: "1 1 260px", minHeight: 48, padding: "0 18px", borderRadius: 999, border: "1px solid var(--line-2)", fontSize: 16, font: "inherit" }}
          />
          <label htmlFor="guide-kind" className="sr-only" style={{ position: "absolute", left: -9999 }}>Type of guide</label>
          <select
            id="guide-kind" value={kind} onChange={(e) => setKind(e.target.value as GuideKind | "all")}
            style={{ minHeight: 48, padding: "0 16px", borderRadius: 999, border: "1px solid var(--line-2)", fontSize: 15, background: "#fff", font: "inherit" }}
          >
            <option value="all">All types</option>
            {KINDS.map((k) => <option key={k.slug} value={k.slug}>{k.label}</option>)}
          </select>
        </div>
        <div className="chips" role="group" aria-label="Filter by topic" style={{ flexWrap: "nowrap", overflowX: "auto", paddingBottom: 4 }}>
          <button type="button" className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")} style={{ flex: "none" }}>All ({guides.length})</button>
          {CATEGORIES.map((c) => (
            <button key={c.slug} type="button" className="chip" aria-pressed={cat === c.slug} onClick={() => setCat(cat === c.slug ? "all" : c.slug)} style={{ flex: "none" }}>
              {c.name} ({counts.get(c.slug) ?? 0})
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" className="muted small" style={{ margin: "18px 0 14px", minHeight: 20 }}>
        {active ? (
          <>
            {results.length} {results.length === 1 ? "guide" : "guides"} found.{" "}
            <button type="button" onClick={() => { setQ(""); setCat("all"); setKind("all"); }} style={{ background: "none", border: 0, padding: "10px 4px", minHeight: 44, font: "inherit", color: "var(--orange-ink)", textDecoration: "underline", cursor: "pointer" }}>Clear filters</button>
          </>
        ) : "Pick a topic above, search, or browse every topic below."}
      </div>

      {active ? (
        results.length ? (
          <div className="grid-auto" style={GRID}>{results.map((g) => <GuideCard key={g.slug} g={g} />)}</div>
        ) : (
          <div className="panel-gray stack g8" style={{ padding: 28 }}>
            <strong>No guides match that yet.</strong>
            <span className="muted">Try a shorter search, or clear the filters. Scan your letter or bill free and we&apos;ll tell you what applies.</span>
          </div>
        )
      ) : (
        <div className="stack" style={{ gap: 56 }}>
          {CATEGORIES.map((c) => {
            const list = guides.filter((g) => g.category === c.slug);
            if (!list.length) return null;
            return (
              <section key={c.slug} className="stack g12" aria-labelledby={`cat-${c.slug}`}>
                <div className="row wrap between g12" style={{ alignItems: "flex-end" }}>
                  <div className="stack g4">
                    <h2 id={`cat-${c.slug}`} className="serif" style={{ fontSize: 32, margin: 0, fontWeight: 400 }}>{c.name}</h2>
                    <p className="muted" style={{ margin: 0, fontSize: 16 }}>{c.blurb}</p>
                  </div>
                  <Link href={`/guides/category/${c.slug}`} className="tap" style={{ fontWeight: 600, fontSize: 15 }}>All {list.length} guides →</Link>
                </div>
                <div className="grid-auto" style={GRID}>{list.slice(0, 3).map((g) => <GuideCard key={g.slug} g={g} />)}</div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
