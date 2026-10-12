// Writes the Supabase account email templates to supabase/email-templates/*.html. Run: npx tsx scripts/auth-emails.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { AUTH_EMAILS } from "../lib/emails/auth.ts";
mkdirSync("supabase/email-templates", { recursive: true });
for (const e of AUTH_EMAILS) writeFileSync(`supabase/email-templates/${e.key}.html`, e.html);
writeFileSync("supabase/email-templates/README.md", "# Account email templates\n\nPaste each file into Supabase → Authentication → Emails → Templates.\n\n" + AUTH_EMAILS.map((e) => `- **${e.label}** (${e.key}.html) — subject: \`${e.subject}\``).join("\n") + "\n");
console.log("wrote", AUTH_EMAILS.length);
