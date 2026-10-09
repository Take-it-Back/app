"use server";
import { getPlan, getCasePremium } from "@/lib/plan";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, requireUser } from "./supabase/server";
import { theirDeadline } from "./rules";
import { theirDeadlineFor } from "./letters";
import type { Category } from "./types";

async function ctx() {
  return requireUser();
}

export async function saveLetter(letterId: string, fields: { body: string; subject: string; recipient: string }) {
  const { supabase } = await ctx();
  const { error } = await supabase.from("letters").update(fields).eq("id", letterId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function markLetterSent(letterId: string, method: string, sentDate: string) {
  const { supabase, user } = await ctx();
  const { data: letter, error } = await supabase
    .from("letters")
    .update({ status: "sent", sent_method: method, sent_at: new Date(sentDate + "T12:00:00Z").toISOString() })
    .eq("id", letterId)
    .select("case_id, kind")
    .single();
  if (error || !letter) throw new Error(error?.message || "Letter not found");
  const { data: c } = await supabase.from("cases").select("category, stage").eq("id", letter.case_id).single();
  const td = theirDeadlineFor(letter.kind, theirDeadline((c?.category || "other") as Category, sentDate), sentDate);
  await Promise.all([
    supabase.from("deadlines").update({ done: true }).eq("case_id", letter.case_id).eq("owner", "you").eq("done", false),
    supabase.from("deadlines").insert({ case_id: letter.case_id, user_id: user.id, title: td.title, due_date: td.due, owner: "them", rule_note: td.note }),
    supabase.from("events").insert({ case_id: letter.case_id, user_id: user.id, title: `Letter sent by ${method}`, happened_at: new Date(sentDate + "T12:00:00Z").toISOString() }),
    supabase.from("cases").update({ status: "waiting", stage: Math.min(4, (c?.stage || 1) + 1) }).eq("id", letter.case_id),
  ]);
  revalidatePath("/app", "layout");
  return { ok: true, caseId: letter.case_id };
}

export async function logCall(caseId: string, formData: FormData) {
  const { supabase, user } = await ctx();
  const rep = String(formData.get("rep") || "").trim().slice(0, 120);
  const ref = String(formData.get("ref") || "").trim().slice(0, 80);
  const detail = String(formData.get("detail") || "").trim().slice(0, 2000);
  const follow = String(formData.get("follow") || "");
  const title = `Call${rep ? ` with ${rep}` : ""}${ref ? ` · ref ${ref}` : ""}`;
  await supabase.from("events").insert({ case_id: caseId, user_id: user.id, kind: "call", title, detail: detail || null });
  if (/^\d{4}-\d{2}-\d{2}$/.test(follow) && (await getCasePremium(supabase, user.id, caseId))) {
    await supabase.from("deadlines").insert({ case_id: caseId, user_id: user.id, title: `Follow up on call${rep ? ` with ${rep}` : ""}`, due_date: follow, owner: "you", rule_note: detail ? detail.slice(0, 200) : null });
  }
  revalidatePath(`/app/cases/${caseId}`, "layout");
  redirect(`/app/cases/${caseId}/calls?saved=1`);
}

export async function inviteHelper(caseId: string, formData: FormData) {
  const { supabase, user } = await ctx();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const back = `/app/cases/${caseId}/share`;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect(`${back}?err=${encodeURIComponent("That email doesn't look right.")}`);
  if (email === (user.email || "").toLowerCase()) redirect(`${back}?err=${encodeURIComponent("That's your own email.")}`);
  if (!(await getCasePremium(supabase, user.id, caseId))) redirect("/app/upgrade");
  const { count } = await supabase.from("case_shares").select("id", { count: "exact", head: true }).eq("case_id", caseId);
  if ((count ?? 0) >= 4) redirect(`${back}?err=${encodeURIComponent("Up to 4 helpers per case.")}`);
  const { error } = await supabase.from("case_shares").insert({ case_id: caseId, owner_id: user.id, helper_email: email });
  if (error) redirect(`${back}?err=${encodeURIComponent(error.code === "23505" ? "They're already added." : "Couldn't add them. Only the case owner can add helpers.")}`);
  await supabase.from("events").insert({ case_id: caseId, user_id: user.id, title: `Added a helper: ${email}` });
  revalidatePath(back);
  redirect(`${back}?sent=1`);
}

export async function removeHelper(shareId: string, caseId: string) {
  const { supabase, user } = await ctx();
  const { data: s } = await supabase.from("case_shares").select("helper_id").eq("id", shareId).maybeSingle();
  await supabase.from("case_shares").delete().eq("id", shareId);
  revalidatePath("/app", "layout");
  redirect(s?.helper_id === user.id ? "/app/cases" : `/app/cases/${caseId}/share`);
}

/** A ready-made sample case so new people can see how a fight plays out. */
export async function createDemoCase() {
  const { supabase, user } = await ctx();
  const { data: existing } = await supabase.from("cases").select("id").eq("user_id", user.id).eq("is_demo", true).limit(1);
  if (existing?.length) redirect(`/app/cases/${existing[0].id}`);
  const today = new Date();
  const iso = (n: number) => new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + n)).toISOString().slice(0, 10);
  const ts = (n: number) => new Date(Date.now() + n * 86400000).toISOString();
  const { data: c, error } = await supabase
    .from("cases")
    .insert({
      user_id: user.id,
      is_demo: true,
      category: "medical",
      title: "Sample: ER visit",
      counterparty: "Riverside Medical (sample)",
      amount_at_stake: 4180,
      status: "your_move",
      stage: 2,
      received_date: iso(-12),
      summary: "This sample ER bill has a double charge and a surprise out-of-network fee. Explore it to see how Take it back works, then delete it.",
      findings: [
        { title: "Charged twice for one CT scan", detail: "Lines 14 and 15 bill the same scan on the same day.", amount: 1240, rule_name: "Duplicate billing" },
        { title: "Surprise out-of-network doctor", detail: "The ER doctor was out of network at an in-network hospital.", amount: 522, rule_name: "No Surprises Act" },
        { title: "You may qualify for charity care", detail: "Nonprofit hospitals must have a financial assistance policy.", rule_name: "Hospital financial assistance" },
      ],
      potential_savings: 1762,
      next_steps: [
        { title: "Ask for an itemized bill", detail: "Every line, with billing codes.", letter_kind: "itemized_bill" },
        { title: "Dispute the double charge", detail: "Ask them to remove it and re-bill.", letter_kind: "dispute" },
      ],
    })
    .select("id")
    .single();
  if (error || !c) throw new Error(error?.message || "Couldn't create the sample case");
  await Promise.all([
    supabase.from("deadlines").insert([
      { case_id: c.id, user_id: user.id, title: "Ask for an itemized bill", due_date: iso(3), owner: "you", rule_note: "Sample deadline." },
    ]),
    supabase.from("events").insert([
      { case_id: c.id, user_id: user.id, title: "Sample bill scanned", detail: "3 pages added", happened_at: ts(-12) },
      { case_id: c.id, user_id: user.id, kind: "call", title: "Call with billing · ref 55120", detail: "They said they'd look into the duplicate charge.", happened_at: ts(-5) },
    ]),
    supabase.from("letters").insert({
      case_id: c.id,
      user_id: user.id,
      kind: "dispute",
      recipient: "Riverside Medical (sample), Patient Billing",
      subject: "Dispute of charges, account [ACCOUNT NUMBER]",
      body: "To Patient Billing,\n\nI am writing to dispute two charges on my bill.\n\nThe CT scan on line 14 appears twice. Please remove the duplicate charge of $1,240.\n\nUnder the No Surprises Act, I should only owe my in-network amount for the emergency physician.\n\nPlease send a corrected, itemized bill and hold this account from collections while it is reviewed.\n\nSincerely,\n[YOUR NAME]",
    }),
  ]);
  revalidatePath("/app", "layout");
  redirect(`/app/cases/${c.id}`);
}

