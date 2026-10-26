import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Download everything we hold about the signed-in person as JSON. Only their own rows (not cases they
 * help on), with a 7-day download link for each file they uploaded.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const mine = <T,>(table: string, cols = "*") => supabase.from(table).select(cols).eq("user_id", user.id) as unknown as Promise<{ data: T[] | null }>;
  const [profile, cases, letters, deadlines, events, documents, sends, shares, passes, wins, devices, pushes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    mine("cases"),
    mine("letters"),
    mine("deadlines"),
    mine("events"),
    mine<{ storage_path: string }>("documents", "id, case_id, kind, file_name, label, analysis, created_at, storage_path"),
    mine("sends", "id, case_id, letter_id, method, status, to_name, to_address, fax_number, price_cents, created_at"),
    supabase.from("case_shares").select("case_id, helper_email, accepted_at, created_at").eq("owner_id", user.id),
    mine("case_passes", "case_id, expires_at, source, amount_cents, revoked_at, created_at"),
    mine("wins", "case_id, category, amount, created_at"),
    mine("device_tokens", "platform, created_at, last_seen_at"),
    mine("push_subscriptions", "created_at, user_agent"),
  ]);

  // Signed links so the export includes the files themselves, not just their names.
  const docs = (documents.data || []) as { storage_path: string }[];
  const paths = docs.map((d) => d.storage_path).filter(Boolean);
  const { data: signed } = paths.length ? await supabase.storage.from("case-files").createSignedUrls(paths, 7 * 86400) : { data: [] };
  const urlFor = new Map((signed || []).map((s) => [s.path, s.signedUrl]));
  const files = docs.map(({ storage_path, ...d }) => ({ ...d, download_url: urlFor.get(storage_path) ?? null }));

  const body = JSON.stringify(
    {
      exported_at: new Date().toISOString(),
      email: user.email,
      note: "File download links work for 7 days.",
      profile: profile.data,
      cases: cases.data,
      letters: letters.data,
      deadlines: deadlines.data,
      events: events.data,
      documents: files,
      mail_and_fax: sends.data,
      helpers_you_invited: shares.data,
      case_passes: passes.data,
      shared_wins: wins.data,
      phone_alert_devices: { iphone: devices.data, browsers: pushes.data },
    },
    null,
    2
  );
  return new NextResponse(body, {
    headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="take-it-back-data.json"', "Cache-Control": "no-store" },
  });
}
