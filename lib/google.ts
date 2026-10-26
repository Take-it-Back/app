// Server only. Google Play purchase checks and Android phone alerts (Firebase Cloud Messaging),
// using Google service accounts. Nothing from the phone is trusted: every purchase is looked up at Google.
import { createSign } from "node:crypto";

export const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE || "app.takeitback";
export const GOOGLE_PRODUCTS = {
  premium: process.env.NEXT_PUBLIC_GOOGLE_PRODUCT_PREMIUM || "app.takeitback.premium",
  casePass: process.env.NEXT_PUBLIC_GOOGLE_PRODUCT_CASE_PASS || "app.takeitback.casepass",
};

type ServiceAccount = { client_email: string; private_key: string; project_id?: string };

function account(envName: string): ServiceAccount | null {
  const raw = process.env[envName];
  if (!raw) return null;
  try {
    const json = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8")) as ServiceAccount;
    return json.client_email && json.private_key ? json : null;
  } catch {
    return null;
  }
}

export const playReady = () => Boolean(account("GOOGLE_PLAY_SERVICE_ACCOUNT"));
export const fcmReady = () => Boolean(account("FIREBASE_SERVICE_ACCOUNT"));

const tokens = new Map<string, { token: string; until: number }>();

/** OAuth access token for a service account (JWT bearer grant), cached until a minute before it expires. */
async function accessToken(envName: string, scope: string): Promise<string | null> {
  const sa = account(envName);
  if (!sa) return null;
  const key = `${envName}:${scope}`;
  const hit = tokens.get(key);
  if (hit && hit.until > Date.now()) return hit.token;
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: sa.client_email, scope, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key.replace(/\\n/g, "\n")).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
  });
  if (!res.ok) return null;
  const d = (await res.json()) as { access_token: string; expires_in: number };
  tokens.set(key, { token: d.access_token, until: Date.now() + (d.expires_in - 60) * 1000 });
  return d.access_token;
}

const PLAY = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${ANDROID_PACKAGE}`;
const PLAY_SCOPE = "https://www.googleapis.com/auth/androidpublisher";

async function play(path: string, init?: RequestInit) {
  const token = await accessToken("GOOGLE_PLAY_SERVICE_ACCOUNT", PLAY_SCOPE);
  if (!token) throw new Error("Google Play isn't set up");
  const res = await fetch(`${PLAY}${path}`, { ...init, headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`Google Play ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

type SubV2 = {
  subscriptionState?: string;
  acknowledgementState?: string;
  latestOrderId?: string;
  startTime?: string;
  externalAccountIdentifiers?: { obfuscatedExternalAccountId?: string };
  lineItems?: { productId: string; expiryTime?: string; offerDetails?: { basePlanId?: string; offerId?: string } }[];
};

export type GoogleSubState = { userHint: string | null; status: string; periodEnd: string | null; productId: string | null; acknowledged: boolean };

/** Looks up a subscription purchase at Google and maps it to the app's plan statuses. */
export async function googleSubscription(purchaseToken: string): Promise<GoogleSubState> {
  const s = (await play(`/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`)) as SubV2;
  const item = s.lineItems?.[0];
  const expiry = item?.expiryTime ? Date.parse(item.expiryTime) : 0;
  const trial = Boolean(item?.offerDetails?.offerId && /trial/i.test(item.offerDetails.offerId));
  let status: string;
  switch (s.subscriptionState) {
    case "SUBSCRIPTION_STATE_ACTIVE":
      status = trial ? "trialing" : "active";
      break;
    case "SUBSCRIPTION_STATE_IN_GRACE_PERIOD":
      status = "past_due";
      break;
    case "SUBSCRIPTION_STATE_CANCELED": // canceled but paid up until the expiry time
      status = expiry > Date.now() ? "active" : "canceled";
      break;
    default: // on hold, paused, expired, pending
      status = "canceled";
  }
  return {
    userHint: s.externalAccountIdentifiers?.obfuscatedExternalAccountId || null,
    status,
    periodEnd: expiry ? new Date(expiry).toISOString() : null,
    productId: item?.productId || null,
    acknowledged: s.acknowledgementState === "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED",
  };
}

/** Google refunds a subscription automatically if it isn't acknowledged within 3 days. */
export async function acknowledgeSubscription(productId: string, purchaseToken: string) {
  await play(`/purchases/subscriptions/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`, { method: "POST", body: "{}" });
}

type ProductPurchase = { purchaseState?: number; consumptionState?: number; orderId?: string; obfuscatedExternalAccountId?: string; acknowledgementState?: number };

/** One-time product (case pass). purchaseState 0 = purchased, 1 = canceled, 2 = pending. */
export async function googleProduct(productId: string, purchaseToken: string) {
  const p = (await play(`/purchases/products/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}`)) as ProductPurchase;
  return { paid: p.purchaseState === 0, consumed: p.consumptionState === 1, orderId: p.orderId || null, userHint: p.obfuscatedExternalAccountId || null };
}

/** Marks a case pass as used so it can be bought again for another case. */
export async function consumeProduct(productId: string, purchaseToken: string) {
  await play(`/purchases/products/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}:consume`, { method: "POST", body: "{}" });
}

export type FcmResult = { token: string; ok: boolean; gone: boolean };

/** Sends an alert to Android devices through Firebase Cloud Messaging (HTTP v1). */
export async function sendFcm(deviceTokens: string[], alert: { title: string; body: string; url?: string }): Promise<FcmResult[]> {
  const sa = account("FIREBASE_SERVICE_ACCOUNT");
  if (!sa || !deviceTokens.length) return [];
  const token = await accessToken("FIREBASE_SERVICE_ACCOUNT", "https://www.googleapis.com/auth/firebase.messaging");
  if (!token) return [];
  const url = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;
  return Promise.all(
    deviceTokens.map(async (t) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({
          message: {
            token: t,
            notification: { title: alert.title, body: alert.body },
            data: { url: alert.url || "/app" },
            android: { priority: "high", notification: { channel_id: "deadlines" }, ttl: "43200s" },
          },
        }),
      }).catch(() => null);
      if (!res) return { token: t, ok: false, gone: false };
      const err = res.ok ? null : ((await res.json().catch(() => ({}))) as { error?: { status?: string } }).error?.status;
      return { token: t, ok: res.ok, gone: err === "NOT_FOUND" || err === "UNREGISTERED" };
    })
  );
}
