import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { letterPdf } from "@/lib/pdf";

/** The saved letter as a PDF, so a phone can attach it to an email or any app through the share sheet. */
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^[0-9a-f-]{36}$/.test(id)) return NextResponse.json({ error: "Missing letter." }, { status: 400 });
  // Row-level security limits this to letters on the person's own cases (or cases they help on).
  const { data: letter } = await supabase.from("letters").select("subject, body").eq("id", id).maybeSingle();
  if (!letter) return NextResponse.json({ error: "Letter not found." }, { status: 404 });
  const bytes = await letterPdf(letter.body, { title: letter.subject || "Letter" });
  const name = `${(letter.subject || "letter").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "letter"}.pdf`;
  return new NextResponse(Buffer.from(bytes), {
    headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="${name}"`, "Cache-Control": "private, no-store" },
  });
}
