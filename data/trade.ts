/**
 * Tagging convention for any trade figure shown to a leader:
 *   - "uz-stat"  → State Statistics Committee of the Republic of Uzbekistan
 *                  (UZ-side methodology — `exports` are UZ exports to US,
 *                   `imports` are UZ imports from US)
 *   - "us-census" → U.S. Census Bureau goods-trade balance table
 *                  (US-side methodology — `exports` are US exports to UZ,
 *                   `imports` are US imports from UZ)
 *   - "ustr"     → USTR goods-and-services summary
 *
 * Mirror discrepancies between the UZ-stat and US-census views are real and
 * a known feature of bilateral trade data (valuation, timing, transshipment).
 * Always render the methodology label next to any figure.
 */
export type TradeMethodology = "uz-stat" | "us-census" | "ustr";

export interface TradeYear {
  year: number;
  turnover: number;
  exports: number;
  imports: number;
  balance: number;
  sharePct?: { turnover: number; exports: number; imports: number };
}

export interface CommodityItem {
  code?: string;
  name: string;
  value: number;
  sharePct: number;
}

export interface CompanyRanking {
  rank: number;
  name: string;
  sector: string;
  value: number;
  is_demo: boolean;
  source_note?: string;
}

/**
 * UZ-side (State Statistics Committee) annual series 2017–2025.
 * `exports` = UZ exports to US, `imports` = UZ imports from US.
 * Aliased as `tradeAnnual` for backward compat with existing components.
 */
export const tradeAnnualUz: TradeYear[] = [
  { year: 2017, turnover: 395.8, exports: 78.1, imports: 317.7, balance: -239.6, sharePct: { turnover: 1.5, exports: 0.6, imports: 2.3 } },
  { year: 2018, turnover: 701.5, exports: 132.4, imports: 569.0, balance: -436.6, sharePct: { turnover: 2.1, exports: 0.9, imports: 2.9 } },
  { year: 2019, turnover: 603.9, exports: 36.6, imports: 567.2, balance: -530.6, sharePct: { turnover: 1.4, exports: 0.2, imports: 2.3 } },
  { year: 2020, turnover: 275.0, exports: 26.7, imports: 248.3, balance: -221.6, sharePct: { turnover: 0.8, exports: 0.2, imports: 1.2 } },
  { year: 2021, turnover: 426.3, exports: 60.8, imports: 365.5, balance: -304.7, sharePct: { turnover: 1.0, exports: 0.4, imports: 1.4 } },
  { year: 2022, turnover: 436.8, exports: 68.5, imports: 368.7, balance: -299.7, sharePct: { turnover: 0.9, exports: 0.4, imports: 1.2 } },
  { year: 2023, turnover: 765.1, exports: 253.1, imports: 512.0, balance: -258.9, sharePct: { turnover: 1.2, exports: 1.0, imports: 1.3 } },
  { year: 2024, turnover: 1024.9, exports: 430.7, imports: 594.1, balance: -163.3, sharePct: { turnover: 1.5, exports: 1.6, imports: 1.5 } },
  { year: 2025, turnover: 1004.0, exports: 291.7, imports: 712.2, balance: -420.5, sharePct: { turnover: 1.2, exports: 0.9, imports: 1.5 } },
];

/**
 * US Census Bureau goods-trade balance with Uzbekistan, 2017–2025.
 * `exports` = US exports to UZ, `imports` = US imports from UZ.
 * Sourced via `census_goods_uz`.
 */
export const tradeAnnualUs: TradeYear[] = [
  { year: 2017, turnover: 150.4, exports: 136.1, imports: 14.3, balance: 121.8 },
  { year: 2018, turnover: 314.7, exports: 296.5, imports: 18.2, balance: 278.4 },
  { year: 2019, turnover: 539.7, exports: 505.5, imports: 34.2, balance: 471.4 },
  { year: 2020, turnover: 261.8, exports: 181.1, imports: 80.7, balance: 100.4 },
  { year: 2021, turnover: 588.7, exports: 401.3, imports: 187.4, balance: 214.0 },
  { year: 2022, turnover: 330.0, exports: 271.0, imports: 59.0, balance: 212.0 },
  { year: 2023, turnover: 438.6, exports: 343.3, imports: 95.3, balance: 248.0 },
  { year: 2024, turnover: 423.1, exports: 380.7, imports: 42.4, balance: 338.3 },
  { year: 2025, turnover: 1048.3, exports: 473.9, imports: 574.4, balance: -100.5 },
];

/** Alias preserved for components built around the UZ-side series. */
export const tradeAnnual = tradeAnnualUz;

export interface MethodologyNote {
  id: string;
  title: string;
  basis: string;
  useFor: string;
  caveat: string;
  sourceId: string;
}

