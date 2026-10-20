// Quick live check: every public page loads, has its own title/canonical/share tags,
// and private pages send people to sign in. Usage: npm run smoke [-- https://www.takeitback.app]
const BASE = (process.argv[2] || process.env.SMOKE_URL || "https://www.takeitback.app").replace(/\/$/, "");

const PUBLIC = [
  "/", "/how-it-works", "/pricing", "/faq", "/fight", "/features", "/guides",
  "/fight/medical-bills", "/fight/insurance-denials", "/fight/landlords", "/fight/debt-collectors",
  "/features/letters", "/features/state-rules", "/features/send-for-you", "/guides/how-to-dispute-a-medical-bill", "/guides/security-deposit-return-deadlines-by-state",
  "/privacy", "/health-data-privacy", "/terms", "/es", "/legal-aid/pennsylvania", "/guides/statute-of-limitations-on-debt-by-state",
  "/guides/how-to-get-an-itemized-medical-bill", "/guides/category/renters", "/guides/category/medical-bills", "/states", "/states/pennsylvania", "/laws/security-deposit", "/laws/security-deposit/pennsylvania", "/laws/debt-time-limit/pennsylvania", "/laws/medical-debt/pennsylvania",
];
const PRIVATE = ["/app", "/app/cases", "/app/tools", "/app/admin"];
const FILES = ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/og.png", "/sw.js", "/offline.html"];

const pick = (html, re) => (html.match(re) || [])[1] || "";
let fails = 0;
const fail = (msg) => { fails++; console.log(`  ✗ ${msg}`); };
const titles = new Map();

for (const path of PUBLIC) {
  const t0 = Date.now();
  const res = await fetch(BASE + path);
  const html = await res.text();
  const ms = Date.now() - t0;
  const title = pick(html, /<title>([^<]*)<\/title>/);
  const canonical = pick(html, /<link rel="canonical" href="([^"]+)"/);
  const ogUrl = pick(html, /<meta property="og:url" content="([^"]+)"/);
  const ogImg = pick(html, /<meta property="og:image" content="([^"]+)"/);
  console.log(`${res.status} ${String(ms).padStart(5)}ms ${path}`);
  if (res.status !== 200) fail(`${path} returned ${res.status}`);
  if (!title) fail(`${path} has no title`);
  if (titles.has(title)) fail(`${path} shares a title with ${titles.get(title)}`);
  titles.set(title, path);
  if (!canonical.endsWith(path === "/" ? "takeitback.app" : path) && !canonical.endsWith(path)) fail(`${path} canonical is "${canonical}"`);
  if (!ogUrl) fail(`${path} has no og:url`);
  if (!ogImg) fail(`${path} has no share image`);
  if (path !== "/privacy" && path !== "/terms" && !html.includes("application/ld+json")) fail(`${path} has no structured data`);
  if (/noindex/.test(pick(html, /<meta name="robots" content="([^"]+)"/))) fail(`${path} is noindex`);
}

for (const path of PRIVATE) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  const loc = res.headers.get("location") || "";
  console.log(`${res.status}         ${path} → ${loc}`);
  if (!(res.status >= 300 && res.status < 400 && loc.includes("/login"))) fail(`${path} is not protected`);
}

for (const path of FILES) {
  const res = await fetch(BASE + path);
  console.log(`${res.status}         ${path}`);
  if (res.status !== 200) fail(`${path} returned ${res.status}`);
}

const login = await (await fetch(BASE + "/login")).text();
if (!/noindex/.test(login)) fail("/login should be noindex");
const missing = await fetch(BASE + "/this-page-does-not-exist");
if (missing.status !== 404) fail(`missing pages return ${missing.status}, not 404`);

const health = await fetch(BASE + "/api/health").catch(() => null);
console.log(`${health?.status ?? "ERR"}         /api/health`);
if (!health || health.status !== 200) { fails++; console.log("  ✗ health check failed"); }

console.log(fails ? `\n${fails} problem(s) found` : "\nAll checks passed");
process.exit(fails ? 1 : 0);
