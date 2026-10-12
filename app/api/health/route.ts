import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Health check for the site monitor: is the database answering, and which services are switched on.
export async function GET() {
  const t0 = Date.now();
  let db = false;
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
    const { error } = await sb.from("wins").select("id", { count: "exact", head: true });
    db = !error;
  } catch {
    db = false;
  }
  const body = {
    ok: db,
    db,
    ms: Date.now() - t0,
    services: {
      ai: Boolean(process.env.ANTHROPIC_API_KEY),
      payments: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
      email: Boolean(process.env.RESEND_API_KEY),
      push: Boolean(process.env.VAPID_PRIVATE_KEY),
      mail: Boolean(process.env.LOB_API_KEY),
      fax: Boolean(process.env.TELNYX_API_KEY),
    },
  };
  return NextResponse.json(body, { status: db ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
