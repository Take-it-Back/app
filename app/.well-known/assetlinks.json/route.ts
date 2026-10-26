// Lets Android open takeitback.app links in the app. Needs ANDROID_CERT_SHA256 (the Play app-signing
// certificate fingerprint, and optionally the upload key's), comma-separated, set in Vercel.
export const dynamic = "force-static";

export function GET() {
  const prints = (process.env.ANDROID_CERT_SHA256 || "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  const body = prints.length
    ? [{ relation: ["delegate_permission/common.handle_all_urls", "delegate_permission/common.get_login_creds"], target: { namespace: "android_app", package_name: process.env.ANDROID_PACKAGE || "app.takeitback", sha256_cert_fingerprints: prints } }]
    : [];
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" } });
}
