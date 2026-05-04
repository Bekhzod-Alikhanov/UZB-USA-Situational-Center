/**
 * Per-state metrics shown on the /map page choropleth.
 *
 * GDP — Bureau of Economic Analysis (BEA), SAGDP1 "Gross Domestic Product
 *       Summary by State", 2025 release (current dollars, USD billions).
 *
 * Population — U.S. Census Bureau, 2025 estimate (millions of persons).
 *
 * Uzbek students — Open Doors / IIE 2024-2025 international student census,
 *       per-state distribution of students from Uzbekistan.
 *
 * Source spreadsheet supplied by the Center:
 *   uzbek_us_states_2025_gdp_billions_no_diaspora.xlsx
 */
export interface UsStateMetric {
  /** Two-letter postal abbreviation. */
  abbr: string;
  /** GDP in USD billions, BEA SAGDP1 2025. */
  gdpBusd: number;
  /** Population in millions, Census 2025. */
  popMillions: number;
  /** Uzbek students enrolled in this state (2024-2025 academic year). */
  uzStudents: number;
}

export const usStateMetrics: UsStateMetric[] = [
  { abbr: "DC", gdpBusd: 192.618, popMillions: 0.694, uzStudents: 19 },
  { abbr: "AL", gdpBusd: 341.154, popMillions: 5.193, uzStudents: 7 },
  { abbr: "AK", gdpBusd: 75.012, popMillions: 0.737, uzStudents: 0 },
  { abbr: "AZ", gdpBusd: 598.189, popMillions: 7.624, uzStudents: 142 },
  { abbr: "AR", gdpBusd: 198.422, popMillions: 3.115, uzStudents: 3 },
  { abbr: "CA", gdpBusd: 4250.841, popMillions: 39.355, uzStudents: 157 },
  { abbr: "CO", gdpBusd: 584.324, popMillions: 6.013, uzStudents: 37 },
  { abbr: "CT", gdpBusd: 376.455, popMillions: 3.688, uzStudents: 22 },
  { abbr: "DE", gdpBusd: 117.218, popMillions: 1.06, uzStudents: 0 },
  { abbr: "FL", gdpBusd: 1834.641, popMillions: 23.463, uzStudents: 147 },
  { abbr: "GA", gdpBusd: 924.829, popMillions: 11.303, uzStudents: 14 },
  { abbr: "HI", gdpBusd: 124.608, popMillions: 1.433, uzStudents: 0 },
  { abbr: "ID", gdpBusd: 135.553, popMillions: 2.03, uzStudents: 0 },
  { abbr: "IL", gdpBusd: 1201.996, popMillions: 12.719, uzStudents: 114 },
  { abbr: "IN", gdpBusd: 545.234, popMillions: 6.973, uzStudents: 26 },
  { abbr: "IA", gdpBusd: 277.11, popMillions: 3.238, uzStudents: 19 },
  { abbr: "KS", gdpBusd: 241.378, popMillions: 2.977, uzStudents: 10 },
  { abbr: "KY", gdpBusd: 306.897, popMillions: 4.607, uzStudents: 21 },
  { abbr: "LA", gdpBusd: 340.08, popMillions: 4.618, uzStudents: 1 },
  { abbr: "ME", gdpBusd: 102.844, popMillions: 1.415, uzStudents: 8 },
  { abbr: "MD", gdpBusd: 568.14, popMillions: 6.265, uzStudents: 9 },
  { abbr: "MA", gdpBusd: 820.105, popMillions: 7.154, uzStudents: 43 },
  { abbr: "MI", gdpBusd: 730.068, popMillions: 10.128, uzStudents: 36 },
  { abbr: "MN", gdpBusd: 531.465, popMillions: 5.83, uzStudents: 36 },
  { abbr: "MS", gdpBusd: 165.069, popMillions: 2.954, uzStudents: 35 },
  { abbr: "MO", gdpBusd: 468.47, popMillions: 6.271, uzStudents: 68 },
  { abbr: "MT", gdpBusd: 82.358, popMillions: 1.145, uzStudents: 2 },
  { abbr: "NE", gdpBusd: 198.073, popMillions: 2.018, uzStudents: 4 },
  { abbr: "NV", gdpBusd: 281.454, popMillions: 3.282, uzStudents: 1 },
  { abbr: "NH", gdpBusd: 125.523, popMillions: 1.415, uzStudents: 6 },
  { abbr: "NJ", gdpBusd: 887.175, popMillions: 9.548, uzStudents: 53 },
  { abbr: "NM", gdpBusd: 152.779, popMillions: 2.125, uzStudents: 0 },
  { abbr: "NY", gdpBusd: 2467.674, popMillions: 20.002, uzStudents: 342 },
  { abbr: "NC", gdpBusd: 893.763, popMillions: 11.198, uzStudents: 13 },
  { abbr: "ND", gdpBusd: 81.883, popMillions: 0.799, uzStudents: 2 },
  { abbr: "OH", gdpBusd: 966.78, popMillions: 11.901, uzStudents: 96 },
  { abbr: "OK", gdpBusd: 274.421, popMillions: 4.123, uzStudents: 6 },
  { abbr: "OR", gdpBusd: 342.85, popMillions: 4.274, uzStudents: 4 },
  { abbr: "PA", gdpBusd: 1056.446, popMillions: 13.059, uzStudents: 115 },
  { abbr: "RI", gdpBusd: 83.956, popMillions: 1.115, uzStudents: 1 },
  { abbr: "SC", gdpBusd: 378.831, popMillions: 5.57, uzStudents: 2 },
  { abbr: "SD", gdpBusd: 80.65, popMillions: 0.935, uzStudents: 2 },
  { abbr: "TN", gdpBusd: 589.817, popMillions: 7.315, uzStudents: 17 },
  { abbr: "TX", gdpBusd: 2904.428, popMillions: 31.71, uzStudents: 28 },
  { abbr: "UT", gdpBusd: 315.973, popMillions: 3.539, uzStudents: 2 },
  { abbr: "VT", gdpBusd: 48.35, popMillions: 0.645, uzStudents: 1 },
  { abbr: "VA", gdpBusd: 798.448, popMillions: 8.88, uzStudents: 46 },
  { abbr: "WA", gdpBusd: 894.99, popMillions: 8.001, uzStudents: 9 },
  { abbr: "WV", gdpBusd: 109.277, popMillions: 1.766, uzStudents: 0 },
  { abbr: "WI", gdpBusd: 473.037, popMillions: 5.973, uzStudents: 17 },
  { abbr: "WY", gdpBusd: 52.622, popMillions: 0.589, uzStudents: 3 },
];

