// Build typed dashboard datasets from Trade Map (ITC) XLSX exports.
// Inputs: input/trademap/*.xlsx
// Outputs: data/trade-services.ts, data/trademap-products.ts
//
// Source: https://www.trademap.org/ — user-exported XLSX files (logged in
// via UZ-side ITC account). No API.
import XLSX from "xlsx";
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("input/trademap");

function readSheet(filename) {
  const buf = fs.readFileSync(path.join(DIR, filename));
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
}

// =====================================================================
// 1. Services (EBOPS) — UZ→US only; US side empty in the export
// =====================================================================
const servRows = readSheet("uzbekistans-exports-to-united-states-of-america-by-service_all.xlsx");
const servHeader = servRows[0];
// e.g. ["reporterCd","reporterLabel","partnerCd","partnerLabel","serviceCd","serviceLabel","2021 (USD Thousand)", ...]
const yearCols = [];
for (let i = 6; i < servHeader.length; i++) {
  const m = String(servHeader[i] || "").match(/^(\d{4})\s/);
  if (m) yearCols.push({ idx: i, year: Number(m[1]) });
}

const services = [];
for (let i = 1; i < servRows.length; i++) {
  const r = servRows[i];
  if (!r || !r[4]) continue;
  const code = String(r[4]);
  const labelRu = String(r[5] || "");
  const series = {};
  let total = 0;
  for (const yc of yearCols) {
    const v = Number(r[yc.idx]) || 0;
    series[yc.year] = v * 1000; // convert USD Thousand → USD
    total += series[yc.year];
  }
  if (total === 0) continue;
  services.push({ code, labelRu, series });
}
services.sort((a, b) => {
  const ax = Math.max(...Object.values(a.series));
  const bx = Math.max(...Object.values(b.series));
  return bx - ax;
});

const servYearTotals = {};
for (const yc of yearCols) servYearTotals[yc.year] = services.reduce((acc, s) => acc + (s.series[yc.year] || 0), 0);

console.log("Services rows:", services.length, "year totals:", servYearTotals);

const servicesOut = `/**
 * UZ-reported services exports to the United States — EBOPS 2010
 * classification, BPM6 framework. Pulled from ITC Trade Map (which
 * sources UZ statistics agency for UZ-side reporting).
 *
 * ⚠️ COVERAGE LIMITATION: UZ reported full EBOPS detail only for 2021.
 * In 2022-2024, UZ either stopped reporting services to US partner-level
 * or reported zero (visible in raw rows as zeros). The 2021 snapshot is
 * preserved below as the most recent service-mix view; aggregate annual
 * services trade should be quoted from BEA / USTR ($603M for 2024 per
 * USTR) which do not require UZ partner reporting.
 *
 * Source: \`trademap_itc\`. Refreshed 2026-04-29 from user-exported XLSX.
 */
export interface ServiceCategory {
  /** EBOPS 2010 code (e.g. "S03002001"). */
  code: string;
  /** Russian label (Trade Map default for UZ reporter). */
  labelRu: string;
  /** Year → USD value (raw, not thousands). */
  series: Record<number, number>;
}

export const servicesUzToUs: ServiceCategory[] = ${JSON.stringify(services, null, 2)};

export const servicesUzToUsYearTotals: Record<number, number> = ${JSON.stringify(servYearTotals, null, 2)};

export const servicesMeta = {
  source: "ITC Trade Map (UZ statistics, EBOPS 2010 / BPM6)",
  sourceId: "trademap_itc" as const,
  fetched_at: "2026-04-29",
  reporter: "UZ",
  partner: "US",
  classificationCode: "EBOPS-2010",
  yearsReported: ${JSON.stringify(yearCols.map((yc) => yc.year).filter((y) => servYearTotals[y] > 0))},
  yearsZero: ${JSON.stringify(yearCols.map((yc) => yc.year).filter((y) => servYearTotals[y] === 0))},
  is_demo: false,
};
`;
fs.writeFileSync(path.resolve("data/trade-services.ts"), servicesOut);
console.log("Wrote data/trade-services.ts");

