// Build typed Comtrade dataset for the dashboard from raw preview-endpoint JSON.
import fs from "node:fs";
import path from "node:path";

// Paths are relative to repo root — run as `node scripts/build-comtrade.mjs`.
const DIR = path.resolve("input/comtrade");
const OUT = path.resolve("data/comtrade.ts");
const YEARS = [2021, 2022, 2023, 2024, 2025];

const ref = JSON.parse(fs.readFileSync(path.join(DIR, "hs6_ref.json"), "utf8"));
/** @type {Map<string, string>} */
const hs6Desc = new Map();
for (const r of ref.results) {
  if (r.aggrlevel === 6) {
    // r.text = "010619 - Mammals; live, except mules etc."
    const m = r.text.match(/^(\d{6})\s*-\s*(.+)$/);
    if (m) hs6Desc.set(m[1], m[2]);
  }
}
console.log("HS-6 descriptions:", hs6Desc.size);

function loadFlow(reporterCode, partnerCode, flowCode, year) {
  const f = path.join(DIR, `r${reporterCode}_p${partnerCode}_${flowCode}_${year}.json`);
  if (!fs.existsSync(f)) return [];
  const raw = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!raw.data || !Array.isArray(raw.data)) return [];
  return raw.data.map((r) => ({
    year: r.refYear,
    reporter: r.reporterCode,
    partner: r.partnerCode,
    flow: r.flowCode,
    hs6: String(r.cmdCode).padStart(6, "0"),
    valueUsd: r.primaryValue ?? 0,
    qty: r.qty ?? null,
    netWgt: r.netWgt ?? null,
  }));
}

// Build all rows
const rows = [];
for (const year of YEARS) {
  for (const flow of ["X", "M"]) {
    for (const [r, p] of [
      [860, 842],
      [842, 860],
    ]) {
      rows.push(...loadFlow(r, p, flow, year));
    }
  }
}
console.log("Total rows:", rows.length);

// Map (year, reporter, flow) → top-30 by value
function topN(filter, n = 30) {
  return rows
    .filter(filter)
    .sort((a, b) => b.valueUsd - a.valueUsd)
    .slice(0, n)
    .map((r) => ({
      hs6: r.hs6,
      desc: hs6Desc.get(r.hs6) ?? `HS ${r.hs6}`,
      valueUsd: r.valueUsd,
    }));
}

// Top UZ exports to US (UZ reports as exporter, flow=X)
const topUzExportsByYear = {};
const topUsImportsByYear = {};
const topUsExportsByYear = {};
const topUzImportsByYear = {};
for (const y of YEARS) {
  topUzExportsByYear[y] = topN((r) => r.year === y && r.reporter === 860 && r.flow === "X", 30);
  topUsImportsByYear[y] = topN((r) => r.year === y && r.reporter === 842 && r.flow === "M", 30);
  topUsExportsByYear[y] = topN((r) => r.year === y && r.reporter === 842 && r.flow === "X", 30);
  topUzImportsByYear[y] = topN((r) => r.year === y && r.reporter === 860 && r.flow === "M", 30);
}

// Mirror comparison for the most recent year both sides reported (2024)
function buildMirror(year) {
  // UZ exports to US (UZ-reported) vs US imports from UZ (US-reported)
  const uzX = new Map(
    rows.filter((r) => r.year === year && r.reporter === 860 && r.flow === "X").map((r) => [r.hs6, r.valueUsd]),
  );
  const usM = new Map(
    rows.filter((r) => r.year === year && r.reporter === 842 && r.flow === "M").map((r) => [r.hs6, r.valueUsd]),
  );
  const uzM = new Map(
    rows.filter((r) => r.year === year && r.reporter === 860 && r.flow === "M").map((r) => [r.hs6, r.valueUsd]),
  );
  const usX = new Map(
    rows.filter((r) => r.year === year && r.reporter === 842 && r.flow === "X").map((r) => [r.hs6, r.valueUsd]),
  );

  const allCodes = new Set([...uzX.keys(), ...usM.keys(), ...uzM.keys(), ...usX.keys()]);
  const out = [];
  for (const hs6 of allCodes) {
    const uzExports = uzX.get(hs6) ?? 0;
    const usImports = usM.get(hs6) ?? 0;
    const uzImports = uzM.get(hs6) ?? 0;
    const usExports = usX.get(hs6) ?? 0;
    const exportFlowMax = Math.max(uzExports, usImports);
    const importFlowMax = Math.max(uzImports, usExports);
    if (exportFlowMax + importFlowMax < 100000) continue; // drop noise
    out.push({
      hs6,
      desc: hs6Desc.get(hs6) ?? `HS ${hs6}`,
      uzExportsToUs: uzExports,
      usImportsFromUz: usImports,
      uzImportsFromUs: uzImports,
      usExportsToUz: usExports,
    });
  }
  return out.sort((a, b) => {
    const aMax = Math.max(a.uzExportsToUs, a.usImportsFromUz, a.uzImportsFromUs, a.usExportsToUz);
    const bMax = Math.max(b.uzExportsToUs, b.usImportsFromUz, b.uzImportsFromUs, b.usExportsToUz);
    return bMax - aMax;
  });
}

