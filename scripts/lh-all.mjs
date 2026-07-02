#!/usr/bin/env node
// Run Lighthouse on every public route, write a compact summary.
// Usage: node scripts/lh-all.mjs
import { execSync } from "node:child_process";
import fs from "node:fs";

const routes = [
  "",
  "brief",
  "trade",
  "visits",
  "commitments",
  "agreements",
  "map",
  "investments",
  "events",
  "grants",
  "contacts",
  "counterparts",
  "compliance",
  "staff",
  "news",
  "benchmark",
  "sectors",
];

const BASE = process.env.LH_BASE || "http://localhost:3100/en";
const CHROME = process.env.CHROME_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

const out = [];
for (const r of routes) {
  const url = r === "" ? BASE : `${BASE}/${r}`;
  const tag = r === "" ? "_overview" : r;
  const file = `lh-${tag}.json`;
  process.stdout.write(`▶ ${url} … `);
  try {
    execSync(
      `npx lighthouse "${url}" --quiet --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="./${file}" --chrome-flags="--headless=new --no-sandbox"`,
      {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, CHROME_PATH: CHROME },
        timeout: 180_000,
      },
    );
  } catch {
    // Lighthouse may exit non-zero on EPERM cleanup; the JSON is still written.
  }
  if (!fs.existsSync(file)) {
    console.log("FAILED (no json)");
    out.push({ route: r || "/", error: true });
    continue;
  }
  try {
    const r2 = JSON.parse(fs.readFileSync(file, "utf8"));
    const c = r2.categories;
    const a = r2.audits;
    const row = {
      route: r || "/",
      perf: Math.round(c.performance.score * 100),
      a11y: Math.round(c.accessibility.score * 100),
      bp: Math.round(c["best-practices"].score * 100),
      seo: Math.round(c.seo.score * 100),
      lcp_ms: Math.round(a["largest-contentful-paint"].numericValue),
      tbt_ms: Math.round(a["total-blocking-time"].numericValue),
      cls: Number(a["cumulative-layout-shift"].numericValue.toFixed(3)),
      tti_ms: Math.round(a["interactive"].numericValue),
      transfer_kb: Math.round(a["total-byte-weight"].numericValue / 1024),
      unused_js_kb: Math.round((a["unused-javascript"]?.details?.overallSavingsBytes ?? 0) / 1024),
    };
    out.push(row);
    console.log(
      `Perf ${row.perf} | A11y ${row.a11y} | LCP ${(row.lcp_ms / 1000).toFixed(1)}s | TBT ${row.tbt_ms}ms | ${row.transfer_kb} KB`,
    );
  } catch (e) {
    console.log("PARSE FAIL", e.message);
    out.push({ route: r || "/", error: true });
  }
}

fs.writeFileSync("lh-summary.json", JSON.stringify(out, null, 2));
console.log("\n=== Summary ===");
const cols = ["route", "perf", "a11y", "lcp_ms", "tbt_ms", "cls", "transfer_kb", "unused_js_kb"];
const headers = ["Route", "Perf", "A11y", "LCP", "TBT", "CLS", "Bytes", "Unused"];
const rows = [headers, ...out.filter((r) => !r.error).map((r) => cols.map((c) => String(r[c])))];
const widths = headers.map((_, i) => Math.max(...rows.map((r) => r[i].length)));
for (const row of rows) {
  console.log(row.map((v, i) => v.padEnd(widths[i])).join("  "));
}
