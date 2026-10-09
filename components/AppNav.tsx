"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Arrow, Avatar, Logo } from "./ui";

const I = {
  home: <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  cases: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  dates: <><path d="M4 6h16v14H4z" /><path d="M4 10h16" /><path d="M8 3v4" /><path d="M16 3v4" /></>,
  you: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14" /><path d="M12 17h.01" /></>,
};

function Icon({ d, size = 22 }: { d: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
  );
}

const scanIcon = <><path d="M4 8V6a2 2 0 0 1 2-2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M20 16v2a2 2 0 0 1-2 2h-2" /><path d="M8 20H6a2 2 0 0 1-2-2v-2" /><path d="M8 12h8" /></>;

export function TabBar() {
  const path = usePathname();
  const on = (p: string) => (p === "/app" ? path === "/app" : path.startsWith(p));
  return (
    <nav aria-label="Main" className="tabbar">
      <Link href="/app" className={on("/app") ? "on" : ""}><Icon d={I.home} />Home</Link>
      <Link href="/app/cases" className={on("/app/cases") ? "on" : ""}><Icon d={I.cases} />Cases</Link>
      <Link href="/app/scan" aria-label="Scan a document" className="scan"><Icon d={scanIcon} size={24} /></Link>
      <Link href="/app/dates" className={on("/app/dates") ? "on" : ""}><Icon d={I.dates} />Dates</Link>
      <Link href="/app/you" className={on("/app/you") ? "on" : ""}><Icon d={I.you} />You</Link>
    </nav>
  );
}

export function SideBar({ name, counts, admin = false }: { name: string; counts: Record<string, number>; admin?: boolean }) {
  const path = usePathname();
  const params = useSearchParams();
  const cat = params.get("c");
  const link = (href: string, label: string, active: boolean, extra?: React.ReactNode) => (
    <Link href={href} className={`side-link${active ? " on" : ""}`}>{extra}{label}</Link>
  );
  const fights: [string, string][] = [["medical", "Medical bills"], ["insurance", "Insurance"], ["landlord", "Landlord"], ["debt", "Debt"]];
  return (
    <aside className="app-side">
      <Logo href="/app" size={21} />
      <Link href="/app/scan" className="btn btn-ink" style={{ minHeight: 48, padding: "5px 5px 5px 18px", fontSize: 15 }}>
        Scan a document
        <span className="dot" style={{ width: 38, height: 38 }}><Arrow size={15} /></span>
      </Link>
      <nav aria-label="Main" className="stack" style={{ gap: 2 }}>
        <span className="side-group">Overview</span>
        {link("/app", "Today", path === "/app")}
        {link("/app/dates", "Dates", path.startsWith("/app/dates"))}
        <span className="side-group">Fights</span>
        {link("/app/cases", "All cases", path === "/app/cases" && !cat)}
        {fights.map(([k, l]) =>
          link(`/app/cases?c=${k}`, l, path === "/app/cases" && cat === k, <span style={{ width: 8, height: 8, borderRadius: 4, background: k === "medical" || k === "landlord" ? "#BF4F28" : "#1A1A1A" }} />)
        )}
        <span className="side-group">Support</span>
        {link("/app/help", "Get real help", path.startsWith("/app/help"))}
        {admin && link("/app/admin", "Admin", path.startsWith("/app/admin"))}
      </nav>
      <Link href="/app/you" className="row g12" style={{ marginTop: "auto", borderTop: "1px solid #EBEBEB", padding: "16px 8px 0", textDecoration: "none" }}>
        <Avatar size={36} />
        <span className="stack"><span style={{ fontSize: 14, fontWeight: 500 }}>{name || "Your account"}</span><span className="muted" style={{ fontSize: 12 }}>{counts.open ?? 0} open {counts.open === 1 ? "fight" : "fights"}</span></span>
      </Link>
    </aside>
  );
}
