import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCasePremium } from "@/lib/plan";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { SEND_PRICES, methodConfigured, normalizeFax, validAddress, type Address, type SendMethod } from "@/lib/send";

const field = (f: FormData, k: string) => String(f.get(k) || "").trim().slice(0, 120);

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return NextResponse.redirect(`${origin}/login`, { status: 303 });

  const f = await request.formData();
  const letterId = field(f, "letter_id");
  const method = (field(f, "method") === "fax" ? "fax" : "mail") as SendMethod;
  const { data: letter } = await supabase.from("letters").select("id, case_id").eq("id", letterId).maybeSingle();
  if (!letter) return NextResponse.redirect(`${origin}/app/cases`, { status: 303 });
  const back = `${origin}/app/cases/${letter.case_id}/letter/send?id=${letterId}&method=${method}`;
  const fail = (msg: string) => NextResponse.redirect(`${back}&err=${encodeURIComponent(msg)}`, { status: 303 });

  if (!(await getCasePremium(supabase, userId, letter.case_id))) return NextResponse.redirect(`${origin}/app/upgrade`, { status: 303 });
  if (!stripeConfigured() || !methodConfigured(method)) return fail(`${SEND_PRICES[method].name} isn't switched on yet. Print it and send it yourself for now.`);

  let toAddress: { to: Address; from: Address } | null = null;
  let fax: string | null = null;
  if (method === "mail") {
    const to = { name: field(f, "to_name"), line1: field(f, "to_line1"), line2: field(f, "to_line2"), city: field(f, "to_city"), state: field(f, "to_state").toUpperCase(), zip: field(f, "to_zip") };
    const from = { name: field(f, "from_name"), line1: field(f, "from_line1"), line2: field(f, "from_line2"), city: field(f, "from_city"), state: field(f, "from_state").toUpperCase(), zip: field(f, "from_zip") };
    if (!validAddress(to)) return fail("Check their address: street, city, 2-letter state and ZIP.");
    if (!validAddress(from)) return fail("Check your return address: street, city, 2-letter state and ZIP.");
    toAddress = { to, from };
    if (f.get("save_from")) {
      await supabase.from("profiles").update({ address_line1: from.line1, address_line2: from.line2 || null, address_city: from.city, address_state: from.state, address_zip: from.zip }).eq("id", userId);
    }
  } else {
    fax = normalizeFax(field(f, "fax"));
    if (!fax) return fail("Enter a 10-digit US fax number.");
  }

  const price = SEND_PRICES[method];
  const { data: send, error } = await supabase
    .from("sends")
    .insert({ user_id: userId, case_id: letter.case_id, letter_id: letterId, method, to_name: toAddress?.to.name || null, to_address: toAddress, fax_number: fax, price_cents: price.cents })
    .select("id")
    .single();
  if (error || !send) return fail("Couldn't start sending. Try again.");

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    client_reference_id: userId,
    line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: price.cents, product_data: { name: `${price.name} of your letter`, description: method === "mail" ? "Printed, mailed USPS Certified Mail with tracking" : "Faxed with a delivery confirmation" } } }],
    metadata: { send_id: send.id, user_id: userId },
    success_url: `${origin}/api/send/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${back}&canceled=1`,
  });
  await supabase.from("sends").update({ stripe_session: session.id }).eq("id", send.id);
  return NextResponse.redirect(session.url as string, { status: 303 });
}