export async function addNote(caseId: string, formData: FormData) {
  const { supabase, user } = await ctx();
  const title = String(formData.get("title") || "").trim();
  const detail = String(formData.get("detail") || "").trim();
  const kind = String(formData.get("kind") || "note") as "note" | "call";
  if (!title) return;
  await supabase.from("events").insert({ case_id: caseId, user_id: user.id, kind, title, detail: detail || null });
  revalidatePath(`/app/cases/${caseId}`, "layout");
}

export async function toggleDeadline(id: string, done: boolean) {
  const { supabase } = await ctx();
  await supabase.from("deadlines").update({ done }).eq("id", id);
  revalidatePath("/app", "layout");
}

export async function updateDeadline(id: string, formData: FormData) {
  const { supabase } = await ctx();
  const due = String(formData.get("due_date") || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) return;
  await supabase.from("deadlines").update({ due_date: due }).eq("id", id);
  revalidatePath("/app", "layout");
}

export async function addDeadline(caseId: string, formData: FormData) {
  const { supabase, user } = await ctx();
  const title = String(formData.get("title") || "").trim();
  const due = String(formData.get("due_date") || "");
  const owner = formData.get("owner") === "them" ? "them" : "you";
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(due)) return;
  if (!(await getCasePremium(supabase, user.id, caseId))) return;
  await supabase.from("deadlines").insert({ case_id: caseId, user_id: user.id, title, due_date: due, owner });
  revalidatePath("/app", "layout");
}