export const usStateMetricsMeta = {
  gdp: {
    source: "U.S. Bureau of Economic Analysis — SAGDP1",
    sourceShort: "BEA SAGDP1 2025",
    url: "https://www.bea.gov/data/gdp/gdp-state",
    year: 2025,
    unit: "USD billions",
  },
  population: {
    source: "U.S. Census Bureau — 2025 Population Estimates",
    sourceShort: "U.S. Census 2025",
    url: "https://www.census.gov/programs-surveys/popest.html",
    year: 2025,
    unit: "millions",
  },
  students: {
    source: "Open Doors / IIE — International student census 2024-2025, students from Uzbekistan",
    sourceShort: "Open Doors / IIE 2024-25",
    url: "https://opendoorsdata.org",
    year: 2025,
    unit: "people",
  },
  fetched_at: "2026-04-30",
} as const;

export type UsStatesMetric = "gdp" | "population" | "students";

export function metricValue(abbr: string, metric: UsStatesMetric): number {
  const row = usStateMetrics.find((s) => s.abbr === abbr);
  if (!row) return 0;
  switch (metric) {
    case "gdp":
      return row.gdpBusd;
    case "population":
      return row.popMillions;
    case "students":
      return row.uzStudents;
  }
}

export function getMetric(abbr: string): UsStateMetric | undefined {
  return usStateMetrics.find((s) => s.abbr === abbr);
}

export function maxFor(metric: UsStatesMetric): number {
  return usStateMetrics.reduce((m, s) => Math.max(m, metricValue(s.abbr, metric)), 0);
}

export function totalFor(metric: UsStatesMetric): number {
  return usStateMetrics.reduce((m, s) => m + metricValue(s.abbr, metric), 0);
}
