import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/limits";
import { pushReady, sendPushToSelf } from "@/lib/push";

/** Admins only: send a test alert to your own devices. */
export async function POST() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub as string | undefined;
  if (!userId) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", userId).maybeSingle();
  if (!me?.is_admin) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!pushReady()) return NextResponse.json({ error: "Phone alerts aren't set up on the server yet." }, { status: 503 });
  try {
    const r = await sendPushToSelf(supabase, userId, { title: "Take it back", body: "This is a test alert. You're all set.", url: "/app/you" });
    if (!r.sent) return NextResponse.json({ error: "No devices to send to. Try turning alerts off and on again." }, { status: 404 });
    return NextResponse.json({ ok: true, ...r });
  } catch (e) {
    await logError(supabase, "push", e, "/api/push/test", userId);
    return NextResponse.json({ error: "Couldn't send the test. Please try again." }, { status: 500 });
  }
}
