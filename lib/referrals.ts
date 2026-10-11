import { SITE_URL } from "./seo";

export const REFERRAL_TEXT = "I'm using Take it back to fight a bill. Get your first month of Premium free:";
export const referralUrl = (code: string, to?: string) => `${SITE_URL}/r/${code}${to ? `?to=${encodeURIComponent(to)}` : ""}`;

const WHAT: Record<string, string> = { medical: "a medical bill", insurance: "an insurance denial", landlord: "a landlord", debt: "a debt collector", other: "a company" };
export const winWhat = (category: string) => WHAT[category] || WHAT.other;
