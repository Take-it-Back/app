import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: "Take it back",
    short_name: "Take it back",
    description: "Fight unfair bills, denials and notices from hospitals, insurers, landlords and debt collectors.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["finance", "productivity", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Scan a document", short_name: "Scan", url: "/app/scan", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Dates", url: "/app/dates", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
