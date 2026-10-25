// Lets iPhone open takeitback.app links in the app, and lets iOS offer saved passwords there.
// Needs APPLE_TEAM_ID (from the Apple Developer account) set in Vercel.
export const dynamic = "force-static";

export function GET() {
  const team = process.env.APPLE_TEAM_ID;
  const bundle = process.env.APPLE_BUNDLE_ID || "app.takeitback";
  const id = team ? `${team}.${bundle}` : null;
  const body = id
    ? {
        applinks: { details: [{ appIDs: [id], components: [{ "/": "/app/*" }, { "/": "/auth/*" }, { "/": "/login" }, { "/": "/r/*" }] }] },
        webcredentials: { apps: [id] },
      }
    : { applinks: { details: [] } };
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" } });
}
