# If health data gets out: breach response

Take it back holds bills, insurance letters and other papers that carry health details, and pulls them from more than one place (scans, uploads, forwarded email). That likely makes it a "vendor of personal health records" under the FTC Health Breach Notification Rule (16 CFR Part 318, as amended July 29, 2024). State laws (Washington MHMDA, Nevada SB 370, Connecticut, and every state's breach law) apply on top.

Not legal advice. Confirm with counsel before launch and before sending any notice.

## What counts as a breach
Anyone getting health data the person didn't authorize, including:
- a hack, leaked key or misconfigured bucket or database rule;
- a bug that shows one person's case to another;
- **sending it somewhere the person didn't agree to**, such as an analytics or ad tool, or a provider not listed in the health data policy. Under the 2024 rule an unauthorized *disclosure* is a breach, not just a hack.

## First 24 hours
1. Stop it: rotate the leaked key (Supabase service role, Anthropic, Stripe, etc.), fix the rule or roll back the deploy.
2. Keep evidence: Supabase logs, Vercel logs, the commit, screenshots. Don't delete anything.
3. Work out who and what: which accounts, which cases, which fields or files, and when it started.
4. Call counsel.

## Who to tell, and when
| Who | When | How |
| --- | --- | --- |
| Each affected person | Without unreasonable delay, and no later than 60 calendar days after discovery | Email, plus an in-app banner or text if helpful |
| FTC | 500+ people: within the same 60 days. Under 500: log it and report within 60 days after the end of the calendar year | FTC's online breach notice form |
| Media | 500+ residents of one state or territory | Prominent outlets in that state |
| State attorneys general and regulators | As each state's breach law requires (many have 30–60 day clocks; some need AG notice above a threshold) | Per state |

## What the notice to people must say
In short, plain sentences or bullets:
- what happened, the date of the breach and the date it was found;
- what kinds of information were involved (e.g., bills, diagnosis codes, insurance details, name, email);
- the full name of any third party that got the information, if known;
- what people should do to protect themselves;
- what we're doing about it;
- how to reach us (email and one more method, such as a phone number or postal address).

## Keep doing
- Never send health data or case contents to analytics, ad or tracking tools. Signed-in pages carry no pixels.
- Only list providers in the health data policy that actually receive data; add new ones there before turning them on.
- Keep the provider data processing agreements on file (Anthropic, Supabase, Vercel, Resend, Postmark, Twilio, Lob, Telnyx).
