import type { SupabaseClient } from "@supabase/supabase-js";
import { letterPdf } from "./pdf";

// Sending letters for people: certified mail through Lob, fax through Telnyx.
export const SEND_PRICES = { mail: { cents: 899, label: "$8.99", name: "Certified mail" }, fax: { cents: 199, label: "$1.99", name: "Fax" } } as const;
export type SendMethod = keyof typeof SEND_PRICES;

export function mailConfigured() {
  return Boolean(process.env.LOB_API_KEY);
}
export function faxConfigured() {
  return Boolean(process.env.TELNYX_API_KEY && process.env.TELNYX_FAX_CONNECTION_ID && process.env.TELNYX_FAX_FROM);
}
export const methodConfigured = (m: SendMethod) => (m === "mail" ? mailConfigured() : faxConfigured());

export type Address = { name: string; line1: string; line2?: string; city: string; state: string; zip: string };

export function validAddress(a: Partial<Address>): a is Address {
  return Boolean(a.name && a.line1 && a.city && /^[A-Za-z]{2}$/.test(a.state || "") && /^\d{5}(-\d{4})?$/.test(a.zip || ""));
}

export function normalizeFax(n: string) {
  const d = n.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return null;
}

const lobAddress = (a: Address) => ({ name: a.name.slice(0, 40), address_line1: a.line1, address_line2: a.line2 || undefined, address_city: a.city, address_state: a.state.toUpperCase(), address_zip: a.zip, address_country: "US" });

type SendRow = { id: string; case_id: string; letter_id: string; method: SendMethod; to_name: string | null; to_address: Address | null; fax_number: string | null; status: string };

/**
 * Builds the PDF, stores it in the case file, and hands it to the mail or fax provider.
 * Safe to call again: a send that already went out is left alone.
 */
export async function dispatchSend(supabase: SupabaseClient, send: SendRow, from: Address | null) {
  if (send.status === "sent") return { ok: true as const };
  const { data: letter } = await supabase.from("letters").select("body, subject, case_id").eq("id", send.letter_id).single();
  const { data: c } = await supabase.from("cases").select("user_id").eq("id", send.case_id).single();
  if (!letter || !c) return { ok: false as const, error: "Letter not found" };

  const pdf = await letterPdf(letter.body, { title: letter.subject || "Letter" });
  const path = `${c.user_id}/${send.case_id}/sent-${send.id}.pdf`;
  const up = await supabase.storage.from("case-files").upload(path, pdf, { contentType: "application/pdf", upsert: true });
  if (up.error) return { ok: false as const, error: up.error.message };
  const { data: signed } = await supabase.storage.from("case-files").createSignedUrl(path, 60 * 60 * 24);
  if (!signed?.signedUrl) return { ok: false as const, error: "Couldn't prepare the file" };

  let providerId = "";
  try {
    if (send.method === "mail") {
      if (!send.to_address || !from) throw new Error("Missing an address");
      const res = await fetch("https://api.lob.com/v1/letters", {
        method: "POST",
        headers: { Authorization: `Basic ${Buffer.from(`${process.env.LOB_API_KEY}:`).toString("base64")}`, "Content-Type": "application/json", "Idempotency-Key": send.id },
        body: JSON.stringify({
          description: `Take it back ${send.id}`.slice(0, 255),
          to: lobAddress(send.to_address),
          from: lobAddress(from),
          file: signed.signedUrl,
          color: false,
          double_sided: false,
          address_placement: "insert_blank_page",
          extra_service: "certified",
          use_type: "operational",
          metadata: { send_id: send.id },
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message || `Mail service error ${res.status}`);
      providerId = json.id;
    } else {
      if (!send.fax_number) throw new Error("Missing a fax number");
      const res = await fetch("https://api.telnyx.com/v2/faxes", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.TELNYX_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ connection_id: process.env.TELNYX_FAX_CONNECTION_ID, media_url: signed.signedUrl, to: send.fax_number, from: process.env.TELNYX_FAX_FROM }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.errors?.[0]?.detail || `Fax service error ${res.status}`);
      providerId = json?.data?.id;
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : "Sending failed";
    await supabase.from("sends").update({ status: "failed", error, updated_at: new Date().toISOString() }).eq("id", send.id);
    return { ok: false as const, error };
  }

  await Promise.all([
    supabase.from("sends").update({ status: "sent", provider_id: providerId, error: null, updated_at: new Date().toISOString() }).eq("id", send.id),
    supabase.from("documents").insert({ case_id: send.case_id, user_id: c.user_id, kind: "proof", storage_path: path, file_name: `${send.method === "mail" ? "Mailed" : "Faxed"} letter.pdf`, mime_type: "application/pdf", label: `${send.method === "mail" ? "Certified mail" : "Fax"} copy` }),
  ]);
  return { ok: true as const, providerId };
}
