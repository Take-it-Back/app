import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiConfigured, draftLetter } from "@/lib/ai";
import { kindInfo, senderAddress, templateFor, type BureauKey, agencyFor, BUREAUS } from "@/lib/letters";
import type { CaseRow } from "@/lib/types";
import { getCasePremium } from "@/lib/plan";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { caseId, kind = "dispute", instructions = "", target = "" } = (await request.json().catch(() => ({}))) as {
    caseId?: string;
    kind?: string;
    instructions?: string;
    target?: string;
  };
  if (!caseId) return NextResponse.json({ error: "Missing case." }, { status: 400 });
  if (!kindInfo(kind)) return NextResponse.json({ error: "Unknown letter type." }, { status: 400 });
  if (!(await getCasePremium(supabase, user.id, caseId)))
    return NextResponse.json({ error: "Letters are part of Premium. Start a free 7-day trial to draft this.", upgrade: true }, { status: 402 });

  const [{ data: c }, { data: profile }, { data: events }, { data: letters }, { data: replies }] = await Promise.all([
    supabase.from("cases").select("*").eq("id", caseId).single(),
    supabase.from("profiles").select("full_name, state, phone, address_line1, address_line2, address_city, address_state, address_zip").eq("id", user.id).maybeSingle(),
    supabase.from("events").select("title, detail, happened_at").eq("case_id", caseId).order("happened_at"),
    supabase.from("letters").select("kind, subject, sent_at, status").eq("case_id", caseId).order("created_at"),
    supabase.from("documents").select("analysis, created_at").eq("case_id", caseId).eq("kind", "reply").order("created_at"),
  ]);
  if (!c) return NextResponse.json({ error: "Case not found." }, { status: 404 });
  const cr = c as CaseRow;
  const name = profile?.full_name || "";
  const sender = { name, address: senderAddress(profile), phone: profile?.phone };
  const info = kindInfo(kind)!;
  const history = (events || []).map((e) => `${String(e.happened_at).slice(0, 10)}: ${e.title}`).join("; ");
  const bureau = (target in BUREAUS ? target : undefined) as BureauKey | undefined;
  const agency = agencyFor(target);
  const extra = { agency: agency?.key, bureau, history };

  let letter: { recipient: string; subject: string; body: string };
  let warning: string | null = null;
  if (aiConfigured()) {
    const context = [
      `Case: ${cr.title} (${cr.category})`,
      `From: ${cr.counterparty || "unknown"}`,
      `Amount: ${cr.amount_at_stake ?? "unknown"}`,
      `State: ${cr.user_state || profile?.state || "unknown"}`,
      `Summary: ${cr.summary || ""}`,
      `Findings: ${JSON.stringify(cr.findings || [])}`,
      `History: ${JSON.stringify(events || [])}`,
      `Letters so far: ${JSON.stringify(letters || [])}`,
      `Their replies (analyzed): ${JSON.stringify((replies || []).map((r) => r.analysis))}`,
      `Sender address: ${sender.address || "[YOUR ADDRESS]"}`,
      agency ? `This is a complaint to: ${agency.name} (${agency.what})` : "",
      bureau ? `This goes to ${BUREAUS[bureau].name} at:\n${BUREAUS[bureau].address}` : "",
      instructions ? `The person adds: ${instructions.slice(0, 1000)}` : "",
    ].join("\n");
    try {
      letter = await draftLetter(context, `${info.label}. ${info.guide}`, name);
    } catch (e) {
      warning = "We couldn't draft a custom letter just now, so here's a template to edit.";
      letter = templateFor(cr, kind, sender, extra);
      console.error(e);
    }
  } else {
    letter = templateFor(cr, kind, sender, extra);
  }

  const { data: row, error } = await supabase
    .from("letters")
    .insert({ case_id: caseId, user_id: user.id, kind, recipient: letter.recipient, subject: letter.subject, body: letter.body })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, letterId: row.id, warning });
}
