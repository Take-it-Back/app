import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiConfigured, analyzeDocument } from "@/lib/ai";
import { loadMedia } from "@/lib/media";
import { firstDeadline } from "@/lib/rules";
import { todayISO } from "@/lib/format";
import type { Category } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { caseId } = (await request.json().catch(() => ({}))) as { caseId?: string };
  if (!caseId) return NextResponse.json({ error: "Missing case." }, { status: 400 });

  const { data: c } = await supabase.from("cases").select("*").eq("id", caseId).single();
  if (!c) return NextResponse.json({ error: "Case not found." }, { status: 404 });

  const { data: docs } = await supabase
    .from("documents")
    .select("storage_path, mime_type, file_name")
    .eq("case_id", caseId)
    .eq("kind", "original")
    .order("created_at");

  const received = c.received_date || todayISO();
  let update: Record<string, unknown> = { status: "your_move" };
  let category = c.category as Category;
  let aiError: string | null = null;

  if (aiConfigured() && docs?.length) {
    try {
      const media = await loadMedia(supabase, docs);
      if (!media.length) throw new Error("We couldn't open that file type. Try a photo (JPG or PNG) or a PDF.");
      const context = [
        `What it is (their pick): ${c.category === "other" ? "not sure" : c.category}`,
        `State: ${c.user_state || "unknown"}`,
        `Has health insurance: ${c.insured || "unknown"}`,
        `Arrived on: ${received}`,
        `Paid any of it: ${c.paid || "unknown"}`,
      ].join("\n");
      const a = await analyzeDocument(media, context);
      category = (c.category !== "other" ? c.category : a.category) as Category;
      update = {
        category,
        title: (a.title || c.title).slice(0, 80),
        counterparty: a.counterparty,
        amount_at_stake: a.amount_at_stake,
        summary: a.summary,
        findings: a.findings || [],
        potential_savings: a.potential_savings,
        red_flag: a.red_flag,
        red_flag_reason: a.red_flag_reason,
        next_steps: a.next_steps || [],
        status: a.red_flag ? "needs_help" : "your_move",
      };
    } catch (e) {
      aiError = e instanceof Error ? e.message : "We couldn't read the document.";
    }
  }
  if (!aiConfigured()) aiError = "Automatic reading isn't switched on yet, so we set up your case with the basics.";
  if (aiError && !update.summary) {
    update.summary = "We saved your document. Add the details on the case page, and we'll still track your deadline and help with a letter.";
  }

  const { error } = await supabase.from("cases").update(update).eq("id", caseId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const fd = firstDeadline(category, received, c.insured);
  await Promise.all([
    supabase.from("deadlines").insert({ case_id: caseId, user_id: user.id, title: fd.title, due_date: fd.due, owner: "you", rule_note: fd.note }),
    supabase.from("events").insert({ case_id: caseId, user_id: user.id, title: "Document scanned", detail: docs?.length ? `${docs.length} page${docs.length > 1 ? "s" : ""} added` : null }),
  ]);

  return NextResponse.json({ ok: true, warning: aiError });
}
