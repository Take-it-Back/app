import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Download all of the signed-in user's data as JSON. */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const [profile, cases, letters, deadlines, events, documents] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("cases").select("*"),
    supabase.from("letters").select("*"),
    supabase.from("deadlines").select("*"),
    supabase.from("events").select("*"),
    supabase.from("documents").select("id, case_id, kind, file_name, label, analysis, created_at"),
  ]);
  const body = JSON.stringify(
    { exported_at: new Date().toISOString(), email: user.email, profile: profile.data, cases: cases.data, letters: letters.data, deadlines: deadlines.data, events: events.data, documents: documents.data },
    null,
    2
  );
  return new NextResponse(body, {
    headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="take-it-back-data.json"' },
  });
}
