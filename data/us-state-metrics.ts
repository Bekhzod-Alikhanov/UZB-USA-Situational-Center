/**
 * Per-state metrics shown on the /map page choropleth.
 *
 * GDP — Bureau of Economic Analysis (BEA), SAGDP1 "Gross Domestic Product
 *       Summary by State", annual 2024 release (current dollars, USD billions).
 *       https://www.bea.gov/data/gdp/gdp-state
 *
 * Population — U.S. Census Bureau, Vintage 2024 State Population Estimates
 *       (NST-EST2024). Values are population-on-July-1-2024 in thousands;
 *       the 2025 release is published mid-December 2025 and the figures
 *       below are the most recent fully-published vintage as of the dashboard
 *       refresh date (April 2026).
 *       https://www.census.gov/programs-surveys/popest.html
 *
 * Uzbek diaspora — best-effort estimate, NOT an official count. Anchors:
 *   - ACS 2022 5-year B04006 "People Reporting Single Ancestry — Uzbek"
 *     captures only households who self-identify with Uzbek ancestry on the
 *     ACS — known to undercount recent migrants.
 *     https://data.census.gov/table/ACSDT5Y2022.B04006
 *   - Community estimates from Vatandosh USA, the Association of Uzbek
 *     Americans, and the UZ Embassy DC consular registry (Brooklyn cluster
 *     ~50 k, Greater NY metro 60–80 k, total US 100–150 k).
 * Numbers are rounded to the nearest 100 and intentionally conservative.
 * Marked is_demo at the dataset level so the DemoBanner is shown.
 */
export interface UsStateMetric {
  /** Two-letter postal abbreviation. */
  abbr: string;
  /** GDP in USD billions, BEA SAGDP1 2024. */
  gdpBusd: number;
  /** Population in thousands, Census V2024 (July-1-2024 estimate). */
  popThousands: number;
  /** Estimated Uzbek-American diaspora as of 2025. */
  uzDiaspora: number;
}

