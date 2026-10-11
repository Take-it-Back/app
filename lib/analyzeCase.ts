import type { SupabaseClient } from "@supabase/supabase-js";
import { aiConfigured, analyzeDocument, type StatedDeadline } from "./ai";
import { loadMedia } from "./media";
import { firstDeadline } from "./rules";
import { stateContext } from "./stateLaw";
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
  let stated: StatedDeadline[] = [];

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
        stateContext(c.category === "other" ? "other" : c.category, c.user_state, c.last_payment_on),
        c.user_state ? "Use the state rules above when they fit what the document shows (for example a deposit kept past the deadline, medical debt on a credit report, or a debt that may be past the time limit). Name the state in the finding." : "",
      ].filter(Boolean).join("\n");
      const { data: prof } = await supabase.from("profiles").select("language").eq("id", c.user_id).maybeSingle();
      const a = await analyzeDocument(media, context, prof?.language === "es" ? "es" : "en");
      stated = cleanStated(a.deadlines);
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

  // Prefer the deadlines the document itself states; fall back to our general rule when it states none for the person.
  const fd = firstDeadline(category, received, c.insured, c.user_state);
  const rows = stated.map((d) => ({ case_id: caseId, user_id: userId, title: d.title.slice(0, 80), due_date: d.date!, owner: d.owner, rule_note: `From the letter: “${d.quote.slice(0, 200)}”` }));
  if (!stated.some((d) => d.owner === "you")) rows.unshift({ case_id: caseId, user_id: userId, title: fd.title, due_date: fd.due, owner: "you", rule_note: fd.note });
  await Promise.all([
    premium ? supabase.from("deadlines").insert(rows) : Promise.resolve(),
    supabase.from("events").insert({ case_id: caseId, user_id: userId, title: eventTitle, detail: docs?.length ? `${docs.length} page${docs.length > 1 ? "s" : ""} added` : null }),
  ]);
  return { ok: true as const, warning: aiError };
}

/** Keep stated deadlines with a real date that hasn't long passed, at most 4, soonest first. */
export function cleanStated(list?: StatedDeadline[] | null) {
  const floor = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  return (list || [])
    .filter((d) => d && d.date && /^\d{4}-\d{2}-\d{2}$/.test(d.date) && d.date >= floor && d.date <= "2100-01-01" && (d.owner === "you" || d.owner === "them"))
    .sort((a, b) => a.date!.localeCompare(b.date!))
    .slice(0, 4);
}
