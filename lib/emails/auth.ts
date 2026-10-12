// Account emails sent by Supabase Auth. Supabase fills in {{ .ConfirmationURL }} and {{ .Token }}.
// Paste each one into Supabase → Authentication → Emails → Templates (scripts/auth-emails.mjs writes them to supabase/email-templates).
import { button, emailLayout, p, small } from "./layout";

const link = "{{ .ConfirmationURL }}";
const expire = (what: string) => small(`This link works once and expires in 24 hours. If you didn't ${what}, you can ignore this email.`);
const fallback = small(`Button not working? Copy this link into your browser:<br><a href="${link}" style="color:#5E5E5E;word-break:break-all">${link}</a>`);

export const AUTH_EMAILS: { key: string; label: string; subject: string; html: string }[] = [
  {
    key: "confirm-signup", label: "Confirm sign-up", subject: "Confirm your email for Take it back",
    html: emailLayout({ preheader: "One tap and you're in.", title: "Confirm your email.", accent: "Confirm", body: p("Thanks for joining Take it back. Tap below to confirm this is your email and open your account.") + button("Confirm my email", link) + fallback + expire("sign up") }),
  },
  {
    key: "magic-link", label: "Sign-in link", subject: "Your Take it back sign-in link",
    html: emailLayout({ preheader: "Tap to sign in. No password needed.", title: "Here's your sign-in link.", accent: "sign-in link", body: p("Tap below to sign in to Take it back.") + button("Sign in", link) + fallback + expire("ask to sign in") }),
  },
  {
    key: "reset-password", label: "Reset password", subject: "Reset your Take it back password",
    html: emailLayout({ preheader: "Choose a new password in a minute.", title: "Reset your password.", accent: "password", body: p("Someone (hopefully you) asked to reset the password for this account. Tap below to choose a new one.") + button("Choose a new password", link) + fallback + expire("ask for this, your password hasn't changed and") }),
  },
  {
    key: "change-email", label: "Confirm new email", subject: "Confirm your new email address",
    html: emailLayout({ preheader: "Confirm the change to {{ .NewEmail }}.", title: "Confirm your new email.", accent: "new email", body: p("You asked to change the email on your Take it back account from <strong>{{ .Email }}</strong> to <strong>{{ .NewEmail }}</strong>. Tap below to confirm.") + button("Confirm new email", link) + fallback + small("Didn't ask for this? Don't tap the link, and write to hello@takeitback.app right away.") }),
  },
  {
    key: "invite", label: "Invite", subject: "You're invited to Take it back",
    html: emailLayout({ preheader: "Accept your invite and set up your account.", title: "You're invited.", accent: "invited", body: p("You've been invited to Take it back, the app that helps people fight unfair medical bills, insurance denials, landlords and debt collectors.") + button("Accept invite", link) + fallback }),
  },
  {
    key: "reauthentication", label: "Verification code", subject: "Your Take it back verification code",
    html: emailLayout({ preheader: "Your code: {{ .Token }}", title: "Your verification code.", accent: "code", body: p("Enter this code to confirm it's you:") + `<p style="margin:0 0 20px;font:700 34px/1 ui-monospace,Menlo,monospace;letter-spacing:6px;color:#1A1A1A">{{ .Token }}</p>` + small("It expires in a few minutes. If you didn't ask for it, someone may know your password, so change it soon.") }),
  },
];
