// Free and low-cost legal help by state, from LSC's grantee list, LawHelp portals and state bar referral services (checked Oct 2026).
import data from "./state-law/legalaid.json";

export type AidOrg = { name: string; url: string; phone: string | null; area: string };
export type AidLink = { name: string; url: string; phone?: string | null };
export type LegalAid = { portal: AidLink; orgs: AidOrg[]; tenant: AidLink | null; referral: AidLink | null };

const ZIP3 = (data as unknown as { zip3: Record<string, string> }).zip3;

export const AID_STATES = Object.keys(data).filter((k) => k !== "zip3" && k !== "_meta").sort();

export const stateSlug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");
export const stateFromSlug = (slug: string) => AID_STATES.find((s) => stateSlug(s) === slug) || null;

export function stateFromZip(zip?: string | null) {
  const z = (zip || "").replace(/\D/g, "");
  if (z.length < 3) return null;
  return ZIP3[z.slice(0, 3)] || null;
}

export function legalAidFor(state?: string | null): LegalAid | null {
  if (!state) return null;
  return ((data as Record<string, unknown>)[state] as LegalAid) || null;
}

export const telHref = (p: string) => `tel:${p.replace(/[^0-9+]/g, "")}`;
