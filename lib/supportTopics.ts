// Labels shared by the support pages (safe to use in the browser).
export const SUPPORT_TOPICS: [string, string][] = [
  ["account", "My account or sign-in"],
  ["billing", "Billing, Premium or a refund"],
  ["scan", "Scanning or reading a document"],
  ["letters", "Letters, mail or fax"],
  ["bug", "Something isn't working"],
  ["privacy", "Privacy or deleting my data"],
  ["other", "Something else"],
];
export const topicLabel = (t?: string | null) => SUPPORT_TOPICS.find(([k]) => k === t)?.[1] || "Something else";
export const PLATFORM_LABEL: Record<string, string> = { web: "Website", ios: "iPhone app", android: "Android app" };
export const STATUS_LABEL: Record<string, string> = { open: "Waiting on us", waiting: "We replied", closed: "Closed" };