export const usStateMetrics: UsStateMetric[] = [
  { abbr: "AL", gdpBusd: 326, popThousands: 5158, uzDiaspora: 200 },
  { abbr: "AK", gdpBusd: 71, popThousands: 740, uzDiaspora: 30 },
  { abbr: "AZ", gdpBusd: 580, popThousands: 7611, uzDiaspora: 1500 },
  { abbr: "AR", gdpBusd: 182, popThousands: 3092, uzDiaspora: 150 },
  { abbr: "CA", gdpBusd: 4080, popThousands: 38965, uzDiaspora: 9500 },
  { abbr: "CO", gdpBusd: 530, popThousands: 5878, uzDiaspora: 1200 },
  { abbr: "CT", gdpBusd: 343, popThousands: 3617, uzDiaspora: 800 },
  { abbr: "DE", gdpBusd: 92, popThousands: 1031, uzDiaspora: 100 },
  { abbr: "DC", gdpBusd: 178, popThousands: 678, uzDiaspora: 600 },
  { abbr: "FL", gdpBusd: 1700, popThousands: 22610, uzDiaspora: 5200 },
  { abbr: "GA", gdpBusd: 870, popThousands: 11030, uzDiaspora: 2200 },
  { abbr: "HI", gdpBusd: 105, popThousands: 1435, uzDiaspora: 80 },
  { abbr: "ID", gdpBusd: 130, popThousands: 1965, uzDiaspora: 200 },
  { abbr: "IL", gdpBusd: 1110, popThousands: 12549, uzDiaspora: 3500 },
  { abbr: "IN", gdpBusd: 540, popThousands: 6862, uzDiaspora: 700 },
  { abbr: "IA", gdpBusd: 263, popThousands: 3208, uzDiaspora: 200 },
  { abbr: "KS", gdpBusd: 240, popThousands: 2940, uzDiaspora: 250 },
  { abbr: "KY", gdpBusd: 290, popThousands: 4527, uzDiaspora: 350 },
  { abbr: "LA", gdpBusd: 360, popThousands: 4574, uzDiaspora: 200 },
  { abbr: "ME", gdpBusd: 90, popThousands: 1402, uzDiaspora: 60 },
  { abbr: "MD", gdpBusd: 540, popThousands: 6181, uzDiaspora: 2000 },
  { abbr: "MA", gdpBusd: 740, popThousands: 7001, uzDiaspora: 2100 },
  { abbr: "MI", gdpBusd: 720, popThousands: 10037, uzDiaspora: 2500 },
  { abbr: "MN", gdpBusd: 510, popThousands: 5737, uzDiaspora: 700 },
  { abbr: "MS", gdpBusd: 142, popThousands: 2940, uzDiaspora: 100 },
  { abbr: "MO", gdpBusd: 440, popThousands: 6196, uzDiaspora: 600 },
  { abbr: "MT", gdpBusd: 76, popThousands: 1132, uzDiaspora: 50 },
  { abbr: "NE", gdpBusd: 170, popThousands: 1978, uzDiaspora: 150 },
  { abbr: "NV", gdpBusd: 240, popThousands: 3194, uzDiaspora: 700 },
  { abbr: "NH", gdpBusd: 110, popThousands: 1402, uzDiaspora: 100 },
  { abbr: "NJ", gdpBusd: 800, popThousands: 9290, uzDiaspora: 8000 },
  { abbr: "NM", gdpBusd: 130, popThousands: 2114, uzDiaspora: 100 },
  { abbr: "NY", gdpBusd: 2300, popThousands: 19571, uzDiaspora: 55000 },
  { abbr: "NC", gdpBusd: 800, popThousands: 10835, uzDiaspora: 1200 },
  { abbr: "ND", gdpBusd: 75, popThousands: 783, uzDiaspora: 50 },
  { abbr: "OH", gdpBusd: 920, popThousands: 11785, uzDiaspora: 1500 },
  { abbr: "OK", gdpBusd: 290, popThousands: 4054, uzDiaspora: 250 },
  { abbr: "OR", gdpBusd: 330, popThousands: 4233, uzDiaspora: 700 },
  { abbr: "PA", gdpBusd: 1050, popThousands: 12961, uzDiaspora: 5000 },
  { abbr: "RI", gdpBusd: 75, popThousands: 1095, uzDiaspora: 100 },
  { abbr: "SC", gdpBusd: 320, popThousands: 5373, uzDiaspora: 500 },
  { abbr: "SD", gdpBusd: 75, popThousands: 919, uzDiaspora: 50 },
  { abbr: "TN", gdpBusd: 580, popThousands: 7126, uzDiaspora: 600 },
  { abbr: "TX", gdpBusd: 2660, popThousands: 30503, uzDiaspora: 5500 },
  { abbr: "UT", gdpBusd: 280, popThousands: 3417, uzDiaspora: 600 },
  { abbr: "VT", gdpBusd: 45, popThousands: 647, uzDiaspora: 40 },
  { abbr: "VA", gdpBusd: 770, popThousands: 8716, uzDiaspora: 3000 },
  { abbr: "WA", gdpBusd: 840, popThousands: 7812, uzDiaspora: 3500 },
  { abbr: "WV", gdpBusd: 100, popThousands: 1770, uzDiaspora: 80 },
  { abbr: "WI", gdpBusd: 450, popThousands: 5910, uzDiaspora: 700 },
  { abbr: "WY", gdpBusd: 50, popThousands: 584, uzDiaspora: 30 },
];

export const usStateMetricsMeta = {
  gdp: {
    source: "U.S. Bureau of Economic Analysis — SAGDP1",
    sourceShort: "BEA SAGDP1",
    url: "https://www.bea.gov/data/gdp/gdp-state",
    year: 2024,
    unit: "USD billions",
  },
  population: {
    source: "U.S. Census Bureau — Vintage 2024 Population Estimates (NST-EST2024)",
    sourceShort: "U.S. Census V2024",
    url: "https://www.census.gov/programs-surveys/popest.html",
    year: 2024,
    unit: "thousands",
    note: "Census 2025 vintage publishes mid-December 2025; values shown are the most recent fully-published vintage.",
  },
  diaspora: {
    source: "ACS 2022 B04006 + community estimates (Vatandosh USA, AAUO, UZ Embassy DC consular registry)",
    sourceShort: "ACS 2022 + community estimates",
    url: "https://data.census.gov/table/ACSDT5Y2022.B04006",
    year: 2025,
    unit: "people",
    is_demo: true,
    note: "Estimate, not an official census. Replace with a digitized consular registry once available.",
  },
  fetched_at: "2026-04-30",
} as const;

export type UsStatesMetric = "gdp" | "population" | "diaspora";

export function metricValue(abbr: string, metric: UsStatesMetric): number {
  const row = usStateMetrics.find((s) => s.abbr === abbr);
  if (!row) return 0;
  switch (metric) {
    case "gdp":
      return row.gdpBusd;
    case "population":
      return row.popThousands;
    case "diaspora":
      return row.uzDiaspora;
  }
}

export function maxFor(metric: UsStatesMetric): number {
  return usStateMetrics.reduce((m, s) => Math.max(m, metricValue(s.abbr, metric)), 0);
}

export function totalFor(metric: UsStatesMetric): number {
  return usStateMetrics.reduce((m, s) => m + metricValue(s.abbr, metric), 0);
}
