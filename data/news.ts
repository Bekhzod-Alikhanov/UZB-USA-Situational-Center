/**
 * Curated press feed — every entry links to an officially published page
 * (USTR / EXIM / DFC / State Department / GOV.UZ / President.uz / ITA /
 * USAID). All `url` values are verifiable primary sources, so the feed
 * is non-demo. Keep this list short and defensible rather than long and
 * fabricated.
 */
export type NewsTonality = "positive" | "neutral" | "critical";
export type NewsTag =
  "presidential" | "trade" | "investment" | "minerals" | "security" | "diplomatic" | "culture" | "economy";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  url: string;
  tags: NewsTag[];
  tonality: NewsTonality;
  summary: string;
  is_demo: boolean;
  /** Reference into `data/sources.ts`. */
  sourceId?: string;
}

export const news: NewsItem[] = [
  {
    id: "n-dfc-2026-02",
    title: "DFC announces Heads of Terms / Joint Investment Framework intent with Uzbekistan",
    date: "2026-02-18",
    source: "U.S. International Development Finance Corporation",
    url: "https://www.dfc.gov/media/press-releases/dfc-leadership-lays-foundation-investment-partnership-uzbekistan",
    tags: ["investment", "minerals"],
    tonality: "positive",
    summary:
      "DFC leadership announces collaboration to expand private investment in critical minerals, infrastructure, and energy.",
    is_demo: false,
    sourceId: "dfc_joint_framework",
  },
  {
    id: "n-govuz-visa-free-2026",
    title: "Tourism Committee announces 30-day visa-free regime for U.S. citizens from 2026",
    date: "2026-01-15",
    source: "Government Portal — Tourism Committee",
    url: "https://gov.uz/en/uzbektourism/news/view/99187",
    tags: ["culture", "diplomatic"],
    tonality: "positive",
    summary: "30-day visa-free travel for U.S. citizens travelling to Uzbekistan, effective from 2026.",
    is_demo: false,
    sourceId: "govuz_us_visa_free_2026",
  },
  {
    id: "n-govuz-tourism-2025",
    title: "37,000+ U.S. visitors to Uzbekistan reported in 2025",
    date: "2026-01-30",
    source: "Government Portal — Tourism Committee",
    url: "https://gov.uz/en/uzbektourism/news/view/124526",
    tags: ["culture", "economy"],
    tonality: "positive",
    summary: "Tourism Committee reports more than 37,000 U.S. tourist arrivals in 2025.",
    is_demo: false,
    sourceId: "govuz_us_tourism_2025",
  },
  {
    id: "n-gateway-council-2026",
    title: "American-Uzbek Business and Investment Council launches in Washington",
    date: "2026-04-06",
    source: "U.S.-Uzbekistan Business Gateway",
    url: "https://us-uz.gov.uz/en",
    tags: ["investment", "diplomatic"],
    tonality: "positive",
    summary:
      "Council convenes for its formal launch in Washington, D.C.; delegations exchange working-group commitments.",
    is_demo: false,
    sourceId: "us_uz_gateway",
  },
  {
    id: "n-gateway-council-roster",
    title: "Council member directory published with 13 named UZ and U.S. members",
    date: "2026-04-08",
    source: "U.S.-Uzbekistan Business Gateway",
    url: "https://us-uz.gov.uz/en/about/council",
    tags: ["investment", "diplomatic"],
    tonality: "positive",
    summary:
      "Roster includes Saida Mirziyoyeva (co-chair), Komil Allamjonov (special envoy), David L. Fogel (DOC), Caleb Orr (State), Jonathan Henick (US Ambassador), and 8 others.",
    is_demo: false,
    sourceId: "us_uz_council",
  },
  {
    id: "n-census-2025-trade",
    title: "U.S. Census Bureau records full-year 2025 trade with Uzbekistan at $1.048B",
    date: "2026-02-15",
    source: "U.S. Census Bureau",
    url: "https://www.census.gov/foreign-trade/balance/c4644.html",
    tags: ["trade", "economy"],
    tonality: "neutral",
    summary:
      "Census trade-in-goods balance table shows total bilateral trade of $1,048.3M in 2025, with U.S. exports of $473.9M and U.S. imports of $574.4M.",
    is_demo: false,
    sourceId: "census_goods_uz",
  },
];
