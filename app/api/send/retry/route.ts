import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { completeSend } from "@/lib/sendFlow";

export const maxDuration = 60;

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const supabase = await createClient();
  const f = await request.formData();
  const r = await completeSend(supabase, String(f.get("send_id") || ""));
  if (!r.caseId) return NextResponse.redirect(`${origin}/app`, { status: 303 });
  const note = r.ok ? "Sent!" : `Still couldn't send: ${r.error}. Contact hello@takeitback.app and we'll sort it out or refund you.`;
  return NextResponse.redirect(`${origin}/app/cases/${r.caseId}/letter?id=${r.letterId}&note=${encodeURIComponent(note)}`, { status: 303 });
}
