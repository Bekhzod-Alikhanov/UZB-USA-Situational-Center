/**
 * Sector opportunities — briefing-quality cards summarising where bilateral
 * cooperation has the most leverage. Each card carries a `signal` (what the
 * source says is happening), `whyItMatters` (the strategic angle), and a
 * `nextQuestion` to push the conversation forward in a meeting.
 *
 * Adapted from the parallel Codex pass; sources cross-checked against the
 * deep-review document and ITA / GOV.UZ official pages.
 */
export type SectorIcon = "banking" | "privatization" | "minerals" | "energy" | "agri" | "health" | "it" | "tourism";

export interface SectorOpportunity {
  id: string;
  sector: string;
  icon: SectorIcon;
  signal: string;
  whyItMatters: string;
  nextQuestion: string;
  sourceId: string;
}

export const sectorOpportunities: SectorOpportunity[] = [
  {
    id: "sector-banking-capital-markets",
    sector: "Banking, finance, and capital markets",
    icon: "banking",
    signal:
      "ITA flags modernization, privatization, fintech, and capital-market development as major opportunity areas.",
    whyItMatters:
      "Connects U.S. financial institutions, fund managers, and technical assistance to Uzbekistan's reform agenda.",
    nextQuestion:
      "Which state-owned banks, IPO candidates, and capital-market platforms have U.S. counterpart interest?",
    sourceId: "tradegov_market_opportunities",
  },
  {
    id: "sector-privatization-soe",
    sector: "SOE privatization and strategic assets",
    icon: "privatization",
    signal:
      "Official market guidance highlights privatization and state-asset reform as a channel for foreign investors.",
    whyItMatters:
      "Creates a platform lane for Franklin Templeton/UzNIF, transaction advisors, and post-privatization governance support.",
    nextQuestion:
      "Which assets need data rooms, valuation work, and investor outreach before the next bilateral forum?",
    sourceId: "tradegov_market_opportunities",
  },
  {
    id: "sector-critical-minerals",
    sector: "Critical minerals and mining",
    icon: "minerals",
    signal:
      "ITA mining guidance points to mineral extraction, processing, equipment, and U.S.-linked industrial gas/hydrogen projects.",
    whyItMatters: "Matches DFC/EXIM strategic sectors and the 2026 critical-minerals agenda.",
    nextQuestion:
      "Which projects have reserve data, environmental studies, offtake terms, and financing need ready for review?",
    sourceId: "tradegov_mining_2025",
  },
  {
    id: "sector-green-energy",
    sector: "Green energy and industrial efficiency",
    icon: "energy",
    signal: "The June 2025 official forum listed green energy among priority cooperation directions.",
    whyItMatters:
      "Pairs U.S. technology, finance, and equipment opportunities with energy-security and decarbonization goals.",
    nextQuestion:
      "Which projects should be screened for EXIM equipment, DFC financing, or private-investor participation?",
    sourceId: "govuz_business_forum_2025",
  },
  {
    id: "sector-agri-food",
    sector: "Food, agriculture, and FMCG",
    icon: "agri",
    signal:
      "The official forum listed food/agriculture as a priority; Coca-Cola expansion provides a regional manufacturing anchor.",
    whyItMatters:
      "Turns consumer and agricultural activity into regional jobs, supply-chain, and export-quality workstreams.",
    nextQuestion: "Which regional industrial zones and suppliers can support U.S. food-processing investors?",
    sourceId: "govuz_business_forum_2025",
  },
  {
    id: "sector-health-pharma",
    sector: "Healthcare and pharmaceuticals",
    icon: "health",
    signal: "The official forum listed healthcare and pharmaceuticals among priority cooperation directions.",
    whyItMatters:
      "Links grant medical-equipment projects with commercial health-tech and pharmaceutical opportunities.",
    nextQuestion: "Which hospital systems, tenders, and regulatory approvals need U.S. counterpart mapping?",
    sourceId: "govuz_business_forum_2025",
  },
  {
    id: "sector-it-digital",
    sector: "IT, digital, AI, and startups",
    icon: "it",
    signal:
      "The official forum listed IT/digital as a priority and the 2026 platform concept includes a $250M AI/digital fund.",
    whyItMatters: "Creates a bridge between venture capital, workforce, e-government, and commercial service exports.",
    nextQuestion:
      "Which startup, AI, and digital-infrastructure projects have U.S. investor or university counterpart matches?",
    sourceId: "govuz_business_forum_2025",
  },
  {
    id: "sector-tourism-people",
    sector: "Tourism and people-to-people ties",
    icon: "tourism",
    signal:
      "Official tourism sources report 37,000+ U.S. visitors in 2025 and a 30-day visa-free regime for U.S. citizens from 2026.",
    whyItMatters:
      "Adds a measurable non-trade channel for services, air connectivity, education, and cultural diplomacy.",
    nextQuestion:
      "Which routes, tourism products, universities, and state/city partnerships should be tracked together?",
    sourceId: "govuz_us_tourism_2025",
  },
];

export const sectorsMeta = {
  total: sectorOpportunities.length,
  is_demo: false,
  fetched_at: "2026-04-24",
};
