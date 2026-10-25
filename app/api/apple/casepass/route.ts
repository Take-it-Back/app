import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyTransaction } from "@/lib/apple";
import { APPLE_CASE_PASS } from "@/lib/appleProducts";
import { grantCasePass } from "@/lib/plan";

// The iPhone app posts Apple's signed receipt for a case pass, with the case it's for.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  const { jws, caseId } = (await request.json().catch(() => ({}))) as { jws?: string; caseId?: string };
  if (typeof jws !== "string" || jws.length > 20000 || typeof caseId !== "string") return NextResponse.json({ error: "Bad request" }, { status: 400 });

  let tx;
  try {
    tx = await verifyTransaction(jws);
  } catch {
    return NextResponse.json({ error: "We couldn't confirm this purchase with Apple." }, { status: 400 });
  }
  if (tx.productId !== APPLE_CASE_PASS || !tx.transactionId || tx.revocationDate) return NextResponse.json({ error: "That isn't a case pass." }, { status: 400 });
  if (tx.appAccountToken && tx.appAccountToken.toLowerCase() !== user.id) return NextResponse.json({ error: "This purchase belongs to a different account." }, { status: 409 });
  try {
    const until = await grantCasePass(supabase, { userId: user.id, caseId, ref: `apple:${tx.transactionId}`, source: "apple", amount: tx.price ? Math.round(tx.price / 10) : null });
    return NextResponse.json({ ok: true, until });
  } catch {
    return NextResponse.json({ error: "We couldn't unlock this case. Contact hello@takeitback.app and we'll fix it." }, { status: 500 });
  }
}
