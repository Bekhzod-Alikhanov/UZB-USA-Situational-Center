/**
 * U.S. foreign assistance to Uzbekistan — yearly aggregates and FY2024
 * agency / category breakdown.
 *
 * Sources:
 * - ForeignAssistance.gov (`foreign_assistance_gov`) — primary registry
 * - USAFacts aggregation of FA.gov data — used to confirm figures
 *   https://usafacts.org/answers/how-much-foreign-aid-does-the-us-provide/countries/uzbekistan/
 *
 * All figures are in nominal USD millions, total obligations basis.
 * Refreshed 2026-04-29.
 */
export interface ForeignAssistanceYear {
  fiscalYear: number;
  totalUsdM: number;
  /** True if the year is preliminary / partial (not fully reported). */
  preliminary?: boolean;
  is_demo: boolean;
}

export interface AgencyShare {
  agency: string;
  amountUsdM: number;
  sharePct: number;
}

export interface CategorySplit {
  category: "Economic" | "Military";
  amountUsdM: number;
  sharePct: number;
}

/** Annual obligations, FY2023 → FY2025 (FY2025 partial). */
export const foreignAssistanceYears: ForeignAssistanceYear[] = [
  { fiscalYear: 2023, totalUsdM: 52.3, is_demo: false },
  { fiscalYear: 2024, totalUsdM: 85.2, is_demo: false },
  { fiscalYear: 2025, totalUsdM: 7.72, preliminary: true, is_demo: false },
];

/** FY2024 agency-level breakdown (most recent fully-reported year). */
export const foreignAssistanceFy2024Agencies: AgencyShare[] = [
  { agency: "USAID", amountUsdM: 36.0, sharePct: 42.3 },
  { agency: "Department of Defense", amountUsdM: 26.1, sharePct: 30.6 },
  { agency: "Department of State", amountUsdM: 22.7, sharePct: 26.6 },
  { agency: "Department of Agriculture", amountUsdM: 0.222, sharePct: 0.3 },
  { agency: "Department of Energy", amountUsdM: 0.123, sharePct: 0.1 },
];

/** FY2024 economic vs. military split. */
export const foreignAssistanceFy2024Categories: CategorySplit[] = [
  { category: "Economic", amountUsdM: 57.1, sharePct: 66.9 },
  { category: "Military", amountUsdM: 28.1, sharePct: 33.1 },
];

export const foreignAssistanceMeta = {
  source: "ForeignAssistance.gov · USAFacts aggregation",
  sourceId: "foreign_assistance_gov" as const,
  fetched_at: "2026-04-29",
  fyMostRecent: 2024,
  fyMostRecentTotalUsdM: 85.2,
  is_demo: false,
  note: "Total obligations basis. FY2025 figures are preliminary and reflect partial reporting.",
};