/** Methodology cards rendered on /trade alongside the dual series. */
export const methodologyNotes: MethodologyNote[] = [
  {
    id: "uz-stat",
    title: "Uzbekistan National Statistics",
    basis: "State Statistics Committee — UZ-reported exports, imports, turnover, balance, and partner share.",
    useFor: "Briefings to UZ leadership; comparison against the national foreign-trade base; product/services structure.",
    caveat: "Partner-country totals should be labeled separately from the U.S. Census goods-only totals.",
    sourceId: "input_trade_stat_docx",
  },
  {
    id: "us-census",
    title: "U.S. Census goods-only totals",
    basis: "Official U.S. merchandise trade balance table.",
    useFor: "U.S. goods exports, imports, balance, and 2026 monthly monitoring.",
    caveat: "Excludes services. Can differ from Uzbekistan-reported turnover because of valuation, timing, and partner-country methodology.",
    sourceId: "census_goods_uz",
  },
  {
    id: "ustr",
    title: "USTR goods-and-services summary",
    basis: "U.S. trade-policy country summary.",
    useFor: "Total bilateral trade including services and policy briefing language.",
    caveat: "Not a substitute for monthly merchandise monitoring; services are annual and methodology-specific.",
    sourceId: "ustr_uzbekistan",
  },
  {
    id: "govuz-forum",
    title: "Government Portal forum indicators",
    basis: "Official forum narrative and headline metrics (e.g. June 2025 forum reported $881.7M trade for 2024).",
    useFor: "Investment climate, enterprise count, forum participation, leadership talking points.",
    caveat: "Forum turnover figure is not the same series as either the U.S. Census or the National Statistics series.",
    sourceId: "govuz_business_forum_2025",
  },
];

export const tradeJan2026 = {
  turnover: 0.093,
  exports: 0.032,
  imports: 0.061,
  turnoverGrowthPct: 69,
  exportsGrowthPct: 107,
  importsGrowthPct: 54,
  note: "Jan 2026, $ millions",
};

export const exportStructure2025: CommodityItem[] = [
  { name: "Fuels and electricity", value: 25.1, sharePct: 8.6 },
  { name: "Food products", value: 9.5, sharePct: 3.3 },
  { name: "Non-ferrous metals", value: 7.8, sharePct: 3.3 },
  { name: "Mechanical equipment", value: 4.5, sharePct: 1.6 },
  { name: "Textile products", value: 2.1, sharePct: 0.7 },
  { name: "Grains and milling products", value: 1.4, sharePct: 0.5 },
  { name: "Base metals (non-precious)", value: 1.1, sharePct: 0.4 },
  { name: "Construction materials", value: 0.4, sharePct: 0.2 },
  { name: "Chemicals", value: 0.4, sharePct: 0.2 },
  { name: "Plastics", value: 0.3, sharePct: 0.1 },
  { name: "Pearls, precious stones", value: 0.1, sharePct: 0.1 },
  { name: "Finished goods (misc.)", value: 1.5, sharePct: 0.5 },
  { name: "Other goods", value: 0.9, sharePct: 0.3 },
  { name: "Services", value: 235.5, sharePct: 80.7 },
];

export const importStructure2025: CommodityItem[] = [
  { name: "Vehicles and parts", value: 228.8, sharePct: 32.1 },
  { name: "Mechanical equipment", value: 121.0, sharePct: 17.0 },
  { name: "Electrical equipment", value: 65.9, sharePct: 9.3 },
  { name: "Pharmaceutical products", value: 54.4, sharePct: 7.6 },
  { name: "Food products", value: 25.5, sharePct: 3.6 },
  { name: "Optical instruments", value: 15.5, sharePct: 2.2 },
  { name: "Textile products", value: 7.1, sharePct: 1.0 },
  { name: "Chemicals", value: 7.0, sharePct: 1.0 },
  { name: "Wood and articles", value: 6.9, sharePct: 1.0 },
  { name: "Ferrous metals", value: 6.4, sharePct: 0.9 },
  { name: "Plastics", value: 5.4, sharePct: 0.8 },
  { name: "Rubber", value: 3.4, sharePct: 0.5 },
  { name: "Finished goods (misc.)", value: 1.9, sharePct: 0.3 },
  { name: "Services", value: 146.3, sharePct: 20.5 },
];

/**
 * Commodity rankings derived from the State Statistics Committee 2025
 * structure tables. Company-level rankings would require MIIT + State
 * Customs Committee data and are intentionally not fabricated here —
 * the closest defensible view is by commodity category.
 */
export const topExportCategoriesUZ: CompanyRanking[] = exportStructure2025
  .filter((c) => c.name !== "Services" && c.name !== "Other goods" && c.name !== "Finished goods (misc.)")
  .sort((a, b) => b.value - a.value)
  .slice(0, 10)
  .map((c, idx) => ({
    rank: idx + 1,
    name: c.name,
    sector: `Share ${c.sharePct.toFixed(1)}%`,
    value: c.value,
    is_demo: false,
    source_note: "State Statistics Committee · 2025 structure",
  }));

export const topImportCategoriesUS: CompanyRanking[] = importStructure2025
  .filter((c) => c.name !== "Services" && c.name !== "Finished goods (misc.)")
  .sort((a, b) => b.value - a.value)
  .slice(0, 10)
  .map((c, idx) => ({
    rank: idx + 1,
    name: c.name,
    sector: `Share ${c.sharePct.toFixed(1)}%`,
    value: c.value,
    is_demo: false,
    source_note: "State Statistics Committee · 2025 structure",
  }));

/** Backward-compat aliases — page imports now resolve to the category lists. */
export const topExportersUZ = topExportCategoriesUZ;
export const topImportersUS = topImportCategoriesUS;

export const tradeMeta = {
  source: "State Statistics Committee of the Republic of Uzbekistan",
  source_url: "https://stat.uz",
  last_updated: "2026-02-15",
  is_demo: false,
};
