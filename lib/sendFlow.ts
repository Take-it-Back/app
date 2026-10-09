import type { SupabaseClient } from "@supabase/supabase-js";
import { stripe } from "./stripe";
import { dispatchSend, SEND_PRICES, type Address, type SendMethod } from "./send";
import { markLetterSent } from "./actions";
import { todayISO } from "./format";

/** Confirms the Stripe payment for a send, then mails or faxes it. */
export async function completeSend(supabase: SupabaseClient, sendId: string) {
  const { data: send } = await supabase.from("sends").select("*").eq("id", sendId).maybeSingle();
  if (!send) return { ok: false as const, error: "Not found", caseId: null, letterId: null };
  const base = { caseId: send.case_id as string, letterId: send.letter_id as string };
  if (send.status === "sent") return { ok: true as const, ...base };
  if (!send.stripe_session) return { ok: false as const, error: "Payment not found", ...base };
  const session = await stripe().checkout.sessions.retrieve(send.stripe_session);
  if (session.payment_status !== "paid" || session.metadata?.send_id !== send.id) return { ok: false as const, error: "Payment not completed", ...base };
  if (send.status === "pending_payment") await supabase.from("sends").update({ status: "paid" }).eq("id", send.id);

  const addr = send.to_address as { to: Address; from: Address } | null;
  const result = await dispatchSend(supabase, { ...send, to_address: addr?.to ?? null }, addr?.from ?? null);
  if (!result.ok) return { ok: false as const, error: result.error, ...base };
  await markLetterSent(send.letter_id, `${SEND_PRICES[send.method as SendMethod].name} (sent for you)`, todayISO());
  return { ok: true as const, ...base };
}
