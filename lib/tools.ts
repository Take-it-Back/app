// Everything reachable from the More tab. Case-level tools open a case picker first.
export type Tool = { name: string; blurb: string; href: string; group: string; icon: string; premium?: boolean; admin?: boolean; tone?: "orange" };

export const TOOLS: Tool[] = [
  { group: "Get help", name: "Get real help", blurb: "Free legal aid and agencies near you", href: "/app/help", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v5M12 16h.01", tone: "orange" },
  { group: "Account", name: "Account and settings", blurb: "Name, state, reminders, password", href: "/app/you", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
  { group: "Account", name: "Plan and billing", blurb: "Premium, trial and receipts", href: "/app/upgrade", icon: "M3 7h18v10H3zM3 11h18" },
  { group: "Account", name: "Admin dashboard", blurb: "Users, plans and cases", href: "/app/admin", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2", admin: true },
];
