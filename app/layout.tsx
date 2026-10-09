import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Outfit:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
