/**
 * Visit-prep data: pipelines (with readiness scores) and post-visit outcomes
 * (plan vs actual). Adapted from the parallel Codex pass plus the MIIT
 * dashboard draft. All workflow records carry `is_demo: true` because the
 * authoritative version lives in the Situational Center's task registry.
 */

export type ReadinessState = "Done" | "In progress" | "Risk" | "Not started";
export type PipelineStatus =
  | "Preparation in progress"
  | "Early preparation"
  | "Briefing"
  | "Final review"
  | "Completed";
export type OutcomeScore = "High" | "Medium-high" | "Medium" | "Below plan" | "Low";
export type OutcomeStatus =
  | "Verified"
  | "Needs verification"
  | "On track"
  | "At risk"
  | "Pending";

export interface ChecklistItem {
  label: string;
  state: ReadinessState;
}

export interface VisitPipeline {
  id: string;
  title: string;
  date: string;
  dateRange: string;
  direction: "UZ to USA" | "USA to UZ" | "Bilateral";
  /** Composite readiness 0-100, derived from checklist + protocol + briefing readiness. */
  readiness: number;
  priority: "High" | "Medium-high" | "Follow-up" | "Routine";
  theme: string;
  status: PipelineStatus;
  delegation: string[];
  program: string[];
  projects: string[];
  checklist: ChecklistItem[];
  kpi: string;
  followUp: string;
  is_demo: boolean;
  sourceId?: string;
}

export interface VisitOutcome {
  id: string;
  visit: string;
  date: string;
  plan: string;
  actual: string;
  score: OutcomeScore;
  verification: string;
  status: OutcomeStatus;
  is_demo: boolean;
  sourceId?: string;
}

export interface VisitRoadmap {
  id: string;
  title: string;
  /** 0-100 progress against the roadmap milestones. */
  progress: number;
  status: string;
  stages: string;
  linkedVisit: string;
  is_demo: boolean;
  sourceId?: string;
}