const mirror2024 = buildMirror(2024).slice(0, 40);

// HS-2 chapter aggregation (for high-level structure) using US-reported 2024
function hs2Aggregate(year, reporter, flow) {
  const m = new Map();
  for (const r of rows.filter((x) => x.year === year && x.reporter === reporter && x.flow === flow)) {
    const ch = r.hs6.slice(0, 2);
    m.set(ch, (m.get(ch) ?? 0) + r.valueUsd);
  }
  // HS-2 description from ref
  const hs2Desc = new Map();
  for (const ref2 of ref.results) {
    if (ref2.aggrlevel === 2) {
      const m2 = ref2.text.match(/^(\d{2})\s*-\s*(.+)$/);
      if (m2) hs2Desc.set(m2[1], m2[2]);
    }
  }
  return [...m.entries()]
    .map(([ch, v]) => ({ hs2: ch, desc: hs2Desc.get(ch) ?? `Chapter ${ch}`, valueUsd: v }))
    .sort((a, b) => b.valueUsd - a.valueUsd);
}

const hs2_2024_usImports = hs2Aggregate(2024, 842, "M"); // US-reported imports from UZ = UZ exports
const hs2_2024_usExports = hs2Aggregate(2024, 842, "X"); // US-reported exports to UZ = UZ imports
const hs2_2025_usImports = hs2Aggregate(2025, 842, "M");
const hs2_2025_usExports = hs2Aggregate(2025, 842, "X");

// Trend: top-10 HS-6 codes for UZ exports across years (US-reported imports for consistency)
const top10codes_usImports = topUsImportsByYear[2024].slice(0, 10).map((r) => r.hs6);
const trend_usImports = top10codes_usImports.map((hs6) => {
  const series = {};
  for (const y of YEARS) {
    const found = rows.find((r) => r.year === y && r.reporter === 842 && r.flow === "M" && r.hs6 === hs6);
    series[y] = found ? found.valueUsd : 0;
  }
  return { hs6, desc: hs6Desc.get(hs6) ?? `HS ${hs6}`, series };
});

const top10codes_usExports = topUsExportsByYear[2024].slice(0, 10).map((r) => r.hs6);
const trend_usExports = top10codes_usExports.map((hs6) => {
  const series = {};
  for (const y of YEARS) {
    const found = rows.find((r) => r.year === y && r.reporter === 842 && r.flow === "X" && r.hs6 === hs6);
    series[y] = found ? found.valueUsd : 0;
  }
  return { hs6, desc: hs6Desc.get(hs6) ?? `HS ${hs6}`, series };
});

// Annual totals from each side for context
const annualUzReporter = {};
const annualUsReporter = {};
for (const y of YEARS) {
  const uzX = rows
    .filter((r) => r.year === y && r.reporter === 860 && r.flow === "X")
    .reduce((a, r) => a + r.valueUsd, 0);
  const uzM = rows
    .filter((r) => r.year === y && r.reporter === 860 && r.flow === "M")
    .reduce((a, r) => a + r.valueUsd, 0);
  const usX = rows
    .filter((r) => r.year === y && r.reporter === 842 && r.flow === "X")
    .reduce((a, r) => a + r.valueUsd, 0);
  const usM = rows
    .filter((r) => r.year === y && r.reporter === 842 && r.flow === "M")
    .reduce((a, r) => a + r.valueUsd, 0);
  annualUzReporter[y] = { exportsToUs: uzX, importsFromUs: uzM };
  annualUsReporter[y] = { exportsToUz: usX, importsFromUz: usM };
}

