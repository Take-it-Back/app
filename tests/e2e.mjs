// End-to-end check of the live site. Usage: E2E_ADMIN_EMAIL=… E2E_ADMIN_PASSWORD=… npm run test:e2e
// (needs "npm i -D playwright" once; set CHROMIUM_PATH to use an existing Chromium). Uses only "ZZ test" data and cleans up.
import { chromium, devices } from "playwright";
const base = process.argv[2] || "https://www.takeitback.app";
const bill = process.argv[3];
const results = [];
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
async function step(name, fn) {
  const t0 = Date.now();
  try { const note = await fn(); results.push(["PASS", name, Date.now() - t0, note || ""]); }
  catch (e) { results.push(["FAIL", name, Date.now() - t0, String(e.message).split("\n")[0].slice(0, 200)]); }
}
async function newPage() {
  const ctx = await b.newContext({ ...devices["iPhone 13"] });
  const p = await ctx.newPage();
  p.errors = [];
  p.on("pageerror", (e) => p.errors.push(e.message));
  p.on("response", (r) => { if (r.status() >= 500 && r.url().startsWith(base)) p.errors.push(`${r.status()} ${r.url()}`); });
  return p;
}
const expectOk = async (p, url) => { const r = await p.goto(base + url, { waitUntil: "domcontentloaded" }); if (!r || r.status() >= 400) throw new Error(`${url} -> ${r?.status()}`); await p.waitForLoadState("networkidle").catch(() => {}); return r.status(); };

