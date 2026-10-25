// Server only. Talks to Apple's Sign in with Apple REST API: turns the app's one-time code into a
// refresh token, and revokes it when someone deletes their account (App Store guideline 5.1.1(v)).
import { createPrivateKey, sign } from "node:crypto";

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");

/** Key with "Sign in with Apple" enabled. The push key can be reused if both services are ticked on it. */
function keyParts() {
  const keyId = process.env.APPLE_SIGNIN_KEY_ID || process.env.APNS_KEY_ID;
  const pem = process.env.APPLE_SIGNIN_PRIVATE_KEY || process.env.APNS_PRIVATE_KEY;
  const team = process.env.APPLE_TEAM_ID || process.env.APNS_TEAM_ID;
  return keyId && pem && team ? { keyId, pem: pem.replace(/\\n/g, "\n"), team } : null;
}

export const appleSigninReady = () => Boolean(keyParts());

/** The short-lived "client secret" Apple asks for: a JWT signed with our key. */
export function appleClientSecret(clientId: string, days = 1) {
  const k = keyParts();
  if (!k) throw new Error("Apple sign-in key not set");
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: "ES256", kid: k.keyId }));
  const body = b64url(JSON.stringify({ iss: k.team, iat: now, exp: now + days * 86400, aud: "https://appleid.apple.com", sub: clientId }));
  const sig = sign("sha256", Buffer.from(`${head}.${body}`), { key: createPrivateKey(k.pem), dsaEncoding: "ieee-p1363" });
  return `${head}.${body}.${b64url(sig)}`;
}

export async function exchangeAppleCode(code: string, clientId: string): Promise<string | null> {
  const res = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: appleClientSecret(clientId), code, grant_type: "authorization_code" }),
  });
  if (!res.ok) return null;
  const d = (await res.json()) as { refresh_token?: string };
  return d.refresh_token ?? null;
}

export async function revokeAppleToken(refreshToken: string, clientId: string) {
  const res = await fetch("https://appleid.apple.com/auth/revoke", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: appleClientSecret(clientId), token: refreshToken, token_type_hint: "refresh_token" }),
  });
  return res.ok;
}
