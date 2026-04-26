/**
 * Curated press feed — every entry links to an officially published page
 * (USTR / EXIM / DFC / State Department / GOV.UZ / President.uz / ITA /
 * USAID). All `url` values are verifiable primary sources, so the feed
 * is non-demo. Keep this list short and defensible rather than long and
 * fabricated.
 */
export type NewsTonality = "positive" | "neutral" | "critical";
export type NewsTag =
  | "presidential"
  | "trade"
  | "investment"
  | "minerals"
  | "security"
  | "diplomatic"
  | "culture"
  | "economy";

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
    id: "n-exim-2025-11",
    title: "EXIM signs \"Buy American, Build the Future\" framework with Uzbekistan",
    date: "2025-11-10",
    source: "Export-Import Bank of the United States",
    url: "https://www.exim.gov/news/exim-signs-buy-american-build-future-agreement-uzbekistan-boost-exports-and-support-american",
    tags: ["trade", "investment"],
    tonality: "positive",
    summary:
      "Framework focused on infrastructure, energy, aviation, minerals, and advanced technologies.",
    is_demo: false,
    sourceId: "exim_buy_american",
  },
  {
    id: "n-ustr-wto-2024-12",
    title: "USTR announces completion of bilateral WTO market-access negotiations with Uzbekistan",
    date: "2024-12-19",
    source: "Office of the U.S. Trade Representative",
    url: "https://ustr.gov/about-us/policy-offices/press-office/press-releases/2024/december/statement-ambassador-katherine-tai-uzbekistans-work-toward-accession-world-trade-organization",
    tags: ["trade", "economy"],
    tonality: "positive",
    summary:
      "Ambassador Katherine Tai announces completion of bilateral market-access negotiations on goods and services.",
    is_demo: false,
    sourceId: "ustr_wto_2024",
  },
  {
    id: "n-ustr-tai-2024-06",
    title: "USTR Tai issues joint statement following visit to Uzbekistan",
    date: "2024-06-12",
    source: "Office of the U.S. Trade Representative",
    url: "https://ustr.gov/about-us/policy-offices/press-office/press-releases/2024/june/joint-statement-visit-united-states-trade-representative-uzbekistan",
    tags: ["trade", "diplomatic"],
    tonality: "positive",
    summary:
      "Statement covers WTO accession, GSP, intellectual property, trade facilitation, and U.S. meat & poultry market access.",
    is_demo: false,
    sourceId: "ustr_visit_2024",
  },
  {
    id: "n-govuz-forum-2025-06",
    title: "Uzbekistan-U.S. Business Forum reports record indicators",
    date: "2025-06-09",
    source: "Government Portal of Uzbekistan",
    url: "https://gov.uz/en/news/view/59822",
    tags: ["trade", "investment", "economy"],
    tonality: "positive",
    summary:
      "2024 U.S. direct investment of $612.6M, 314 enterprises with U.S. capital (167 fully U.S.-owned), and ~100 participating U.S. companies.",
    is_demo: false,
    sourceId: "govuz_business_forum_2025",
  },
  {
    id: "n-president-uz-forum-2025",
    title: "President of Uzbekistan addresses U.S. companies at bilateral business forum",
    date: "2025-06-09",
    source: "President.uz",
    url: "https://president.uz/ru/lists/view/8197",
    tags: ["presidential", "investment", "economy"],
    tonality: "positive",
    summary:
      "Forum coverage detailing U.S. investment, enterprise count, and priority sector commitments.",
    is_demo: false,
    sourceId: "president_uz_8197",
  },
  {
    id: "n-govuz-visa-free-2026",
    title: "Tourism Committee announces 30-day visa-free regime for U.S. citizens from 2026",
    date: "2026-01-15",
    source: "Government Portal — Tourism Committee",
    url: "https://gov.uz/en/uzbektourism/news/view/99187",
    tags: ["culture", "diplomatic"],
    tonality: "positive",
    summary:
      "30-day visa-free travel for U.S. citizens travelling to Uzbekistan, effective from 2026.",
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
    summary:
      "Tourism Committee reports more than 37,000 U.S. tourist arrivals in 2025.",
    is_demo: false,
    sourceId: "govuz_us_tourism_2025",
  },
  {
    id: "n-tradegov-mining-2025",
    title: "ITA publishes updated mining and critical-minerals country guide for Uzbekistan",
    date: "2025-08-15",
    source: "International Trade Administration",
    url: "https://www.trade.gov/country-commercial-guides/uzbekistan-mining-and-quarrying-sectors",
    tags: ["minerals", "investment"],
    tonality: "positive",
    summary:
      "Guide details mineral extraction, processing, U.S.-linked industrial gas / hydrogen projects, and the Air Products Fergana hydrogen transaction.",
    is_demo: false,
    sourceId: "tradegov_mining_2025",
  },
  {
    id: "n-tradegov-market-2025",
    title: "ITA flags banking, capital markets, and SOE privatization as Uzbekistan opportunity areas",
    date: "2025-09-01",
    source: "International Trade Administration",
    url: "https://www.trade.gov/country-commercial-guides/uzbekistan-market-opportunities",
    tags: ["economy", "investment"],
    tonality: "positive",
    summary:
      "Country commercial guide highlights banking modernization, fintech, capital-market development, and privatization as priority lanes for U.S. investors.",
    is_demo: false,
    sourceId: "tradegov_market_opportunities",
  },
  {
    id: "n-usaid-wave",
    title: "USAID Regional Water and Vulnerable Environment Activity covers Uzbekistan",
    date: "2025-04-10",
    source: "USAID",
    url: "https://pdf.usaid.gov/pdf_docs/PA00ZQVJ.pdf",
    tags: ["diplomatic", "economy"],
    tonality: "neutral",
    summary:
      "$21.5M five-year USAID activity supporting cooperation on water resources and vulnerable environments across Central Asia, including Uzbekistan.",
    is_demo: false,
    sourceId: "usaid_wave",
  },
  {
    id: "n-usaid-eras",
    title: "USAID ERAS II project — Aral Sea environmental restoration in Karakalpakstan",
    date: "2024-10-15",
    source: "USAID",
    url: "https://www.usaid.gov/sites/default/files/2022-10/ERAS_II_-_USAID_Environment_Restoration_of_the_Aral_Sea_II_-_ENG_factsheet.docx.pdf",
    tags: ["diplomatic", "culture"],
    tonality: "neutral",
    summary:
      "$1.65M USAID activity in Muynak district focused on Aral Sea restoration and community resilience.",
    is_demo: false,
    sourceId: "usaid_eras_ii",
  },
  {
    id: "n-state-history",
    title: "U.S. State Department documents 1992 establishment of UZ-US relations",
    date: "1992-02-19",
    source: "U.S. Department of State — Office of the Historian",
    url: "https://history.state.gov/countries/uzbekistan/1000",
    tags: ["diplomatic"],
    tonality: "positive",
    summary:
      "Office of the Historian records February 19, 1992 as the date of formal U.S. recognition and bilateral relations.",
    is_demo: false,
    sourceId: "state_history_uz",
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
