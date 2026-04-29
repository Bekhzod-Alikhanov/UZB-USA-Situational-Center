/**
 * Regional benchmark — Uzbekistan vs. Central Asia (5) + South Caucasus (2).
 *
 * Sources:
 * - GDP (`gdpUsdBn`) and population (`populationM`) — World Bank Open Data,
 *   2024 figures. Indicators NY.GDP.MKTP.CD and SP.POP.TOTL via the public
 *   World Bank JSON API. Refreshed 2026-04-26.
 * - Bilateral trade with US (`tradeWithUsUsdBn`, `exportsToUsUsdM`,
 *   `importsFromUsUsdM`) — U.S. Census Bureau goods-trade balance tables for
 *   each partner. UZ values match `tradeAnnualUs` 2025.
 * - `fdiFromUsUsdM` — approximate cumulative U.S. FDI position. Final
 *   validation requires BEA International Investment Position by partner;
 *   current values are best-available public estimates and may move ±20%.
 * - `wbDoingBusinessRank` — last published rank from World Bank Doing Business
 *   2020 (the report was discontinued in 2021). Kept as historical reference.
 * - `visaBilateral` and `gspStatus` — current-as-of 2026 manual classification.
 */
export interface RegionalMetric {
  country: "UZ" | "KZ" | "KG" | "TJ" | "TM" | "AZ" | "GE";
  gdpUsdBn: number;
  populationM: number;
  tradeWithUsUsdBn: number;
  exportsToUsUsdM: number;
  importsFromUsUsdM: number;
  fdiFromUsUsdM: number;
  /** Last published rank from WB Doing Business 2020 (report discontinued 2021). */
  wbDoingBusinessRank?: number;
  visaBilateral: "visa-free" | "e-visa" | "standard";
  gspStatus: "beneficiary" | "eligible-pending" | "graduated" | "n/a";
  flagEmoji: string;
  is_demo: boolean;
}

export const benchmark: RegionalMetric[] = [
  { country: "UZ", gdpUsdBn: 115.0, populationM: 36.4, tradeWithUsUsdBn: 1.048, exportsToUsUsdM: 473.9, importsFromUsUsdM: 574.4, fdiFromUsUsdM: 1800, wbDoingBusinessRank: 69, visaBilateral: "e-visa", gspStatus: "eligible-pending", flagEmoji: "🇺🇿", is_demo: false },
  { country: "KZ", gdpUsdBn: 291.5, populationM: 20.6, tradeWithUsUsdBn: 3.1, exportsToUsUsdM: 1450, importsFromUsUsdM: 1650, fdiFromUsUsdM: 12400, wbDoingBusinessRank: 25, visaBilateral: "visa-free", gspStatus: "graduated", flagEmoji: "🇰🇿", is_demo: false },
  { country: "KG", gdpUsdBn: 17.5, populationM: 7.2, tradeWithUsUsdBn: 0.36, exportsToUsUsdM: 42, importsFromUsUsdM: 320, fdiFromUsUsdM: 310, wbDoingBusinessRank: 80, visaBilateral: "visa-free", gspStatus: "eligible-pending", flagEmoji: "🇰🇬", is_demo: false },
  { country: "TJ", gdpUsdBn: 14.2, populationM: 10.6, tradeWithUsUsdBn: 0.09, exportsToUsUsdM: 6, importsFromUsUsdM: 88, fdiFromUsUsdM: 60, wbDoingBusinessRank: 106, visaBilateral: "e-visa", gspStatus: "eligible-pending", flagEmoji: "🇹🇯", is_demo: false },
  { country: "TM", gdpUsdBn: 51.4, populationM: 7.5, tradeWithUsUsdBn: 0.18, exportsToUsUsdM: 12, importsFromUsUsdM: 168, fdiFromUsUsdM: 220, wbDoingBusinessRank: 112, visaBilateral: "standard", gspStatus: "n/a", flagEmoji: "🇹🇲", is_demo: false },
  { country: "AZ", gdpUsdBn: 74.3, populationM: 10.2, tradeWithUsUsdBn: 0.95, exportsToUsUsdM: 450, importsFromUsUsdM: 520, fdiFromUsUsdM: 2000, wbDoingBusinessRank: 34, visaBilateral: "e-visa", gspStatus: "graduated", flagEmoji: "🇦🇿", is_demo: false },
  { country: "GE", gdpUsdBn: 34.2, populationM: 3.7, tradeWithUsUsdBn: 1.8, exportsToUsUsdM: 320, importsFromUsUsdM: 1480, fdiFromUsUsdM: 1400, wbDoingBusinessRank: 7, visaBilateral: "visa-free", gspStatus: "beneficiary", flagEmoji: "🇬🇪", is_demo: false },
];

export const benchmarkMeta = {
  source: "World Bank Open Data (GDP, population) · U.S. Census Bureau (bilateral trade) · public estimates (US FDI)",
  sourceId: "worldbank_data",
  note: "GDP + population from World Bank API (2024). Bilateral trade from U.S. Census. US FDI cumulative figures are best-available public estimates pending BEA IIP validation.",
  fetched_at: "2026-04-26",
};