// 1. Marketing: every internal link from every sitemap page
const pub = await newPage();
await step("Marketing: sitemap pages and all internal links", async () => {
  const xml = await (await pub.request.get(base + "/sitemap.xml")).text();
  const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const links = new Set(pages);
  for (const u of pages) {
    await expectOk(pub, u);
    for (const h of await pub.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")))) links.add(h.split("#")[0]);
  }
  const bad = [];
  for (const l of links) { if (!l || l.startsWith("/app") || l.startsWith("/api")) continue; const r = await pub.request.get(base + l, { maxRedirects: 5 }); if (r.status() >= 400) bad.push(`${l} ${r.status()}`); }
  if (bad.length) throw new Error("Broken: " + bad.join(", "));
  return `${pages.length} pages, ${links.size} links OK`;
});
await step("Marketing: mobile menu opens", async () => { await expectOk(pub, "/"); await pub.click(".nav-burger"); await pub.waitForSelector("#mobile-nav a[href='/pricing']"); });

// 2. New free account
const email = `tib-e2e-${Date.now()}@mailinator.com`;
const fu = await newPage();
let freeSignedIn = false;
await step("Free: sign up", async () => {
  await expectOk(fu, "/login?mode=signup");
  const name = fu.locator("input#name"); if (await name.count()) await name.fill("E2E Tester");
  await fu.fill("#email", email); await fu.fill("#password", "E2eTest#2026x");
  await fu.click("form button[type=submit]");
  await Promise.race([fu.waitForURL("**/app", { timeout: 20000 }), fu.waitForSelector("text=Check your email", { timeout: 20000 })]);
  freeSignedIn = fu.url().endsWith("/app");
  return freeSignedIn ? "signed straight in" : "asked to confirm email";
});
if (freeSignedIn) {
  await step("Free: sample case", async () => { await fu.click("text=Or explore a sample case first"); await fu.waitForURL(/\/app\/cases\/[0-9a-f-]{36}$/); });
  await step("Free: scan a bill (works, shows locked details)", async () => {
    await expectOk(fu, "/app/scan");
    await fu.setInputFiles("input[aria-label='Upload a file']", bill);
    await fu.click("text=Medical bill").catch(() => {});
    await fu.click("text=Show me what's wrong");
    await fu.waitForURL(/\/found/, { timeout: 60000 });
    if (!(await fu.locator(".upsell").count())) throw new Error("no upsell on found page");
  });
  await step("Free: letters are locked (402)", async () => {
    const cid = fu.url().match(/cases\/([0-9a-f-]{36})/)[1];
    const r = await fu.request.post(base + "/api/letter", { data: { caseId: cid, kind: "dispute" } });
    if (r.status() !== 402) throw new Error(`status ${r.status()}`);
  });
  await step("Free: unlock this case goes to checkout", async () => {
    const cid = fu.url().match(/cases\/([0-9a-f-]{36})/)[1];
    await expectOk(fu, `/app/cases/${cid}`);
    await fu.click("text=Unlock just this case");
    await fu.waitForURL(/checkout\.stripe\.com|error=billing/, { timeout: 30000 });
    return fu.url().includes("stripe.com") ? "reached Stripe checkout" : "billing not switched on (expected until keys added)";
  });
  await step("Free: 2nd scan this month is blocked", async () => {
    await expectOk(fu, "/app/scan");
    if (!(await fu.locator("text=this month's").count())) throw new Error("2nd scan not blocked");
  });
  await step("Free: upgrade page and checkout", async () => {
    await expectOk(fu, "/app/upgrade");
    await fu.click("form.plan-card.hot button");
    await fu.waitForURL(/checkout\.stripe\.com|error=billing/, { timeout: 30000 });
    return fu.url().includes("stripe.com") ? "reached Stripe checkout" : "billing not switched on (expected until keys added)";
  });
  await step("Free: every app page loads", async () => { for (const u of ["/app", "/app/cases", "/app/dates", "/app/tools", "/app/help", "/app/you", "/app/tools/inbox"]) await expectOk(fu, u); });
  await step("Free: admin page is hidden", async () => { const r = await fu.goto(base + "/app/admin"); if (r.status() !== 404) throw new Error(`status ${r.status()}`); });
}

// 3. Premium (admin)
const ad = await newPage();
let cid = null, lid = null;
await step("Premium: sign in with username", async () => { await expectOk(ad, "/login"); await ad.fill("#email", process.env.E2E_ADMIN_EMAIL || "admin@takeitback.app"); await ad.fill("#password", process.env.E2E_ADMIN_PASSWORD); await ad.click("form button[type=submit]"); await ad.waitForURL("**/app", { timeout: 20000 }); });
await step("Premium: scan → found → deadline set", async () => {
  await expectOk(ad, "/app/scan");
  if (await ad.locator("text=Before you scan").count()) { await ad.check("input[name=agree]"); await ad.click("text=I agree, continue"); await ad.waitForSelector("input[aria-label='Upload a file']", { state: "attached", timeout: 20000 }); }
  await ad.setInputFiles("input[aria-label='Upload a file']", bill);
  await ad.click("text=Show me what's wrong");
  await ad.waitForURL(/\/found/, { timeout: 60000 });
  cid = ad.url().match(/cases\/([0-9a-f-]{36})/)[1];
  await expectOk(ad, `/app/cases/${cid}`);
  if (!(await ad.locator(".panel-orange .big-num").first().textContent()).match(/day|late|—/)) throw new Error("no deadline tile");
});
for (const kind of ["itemized_bill", "discount", "payment_plan", "charity_care", "records_request", "dispute", "followup"]) {
  await step(`Premium: write letter "${kind}"`, async () => {
    const r = await ad.request.post(base + "/api/letter", { data: { caseId: cid, kind } });
    const j = await r.json(); if (!r.ok) throw new Error(j.error); lid = j.letterId;
  });
}
await step("Premium: letters menu → card writes a letter", async () => { await expectOk(ad, `/app/cases/${cid}/write`); await ad.click("text=Ask for an itemized bill"); await ad.waitForURL(/\/letter\?id=/, { timeout: 30000 }); lid = new URL(ad.url()).searchParams.get("id"); });
await step("Premium: edit + save letter", async () => { const t = ad.locator("textarea").first(); await t.fill((await t.inputValue()) + "\nP.S. Test edit."); await ad.click("text=Save changes"); await ad.waitForTimeout(1500); await ad.reload(); if (!(await ad.locator("textarea").first().inputValue()).includes("Test edit")) throw new Error("edit not saved"); });
await step("Premium: print view", async () => { await expectOk(ad, `/app/cases/${cid}/letter/print?id=${lid}`); });
await step("Premium: send-for-me page", async () => { await expectOk(ad, `/app/cases/${cid}/letter/send?id=${lid}`); await expectOk(ad, `/app/cases/${cid}/letter/send?id=${lid}&method=fax`); });
await step("Premium: mark letter sent → their deadline", async () => {
  await expectOk(ad, `/app/cases/${cid}/letter?id=${lid}`);
  await ad.click("text=I've sent it"); await ad.waitForTimeout(3000);
  await expectOk(ad, `/app/cases/${cid}`);
  const theirs = await ad.locator(".stats .card .big-num").first().textContent();
  if (!/day/.test(theirs || "")) throw new Error(`their deadline: ${theirs}`);
});
await step("Premium: their reply upload", async () => {
  await expectOk(ad, `/app/cases/${cid}`);
  const up = ad.locator("input[aria-label='They replied — add their letter']");
  if (!(await up.count())) return "no reply button (case not waiting)";
  await up.setInputFiles(bill); await ad.waitForURL(/\/reply/, { timeout: 60000 });
});
await step("Premium: files page + add file", async () => { await expectOk(ad, `/app/cases/${cid}/docs`); await ad.setInputFiles("input[aria-label='Add a file']", bill); await ad.waitForTimeout(4000); await ad.reload(); const n = await ad.locator("img, a[href*='case-files']").count(); return `${n} file items`; });
await step("Premium: packet", async () => { await expectOk(ad, `/app/cases/${cid}/packet`); });
await step("Premium: calls page + log a call with follow-up", async () => {
  await expectOk(ad, `/app/cases/${cid}/calls`);
  await ad.fill("input[name=rep]", "E2E rep"); await ad.fill("input[name=ref]", "E2E-1"); await ad.fill("input[name=follow]", new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10));
  await ad.click("text=Save call"); await ad.waitForURL(/saved=1/);
});
await step("Premium: escalate → complaint letter", async () => { await expectOk(ad, `/app/cases/${cid}/escalate`); await ad.click("text=Write my complaint >> nth=0"); await ad.waitForURL(/\/letter\?id=/, { timeout: 30000 }); });
await step("Premium: credit dispute letters", async () => { await expectOk(ad, `/app/cases/${cid}/escalate`); await ad.click("text=Dispute with TransUnion"); await ad.waitForURL(/\/letter\?id=/, { timeout: 30000 }); if (!(await ad.locator("textarea").first().inputValue()).includes("Chester, PA")) throw new Error("bureau address missing"); });
await step("Premium: small claims statement", async () => { await expectOk(ad, `/app/cases/${cid}/small-claims`); await ad.click("text=Write my statement of claim"); await ad.waitForURL(/\/letter\?id=/, { timeout: 30000 }); });
await step("Premium: share → invite → remove", async () => {
  await expectOk(ad, `/app/cases/${cid}/share`);
  await ad.fill("input[name=email]", "e2e-helper@mailinator.com"); const cb = ad.locator("form:has(input[name=email]) input[type=checkbox]"); if (await cb.count()) await cb.first().check(); await ad.click("text=Add helper"); await ad.waitForURL(/sent=1/);
  ad.once("dialog", (d) => d.accept()); await ad.click("button:text-is(\"Remove\") >> nth=0"); await ad.waitForTimeout(2500);
  await ad.reload(); if (await ad.locator("text=e2e-helper@mailinator.com").count()) throw new Error("helper not removed");
});
await step("Premium: add note + add date + mark done", async () => {
  await expectOk(ad, `/app/cases/${cid}`);
  await ad.click("text=Add a note or call"); await ad.fill("input[name=title]", "E2E note"); await ad.click("text=Save note"); await ad.waitForTimeout(2500);
  await ad.click("text=+ Add a date"); await ad.fill("form input[name=title][placeholder=\"What's due?\"]", "E2E date"); await ad.fill("input[name=due_date][required]", "2026-12-01"); await ad.click("text=Add date"); await ad.waitForTimeout(2500);
  await ad.reload(); if (!(await ad.locator("text=E2E date").count())) throw new Error("date not added");
});
await step("Premium: dates, tools, pick, inbox, you, admin, help", async () => { for (const u of ["/app/dates", "/app/tools", "/app/tools/pick?to=calls&label=x", "/app/tools/inbox", "/app/you", "/app/admin", "/app/help", "/app/cases?c=medical&f=waiting"]) await expectOk(ad, u); });
await step("Premium: settings save", async () => { await expectOk(ad, "/app/you"); await ad.fill("input[name=address_line1]", "23 W Market St"); await ad.fill("input[name=address_city]", "Wilkes-Barre"); await ad.fill("input[name=address_state]", "PA"); await ad.fill("input[name=address_zip]", "18701"); await ad.click("form button:has-text('Save')"); await ad.waitForURL(/saved=1/); });
await step("Premium: export data", async () => { const r = await ad.request.get(base + "/api/export"); if (!r.ok()) throw new Error(`status ${r.status()}`); const j = await r.json(); return `${(j.cases || []).length} cases exported`; });
await step("Premium: close case as won", async () => { await expectOk(ad, `/app/cases/${cid}`); await ad.fill("input[name=amount]", "1240"); await ad.click("text=Close this case"); await ad.waitForTimeout(3000); });
await step("Premium: delete the test case", async () => {
  await expectOk(ad, `/app/cases/${cid}`);
  await ad.click("text=Edit details"); ad.once("dialog", (d) => d.accept());
  await ad.click("text=Delete this case and its files"); await ad.waitForURL(/\/app\/cases$/, { timeout: 20000 });
});
await step("Security: signed-out API and app are blocked", async () => {
  const anon = await newPage();
  const r = await anon.request.post(base + "/api/letter", { data: { caseId: "x" } }); if (r.status() !== 401) throw new Error(`letter api ${r.status()}`);
  await anon.goto(base + "/app/cases"); if (!anon.url().includes("/login")) throw new Error("app not redirected");
  const r2 = await anon.request.post(base + "/api/inbound/email", { data: {} }); if (r2.status() !== 403) throw new Error(`inbound ${r2.status()}`);
});
// cleanup free account
if (freeSignedIn) await step("Cleanup: delete the free test account in-app", async () => { await expectOk(fu, "/app/you"); fu.once("dialog", (d) => d.accept()); await fu.click("text=Delete my account and everything in it"); await fu.waitForURL((u) => !u.pathname.startsWith("/app"), { timeout: 20000 }); });
for (const p of [pub, fu, ad]) if (p.errors.length) results.push(["WARN", "page errors", 0, [...new Set(p.errors)].slice(0, 6).join(" | ")]);
await b.close();
for (const r of results) console.log(r[0].padEnd(4), String(r[2]).padStart(6) + "ms", r[1], r[3] ? "— " + r[3] : "");
