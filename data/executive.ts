import { commitments, type Commitment } from "./commitments";
import { events } from "./events";
import { externalDataSummary } from "./external-data";
import { investments } from "./investments";
import { news } from "./news";
import { relationshipPillars } from "./relationship-pillars";
import { nextAnchorVisit } from "./visits";
import { sourceQualitySummary } from "@/lib/source-quality";

export type ExecutiveItemTone = "critical" | "watch" | "positive" | "neutral";

export interface ExecutiveItem {
  id: string;
  title: string;
  detail: string;
  owner: string;
  due?: string;
  href: string;
  tone: ExecutiveItemTone;
  sourceId?: string;
}

export interface ExecutiveBriefing {
  asOf: string;
  headline: string;
  readout: string;
  metrics: { label: string; value: string; tone: ExecutiveItemTone }[];
  priorityActions: ExecutiveItem[];
  risks: ExecutiveItem[];
  opportunities: ExecutiveItem[];
  changes: ExecutiveItem[];
}

const AS_OF = "2026-05-04";

function daysUntil(date: string, asOf = AS_OF) {
  const target = new Date(`${date}T00:00:00Z`).getTime();
  const now = new Date(`${asOf}T00:00:00Z`).getTime();
  return Math.ceil((target - now) / (24 * 60 * 60 * 1000));
}

function commitmentTone(commitment: Commitment): ExecutiveItemTone {
  if (commitment.status === "overdue") return "critical";
  if (commitment.status === "watch" || commitment.progressPct < 35) return "watch";
  if (commitment.status === "done") return "positive";
  return "neutral";
}

function actionFromCommitment(commitment: Commitment): ExecutiveItem {
  const delta = daysUntil(commitment.dueDate);
  const dueText = delta < 0 ? `${Math.abs(delta)}d overdue` : `T-${delta}d`;
  return {
    id: commitment.id,
    title: commitment.title,
    detail: `${commitment.progressPct}% complete, ${dueText}.`,
    owner: commitment.owner,
    due: commitment.dueDate,
    href: "/commitments",
    tone: commitmentTone(commitment),
    sourceId: commitment.sourceId,
  };
}

export function buildExecutiveBriefing(): ExecutiveBriefing {
  const sourceSummary = sourceQualitySummary(new Date(`${AS_OF}T00:00:00Z`));
  const overdue = commitments.filter((item) => item.status === "overdue");
  const watch = commitments.filter((item) => item.status === "watch");
  const dueSoon = commitments
    .filter((item) => item.status !== "done")
    .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate))
    .slice(0, 5);
  const demoInvestments = investments.filter((item) => item.is_demo).length;
  const totalInvestmentValue = investments.reduce((sum, item) => sum + item.valueMusd, 0);
  const anchor = nextAnchorVisit(new Date(`${AS_OF}T00:00:00Z`));
  const latestNews = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);
  const upcomingEvents = events
    .filter((event) => daysUntil(event.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  return {
    asOf: AS_OF,
    headline: "Relationship is opportunity-rich, but production readiness depends on replacing demo pipeline data and closing overdue legal-register work.",
    readout:
      "The strongest immediate lanes are investment finance, critical minerals, Council operating cadence, and visa/tourism mobility. The main executive risk is not technical: it is source ownership, methodology separation, and action accountability.",
    metrics: [
      { label: "Priority actions", value: dueSoon.length.toString(), tone: "watch" },
      { label: "Overdue", value: overdue.length.toString(), tone: overdue.length ? "critical" : "positive" },
      { label: "Watchlist", value: watch.length.toString(), tone: watch.length ? "watch" : "positive" },
      { label: "Investment pipeline", value: `$${(totalInvestmentValue / 1000).toFixed(1)}B`, tone: "positive" },
      { label: "Demo investment rows", value: demoInvestments.toString(), tone: demoInvestments ? "watch" : "positive" },
      { label: "Live-ready connectors", value: `${externalDataSummary.liveReady}/${externalDataSummary.total}`, tone: "positive" },
      { label: "Fresh sources", value: `${sourceSummary.fresh}/${sourceSummary.total}`, tone: "positive" },
      { label: "Relationship pillars", value: relationshipPillars.length.toString(), tone: "neutral" },
    ],
    priorityActions: dueSoon.map(actionFromCommitment),
    risks: ([
      ...overdue.map(actionFromCommitment),
      {
        id: "risk-demo-investments",
        title: "Demo investment rows remain visible in strategic pipeline",
        detail: `${demoInvestments} investment records still require MIIT/UzInvest source-owner replacement before external publication.`,
        owner: "MIIT / UzInvest / Situational Center",
        href: "/investments",
        tone: demoInvestments ? ("watch" as const) : ("positive" as const),
        sourceId: "input_figma_pdf",
      },
      {
        id: "risk-methodology-mix",
        title: "Grants and assistance use separate accounting systems",
        detail: "UZ-side internal grants, USAID program records, and ForeignAssistance.gov annual obligations should never be summed without reconciliation.",
        owner: "Situational Center data lead",
        href: "/grants",
        tone: "watch",
        sourceId: "foreign_assistance_gov",
      },
    ] satisfies ExecutiveItem[]).slice(0, 5),
    opportunities: [
      {
        id: "opp-dfc",
        title: "Convert DFC framework into bankable project shortlist",
        detail: "Critical minerals, infrastructure, and energy can become the highest-value bilateral investment lane.",
        owner: "MIIT / DFC liaison",
        href: "/investments",
        tone: "positive",
        sourceId: "dfc_joint_framework",
      },
      {
        id: "opp-census-live",
        title: "Automate monthly Census trade refresh",
        detail: "The Census API is live-ready and can keep the U.S.-side trade view current after deployment.",
        owner: "Data engineering",
        href: "/trade",
        tone: "positive",
        sourceId: "census_intl_trade_api",
      },
      {
        id: "opp-visa",
        title: "Turn visa-free travel into a people-to-people KPI",
        detail: "Pair UZ tourism announcements with State visa and DHS admissions data for a mobility dashboard.",
        owner: "Tourism Committee / MFA",
        href: "/events",
        tone: "positive",
        sourceId: "govuz_us_visa_free_2026",
      },
      {
        id: "opp-education",
        title: "Add education exchange as a strategic pillar",
        detail: "Open Doors and university partnership data would make education diplomacy measurable.",
        owner: "MFA / Higher Education Ministry",
        href: "/grants",
        tone: "neutral",
        sourceId: "iie_open_doors",
      },
    ],
    changes: [
      ...latestNews.map((item): ExecutiveItem => ({
        id: item.id,
        title: item.title,
        detail: item.summary,
        owner: item.source,
        due: item.date,
        href: "/news",
        tone: item.tonality === "positive" ? "positive" : "neutral",
        sourceId: item.sourceId,
      })),
      ...upcomingEvents.map((item): ExecutiveItem => ({
        id: item.id,
        title: item.title,
        detail: item.description,
        owner: item.location,
        due: item.date,
        href: "/events",
        tone: "neutral" as const,
        sourceId: item.sourceId,
      })),
      ...(anchor
        ? [
            {
              id: `anchor-${anchor.id}`,
              title: `Next anchor visit: ${anchor.title}`,
              detail: `${anchor.location}, ${anchor.date}.`,
              owner: anchor.participantsUz[0] ?? "Situational Center",
              due: anchor.date,
              href: "/visits",
              tone: "watch" as const,
              sourceId: anchor.sourceId,
            },
          ]
        : []),
    ].slice(0, 5),
  };
}
