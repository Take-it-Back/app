import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Outfit } from "next/font/google";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], display: "swap", variable: "--font-serif" });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-sans" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600"], display: "swap", variable: "--font-hand", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.takeitback.app"),
  title: { default: "Take it back — fight unfair bills, denials and notices", template: "%s · Take it back" },
  description:
    "Snap a photo of a medical bill, insurance denial, landlord notice or debt letter. Get your rights in plain words, a ready-to-send letter, and every deadline tracked.",
  icons: { icon: "/icon.svg", apple: "/icons/apple-touch-icon.png" },
  applicationName: "Take it back",
  appleWebApp: { capable: true, title: "Take it back", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Take it back",
    description: "Fight back against hospitals, insurers, landlords and debt collectors. They count on you giving up. Take it back.",
    url: "https://www.takeitback.app",
    siteName: "Take it back",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Take it back: fight back against hospitals, insurers, landlords and debt collectors" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Take it back",
    description: "Fight back against hospitals, insurers, landlords and debt collectors.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable} ${caveat.variable}`}>
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
