/**
 * Situational Center 12-month milestone schedule.
 *
 * Source: Annex 1 ("Protocol on agreement of prices, stages and deadlines of
 * services") to the civil-law contract dated 15.04.2026 under Presidential
 * Center founding mandate (17.02.2026). Monetary amounts intentionally omitted.
 *
 * Deadlines are real (`is_demo: false`); status is derived in the UI from the
 * current date relative to `dueDate`.
 */
export type MilestoneTrack =
  | "governance"
  | "visits"
  | "dashboard"
  | "expertise"
  | "strategy"
  | "reporting"
  | "investments"
  | "reforms"
  | "training"
  | "documents";

export interface CenterMilestone {
  /** Stage number from the contract Annex 1 (1–12). */
  stage: number;
  /** Short label rendered as the milestone title. */
  title: string;
  /** Full description as worded in Annex 1, monetary clauses removed. */
  description: string;
  /** ISO date — completion deadline per Annex 1. */
  dueDate: string;
  track: MilestoneTrack;
  is_demo: boolean;
  sourceId: "gpd_protocol_2026";
}

export const centerMilestones: CenterMilestone[] = [
  {
    stage: 1,
    title: "Launch the Center",
    description:
      "Agree the internal regulations of the Headquarters; distribute functional duties; produce templates for working documents (checklists, report formats, registries) and the Headquarters' road-map.",
    dueDate: "2026-05-15",
    track: "governance",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 2,
    title: "Monthly monitoring of upcoming UZ delegation visits to the U.S.",
    description:
      "Review delegation composition, agenda and programme of visits, lists of meetings with U.S. companies, draft speeches and presentations.",
    dueDate: "2026-06-15",
    track: "visits",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 3,
    title: "Dashboard improvement package after pilot testing",
    description:
      "Refine the indicator set, identify gaps in the data, propose interface improvements following first-round testing.",
    dueDate: "2026-07-15",
    track: "dashboard",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 4,
    title: "Activate the visit-expertise system",
    description:
      "Review proposed delegation composition, negotiation agenda, programme, list of U.S. companies/organisations to meet, planned trip duration. Prepare short opinions with recommendations on excluding redundant or non-targeted participants and optimising budget expenditure.",
    dueDate: "2026-08-15",
    track: "expertise",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 5,
    title: "Priority cooperation directions with the U.S.",
    description:
      "Identify priority directions of cooperation with the U.S. based on analysis of the current state of bilateral relations. Begin preparing analytical notes on applicable U.S. reforms and best practices. Build the initial registry of potential U.S. partners (companies, organisations, structures) classified by sector.",
    dueDate: "2026-09-15",
    track: "strategy",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 6,
    title: "6-month results report to the Office of the President",
    description:
      "Detailed analytical report covering: visits supported, agreements reached, an evaluation of delegation-expertise effectiveness, and proposals for adjusting the Headquarters' work for the next period.",
    dueDate: "2026-10-15",
    track: "reporting",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 7,
    title: "Refresh the investment-projects database",
    description:
      "Update statuses of regional and ministerial projects, add new proposals, remove non-implementable ones. Prepare an updated investment portfolio for use in negotiations with U.S. partners during upcoming visits.",
    dueDate: "2026-11-15",
    track: "investments",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 8,
    title: "Analysis of U.S. reforms + new bilateral initiatives",
    description:
      "Analyse reforms and changes implemented across various sectors in the U.S.; design new initiatives to develop bilateral ties with U.S. partners.",
    dueDate: "2026-12-15",
    track: "reforms",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 9,
    title: "Capacity building for ministry/regional leadership",
    description:
      "Upgrade the skills of leaders and responsible officers of ministries, agencies and regions in diplomacy fundamentals, negotiation techniques and methods, and international protocol & etiquette in the context of visits to the U.S.",
    dueDate: "2027-01-15",
    track: "training",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 10,
    title: "Submit visit-package documents to the Special Headquarters",
    description:
      "Prepare and submit the visit document package to the Special Headquarters for review and approval (invitation letters, visit programme, delegation composition, work plan, draft documents for signing, meeting materials).",
    dueDate: "2027-02-15",
    track: "documents",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 11,
    title: "Deep-dive analysis of U.S. institutional best practices",
    description:
      "In-depth analysis of successful U.S. reforms and institutional practices in public administration, investment climate and digitalisation. Targeted proposals for adaptation, addressed to interested ministries and agencies of Uzbekistan.",
    dueDate: "2027-03-15",
    track: "reforms",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
  {
    stage: 12,
    title: "12-month final report to the Office of the President",
    description:
      "Final report covering: results of work, key indicators, list of supported visits, agreements reached and their execution, tools and databases produced, recommendations for continuing and developing the Center's activity.",
    dueDate: "2027-04-15",
    track: "reporting",
    is_demo: false,
    sourceId: "gpd_protocol_2026",
  },
];

export type MilestoneStatus = "completed" | "in-progress" | "upcoming" | "overdue";

/**
 * Derive a milestone's status from `dueDate` relative to a reference date.
 * "in-progress" if the deadline is within 30 days; "upcoming" if further;
 * "overdue" if the deadline has passed and no completion is recorded.
 *
 * Production should replace this with a real completion flag from the Acts
 * of acceptance ("Акт сдачи-приемки") archive.
 */
export function deriveMilestoneStatus(dueDate: string, today: Date = new Date()): MilestoneStatus {
  const due = new Date(dueDate + "T00:00:00Z");
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "overdue";
  if (diffDays <= 30) return "in-progress";
  return "upcoming";
}

export const centerMilestonesMeta = {
  contractDate: "2026-04-15",
  firstDeadline: "2026-05-15",
  finalDeadline: "2027-04-15",
  total: centerMilestones.length,
  source: "Annex 1 to the civil-law contract (15.04.2026)",
  sourceId: "gpd_protocol_2026" as const,
  is_demo: false,
};
