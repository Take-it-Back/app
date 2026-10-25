import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { appleState, applyApple, verifyTransaction } from "@/lib/apple";

// The iPhone app posts Apple's signed transactions here after a purchase or "Restore purchases".
// We check Apple's signature, make sure it belongs to this person, and save the subscription.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { jws?: unknown };
  const list = (Array.isArray(body.jws) ? body.jws : [body.jws]).filter((j): j is string => typeof j === "string" && j.length < 20000).slice(0, 20);
  if (!list.length) return NextResponse.json({ error: "Nothing to check." }, { status: 400 });

  let best: { premium: boolean; status: string } | null = null;
  let other = false;
  for (const jws of list) {
    let state;
    try {
      state = appleState(await verifyTransaction(jws));
    } catch {
      continue;
    }
    if (!state) continue;
    if (state.userHint && state.userHint.toLowerCase() !== user.id) {
      other = true;
      continue;
    }
    const saved = await applyApple(supabase, user.id, state).catch(() => null);
    if (saved && saved !== user.id) {
      other = true;
      continue;
    }
    const premium = ["active", "trialing", "past_due"].includes(state.status);
    if (!best || (premium && !best.premium)) best = { premium, status: state.status };
  }

  if (best?.premium) return NextResponse.json({ ok: true, premium: true, status: best.status });
  if (other) return NextResponse.json({ ok: false, error: "This Apple subscription is linked to a different Take it back account. Sign in with that account, or contact hello@takeitback.app." }, { status: 409 });
  if (best) return NextResponse.json({ ok: true, premium: false, status: best.status });
  return NextResponse.json({ ok: false, error: "We couldn't confirm this purchase with Apple." }, { status: 400 });
}
