import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeCase } from "@/lib/analyzeCase";
import { getPlan } from "@/lib/plan";
import { logError, useAi } from "@/lib/limits";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { caseId } = (await request.json().catch(() => ({}))) as { caseId?: string };
  if (!caseId) return NextResponse.json({ error: "Missing case." }, { status: 400 });

  const { data: prof } = await supabase.from("profiles").select("health_consent_at").eq("id", user.id).maybeSingle();
  if (!prof?.health_consent_at) return NextResponse.json({ error: "Please agree to how we handle health information first.", consent: true }, { status: 403 });

  const limit = await useAi(supabase, user.id, "analyze");
  if (!limit.ok) return NextResponse.json({ error: limit.error }, { status: 429 });
  const premium = (await getPlan(supabase, user.id)).premium;
  const r = await analyzeCase(supabase, user.id, caseId, premium);
  if (r.ok && r.warning && !r.warning.startsWith("Automatic reading isn't switched on")) await logError(supabase, "analyze", r.warning, `/app/cases/${caseId}`);
  if (!r.ok) await logError(supabase, "analyze", r.error, `/app/cases/${caseId}`);
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: r.error === "Case not found." ? 404 : 500 });
  return NextResponse.json({ ok: true, warning: r.warning });
}
