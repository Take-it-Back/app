import { ImageResponse } from "next/og";
import { getWin } from "@/lib/wins";
import { winWhat } from "@/lib/referrals";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A win shared from Take it back";

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const w = await getWin((await params).id);
  const amount = w?.amount ? usd(Number(w.amount)) : "Won";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F6F4EF", padding: 72, fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 64 64"><path d="M47 54V32a15 15 0 0 0-15-15H15" fill="none" stroke="#BF4F28" strokeWidth="8.5" strokeLinecap="round" /><path d="M26 6L15 17l11 11" fill="none" stroke="#BF4F28" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="47" cy="54" r="4.25" fill="#1A1A1A" /></svg>
          <span style={{ fontSize: 40, fontWeight: 700, color: "#1A1A1A", fontFamily: "sans-serif", letterSpacing: -1 }}>take it back</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 34, color: "#5E5E5E", fontFamily: "sans-serif" }}>Someone just took back</span>
          <span style={{ fontSize: 190, color: "#1A1A1A", lineHeight: 1 }}>{amount}</span>
          <span style={{ fontSize: 48, color: "#BF4F28", fontFamily: "sans-serif" }}>from {winWhat(w?.category || "other")}.</span>
        </div>
        <span style={{ fontSize: 28, color: "#5E5E5E", fontFamily: "sans-serif" }}>takeitback.app · Fight the bill. Keep what's yours.</span>
      </div>
    ),
    size
  );
}
