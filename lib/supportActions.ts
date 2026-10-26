"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import { appPlatform } from "@/lib/appContext";
import { notifyCustomerReply, notifyNewTicket, notifyStaffReply, type TicketInfo } from "@/lib/support";

export type FormState = { error?: string } | undefined;

const KNOWN = /Please|You've|We're|That's|Messages can/;
const friendly = (m?: string) => (m && KNOWN.test(m) ? m : "That didn't go through. Please try again in a minute.");
const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

/** Opens a support request from the website, the app, or the signed-out contact form. */
export async function createSupportTicket(_: FormState, fd: FormData): Promise<FormState> {
  // Bots fill every field; people never see this one.
  if (str(fd, "website")) redirect("/support?sent=1");
  const { supabase, user } = await getSessionUser();
  const platform = (await appPlatform()) || "web";
  const message = str(fd, "message");
  const { data, error } = await supabase.rpc("support_create", {
    p_subject: str(fd, "subject"),
    p_message: message,
    p_topic: str(fd, "topic") || "other",
    p_platform: platform,
    p_page: str(fd, "page").slice(0, 300) || null,
    p_case_id: str(fd, "case_id") || null,
    p_email: user ? null : str(fd, "email"),
    p_name: str(fd, "name") || null,
  });
  if (error || !data) return { error: friendly(error?.message) };
  const t = data as TicketInfo & { token: string | null };
  await notifyNewTicket({ ...t, signed_in_owner: Boolean(user) }, message);
  redirect(user ? `/app/support/${t.id}?new=1` : `/support/t/${t.token}?new=1`);
}

/** Adds a message to a request. The database decides who may: staff, the owner, or a guest with the private link. */
export async function replySupportTicket(_: FormState, fd: FormData): Promise<FormState> {
  const supabase = await createClient();
  const ticket = str(fd, "ticket");
  const token = str(fd, "token") || null;
  const body = str(fd, "body");
  const back = str(fd, "back");
  const { data, error } = await supabase.rpc("support_reply", { p_ticket: ticket, p_body: body, p_token: token });
  if (error || !data) return { error: friendly(error?.message) };
  const t = data as TicketInfo & { from_staff: boolean; token: string | null };
  if (t.from_staff) {
    const sent = await notifyStaffReply(t, body).catch(() => ({ ok: false as const }));
    if (!sent.ok) return { error: "Your reply was saved, but the email to them didn't send. They'll still see it when they open the request." };
  } else {
    await notifyCustomerReply(t, body);
  }
  if (back.startsWith("/")) {
    revalidatePath(back);
    redirect(back);
  }
  return undefined;
}

/** Close or reopen a request (staff can also mark it as waiting on the person). */
export async function setSupportStatus(fd: FormData) {
  const supabase = await createClient();
  const back = str(fd, "back");
  await supabase.rpc("support_set_status", { p_ticket: str(fd, "ticket"), p_status: str(fd, "status"), p_token: str(fd, "token") || null });
  if (back.startsWith("/")) {
    revalidatePath(back);
    redirect(back);
  }
}
