"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { theirDeadline } from "./rules";
import type { Category } from "./types";

async function ctx() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
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
  const td = theirDeadline((c?.category || "other") as Category, sentDate);
  await Promise.all([
    supabase.from("deadlines").update({ done: true }).eq("case_id", letter.case_id).eq("owner", "you").eq("done", false),
    supabase.from("deadlines").insert({ case_id: letter.case_id, user_id: user.id, title: td.title, due_date: td.due, owner: "them", rule_note: td.note }),
    supabase.from("events").insert({ case_id: letter.case_id, user_id: user.id, title: `Letter sent by ${method}`, happened_at: new Date(sentDate + "T12:00:00Z").toISOString() }),
    supabase.from("cases").update({ status: "waiting", stage: Math.min(4, (c?.stage || 1) + 1) }).eq("id", letter.case_id),
  ]);
  revalidatePath("/app", "layout");
  return { ok: true, caseId: letter.case_id };
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
  await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") || "").slice(0, 80),
      state: String(formData.get("state") || "").slice(0, 40) || null,
      remind_email: formData.get("remind_email") === "on",
      morning_briefing: formData.get("morning_briefing") === "on",
    })
    .eq("id", user.id);
  revalidatePath("/app", "layout");
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
