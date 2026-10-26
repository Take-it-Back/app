import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Status: is Take it back working?",
  description: "Live status of the Take it back website and app, checked every minute, with uptime for the last 30 days.",
  path: "/status",
});
export const revalidate = 60;

type Part = { name: string; up: boolean; last_ok: boolean | null; uptime_24h: number | null; uptime_30d: number | null; ms_24h: number | null; days: { day: string; pct: number }[] };
type Incident = { part: string; began: string; ended: string; minutes: number; ongoing: boolean };
type Status = { checked_at: string | null; parts: Part[]; incidents: Incident[] };

const when = (iso: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }).format(new Date(iso)) + " ET";
const pct = (n: number | null) => (n == null ? "—" : `${n >= 99.995 ? "100" : n.toFixed(2)}%`);
const dayColor = (p?: number) => (p == null ? "var(--line)" : p >= 99.5 ? "#3C7D4E" : p >= 95 ? "#D9A441" : "var(--orange)");

export default async function StatusPage() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc("uptime_status");
  const s = data as Status | null;
  const stale = !s?.checked_at || Date.now() - new Date(s.checked_at).getTime() > 10 * 60000;
  const down = s?.parts.filter((p) => !p.up) || [];
  const headline = error || !s ? "We couldn't load the status right now" : down.length ? `${down.map((d) => d.name).join(", ")} ${down.length > 1 ? "are" : "is"} having trouble` : "Everything is working";
  // The last 30 days, oldest first, so each part shows one bar per day.
  const days = Array.from({ length: 30 }, (_, i) => new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10));
  return (
    <main id="main" className="stack g24" style={{ maxWidth: 820, margin: "0 auto", padding: "72px 24px 96px" }}>
      <span className="eyebrow">Status</span>
      <div className={down.length || error ? "panel-orange" : "panel-gray"} style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: 7, flex: "none", background: down.length || error ? "var(--orange)" : "#3C7D4E" }} />
        <span className="stack g4">
          <h1 className="serif" style={{ margin: 0, fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1.15 }}>{headline}</h1>
          {s?.checked_at && <span className="muted small">Checked every minute. Last check {when(s.checked_at)}{stale ? " (the checker may be paused)" : ""}.</span>}
        </span>
      </div>

      <section className="stack g16" aria-label="Parts of the service">
        {s?.parts.map((p) => {
          const byDay = new Map(p.days.map((d) => [d.day, d.pct]));
          return (
            <div key={p.name} className="card stack g12" style={{ borderRadius: 20 }}>
              <div className="row between wrap g8" style={{ alignItems: "baseline" }}>
                <span style={{ fontWeight: 600, fontSize: 17 }}>{p.name}</span>
                <span className={`tag ${p.up ? "tag-gray" : "tag-orange"}`}>{p.up ? "Working" : "Having trouble"}</span>
              </div>
              <div role="img" aria-label={`${p.name}: ${pct(p.uptime_30d)} up over the last 30 days`} style={{ display: "grid", gridTemplateColumns: "repeat(30, 1fr)", gap: 3 }}>
                {days.map((d) => <span key={d} title={`${d}: ${byDay.has(d) ? pct(byDay.get(d)!) : "no data"}`} style={{ height: 28, borderRadius: 3, background: dayColor(byDay.get(d)) }} />)}
              </div>
              <span className="muted small">{pct(p.uptime_30d)} up over 30 days · {pct(p.uptime_24h)} in the last 24 hours</span>
            </div>
          );
        })}
      </section>

      <section className="stack g8">
        <h2 className="serif" style={{ margin: 0, fontSize: 26 }}>Recent problems</h2>
        {!s?.incidents.length ? (
          <p className="muted" style={{ margin: 0 }}>None in the last 30 days.</p>
        ) : (
          <ul className="stack g8" style={{ margin: 0, paddingLeft: 18 }}>
            {s.incidents.map((i) => (
              <li key={i.part + i.began}>{i.part}: {i.ongoing ? `down since ${when(i.began)}` : `down ${when(i.began)} for about ${i.minutes} minute${i.minutes === 1 ? "" : "s"}`}</li>
            ))}
          </ul>
        )}
      </section>
      <p className="muted small" style={{ margin: 0 }}>Something not working that isn&apos;t shown here? <Link href="/support">Tell us</Link>.</p>
    </main>
  );
}
