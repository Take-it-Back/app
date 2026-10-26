import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/supabase/server";
import { BackLink } from "@/components/ui";
import { emailPreviews } from "@/lib/emails/templates";
import { AUTH_EMAILS } from "@/lib/emails/auth";

export const metadata: Metadata = { title: "Emails", robots: { index: false } };

export default async function EmailsPreview() {
  const { supabase, user } = await requireUser();
  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  if (!me?.is_admin) notFound();
  const groups: [string, string, { key: string; label: string; subject: string; html: string }[]][] = [
    ["Account emails", "Sent by Supabase. Paste these into Supabase → Authentication → Emails → Templates.", AUTH_EMAILS.map((a) => ({ ...a, html: a.html.replaceAll("{{ .ConfirmationURL }}", "#").replaceAll("{{ .Token }}", "482913").replaceAll("{{ .Email }}", "maria@example.com").replaceAll("{{ .NewEmail }}", "maria.lopez@example.com") }))],
    ["App emails", "Sent by the app through Resend, automatically.", emailPreviews().map((e) => ({ key: e.key, label: e.label, subject: e.email.subject, html: e.email.html }))],
  ];
  return (
    <main id="main" className="app-main wide">
      <BackLink href="/app/admin" />
      <h1 className="page-title" style={{ margin: "6px 0 18px" }}>Emails</h1>
      {groups.map(([title, note, items]) => (
        <section key={title} style={{ marginBottom: 32 }}>
          <div className="sec-head"><h2>{title} <span className="n">{items.length}</span></h2></div>
          <p className="muted small" style={{ margin: "0 0 14px" }}>{note}</p>
          <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
            {items.map((e) => (
              <figure key={e.key} className="card stack g8" style={{ margin: 0, padding: 12 }}>
                <figcaption className="stack g4" style={{ padding: "2px 6px" }}><span style={{ fontWeight: 600 }}>{e.label}</span><span className="muted small">Subject: {e.subject}</span></figcaption>
                <iframe title={e.label} srcDoc={e.html} style={{ width: "100%", height: 560, border: "1px solid #EBEBEB", borderRadius: 14, background: "#F6F4EF" }} sandbox="" />
              </figure>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