// =====================================================================
// 2. 2024 deep-view for products (Share %, Growth 5Y %)
// =====================================================================
function read2024Deep(filename) {
  const rows = readSheet(filename);
  // Column layout:
  // ["reporterCd","reporterLabel","partnerCd","partnerLabel","productCd","productLabel","Value","Quantity","Unit Value","Share (%)","Growth Value 5Y (%)","Growth Quantity 5Y (%)"]
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r) continue;
    // After header positions look slightly off in real data — read raw values by index
    // Trust header positions:
    const productCd = String(r[4] || r[2] || "").trim();
    const productLabel = String(r[5] || r[3] || "");
    const valueK = Number(r[6]) || 0; // USD Thousand
    const quantity = Number(r[7]) || null;
    const unitValue = r[8] ? Number(r[8]) : null;
    const sharePct = Number(r[9]) || 0;
    const growth5yValue = r[10] === "" || r[10] === null ? null : Number(r[10]);
    const growth5yQty = r[11] === "" || r[11] === null ? null : Number(r[11]);
    if (!productCd || valueK <= 0) continue;
    out.push({
      hs: productCd,
      labelRu: productLabel,
      valueUsd: valueK * 1000,
      quantity,
      unitValueUsd: unitValue,
      sharePct,
      growth5yValuePct: Number.isFinite(growth5yValue) ? growth5yValue : null,
      growth5yQuantityPct: Number.isFinite(growth5yQty) ? growth5yQty : null,
    });
  }
  out.sort((a, b) => b.valueUsd - a.valueUsd);
  return out;
}

const uzExports2024 = read2024Deep("uzbekistans-exports-to-united-states-of-america-in-2024-by-product_all.xlsx");
const usExports2024 = read2024Deep("united-states-of-americas-exports-to-uzbekistan-in-2024-by-product_all.xlsx");

// Filter residual + take top 40 each
const RESIDUAL = new Set(["999999", "9999"]);
const uzExports2024Top = uzExports2024.filter((r) => !RESIDUAL.has(r.hs)).slice(0, 40);
const usExports2024Top = usExports2024.filter((r) => !RESIDUAL.has(r.hs)).slice(0, 60);

const uzTotal = uzExports2024.reduce((a, r) => a + r.valueUsd, 0);
const usTotal = usExports2024.reduce((a, r) => a + r.valueUsd, 0);

console.log(
  `UZ→US 2024: ${uzExports2024.length} rows, $${(uzTotal / 1e6).toFixed(1)}M; top-40 cover ${(
    (uzExports2024Top.reduce((a, r) => a + r.valueUsd, 0) / uzTotal) *
    100
  ).toFixed(1)}%`,
);
console.log(
  `US→UZ 2024: ${usExports2024.length} rows, $${(usTotal / 1e6).toFixed(1)}M; top-40 cover ${(
    (usExports2024Top.reduce((a, r) => a + r.valueUsd, 0) / usTotal) *
    100
  ).toFixed(1)}%`,
);

const productsOut = `/**
 * Trade Map (ITC) deep-view for 2024 — UZ↔US bilateral product trade.
 *
 * Trade Map computes ready-to-use indicators that Comtrade does not:
 *   • Share (%)               — code's share of partner-level total
 *   • Growth Value 5Y (%)     — CAGR over the trailing 5 years
 *   • Growth Quantity 5Y (%)  — same for physical units
 *   • Unit Value (USD)        — average unit price
 * Russian product labels come straight from the Trade Map UI export
 * (the user is logged in via the UZ statistics-agency account).
 *
 * Source: \`trademap_itc\`. Refreshed 2026-04-29 from user-exported XLSX.
 * Residual code 999999 ("not specified") filtered.
 */
export interface TrademapProduct2024 {
  /** HS-6 (or HS-4 for older series) code. */
  hs: string;
  /** Russian product label as exported. */
  labelRu: string;
  /** USD value (raw, not thousands). */
  valueUsd: number;
  /** Quantity in the dominant unit (Trade Map mixes units; quantity may be null). */
  quantity: number | null;
  /** Average unit value, USD. */
  unitValueUsd: number | null;
  /** Share of partner-level annual total, percent. */
  sharePct: number;
  /** Compound 5-year growth in value, percent (null if not computable). */
  growth5yValuePct: number | null;
  /** Compound 5-year growth in physical quantity, percent. */
  growth5yQuantityPct: number | null;
}

/** Top-40 UZ exports to US in 2024 (residual 999999 excluded). */
export const uzExportsToUs2024Top: TrademapProduct2024[] = ${JSON.stringify(uzExports2024Top, null, 2)};

/** Top-40 US exports to UZ in 2024 (residual 999999 excluded). */
export const usExportsToUz2024Top: TrademapProduct2024[] = ${JSON.stringify(usExports2024Top, null, 2)};

export const trademap2024Meta = {
  source: "ITC Trade Map · 2024 deep view",
  sourceId: "trademap_itc" as const,
  fetched_at: "2026-04-29",
  uzExportsToUsTotalUsd: ${uzTotal * 1},
  usExportsToUzTotalUsd: ${usTotal * 1},
  is_demo: false,
};
`;
fs.writeFileSync(path.resolve("data/trademap-products.ts"), productsOut);
console.log("Wrote data/trademap-products.ts");
