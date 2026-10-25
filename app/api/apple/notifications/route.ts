import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { appleState, applyApple, verifyNotification, verifyRenewalInfo, verifyTransaction } from "@/lib/apple";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// App Store Server Notifications (version 2): renewals, cancellations, billing problems and refunds.
// Set this URL for both Production and Sandbox in App Store Connect → App Information.
export async function POST(request: Request) {
  const { signedPayload } = (await request.json().catch(() => ({}))) as { signedPayload?: string };
  if (!signedPayload) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  let note;
  try {
    note = await verifyNotification(signedPayload);
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }
  if (note.notificationType === "TEST") return NextResponse.json({ ok: true, test: true });

  const txJws = note.data?.signedTransactionInfo;
  if (!txJws) return NextResponse.json({ ok: true, skipped: true });
  try {
    const tx = await verifyTransaction(txJws);
    const renewal = note.data?.signedRenewalInfo ? await verifyRenewalInfo(note.data.signedRenewalInfo).catch(() => null) : null;
    const state = appleState(tx, renewal);
    if (!state) return NextResponse.json({ ok: true, skipped: true });
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
    const hint = state.userHint && UUID.test(state.userHint) ? state.userHint.toLowerCase() : null;
    const saved = await applyApple(supabase, hint, state);
    return NextResponse.json({ ok: true, matched: Boolean(saved) });
  } catch (e) {
    console.error("apple notification failed", e);
    // A 5xx makes Apple retry later.
    return NextResponse.json({ error: "Try again" }, { status: 500 });
  }
}