export const visitPipelines: VisitPipeline[] = [
  {
    id: "visit-pipeline-washington-2026",
    title: "Uzbekistan delegation — Washington economic mission",
    date: "2026-05-12",
    dateRange: "12–15 May 2026",
    direction: "UZ to USA",
    readiness: 78,
    priority: "High",
    theme: "Investment · DFC · critical minerals · AI Hub",
    status: "Preparation in progress",
    delegation: [
      "MIIT core team",
      "MFA bilateral relations",
      "Economy & finance track",
      "IT Park",
      "Mining project owners",
    ],
    program: [
      "Arrival and internal briefing",
      "DFC, USTDA, Commerce meetings",
      "B2B with mining and innovation partners",
      "MoU / readout block",
    ],
    projects: ["AI Hub Uzbekistan-US", "Critical minerals supply chain", "DFC financing shortlist"],
    checklist: [
      { label: "Delegation composition agreed", state: "Done" },
      { label: "Air logistics and hotels", state: "In progress" },
      { label: "Talking points and briefs", state: "Done" },
      { label: "Signing documents", state: "In progress" },
      { label: "Media support", state: "Risk" },
    ],
    kpi: "5 target meetings · 2 term sheets · 1 roadmap",
    followUp: "Convert DFC shortlist and AI Hub roadmap into owners, deadlines, and verification points.",
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "visit-pipeline-tashkent-2026",
    title: "U.S. business delegation — Tashkent and Samarkand",
    date: "2026-07-08",
    dateRange: "8–10 July 2026",
    direction: "USA to UZ",
    readiness: 61,
    priority: "Medium-high",
    theme: "AI · pharmaceuticals · logistics · regions",
    status: "Preparation in progress",
    delegation: [
      "U.S. business delegates",
      "Healthcare / pharma companies",
      "Logistics investors",
      "Embassy / Commercial Service",
    ],
    program: [
      "Tashkent B2G meetings + portfolio presentation",
      "Samarkand site visits + pharma cluster block",
      "B2B sessions and draft roadmap",
    ],
    projects: ["Pharma Cluster", "Tashkent–Washington logistics hub", "Regional investment pipeline"],
    checklist: [
      { label: "Program approved", state: "Done" },
      { label: "Regions and routes", state: "In progress" },
      { label: "Uzbek company lists", state: "In progress" },
      { label: "Draft roadmap", state: "In progress" },
      { label: "Visa support", state: "Done" },
    ],
    kpi: "8 B2B meetings · 3 LOIs · 1 follow-up visit",
    followUp: "Connect site visits to NDA, LOI, and roadmap owners.",
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "visit-pipeline-nyc-unga-2026",
    title: "UNGA / New York follow-up visit",
    date: "2026-09-22",
    dateRange: "22–24 September 2026",
    direction: "Bilateral",
    readiness: 42,
    priority: "Follow-up",
    theme: "Verification of May visit commitments",
    status: "Early preparation",
    delegation: ["Core delegation", "Project owners", "Embassy support"],
    program: [
      "Review meeting",
      "Follow-up with companies and funds",
      "Export promotion block",
    ],
    projects: ["DFC shortlist review", "Grant pipeline update", "Export package refresh"],
    checklist: [
      { label: "Baseline KPI pulled in", state: "Done" },
      { label: "Plan/fact comparison", state: "In progress" },
      { label: "Unresolved-items matrix", state: "In progress" },
      { label: "Delegation composition", state: "Risk" },
    ],
    kpi: "100% linkage to previous visit · 1 updated action tracker",
    followUp: "Close unresolved items from May and July visits before leadership readout.",
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
];

export const visitOutcomes: VisitOutcome[] = [
  {
    id: "outcome-washington-2026-04",
    visit: "Washington, April 2026",
    date: "2026-04-06",
    plan: "Council launch · 4 B2G meetings · 1 signed framework",
    actual: "Council launched · 5 meetings · DFC framework intent received",
    score: "High",
    verification: "Verified by US-UZ Gateway readout",
    status: "Verified",
    is_demo: false,
    sourceId: "us_uz_gateway",
  },
  {
    id: "outcome-washington-2026-02",
    visit: "Washington, February 2026 (Critical Minerals)",
    date: "2026-02-04",
    plan: "Critical Minerals MOU signed · supply-chain framework agreed",
    actual: "MOU signed; investment-platform agreement exchanged at SPD",
    score: "High",
    verification: "MFA readout",
    status: "Verified",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "outcome-washington-2025-11",
    visit: "Washington C5+1, November 2025",
    date: "2025-11-06",
    plan: "Bilateral with President Trump · Council agreement · Kennedy Center business conference",
    actual: "Bilateral held · Council agreement reached · 2 statements of intent",
    score: "High",
    verification: "Joint statement",
    status: "Verified",
    is_demo: false,
    sourceId: "us_uz_gateway",
  },
  {
    id: "outcome-uz-business-forum-2025",
    visit: "Tashkent — UZ-US Business Forum, June 2025",
    date: "2025-06-09",
    plan: "Forum + B2G meetings · investor outreach",
    actual: "~100 U.S. companies · $612.6M US FDI figure announced",
    score: "Medium-high",
    verification: "Government Portal readout",
    status: "Verified",
    is_demo: false,
    sourceId: "govuz_business_forum_2025",
  },
  {
    id: "outcome-saidov-us-2025",
    visit: "FM Saidov — Washington, April 2025",
    date: "2025-04-08",
    plan: "Meetings with Secretary Rubio and NSA Waltz",
    actual: "Both meetings held · diplomatic coordination calendar set",
    score: "Medium-high",
    verification: "MFA readout",
    status: "Verified",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
];

export const visitRoadmaps: VisitRoadmap[] = [
  {
    id: "roadmap-ai-hub",
    title: "Roadmap · AI Hub Uzbekistan–US",
    progress: 62,
    status: "In progress",
    stages: "Governance · site selection · anchor partners · grant line",
    linkedVisit: "Washington May 2026 → Tashkent July 2026",
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "roadmap-pharma-cluster",
    title: "Roadmap · Pharma cluster",
    progress: 48,
    status: "Needs attention",
    stages: "GMP audit · land allocation · partner confirmation",
    linkedVisit: "Tashkent July 2026 → Q4 2026 repeat visit",
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "roadmap-followup-linkage",
    title: "Roadmap · Follow-up linkage",
    progress: 100,
    status: "Structure enabled",
    stages: "Previous visit → baseline KPI → actual result → comments → unresolved items",
    linkedVisit: "All repeat visits",
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
];
