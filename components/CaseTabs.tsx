"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const TABS: [string, string][] = [
  ["", "Overview"],
  ["/found", "What we found"],
  ["/letter", "Letters"],
  ["/reply", "Their reply"],
  ["/docs", "Files"],
  ["/packet", "Packet"],
];

export default function CaseTabs({ id }: { id: string }) {
  const path = usePathname();
  const base = `/app/cases/${id}`;
  const rest = path.slice(base.length);
  const ref = useRef<HTMLAnchorElement>(null);
  const active = (t: string) => (t === "" ? rest === "" : rest.startsWith(t) || (t === "/write" && rest.startsWith("/letter")) || (t === "/escalate" && rest.startsWith("/small-claims")));
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [path]);
  if (rest.startsWith("/letter/print")) return null;
  return (
    <nav aria-label="Case sections" className="case-tabs no-print">
      <div>
        {TABS.map(([t, label]) => {
          const on = active(t);
          return (
            <Link key={t} href={base + t} ref={on ? ref : undefined} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
