// Guide categories, types and cover icons. Kept separate from the guide text so the index,
// category pages, covers and analytics rules can all share it.

export type GuideCategory =
  | "medical-bills" | "health-insurance" | "renters" | "debt" | "courts-complaints"
  | "credit" | "banking-fraud" | "insurance" | "auto" | "home"
  | "shopping" | "utilities" | "travel" | "student-loans" | "work";

export type GuideKind = "how-to" | "rights" | "explainer" | "letter" | "checklist";

export type IconKey =
  | "receipt" | "shield" | "house" | "key" | "phone" | "car" | "plane" | "card" | "bank" | "scale"
  | "gavel" | "envelope" | "document" | "clock" | "search" | "cross" | "pill" | "cap" | "briefcase"
  | "wrench" | "wifi" | "bolt" | "bag" | "tag" | "lock" | "alert" | "check" | "calendar" | "megaphone"
  | "pin" | "coin" | "chart" | "package" | "flag" | "stop" | "user" | "drop" | "bell" | "clipboard" | "scissors";

export const ICON_KEYS: IconKey[] = [
  "receipt", "shield", "house", "key", "phone", "car", "plane", "card", "bank", "scale",
  "gavel", "envelope", "document", "clock", "search", "cross", "pill", "cap", "briefcase",
  "wrench", "wifi", "bolt", "bag", "tag", "lock", "alert", "check", "calendar", "megaphone",
  "pin", "coin", "chart", "package", "flag", "stop", "user", "drop", "bell", "clipboard", "scissors",
];

export const KINDS: { slug: GuideKind; label: string }[] = [
  { slug: "how-to", label: "Step-by-step" },
  { slug: "rights", label: "Your rights" },
  { slug: "explainer", label: "Explainer" },
  { slug: "letter", label: "Letter & template" },
  { slug: "checklist", label: "Checklist" },
];
export const kindLabel = (k: GuideKind) => KINDS.find((x) => x.slug === k)?.label ?? "Guide";

export type CategoryInfo = {
  slug: GuideCategory;
  name: string;
  blurb: string;
  /** Soft background and stroke colour for covers. */
  tint: string;
  ink: string;
  /** Pages about health: analytics stays off (see the health data privacy memo). */
  health?: boolean;
  /** Fight page this category belongs to, if any. */
  problem?: "medical-bills" | "insurance-denials" | "landlords" | "debt-collectors";
};

export const CATEGORIES: CategoryInfo[] = [
  { slug: "medical-bills", name: "Medical bills", blurb: "Read, question and dispute hospital and doctor bills.", tint: "#FDEEE7", ink: "#A8441F", health: true, problem: "medical-bills" },
  { slug: "health-insurance", name: "Health insurance", blurb: "Denied claims, appeals, prior authorization and coverage.", tint: "#E6F0F8", ink: "#1F5C8B", health: true, problem: "insurance-denials" },
  { slug: "renters", name: "Renting & landlords", blurb: "Deposits, repairs, rent increases, leases and evictions.", tint: "#ECF2E0", ink: "#4A6B1F", problem: "landlords" },
  { slug: "debt", name: "Debt & collectors", blurb: "Collector rules, old debt, lawsuits and garnishment.", tint: "#F7EBDD", ink: "#8A5A1E", problem: "debt-collectors" },
  { slug: "courts-complaints", name: "Courts & complaints", blurb: "Small claims, demand letters and where to file a complaint.", tint: "#EEE9F6", ink: "#5B3F8C" },
  { slug: "credit", name: "Credit reports & scores", blurb: "Fix errors, freeze your file and understand what counts.", tint: "#E1F2EE", ink: "#1B6B5E" },
  { slug: "banking-fraud", name: "Banks, fraud & scams", blurb: "Unauthorized charges, scams, frozen accounts and identity theft.", tint: "#FBE8EB", ink: "#A3283F" },
  { slug: "insurance", name: "Insurance claims", blurb: "Car, home, renters and life insurance claims that go wrong.", tint: "#E8EDF7", ink: "#2F4B94" },
  { slug: "auto", name: "Cars & repairs", blurb: "Dealers, lemons, repossession, repair shops and tow fees.", tint: "#EFEFE6", ink: "#5A5A2E" },
  { slug: "home", name: "Home & contractors", blurb: "Contractors, liens, warranties, HOAs and property taxes.", tint: "#F5E9E1", ink: "#8C4A2A" },
  { slug: "shopping", name: "Shopping & subscriptions", blurb: "Refunds, free trials, warranties and hidden fees.", tint: "#FDEFD9", ink: "#9A5800" },
  { slug: "utilities", name: "Phone, internet & utilities", blurb: "Billing errors, cancellations, shutoffs and spam calls.", tint: "#E3F1F6", ink: "#1F6A85" },
  { slug: "travel", name: "Travel & airlines", blurb: "Cancelled flights, lost bags, hotel fees and timeshares.", tint: "#E4ECFA", ink: "#2B5FB3" },
  { slug: "student-loans", name: "Student loans", blurb: "Servicer problems, repayment, forgiveness and default.", tint: "#F1E7F4", ink: "#7A3A8F" },
  { slug: "work", name: "Work & wages", blurb: "Unpaid wages, unemployment, workers' comp and retaliation.", tint: "#E7EFE9", ink: "#345F46" },
];

export const categoryBySlug = (s: string) => CATEGORIES.find((c) => c.slug === s);
export const HEALTH_CATEGORIES = CATEGORIES.filter((c) => c.health).map((c) => c.slug);
