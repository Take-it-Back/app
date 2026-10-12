// AI test set: runs every sample letter in evals/cases.json through the same reading the app uses,
// scores the answers, and compares with the last saved baseline.
//
//   ANTHROPIC_API_KEY=... npm run eval                 run all cases
//   npm run eval -- --only med-01 --only ins-03        run some cases
//   npm run eval -- --save-baseline                    keep this run as the new baseline
//   npm run eval -- --dry                              check the scorer itself (no API calls)
//
// Exit code 1 if a red flag (court date, eviction, shutoff, urgent care) is missed, or the overall
// score drops more than 3 points below the baseline. Run it before changing the model or the prompt.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { analyzeDocument, type Analysis } from "../lib/ai";
import { letterPdf } from "../lib/pdf";

type Expect = {
  category: Analysis["category"];
  red_flag: boolean;
  amount_at_stake?: number | null;
  findings_any: string[][];
  max_findings?: number;
  deadlines: { owner: "you" | "them"; date: string }[];
  must_not: string[];
};
type Case = { id: string; context: string; document: string; expect: Expect };
type Check = { name: string; ok: boolean; note?: string; critical?: boolean };

const DIR = new URL(".", import.meta.url).pathname;
const args = process.argv.slice(2);
const only = args.flatMap((a, i) => (a === "--only" ? [args[i + 1]] : []));
const dry = args.includes("--dry");
const saveBaseline = args.includes("--save-baseline");
const concurrency = Number(args[args.indexOf("--concurrency") + 1]) || 4;

const cases: Case[] = JSON.parse(readFileSync(`${DIR}cases.json`, "utf8")).filter((c: Case) => !only.length || only.some((o) => c.id.startsWith(o)));

const days = (a: string, b: string) => Math.abs(Date.parse(a) - Date.parse(b)) / 86400000;
const lower = (s: unknown) => JSON.stringify(s ?? "").toLowerCase();

function score(c: Case, a: Analysis): Check[] {
  const e = c.expect;
  const checks: Check[] = [];
  checks.push({ name: "category", ok: a.category === e.category, note: `${a.category} (want ${e.category})` });
  checks.push({ name: "red flag", ok: a.red_flag === e.red_flag, note: `${a.red_flag} (want ${e.red_flag})`, critical: e.red_flag && !a.red_flag });
  if (e.amount_at_stake != null) {
    const got = a.amount_at_stake ?? NaN;
    checks.push({ name: "amount", ok: Math.abs(got - e.amount_at_stake) <= Math.max(1, e.amount_at_stake * 0.01), note: `${a.amount_at_stake} (want ${e.amount_at_stake})` });
  }
  const findingsText = lower([a.findings, a.next_steps, a.summary, a.red_flag_reason]);
  for (const group of e.findings_any) {
    checks.push({ name: `mentions ${group[0]}`, ok: group.some((k) => findingsText.includes(k.toLowerCase())), note: group.join(" | ") });
  }
  if (e.max_findings != null) checks.push({ name: "no invented problems", ok: (a.findings?.length ?? 0) <= e.max_findings, note: `${a.findings?.length ?? 0} findings (max ${e.max_findings})` });
  for (const d of e.deadlines) {
    const hit = (a.deadlines || []).some((x) => x.owner === d.owner && x.date && days(x.date, d.date) <= 3);
    checks.push({ name: `deadline ${d.date}`, ok: hit, note: (a.deadlines || []).map((x) => `${x.owner}:${x.date}`).join(", ") || "none found" });
  }
  for (const s of e.must_not) checks.push({ name: `doesn't say "${s}"`, ok: !lower(a).includes(s.toLowerCase()) });
  // Made-up numbers: any 5+ digit number in the answer must appear in the letter or what the person said.
  const source = (c.document + " " + c.context).replace(/[,\s-]/g, "");
  const invented = [...new Set((JSON.stringify(a).match(/\d{5,}/g) || []).filter((n) => !source.includes(n) && !/^20\d{6}$/.test(n)))];
  checks.push({ name: "no made-up numbers", ok: invented.length === 0, note: invented.join(", ") || undefined });
  return checks;
}

