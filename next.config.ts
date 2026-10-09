import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "20mb" },
  },
  async redirects() {
    return [
      { source: "/help-with", destination: "/fight", permanent: true },
      { source: "/help-with/renters", destination: "/fight/landlords", permanent: true },
      { source: "/help-with/:slug", destination: "/fight/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
