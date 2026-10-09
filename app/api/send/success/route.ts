import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { completeSend } from "@/lib/sendFlow";

export const maxDuration = 60;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const supabase = await createClient();
  if (!sessionId || !stripeConfigured()) return NextResponse.redirect(`${url.origin}/app`);
  const session = await stripe().checkout.sessions.retrieve(sessionId);
  const sendId = session.metadata?.send_id;
  if (!sendId) return NextResponse.redirect(`${url.origin}/app`);
  const r = await completeSend(supabase, sendId);
  if (!r.caseId) return NextResponse.redirect(`${url.origin}/app`);
  const note = r.ok ? "Sent! We'll keep the tracking with your case, and we've started counting their deadline." : `Payment received, but sending hit a problem: ${r.error}. Tap "Try again" below.`;
  return NextResponse.redirect(`${url.origin}/app/cases/${r.caseId}/letter?id=${r.letterId}&note=${encodeURIComponent(note)}`);
}
