import { agreementsAggregate } from "./agreements";
import { events } from "./events";
import { grants } from "./grants";
import { investments } from "./investments";
import { news } from "./news";
import { visits } from "./visits";

export type RelationshipPillarTone = "trade" | "visits" | "invest" | "agree" | "people" | "rose" | "slate" | "primary";

export interface RelationshipPillar {
  id: string;
  title: string;
  signal: string;
  metric: string;
  narrative: string;
  href: string;
  tone: RelationshipPillarTone;
  sourceId: string;
  action: string;
}

const investmentValue = investments.reduce((sum, item) => sum + item.valueMusd, 0);
const grantValue = grants.reduce((sum, item) => sum + item.valueMusd, 0);
const criticalMinerals = investments.filter(
  (item) => item.sector === "minerals-rare-earth" || item.sector === "mining-metals",
);
const diplomaticEvents = events.filter(
  (item) => item.type === "dialogue" || item.type === "summit" || item.type === "council",
);

export const relationshipPillars: RelationshipPillar[] = [
  {
    id: "diplomacy",
    title: "Diplomacy",
    signal: `${visits.length} active-window visits`,
    metric: `${agreementsAggregate.totalDocuments} legal instruments`,
    narrative:
      "The relationship has enough high-level cadence to support an operating rhythm, but agreement-level metadata still needs owner validation.",
    href: "/visits",
    tone: "visits",
    sourceId: "input_diplomatic_docx",
    action: "Convert the aggregate treaty base into a searchable agreement-level register.",
  },
  {
    id: "trade",
    title: "Trade",
    signal: "UZ Stat + U.S. Census series",
    metric: "Dual UZ/US methodology",
    narrative:
      "Trade analysis is strongest when UZ Stat and U.S. Census are shown side by side with explicit methodology boundaries.",
    href: "/trade",
    tone: "trade",
    sourceId: "census_goods_uz",
    action: "Automate monthly Census refresh and keep UZ-side figures source-owner approved.",
  },
  {
    id: "investment",
    title: "Investment",
    signal: `$${(investmentValue / 1000).toFixed(1)}B pipeline`,
    metric: `${investments.length} projects`,
    narrative:
      "The investment portfolio is the platform's strongest executive story, but demo pipeline rows must be replaced before external use.",
    href: "/investments",
    tone: "invest",
    sourceId: "dfc_joint_framework",
    action: "Prioritize DFC/EXIM-ready projects and require sponsor, owner, value, status, and source fields.",
  },
  {
    id: "security-minerals",
    title: "Security and minerals",
    signal: `${criticalMinerals.length} critical-minerals records`,
    metric: "C5+1 supply-chain lane",
    narrative:
      "Critical minerals connect economic, security, and regional strategy; this should be treated as a standing watchlist.",
    href: "/sectors",
    tone: "slate",
    sourceId: "tradegov_mining_2025",
    action:
      "Create a minerals tracker with counterpart, concession, financing, export-control, and infrastructure dependencies.",
  },
  {
    id: "education-aid",
    title: "Education and aid",
    signal: `$${grantValue.toFixed(1)}M grants/programs`,
    metric: "UZ-side plus U.S.-side accounting",
    narrative:
      "Development assistance and education are useful soft-power indicators, but their accounting systems must stay separate.",
    href: "/grants",
    tone: "people",
    sourceId: "foreign_assistance_gov",
    action: "Add Open Doors education data and normalize ForeignAssistance.gov sector summaries.",
  },
  {
    id: "people-mobility",
    title: "People and mobility",
    signal: `${news.filter((item) => item.tags.includes("culture")).length} culture/mobility signals`,
    metric: "Visa-free U.S. citizens from 2026",
    narrative:
      "Visa-free travel and tourism growth can become a distinctive relationship metric if paired with visa/admissions data.",
    href: "/events",
    tone: "rose",
    sourceId: "govuz_us_visa_free_2026",
    action: "Add State visa statistics, DHS admissions, and Open Doors education flows.",
  },
  {
    id: "regional-strategy",
    title: "Regional strategy",
    signal: `${diplomaticEvents.length} diplomacy/council events`,
    metric: "C5+1 and peer benchmark",
    narrative:
      "The benchmark page is valuable, but it should be connected to concrete policy implications and regional competition.",
    href: "/benchmark",
    tone: "agree",
    sourceId: "worldbank_data",
    action: "Refresh macro benchmark data through World Bank WDI and add policy implication notes per metric.",
  },
];
