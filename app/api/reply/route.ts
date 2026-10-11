import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiConfigured, analyzeReply } from "@/lib/ai";
import { cleanStated } from "@/lib/analyzeCase";
import { loadMedia } from "@/lib/media";
import { getCasePremium } from "@/lib/plan";
import { logError, useAi } from "@/lib/limits";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { caseId, documentId } = (await request.json().catch(() => ({}))) as { caseId?: string; documentId?: string };
  if (!caseId || !documentId) return NextResponse.json({ error: "Missing details." }, { status: 400 });
  if (!(await getCasePremium(supabase, user.id, caseId)))
    return NextResponse.json({ error: "Reading their reply is part of Premium. Start a free 7-day trial to use it.", upgrade: true }, { status: 402 });
  const limit = await useAi(supabase, user.id, "reply");
  if (!limit.ok) return NextResponse.json({ error: limit.error }, { status: 429 });

  const [{ data: c }, { data: doc }] = await Promise.all([
    supabase.from("cases").select("title, category, summary, findings, stage").eq("id", caseId).single(),
    supabase.from("documents").select("storage_path, mime_type").eq("id", documentId).single(),
  ]);
  if (!c || !doc) return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Their reply arrived: their deadlines are met.
  await supabase.from("deadlines").update({ done: true }).eq("case_id", caseId).eq("owner", "them").eq("done", false);

  if (!aiConfigured()) {
    await Promise.all([
      supabase.from("events").insert({ case_id: caseId, user_id: user.id, title: "Their reply added" }),
      supabase.from("cases").update({ status: "your_move" }).eq("id", caseId),
    ]);
    return NextResponse.json({ ok: true, warning: "Saved. Automatic reading isn't switched on yet." });
  }

  try {
    const media = await loadMedia(supabase, [doc]);
    if (!media.length) throw new Error("We couldn't open that file type.");
    const { data: prof } = await supabase.from("profiles").select("language").eq("id", user.id).maybeSingle();
    const a = await analyzeReply(media, `Case: ${c.title} (${c.category}). Earlier summary: ${c.summary}. Our original points: ${JSON.stringify(c.findings)}`, prof?.language === "es" ? "es" : "en");
    const stated = cleanStated(a.deadlines);
    const status = a.red_flag ? "needs_help" : a.outcome === "won" ? "your_move" : "your_move";
    await Promise.all([
      supabase.from("documents").update({ analysis: a }).eq("id", documentId),
      supabase.from("events").insert({ case_id: caseId, user_id: user.id, title: `Their reply: ${a.outcome === "won" ? "they agreed" : a.outcome === "partial" ? "partly fixed" : a.outcome === "denied" ? "they said no" : "they need more"}`, detail: a.what_it_says }),
      stated.length ? supabase.from("deadlines").insert(stated.map((d) => ({ case_id: caseId, title: d.title.slice(0, 80), due_date: d.date!, owner: d.owner, rule_note: `From their reply: “${d.quote.slice(0, 200)}”` }))) : Promise.resolve(),
      supabase.from("cases").update({ status, next_steps: a.next_steps, red_flag: a.red_flag || undefined, red_flag_reason: a.red_flag_reason }).eq("id", caseId),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    await logError(supabase, "reply", e, `/app/cases/${caseId}`);
    await supabase.from("events").insert({ case_id: caseId, user_id: user.id, title: "Their reply added" });
    return NextResponse.json({ ok: true, warning: e instanceof Error ? e.message : "We couldn't read the reply." });
  }
}