export async function setCaseStatus(caseId: string, status: string) {
  const { supabase } = await ctx();
  await supabase.from("cases").update({ status }).eq("id", caseId);
  revalidatePath("/app", "layout");
}

export async function closeCase(caseId: string, formData: FormData) {
  const { supabase, user } = await ctx();
  const outcome = String(formData.get("outcome") || "won");
  const amount = Number(String(formData.get("amount") || "").replace(/[^0-9.]/g, "")) || null;
  const status = ["won", "settled", "closed"].includes(outcome) ? outcome : "closed";
  await supabase.from("cases").update({ status, outcome_amount: amount, closed_at: new Date().toISOString(), stage: 4 }).eq("id", caseId);
  await supabase.from("deadlines").update({ done: true }).eq("case_id", caseId).eq("done", false);
  await supabase.from("events").insert({ case_id: caseId, user_id: user.id, title: status === "won" ? "Case won" : status === "settled" ? "Case settled" : "Case closed" });
  revalidatePath("/app", "layout");
  redirect(`/app/cases/${caseId}/won`);
}

export async function updateCaseBasics(caseId: string, formData: FormData) {
  const { supabase } = await ctx();
  const amount = Number(String(formData.get("amount_at_stake") || "").replace(/[^0-9.]/g, "")) || null;
  await supabase
    .from("cases")
    .update({
      title: String(formData.get("title") || "").slice(0, 80) || "Untitled case",
      counterparty: String(formData.get("counterparty") || "") || null,
      amount_at_stake: amount,
    })
    .eq("id", caseId);
  revalidatePath("/app", "layout");
}

export async function deleteCase(caseId: string) {
  const { supabase } = await ctx();
  const { data: docs } = await supabase.from("documents").select("storage_path").eq("case_id", caseId);
  if (docs?.length) await supabase.storage.from("case-files").remove(docs.map((d) => d.storage_path));
  await supabase.from("cases").delete().eq("id", caseId);
  revalidatePath("/app", "layout");
  redirect("/app/cases");
}

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await ctx();
  const digits = String(formData.get("phone") || "").replace(/\D/g, "");
  const phone = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith("1") ? `+${digits}` : "";
  await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") || "").slice(0, 80),
      state: String(formData.get("state") || "").slice(0, 40) || null,
      remind_email: formData.get("remind_email") === "on",
      morning_briefing: formData.get("morning_briefing") === "on",
      phone: phone || null,
      sms_opt_in: Boolean(phone) && formData.get("sms_opt_in") === "on",
      address_line1: String(formData.get("address_line1") || "").trim().slice(0, 120) || null,
      address_line2: String(formData.get("address_line2") || "").trim().slice(0, 120) || null,
      address_city: String(formData.get("address_city") || "").trim().slice(0, 80) || null,
      address_state: String(formData.get("address_state") || "").trim().toUpperCase().slice(0, 2) || null,
      address_zip: String(formData.get("address_zip") || "").trim().slice(0, 10) || null,
    })
    .eq("id", user.id);
  revalidatePath("/app", "layout");
  redirect("/app/you?saved=1");
}

export async function deleteAccount() {
  const { supabase, user } = await ctx();
  // Remove every file under the user's folder, then the account (rows cascade).
  const { data: caseDirs } = await supabase.storage.from("case-files").list(user.id, { limit: 1000 });
  for (const dir of caseDirs || []) {
    const { data: files } = await supabase.storage.from("case-files").list(`${user.id}/${dir.name}`, { limit: 1000 });
    if (files?.length) await supabase.storage.from("case-files").remove(files.map((f) => `${user.id}/${dir.name}/${f.name}`));
  }
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw new Error(error.message);
  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
