// State-by-state rules used across the app. Data lives in lib/state-law/*.json, each entry with a source link.
// Compiled from statutes, court and agency sites, and 50-state surveys; last checked Oct 2026.
// General information, not legal advice — every table needs review by a licensed attorney before launch.
import debtData from "./state-law/debt.json";
import smallClaimsData from "./state-law/smallclaims.json";
import landlordData from "./state-law/landlord.json";
import medicalData from "./state-law/medical.json";
import insuranceData from "./state-law/insurance.json";
import compliance from "./state-law/compliance.json";
import { depositRule } from "./deposits";
import type { Category } from "./types";

export const RULES_CHECKED = "Oct 2026";

export type DebtRule = { written: number; open: number; revival: "payment" | "writing" | "both" | "none"; barred_extinguished: boolean; disclosure: boolean; note: string; source: string };
export type SmallClaimsRule = { limit: number; court: string; fee: string; lawyers: string; note: string; url: string };
export type LandlordRule = { cap: string | null; interest: string | null; penalty: string | null; entry: string | null; repair_deduct: string | null; withhold: string | null; retaliation: string | null; url: string };
export type MedicalRule = { credit: string | null; interest: string | null; charity: string | null; surprise: string | null; collections: string | null; url: string };
export type InsuranceRule = { dept: string; complaint_url: string; external_review: string; medicaid_days: number; medicaid_name: string; medicaid_url: string; note: string };

function pick<T>(data: Record<string, unknown>, state?: string | null): T | null {
  if (!state || state === "_meta") return null;
  return (data[state] as T) ?? null;
}

export const debtRule = (s?: string | null) => pick<DebtRule>(debtData, s);
export const smallClaimsRule = (s?: string | null) => pick<SmallClaimsRule>(smallClaimsData, s);
export const landlordRule = (s?: string | null) => pick<LandlordRule>(landlordData, s);
export const medicalRule = (s?: string | null) => pick<MedicalRule>(medicalData, s);
export const insuranceRule = (s?: string | null) => pick<InsuranceRule>(insuranceData, s);

export const ALL_PARTY_RECORDING: string[] = compliance.recording.all_party_states;
export const needsAllPartyConsent = (s?: string | null) => Boolean(s && ALL_PARTY_RECORDING.includes(s));

/** Every table, for the admin review page and guides. */
export const TABLES = { debt: debtData, smallclaims: smallClaimsData, landlord: landlordData, medical: medicalData, insurance: insuranceData } as const;

const REVIVAL_TEXT: Record<DebtRule["revival"], string> = {
  payment: "Any payment, even a small one, can restart the clock.",
  writing: "A signed letter admitting the debt or promising to pay can restart the clock.",
  both: "A payment, or a written promise or admission, can restart the clock.",
  none: "State law says a payment or promise doesn't bring an expired debt back to life.",
};

export type DebtAge = { years: number; expires: string | null; expired: boolean; soon: boolean };

/** How long a collector has to sue in this state, and where this debt stands if we know the last payment date. */
export function debtTimeLimit(state?: string | null, lastPayment?: string | null) {
  const r = debtRule(state);
  if (!r) return null;
  const years = Math.max(r.written, r.open);
  let age: DebtAge | null = null;
  if (lastPayment) {
    const d = new Date(lastPayment + "T12:00:00Z");
    d.setUTCFullYear(d.getUTCFullYear() + years);
    const expires = d.toISOString().slice(0, 10);
    const ms = d.getTime() - Date.now();
    age = { years, expires, expired: ms < 0, soon: ms >= 0 && ms < 365 * 86400000 };
  }
  const span = r.written === r.open ? `${r.written} years` : `${Math.min(r.written, r.open)}–${years} years depending on the type of debt`;
  return { rule: r, years, span, revival: REVIVAL_TEXT[r.revival], age };
}

export type StateRight = { title: string; text: string; url?: string };

/** Plain-language state rules for a case, most useful first. */
export function stateRights(category: Category, state?: string | null): StateRight[] {
  if (!state) return [];
  const out: StateRight[] = [];
  if (category === "landlord") {
    const d = depositRule(state);
    const l = landlordRule(state);
    if (d) out.push({ title: "Deposit return deadline", text: `Landlords generally must return it within ${d.text}.` });
    if (l) {
      if (l.penalty) out.push({ title: "If they keep it wrongly", text: l.penalty, url: l.url });
      if (l.cap) out.push({ title: "Deposit limit", text: l.cap, url: l.url });
      if (l.interest) out.push({ title: "Interest on your deposit", text: l.interest, url: l.url });
      if (l.repair_deduct) out.push({ title: "Repair and deduct", text: l.repair_deduct, url: l.url });
      if (l.withhold) out.push({ title: "Holding back rent", text: `${l.withhold} Withholding rent can lead to an eviction case, so get advice first.`, url: l.url });
      if (l.entry) out.push({ title: "Before they come in", text: `Notice required: ${l.entry}`, url: l.url });
      if (l.retaliation) out.push({ title: "Protection from payback", text: l.retaliation, url: l.url });
    }
  }
  if (category === "debt") {
    const t = debtTimeLimit(state);
    if (t) {
      out.push({ title: "Time limit to sue you", text: `Collectors generally have ${t.span} to sue. ${t.revival}`, url: t.rule.source });
      if (t.rule.barred_extinguished) out.push({ title: "Old debts", text: "This state limits collecting on debts past the time limit.", url: t.rule.source });
      if (t.rule.disclosure) out.push({ title: "They must tell you", text: "Collectors must tell you in writing if a debt is too old to sue on.", url: t.rule.source });
      if (t.rule.note) out.push({ title: "Also note", text: t.rule.note, url: t.rule.source });
    }
  }
  if (category === "medical" || category === "debt") {
    const m = medicalRule(state);
    if (m) {
      if (m.credit) out.push({ title: "Medical debt and credit", text: m.credit, url: m.url });
      if (category === "medical") {
        if (m.charity) out.push({ title: "Hospital financial help", text: m.charity, url: m.url });
        if (m.interest) out.push({ title: "Interest limit", text: m.interest, url: m.url });
        if (m.collections) out.push({ title: "Collection limits", text: m.collections, url: m.url });
        if (m.surprise) out.push({ title: "Surprise bills", text: m.surprise, url: m.url });
      }
    }
  }
  if (category === "insurance") {
    const i = insuranceRule(state);
    if (i) {
      out.push({ title: "Outside review", text: `${i.external_review.replace(/\.$/, "")}. This applies to plans regulated by the state; large employer plans that pay claims themselves use the federal process.`, url: i.complaint_url });
      out.push({ title: "Your state regulator", text: `${i.dept} takes complaints about insurers.`, url: i.complaint_url });
      out.push({ title: `If it's ${i.medicaid_name}`, text: `Ask for a fair hearing within ${i.medicaid_days} days of the notice.${i.note ? ` ${i.note}` : ""}`, url: i.medicaid_url });
    }
  }
  return out;
}

/** One block of state context for the AI. */
export function stateContext(category: Category, state?: string | null, lastPayment?: string | null) {
  const rights = stateRights(category, state);
  const lines = rights.map((r) => `- ${r.title}: ${r.text}`);
  if (category === "debt") {
    const t = debtTimeLimit(state, lastPayment);
    if (t?.age) lines.push(`- Last payment ${lastPayment}; the time limit to sue ${t.age.expired ? "has likely passed" : `likely ends ${t.age.expires}`}.`);
  }
  return lines.length ? `State rules for ${state} (general, check before relying on them):\n${lines.join("\n")}` : "";
}