// For --dry: a perfect answer built from the expectations, so the scorer can be checked without the API.
function ideal(c: Case): Analysis {
  const e = c.expect;
  return {
    category: e.category,
    title: c.id,
    counterparty: null,
    amount_at_stake: e.amount_at_stake ?? null,
    document_date: null,
    summary: "",
    findings: e.findings_any.map((g) => ({ title: g[0], detail: g[0], amount: null, rule_name: null })),
    potential_savings: null,
    red_flag: e.red_flag,
    red_flag_reason: null,
    next_steps: [],
    deadlines: e.deadlines.map((d) => ({ title: "x", date: d.date, owner: d.owner, quote: "" })),
  };
}

async function runCase(c: Case) {
  const t0 = Date.now();
  try {
    let a: Analysis;
    if (dry) a = ideal(c);
    else {
      const pdf = await letterPdf(c.document, { title: c.id });
      a = await analyzeDocument([{ mime: "application/pdf", base64: Buffer.from(pdf).toString("base64") }], c.context);
    }
    const checks = score(c, a);
    return { id: c.id, ms: Date.now() - t0, checks, answer: a };
  } catch (err) {
    return { id: c.id, ms: Date.now() - t0, checks: [{ name: "ran", ok: false, note: String(err), critical: true }] as Check[], answer: null };
  }
}

async function main() {
  if (!dry && !process.env.ANTHROPIC_API_KEY) {
    console.error("Set ANTHROPIC_API_KEY (or use --dry to check the scorer).");
    process.exit(2);
  }
  const results: Awaited<ReturnType<typeof runCase>>[] = [];
  const queue = [...cases];
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    for (let c = queue.shift(); c; c = queue.shift()) results.push(await runCase(c));
  }));
  results.sort((a, b) => a.id.localeCompare(b.id));

  let ok = 0, total = 0, critical = 0;
  for (const r of results) {
    const pass = r.checks.filter((x) => x.ok).length;
    ok += pass;
    total += r.checks.length;
    const fails = r.checks.filter((x) => !x.ok);
    critical += fails.filter((x) => x.critical).length;
    console.log(`${fails.length ? "✗" : "✓"} ${r.id.padEnd(34)} ${pass}/${r.checks.length}  ${(r.ms / 1000).toFixed(1)}s`);
    for (const f of fails) console.log(`    ${f.critical ? "!!" : "-"} ${f.name}${f.note ? `: ${f.note}` : ""}`);
  }
  const pct = total ? Math.round((ok / total) * 1000) / 10 : 0;
  const byCat: Record<string, [number, number]> = {};
  for (const r of results) {
    const cat = cases.find((c) => c.id === r.id)!.expect.category;
    const t = (byCat[cat] ||= [0, 0]);
    t[0] += r.checks.filter((x) => x.ok).length;
    t[1] += r.checks.length;
  }
  console.log(`\nScore ${ok}/${total} = ${pct}%   ` + Object.entries(byCat).map(([k, [a, b]]) => `${k} ${Math.round((a / b) * 100)}%`).join(" · "));
  if (critical) console.log(`!! ${critical} critical miss(es): a red flag was missed or a case failed to run`);

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
  const out = { at: new Date().toISOString(), model: dry ? "dry-run" : model, score: pct, ok, total, critical, results };
  mkdirSync(`${DIR}results`, { recursive: true });
  writeFileSync(`${DIR}results/latest.json`, JSON.stringify(out, null, 2));

  let regressed = false;
  const basePath = `${DIR}baseline.json`;
  if (!dry && !only.length && existsSync(basePath)) {
    const base = JSON.parse(readFileSync(basePath, "utf8"));
    console.log(`Baseline ${base.score}% (${base.model}, ${base.at.slice(0, 10)}) → now ${pct}%`);
    regressed = pct < base.score - 3;
    if (regressed) console.log("!! Score dropped more than 3 points against the baseline.");
  }
  if (saveBaseline && !dry && !only.length) {
    writeFileSync(basePath, JSON.stringify({ at: out.at, model, score: pct, ok, total }, null, 2));
    console.log("Saved as the new baseline.");
  }
  process.exit(critical || regressed ? 1 : 0);
}

main();
