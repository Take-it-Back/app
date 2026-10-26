import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { playReady } from "@/lib/google";
import { applyGoogleSubscription } from "@/lib/googleBilling";
import { revokeCasePass } from "@/lib/plan";

// Google Play real-time developer notifications (Pub/Sub push). The message only says "this purchase changed";
// we look the purchase up at Google ourselves, so a forged message can't change anything.
export async function POST(request: Request) {
  if (!playReady()) return NextResponse.json({ ok: true, skipped: "not configured" });
  const body = (await request.json().catch(() => ({}))) as { message?: { data?: string } };
  let note: {
    subscriptionNotification?: { purchaseToken?: string };
    voidedPurchaseNotification?: { purchaseToken?: string; orderId?: string; productType?: number };
    testNotification?: unknown;
  } = {};
  try {
    note = JSON.parse(Buffer.from(body.message?.data || "", "base64").toString("utf8"));
  } catch {
    return NextResponse.json({ ok: true, skipped: "unreadable" });
  }
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  try {
    if (note.subscriptionNotification?.purchaseToken) {
      await applyGoogleSubscription(supabase, note.subscriptionNotification.purchaseToken, null);
    } else if (note.voidedPurchaseNotification?.orderId && note.voidedPurchaseNotification.productType === 2) {
      // A refunded or charged-back case pass (productType 2 = one-time product) stops unlocking the case.
      await revokeCasePass(supabase, `google:${note.voidedPurchaseNotification.orderId}`);
    } else if (note.voidedPurchaseNotification?.purchaseToken) {
      await applyGoogleSubscription(supabase, note.voidedPurchaseNotification.purchaseToken, null);
    }
  } catch (e) {
    console.error("google notification failed", e);
    return NextResponse.json({ error: "Try again" }, { status: 500 }); // Pub/Sub retries
  }
  return NextResponse.json({ ok: true });
}
