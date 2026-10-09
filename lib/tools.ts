// Everything reachable from the More tab. Case-level tools open a case picker first.
export type Tool = { name: string; blurb: string; href: string; group: string; icon: string; premium?: boolean; admin?: boolean; tone?: "orange" };

const pick = (to: string, label: string) => `/app/tools/pick?to=${encodeURIComponent(to)}&label=${encodeURIComponent(label)}`;

export const TOOLS: Tool[] = [
  { group: "Get help", name: "Get real help", blurb: "Free legal aid and agencies near you", href: "/app/help", icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v5M12 16h.01", tone: "orange" },
  { group: "Fight a case", name: "Write a letter", blurb: "Disputes, appeals, demands and follow-ups", href: pick("write", "Write a letter"), icon: "M4 6h16v12H4zM4 7l8 6 8-6", premium: true },
  { group: "Fight a case", name: "Lower my bill", blurb: "Discounts, payment plans, financial help", href: pick("write", "Lower my bill"), icon: "M12 3v18M17 7.5a4 4 0 0 0-4-2.5H11a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6h-2a4 4 0 0 1-4-2.5", premium: true },
  { group: "Fight a case", name: "Call script", blurb: "What to say, ask and avoid on the phone", href: pick("calls", "Call script"), icon: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" },
  { group: "Fight a case", name: "File a complaint", blurb: "CFPB, state regulators and more", href: pick("escalate", "File a complaint"), icon: "M4 21V4h12l-2 4 2 4H4", premium: true },
  { group: "Fight a case", name: "Fix my credit report", blurb: "Dispute letters to all three bureaus", href: pick("escalate", "Fix my credit report"), icon: "M3 17l5-5 4 4 8-8M15 8h5v5", premium: true },
  { group: "Fight a case", name: "Small claims kit", blurb: "Evidence, statement and steps to file", href: pick("small-claims", "Small claims kit"), icon: "M12 3v18M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z" },
  { group: "Fight a case", name: "Send by mail or fax", blurb: "Certified mail or fax, no printer", href: pick("write", "Send by mail or fax"), icon: "M22 2L11 13M22 2l-7 20-4-9-9-4z", premium: true },
  { group: "Fight a case", name: "Get a helper", blurb: "Share a case with family", href: pick("share", "Get a helper"), icon: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.6", premium: true },
  { group: "Stay on top of it", name: "Forward bills by email", blurb: "Your private address for bills", href: "/app/tools/inbox", icon: "M4 6h16v12H4zM4 7l8 6 8-6M15 15l3 3-3 3", premium: true },
  { group: "Stay on top of it", name: "Text reminders", blurb: "A text before every deadline", href: "/app/you#reminders", icon: "M4 5h16v11H8l-4 4z", premium: true },
  { group: "Account", name: "Account and settings", blurb: "Name, address, reminders, password", href: "/app/you", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" },
  { group: "Account", name: "Plan and billing", blurb: "Premium, trial and receipts", href: "/app/upgrade", icon: "M3 7h18v10H3zM3 11h18" },
  { group: "Account", name: "Admin dashboard", blurb: "Users, plans and cases", href: "/app/admin", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2", admin: true },
];
