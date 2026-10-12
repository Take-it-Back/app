// Sends email through Resend from the takeitback.app domain. Server only.
export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  if (!emailConfigured()) return { ok: false as const, error: "Email not configured" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM || "Take it back <hello@takeitback.app>", to: [to], subject: subject.slice(0, 200), text, ...(html ? { html } : {}), reply_to: "hello@takeitback.app" }),
  });
  const j = await res.json().catch(() => ({}));
  return res.ok ? { ok: true as const, id: j.id as string } : { ok: false as const, error: (j.message as string) || `Email error ${res.status}` };
}
