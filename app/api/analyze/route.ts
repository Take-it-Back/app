import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeCase } from "@/lib/analyzeCase";
import { getPlan } from "@/lib/plan";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { caseId } = (await request.json().catch(() => ({}))) as { caseId?: string };
  if (!caseId) return NextResponse.json({ error: "Missing case." }, { status: 400 });

  const premium = (await getPlan(supabase, user.id)).premium;
  const r = await analyzeCase(supabase, user.id, caseId, premium);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.error === "Case not found." ? 404 : 500 });
  return NextResponse.json({ ok: true, warning: r.warning });
}
