import type { SupabaseClient } from "@supabase/supabase-js";
import { aiConfigured, analyzeDocument } from "./ai";
import { loadMedia } from "./media";
import { firstDeadline } from "./rules";
import { todayISO } from "./format";
import type { Category } from "./types";

/** Reads a case's original documents, fills in what we found, and sets the first deadline. */
export async function analyzeCase(supabase: SupabaseClient, userId: string, caseId: string, premium: boolean, eventTitle = "Document scanned") {
  const { data: c } = await supabase.from("cases").select("*").eq("id", caseId).single();
  if (!c) return { ok: false as const, error: "Case not found." };

  const { data: docs } = await supabase.from("documents").select("storage_path, mime_type, file_name").eq("case_id", caseId).eq("kind", "original").order("created_at");

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
    update.summary = "We saved your document. Add the details on the case page, and we'll still help with a letter.";
  }

  const { error } = await supabase.from("cases").update(update).eq("id", caseId);
  if (error) return { ok: false as const, error: error.message };

  const fd = firstDeadline(category, received, c.insured);
  await Promise.all([
    premium ? supabase.from("deadlines").insert({ case_id: caseId, user_id: userId, title: fd.title, due_date: fd.due, owner: "you", rule_note: fd.note }) : Promise.resolve(),
    supabase.from("events").insert({ case_id: caseId, user_id: userId, title: eventTitle, detail: docs?.length ? `${docs.length} page${docs.length > 1 ? "s" : ""} added` : null }),
  ]);
  return { ok: true as const, warning: aiError };
}
