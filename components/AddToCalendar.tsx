"use client";

import { useState } from "react";
import { haptic, isNativeApp } from "@/lib/native";

const pad = (n: number) => String(n).padStart(2, "0");
const icsDate = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const esc = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

/** Adds a deadline to the phone's calendar (native prompt in the app, an .ics file on the web). */
export default function AddToCalendar({ title, date, caseTitle, url }: { title: string; date: string; caseTitle?: string; url?: string }) {
  const [done, setDone] = useState(false);
  const label = `Add "${title}" to your calendar`;

  async function add() {
    const [y, m, d] = date.split("-").map(Number);
    const start = new Date(y, m - 1, d, 9, 0, 0);
    const note = `${caseTitle ? `${caseTitle}. ` : ""}From Take it back.`;
    const link = url ? new URL(url, window.location.origin).toString() : undefined;
    if (isNativeApp()) {
      try {
        const { CapacitorCalendar } = await import("@ebarooni/capacitor-calendar");
        const r = await CapacitorCalendar.createEventWithPrompt({ title, startDate: start.getTime(), endDate: start.getTime() + 86400000, isAllDay: true, description: note, url: link, alerts: [-1440 * 2 + 540, 540] });
        if (r.id) { setDone(true); haptic("success"); }
      } catch {}
      return;
    }
    const next = new Date(y, m - 1, d + 1);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Take it back//Deadlines//EN", "BEGIN:VEVENT",
      `UID:${date}-${title.replace(/\W+/g, "-").toLowerCase()}@takeitback.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
      `DTSTART;VALUE=DATE:${icsDate(start)}`, `DTEND;VALUE=DATE:${icsDate(next)}`,
      `SUMMARY:${esc(title)}`, `DESCRIPTION:${esc(note + (link ? ` ${link}` : ""))}`,
      "BEGIN:VALARM", "TRIGGER:-P2D", "ACTION:DISPLAY", `DESCRIPTION:${esc(title)}`, "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${title.replace(/[^\w ]+/g, "").trim() || "deadline"}.ics`;
    a.click();
    setDone(true);
  }

  return (
    <button type="button" onClick={add} aria-label={label} title={label} className="btn-text" style={{ minWidth: 44, minHeight: 44, justifyContent: "center", flex: "none", color: done ? "#BF4F28" : "#5E5E5E" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" />{done ? <path d="M9 15l2 2 4-4" /> : <path d="M12 13v5M9.5 15.5h5" />}
      </svg>
    </button>
  );
}