// Compose TS output
const output = `/**
 * UN Comtrade UZ↔US bilateral trade — HS-6 granular structure.
 *
 * Pulled 2026-04-29 via the public preview endpoint
 *   https://comtradeapi.un.org/public/v1/preview/C/A/HS
 * for years ${YEARS.join(", ")}, both reporters (UZ=860 and US=842), both
 * flows (X=exports, M=imports). UZ has not yet reported 2025 to Comtrade
 * (typical reporting lag) — UZ-2025 totals therefore reflect partial /
 * mirror data only.
 *
 * All values in USD (raw, not millions). Source: \`comtrade_hs6\`.
 */
export interface Hs6Row {
  hs6: string;
  desc: string;
  valueUsd: number;
}

export interface MirrorRow {
  hs6: string;
  desc: string;
  /** UZ reports as exporter to US. */
  uzExportsToUs: number;
  /** US reports as importer from UZ. */
  usImportsFromUz: number;
  /** UZ reports as importer from US. */
  uzImportsFromUs: number;
  /** US reports as exporter to UZ. */
  usExportsToUz: number;
}

export interface Hs2Row {
  hs2: string;
  desc: string;
  valueUsd: number;
}

export interface Hs6Trend {
  hs6: string;
  desc: string;
  series: Record<number, number>;
}

/** Top 30 HS-6 codes for UZ exports (US-reported imports) by year. */
export const topUsImportsFromUzByYear: Record<number, Hs6Row[]> = ${JSON.stringify(topUsImportsByYear, null, 2)};

/** Top 30 HS-6 codes for UZ imports (US-reported exports) by year. */
export const topUsExportsToUzByYear: Record<number, Hs6Row[]> = ${JSON.stringify(topUsExportsByYear, null, 2)};

/** Top 30 HS-6 codes — UZ-reporter view of exports to US. */
export const topUzExportsToUsByYear: Record<number, Hs6Row[]> = ${JSON.stringify(topUzExportsByYear, null, 2)};

/** Top 30 HS-6 codes — UZ-reporter view of imports from US. */
export const topUzImportsFromUsByYear: Record<number, Hs6Row[]> = ${JSON.stringify(topUzImportsByYear, null, 2)};

/** HS-2 chapter aggregation for 2024 — US-reported imports from UZ. */
export const hs2_2024_usImports: Hs2Row[] = ${JSON.stringify(hs2_2024_usImports, null, 2)};

/** HS-2 chapter aggregation for 2024 — US-reported exports to UZ. */
export const hs2_2024_usExports: Hs2Row[] = ${JSON.stringify(hs2_2024_usExports, null, 2)};

/** HS-2 chapter aggregation for 2025 — US-reported imports from UZ. */
export const hs2_2025_usImports: Hs2Row[] = ${JSON.stringify(hs2_2025_usImports, null, 2)};

/** HS-2 chapter aggregation for 2025 — US-reported exports to UZ. */
export const hs2_2025_usExports: Hs2Row[] = ${JSON.stringify(hs2_2025_usExports, null, 2)};

/** Mirror discrepancy table for 2024 — top-40 codes by either-side trade value. */
export const mirror2024: MirrorRow[] = ${JSON.stringify(mirror2024, null, 2)};

/** 5-year trend for the 2024 top-10 UZ export codes (US-reported imports). */
export const trendTopUsImports: Hs6Trend[] = ${JSON.stringify(trend_usImports, null, 2)};

/** 5-year trend for the 2024 top-10 UZ import codes (US-reported exports). */
export const trendTopUsExports: Hs6Trend[] = ${JSON.stringify(trend_usExports, null, 2)};

/** Annual totals as reported by UZ side. */
export const comtradeAnnualUzReporter: Record<number, { exportsToUs: number; importsFromUs: number }> = ${JSON.stringify(annualUzReporter, null, 2)};

/** Annual totals as reported by US side. */
export const comtradeAnnualUsReporter: Record<number, { exportsToUz: number; importsFromUz: number }> = ${JSON.stringify(annualUsReporter, null, 2)};

export const comtradeMeta = {
  source: "UN Comtrade preview API (public, no auth)",
  sourceId: "comtrade_hs6" as const,
  endpoint: "https://comtradeapi.un.org/public/v1/preview/C/A/HS",
  fetched_at: "2026-04-29",
  classificationCode: "H6",
  reporters: { uz: 860, us: 842 },
  yearsCovered: ${JSON.stringify(YEARS)},
  uzReporting2025: false,
  is_demo: false,
};
`;

