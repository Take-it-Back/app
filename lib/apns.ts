// Server only. Sends notifications to the iPhone app through Apple Push Notification service,
// using a token key (.p8) from the Apple Developer account.
import http2 from "node:http2";
import { createPrivateKey, sign } from "node:crypto";

const b64url = (b: Buffer | string) => Buffer.from(b).toString("base64url");

let cached: { jwt: string; at: number } | null = null;

export function apnsReady() {
  return Boolean(process.env.APNS_KEY_ID && process.env.APNS_TEAM_ID && process.env.APNS_PRIVATE_KEY);
}

/** Apple accepts a token for up to an hour; we refresh every 50 minutes. */
function jwt() {
  if (cached && Date.now() - cached.at < 50 * 60 * 1000) return cached.jwt;
  const header = b64url(JSON.stringify({ alg: "ES256", kid: process.env.APNS_KEY_ID }));
  const iat = Math.floor(Date.now() / 1000);
  const claims = b64url(JSON.stringify({ iss: process.env.APNS_TEAM_ID, iat }));
  const pem = process.env.APNS_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const sig = sign("sha256", Buffer.from(`${header}.${claims}`), { key: createPrivateKey(pem), dsaEncoding: "ieee-p1363" });
  cached = { jwt: `${header}.${claims}.${b64url(sig)}`, at: Date.now() };
  return cached.jwt;
}

export type ApnsResult = { token: string; status: number; reason?: string };

/** Sends one alert to each device token. A status of 410 (or reason BadDeviceToken) means the token is gone. */
export async function sendApns(tokens: string[], alert: { title: string; body: string; url?: string }): Promise<ApnsResult[]> {
  if (!apnsReady() || !tokens.length) return [];
  const host = process.env.APNS_SANDBOX === "1" ? "https://api.sandbox.push.apple.com" : "https://api.push.apple.com";
  const topic = process.env.APNS_TOPIC || process.env.APPLE_BUNDLE_ID || "app.takeitback";
  const payload = JSON.stringify({ aps: { alert: { title: alert.title, body: alert.body }, sound: "default" }, url: alert.url || "/app" });
  const client = http2.connect(host);
  try {
    return await Promise.all(
      tokens.map(
        (token) =>
          new Promise<ApnsResult>((resolve) => {
            const req = client.request({
              ":method": "POST",
              ":path": `/3/device/${token}`,
              authorization: `bearer ${jwt()}`,
              "apns-topic": topic,
              "apns-push-type": "alert",
              "apns-priority": "10",
              "apns-expiration": String(Math.floor(Date.now() / 1000) + 12 * 3600),
              "content-type": "application/json",
            });
            let status = 0;
            let data = "";
            req.on("response", (h) => (status = Number(h[":status"]) || 0));
            req.on("data", (c) => (data += c));
            req.on("end", () => resolve({ token, status, reason: data ? (JSON.parse(data) as { reason?: string }).reason : undefined }));
            req.on("error", () => resolve({ token, status: 0, reason: "network" }));
            req.setTimeout(10000, () => { req.close(); resolve({ token, status: 0, reason: "timeout" }); });
            req.end(payload);
          })
      )
    );
  } finally {
    client.close();
  }
}
