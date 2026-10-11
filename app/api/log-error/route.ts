import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/limits";

// Client-side crashes reported by the app's error screen.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return NextResponse.json({ ok: false }, { status: 401 });
  const { message = "", path = "" } = (await request.json().catch(() => ({}))) as { message?: string; path?: string };
  await logError(supabase, "app", String(message).slice(0, 1000), String(path).slice(0, 300));
  return NextResponse.json({ ok: true });
}