function extractSection(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) throw new Error(`Missing Comtrade output marker: ${startMarker}`);
  const end = endMarker ? text.indexOf(endMarker, start + startMarker.length) : text.length;
  if (endMarker && end === -1) throw new Error(`Missing Comtrade output marker: ${endMarker}`);
  return text.slice(start, end).trimEnd();
}

function writeComtradeSlices(text) {
  const outDir = path.dirname(OUT);
  const header = `/**
 * UN Comtrade UZ-US bilateral trade slices.
 *
 * Generated from raw Comtrade pulls so lazy UI components can import only the
 * dataset they render.
 */
`;
  const write = (file, content) => fs.writeFileSync(path.join(outDir, file), `${content.trimEnd()}\n`);

  write(
    "comtrade-types.ts",
    `${header}
export interface Hs6Row {
  hs6: string;
  desc: string;
  valueUsd: number;
}

export interface MirrorRow {
  hs6: string;
  desc: string;
  /** UZ reports as exporter to US. */
  uzExportsToUs: number;
  /** US reports as importer from UZ. */
  usImportsFromUz: number;
  /** UZ reports as importer from US. */
  uzImportsFromUs: number;
  /** US reports as exporter to UZ. */
  usExportsToUz: number;
}

export interface Hs2Row {
  hs2: string;
  desc: string;
  valueUsd: number;
}

export interface Hs6Trend {
  hs6: string;
  desc: string;
  series: Record<number, number>;
}
`,
  );
  write(
    "comtrade-hs6.ts",
    `${header}
import type { Hs6Row } from "./comtrade-types";

${extractSection(text, "export const topUsImportsFromUzByYear", "export const topUzExportsToUsByYear")}`,
  );
  write(
    "comtrade-hs6-uz.ts",
    `${header}
import type { Hs6Row } from "./comtrade-types";

${extractSection(text, "export const topUzExportsToUsByYear", "export const hs2_2024_usImports")}`,
  );
  write(
    "comtrade-hs2.ts",
    `${header}
import type { Hs2Row } from "./comtrade-types";

${extractSection(text, "export const hs2_2024_usImports", "export const mirror2024")}`,
  );
  write(
    "comtrade-mirror.ts",
    `${header}
import type { MirrorRow } from "./comtrade-types";

${extractSection(text, "export const mirror2024", "export const trendTopUsImports")}`,
  );
  write(
    "comtrade-trends.ts",
    `${header}
import type { Hs6Trend } from "./comtrade-types";

${extractSection(text, "export const trendTopUsImports", "export const comtradeAnnualUzReporter")}`,
  );
  write("comtrade-meta.ts", `${header}\n${extractSection(text, "export const comtradeAnnualUzReporter", null)}`);
  write(
    "comtrade.ts",
    `${header}
export type { Hs2Row, Hs6Row, Hs6Trend, MirrorRow } from "./comtrade-types";
export { topUsImportsFromUzByYear, topUsExportsToUzByYear } from "./comtrade-hs6";
export { topUzExportsToUsByYear, topUzImportsFromUsByYear } from "./comtrade-hs6-uz";
export { hs2_2024_usImports, hs2_2024_usExports, hs2_2025_usImports, hs2_2025_usExports } from "./comtrade-hs2";
export { mirror2024 } from "./comtrade-mirror";
export { trendTopUsImports, trendTopUsExports } from "./comtrade-trends";
export { comtradeAnnualUzReporter, comtradeAnnualUsReporter, comtradeMeta } from "./comtrade-meta";
`,
  );
}

writeComtradeSlices(output);
console.log("Wrote sliced Comtrade modules under:", path.dirname(OUT));

// Sanity check totals (in millions)
console.log("\\nAnnual totals ($M):");
console.log("Year | UZ→US (UZ-rep) | UZ→US (US-rep) | US→UZ (US-rep) | US→UZ (UZ-rep)");
for (const y of YEARS) {
  console.log(
    `${y} | ${(annualUzReporter[y].exportsToUs / 1e6).toFixed(1)} | ${(annualUsReporter[y].importsFromUz / 1e6).toFixed(1)} | ${(annualUsReporter[y].exportsToUz / 1e6).toFixed(1)} | ${(annualUzReporter[y].importsFromUs / 1e6).toFixed(1)}`,
  );
}
