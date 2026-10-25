// Makes the "Secret Key" Supabase needs for Sign in with Apple on the website, and (optionally) saves it
// to Supabase. Apple only accepts these for up to 6 months, so .github/workflows/apple-auth-secret.yml
// runs this monthly to keep it fresh.
//
//   APPLE_TEAM_ID=… APPLE_SIGNIN_KEY_ID=… APPLE_SIGNIN_P8="$(cat AuthKey_XXXX.p8)" APPLE_SERVICES_ID=app.takeitback.web \
//   node scripts/apple-auth-secret.mjs            # prints the secret
//   SUPABASE_ACCESS_TOKEN=… node scripts/apple-auth-secret.mjs --apply   # also saves it to Supabase
import { createPrivateKey, sign } from "node:crypto";

const { APPLE_TEAM_ID: team, APPLE_SIGNIN_KEY_ID: kid, APPLE_SIGNIN_P8: p8, APPLE_SERVICES_ID: services } = process.env;
const bundle = process.env.APPLE_BUNDLE_ID || "app.takeitback";
const project = process.env.SUPABASE_PROJECT_REF || "uzogyqreputvggefnxiy";
if (!team || !kid || !p8 || !services) {
  console.error("Set APPLE_TEAM_ID, APPLE_SIGNIN_KEY_ID, APPLE_SIGNIN_P8 and APPLE_SERVICES_ID.");
  process.exit(1);
}

const b64 = (x) => Buffer.from(typeof x === "string" ? x : JSON.stringify(x)).toString("base64url");
const now = Math.floor(Date.now() / 1000);
const head = b64({ alg: "ES256", kid });
const body = b64({ iss: team, iat: now, exp: now + 180 * 86400, aud: "https://appleid.apple.com", sub: services });
const sig = sign("sha256", Buffer.from(`${head}.${body}`), { key: createPrivateKey(p8.replace(/\\n/g, "\n")), dsaEncoding: "ieee-p1363" });
const secret = `${head}.${body}.${sig.toString("base64url")}`;

if (!process.argv.includes("--apply")) {
  console.log(secret);
  process.exit(0);
}
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error("Set SUPABASE_ACCESS_TOKEN to save it to Supabase.");
  process.exit(1);
}
const res = await fetch(`https://api.supabase.com/v1/projects/${project}/config/auth`, {
  method: "PATCH",
  headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
  // Website sign-in uses the Services ID; the iPhone app signs in with the bundle ID.
  body: JSON.stringify({ external_apple_enabled: true, external_apple_client_id: `${services},${bundle}`, external_apple_secret: secret }),
});
console.log(res.ok ? `Saved. Valid until ${new Date((now + 180 * 86400) * 1000).toDateString()}.` : `Supabase said ${res.status}: ${await res.text()}`);
process.exit(res.ok ? 0 : 1);
