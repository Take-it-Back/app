import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { getPlan } from "@/lib/plan";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`, { status: 303 });
  const plan = await getPlan(supabase, user.id);
  if (!plan.customer || !stripeConfigured()) return NextResponse.redirect(`${origin}/app/upgrade`, { status: 303 });
  const portal = await stripe().billingPortal.sessions.create({ customer: plan.customer, return_url: `${origin}/app/you` });
  return NextResponse.redirect(portal.url, { status: 303 });
}
