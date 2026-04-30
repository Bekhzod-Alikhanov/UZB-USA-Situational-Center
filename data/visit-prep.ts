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
  /** Reference into `data/visits.ts` (Visit.id) when the outcome maps to a tracked visit. */
  visitId?: string;
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
    visitId: "v-2026-04-upcoming-council",
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
    visitId: "v-2026-02-04-minerals",
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
    visitId: "v-2025-11-c5-1",
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
    visitId: "v-2025-04-saidov",
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

// =====================================================================
// 7-block Visit Readiness extension (Option B from the visit-prep
// architectural triage). The dashboard tracks STATUS ONLY — never
// passport numbers, visa numbers, flight bookings, talking-point text,
// draft MoU contents, or financial estimates. Those belong to a
// separate operational system with auth + audit + document storage.
// =====================================================================

/** Status enum for a single readiness item. Same shape across all 7 blocks. */
export type ItemStatus = "not-started" | "in-progress" | "review" | "approved" | "blocked" | "n/a";

export interface ScorecardItem {
  /** Short label rendered in the UI. */
  label: string;
  status: ItemStatus;
  /** Owner role-slot or organisational unit (no person names). */
  owner?: string;
  /** ISO due date. */
  dueDate?: string;
}

/** One of the seven blocks of the visit-prep protocol. */
export interface ScorecardBlock {
  blockNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  /** Whether the block applies to this visit (some visits skip e.g. signings). */
  applicable: boolean;
  items: ScorecardItem[];
}

export interface VisitScorecard {
  /** Reference into `data/visits.ts` (Visit.id) when the visit is anchored. */
  visitRef?: string;
  /** Reference into `visitPipelines` for upcoming visits. */
  pipelineRef?: string;
  blocks: ScorecardBlock[];
  is_demo: boolean;
  sourceId?: string;
}

export type DocumentType =
  | "brief"
  | "talking-points"
  | "speech"
  | "presentation"
  | "analytical-note"
  | "service-memo"
  | "travel-order"
  | "agenda";

export interface DocumentRegistryItem {
  /** Document title — administrative descriptor only, never content. */
  title: string;
  type: DocumentType;
  /** Owner role-slot or organisational unit. */
  owner: string;
  status: ItemStatus;
  dueDate?: string;
  /** Pages or slides count once produced. Not the file. */
  size?: string;
}

export interface VisitDocumentRegistry {
  visitRef?: string;
  pipelineRef?: string;
  documents: DocumentRegistryItem[];
  is_demo: boolean;
  sourceId?: string;
}

export type LogisticsRow = "avia" | "hotel" | "transfer" | "visa" | "insurance" | "coordination";

export interface LogisticsCell {
  row: LogisticsRow;
  /** Aggregated status for this row across the delegation. */
  status: ItemStatus;
  /** How many delegates are covered (e.g. 8 of 10 visas confirmed). */
  coveredOf?: { covered: number; of: number };
  /** Lead role-slot — e.g. "Protocol Officer" or "Embassy". */
  responsible?: string;
  /** Optional one-line note ("AZ Airways Apr 12 NYC", but never PNR/booking codes). */
  note?: string;
}

export interface VisitLogistics {
  visitRef?: string;
  pipelineRef?: string;
  /** Total delegation size — slot count only, no names. */
  delegationSize: number;
  rows: LogisticsCell[];
  is_demo: boolean;
  sourceId?: string;
}

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

// =====================================================================
// Scorecard demo data — 3 upcoming visits, no PII.
// =====================================================================

function s(label: string, status: ItemStatus, owner?: string, dueDate?: string): ScorecardItem {
  return { label, status, owner, dueDate };
}

export const visitScorecards: VisitScorecard[] = [
  // Washington May 2026 — high readiness (~78%)
  {
    pipelineRef: "visit-pipeline-washington-2026",
    blocks: [
      {
        blockNumber: 1,
        title: "Initiation",
        applicable: true,
        items: [
          s("Service memo (служебная записка)", "approved", "Project Office", "2026-04-10"),
          s("Justification + KPI link", "approved", "Strategic Analysis", "2026-04-12"),
          s("Resolution from leadership", "approved", "Office of the President", "2026-04-15"),
          s("Travel order draft", "review", "HR / Protocol", "2026-04-25"),
          s("Funding source confirmed", "approved", "Finance"),
          s("Delegation composition agreed", "approved", "MIIT + MFA", "2026-04-20"),
        ],
      },
      {
        blockNumber: 2,
        title: "Personnel (slot count only)",
        applicable: true,
        items: [
          s("12 slots assigned (1 head, 1 deputy, 6 experts, 1 protocol, 2 translators, 1 security)", "approved", "Protocol Office"),
          s("Passport check — covers 12/12", "approved", "Protocol Office"),
          s("U.S. visa applications submitted — 12/12", "in-progress", "Embassy DC", "2026-04-30"),
          s("Medical / travel insurance — 10/12", "in-progress", "HR", "2026-05-05"),
          s("Role briefings issued", "approved", "Protocol Office"),
        ],
      },
      {
        blockNumber: 3,
        title: "Programme",
        applicable: true,
        items: [
          s("Day-by-day agenda drafted (4 working days)", "approved", "MFA Bilateral"),
          s("Receiving-side contacts established (DFC, USTDA, Commerce)", "approved", "Embassy DC"),
          s("Format mix: 5 negotiations, 3 site visits, 1 signing", "approved", "MFA Bilateral"),
          s("Public schedule for media", "review", "Communications", "2026-05-08"),
          s("Internal bilateral table prepared", "in-progress", "Project Office", "2026-05-10"),
        ],
      },
      {
        blockNumber: 4,
        title: "Materials (registry only — content separate)",
        applicable: true,
        items: [
          s("Brief on each receiving organisation (4 docs)", "approved", "Strategic Analysis"),
          s("Talking points for delegation head", "review", "MFA Bilateral", "2026-05-08"),
          s("Speech for opening — Council", "in-progress", "Communications", "2026-05-09"),
          s("Project portfolio presentation (slides)", "approved", "MIIT"),
          s("Analytical note on critical minerals", "approved", "Strategic Analysis"),
        ],
      },
      {
        blockNumber: 5,
        title: "Agreements (stage only)",
        applicable: true,
        items: [
          s("AI Hub MoU — draft → legal review", "review", "MFA Legal", "2026-05-05"),
          s("DFC follow-up framework — drafting", "in-progress", "MIIT + DFC liaison", "2026-05-10"),
          s("Critical minerals annex — final version", "approved", "MFA Legal"),
        ],
      },
      {
        blockNumber: 6,
        title: "Logistics (status only)",
        applicable: true,
        items: [
          s("Air tickets booked — 12/12", "approved", "Protocol Office"),
          s("Hotel block confirmed (4 nights)", "approved", "Embassy DC"),
          s("Ground transport / transfer", "in-progress", "Embassy DC", "2026-05-08"),
          s("Coordination roster + emergency contacts", "approved", "Protocol Office"),
          s("Cost estimate within budget cap", "approved", "Finance"),
        ],
      },
      {
        blockNumber: 7,
        title: "Outcomes (post-visit)",
        applicable: false,
        items: [s("Awaiting visit completion", "not-started")],
      },
    ],
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  // Tashkent July 2026 — medium readiness (~61%)
  {
    pipelineRef: "visit-pipeline-tashkent-2026",
    blocks: [
      {
        blockNumber: 1,
        title: "Initiation",
        applicable: true,
        items: [
          s("Service memo from US Embassy", "approved", "MFA Bilateral"),
          s("Justification + sector KPI", "approved", "MIIT", "2026-05-15"),
          s("Resolution received", "approved", "Office of the President"),
          s("Hosting plan", "in-progress", "MIIT + MFA", "2026-06-01"),
          s("Funding lines (regional + central)", "in-progress", "Finance", "2026-06-10"),
        ],
      },
      {
        blockNumber: 2,
        title: "Personnel (slot count only)",
        applicable: true,
        items: [
          s("U.S. side delegation — 18 slots indicated", "review", "Embassy + AUCC"),
          s("UZ-side host roster — 14 slots", "approved", "Protocol Office"),
          s("Visa / entry support coordination", "in-progress", "MFA Consular", "2026-06-15"),
          s("Translator pool — 4 confirmed", "approved", "Protocol Office"),
        ],
      },
      {
        blockNumber: 3,
        title: "Programme",
        applicable: true,
        items: [
          s("Tashkent track — B2G + portfolio presentation", "approved", "MIIT"),
          s("Samarkand track — site visits + pharma cluster", "in-progress", "Khokimiyat Samarkand", "2026-06-15"),
          s("B2B sessions — 8 confirmed", "in-progress", "AUCC", "2026-06-20"),
          s("Public agenda + media plan", "in-progress", "Communications", "2026-06-30"),
        ],
      },
      {
        blockNumber: 4,
        title: "Materials (registry only)",
        applicable: true,
        items: [
          s("Brief packs on US delegates (registry only)", "in-progress", "Strategic Analysis", "2026-06-25"),
          s("UZ talking points for ministers", "in-progress", "MFA Bilateral", "2026-07-01"),
          s("Pharma cluster presentation", "review", "MoH + MIIT"),
          s("Investment portfolio refresh", "in-progress", "MIIT", "2026-06-20"),
        ],
      },
      {
        blockNumber: 5,
        title: "Agreements (stage only)",
        applicable: true,
        items: [
          s("Pharma cluster MoU — drafting", "in-progress", "MFA Legal", "2026-06-30"),
          s("Logistics hub LOI — drafting", "in-progress", "MIIT", "2026-07-01"),
          s("Regional roadmap — early draft", "not-started", "Khokimiyats", "2026-07-05"),
        ],
      },
      {
        blockNumber: 6,
        title: "Logistics (status only)",
        applicable: true,
        items: [
          s("Receiving-side hotels block", "in-progress", "Protocol Office", "2026-06-25"),
          s("Inter-city transfer (TAS↔SKD)", "not-started", "Protocol Office", "2026-06-30"),
          s("Visa support letters issued — 12/18", "in-progress", "MFA Consular"),
          s("Coordination roster", "in-progress", "Protocol Office", "2026-07-01"),
        ],
      },
      {
        blockNumber: 7,
        title: "Outcomes (post-visit)",
        applicable: false,
        items: [s("Awaiting visit completion", "not-started")],
      },
    ],
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  // UNGA September 2026 — early prep (~42%)
  {
    pipelineRef: "visit-pipeline-nyc-unga-2026",
    blocks: [
      {
        blockNumber: 1,
        title: "Initiation",
        applicable: true,
        items: [
          s("Service memo", "in-progress", "MFA Bilateral", "2026-06-01"),
          s("Linkage to May/July visits established", "approved", "Project Office"),
          s("Resolution from leadership — pending", "not-started", "Office of the President"),
          s("Composition shortlist", "in-progress", "MFA + MIIT", "2026-07-01"),
        ],
      },
      {
        blockNumber: 2,
        title: "Personnel (slot count only)",
        applicable: true,
        items: [
          s("Core delegation — 8 slots indicated", "in-progress", "Protocol Office"),
          s("Project owners — 3 slots", "not-started", "MIIT"),
          s("Embassy support — 2 slots", "approved", "Embassy NYC"),
        ],
      },
      {
        blockNumber: 3,
        title: "Programme",
        applicable: true,
        items: [
          s("UNGA week anchor events identified", "in-progress", "MFA Bilateral"),
          s("Bilateral schedule — drafting", "not-started", "MFA Bilateral", "2026-08-01"),
          s("Follow-up tracker built from May/July outputs", "in-progress", "Project Office", "2026-08-15"),
        ],
      },
      {
        blockNumber: 4,
        title: "Materials (registry only)",
        applicable: true,
        items: [
          s("Plan-vs-actual matrix from May", "in-progress", "Strategic Analysis", "2026-08-10"),
          s("Plan-vs-actual matrix from July", "not-started", "Strategic Analysis", "2026-08-25"),
          s("Unresolved-items dossier", "not-started", "Project Office", "2026-09-01"),
        ],
      },
      {
        blockNumber: 5,
        title: "Agreements (stage only)",
        applicable: true,
        items: [s("No new instruments planned — verification visit", "n/a", "MFA Bilateral")],
      },
      {
        blockNumber: 6,
        title: "Logistics (status only)",
        applicable: true,
        items: [
          s("UNGA accreditation submitted", "not-started", "MFA NYC", "2026-07-15"),
          s("Hotels via UN block — pending", "not-started", "Protocol Office", "2026-08-01"),
        ],
      },
      {
        blockNumber: 7,
        title: "Outcomes (post-visit)",
        applicable: false,
        items: [s("Awaiting visit completion", "not-started")],
      },
    ],
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
];

// =====================================================================
// Document Registry — TITLES + STATUS, never content.
// =====================================================================

function d(title: string, type: DocumentType, owner: string, status: ItemStatus, dueDate?: string, size?: string): DocumentRegistryItem {
  return { title, type, owner, status, dueDate, size };
}

export const visitDocumentRegistries: VisitDocumentRegistry[] = [
  {
    pipelineRef: "visit-pipeline-washington-2026",
    documents: [
      d("Brief — DFC structure and Uzbekistan portfolio", "brief", "Strategic Analysis", "approved", "2026-04-25", "2 pp"),
      d("Brief — USTDA pipeline status", "brief", "Strategic Analysis", "approved", "2026-04-25", "2 pp"),
      d("Brief — U.S. Department of Commerce", "brief", "Strategic Analysis", "approved", "2026-04-25", "1 p"),
      d("Brief — receiving company #1 (mining sector)", "brief", "MIIT", "approved", "2026-04-28", "2 pp"),
      d("Talking points — delegation head (DFC track)", "talking-points", "MFA Bilateral", "review", "2026-05-08", "1 p"),
      d("Talking points — critical minerals", "talking-points", "MFA Bilateral", "approved", "2026-05-05", "1 p"),
      d("Speech — Council session opening", "speech", "Communications", "in-progress", "2026-05-09"),
      d("Presentation — UZ project portfolio", "presentation", "MIIT", "approved", "2026-05-02", "24 slides"),
      d("Presentation — AI Hub concept", "presentation", "IT Park", "review", "2026-05-07", "18 slides"),
      d("Analytical note — critical minerals supply chain", "analytical-note", "Strategic Analysis", "approved", "2026-04-22", "6 pp"),
      d("Service memo — visit initiation", "service-memo", "Project Office", "approved", "2026-04-10", "2 pp"),
      d("Travel order draft", "travel-order", "HR", "review", "2026-04-25", "1 p"),
      d("Day-by-day agenda", "agenda", "MFA Bilateral", "approved", "2026-04-30", "3 pp"),
    ],
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    pipelineRef: "visit-pipeline-tashkent-2026",
    documents: [
      d("Brief — pharma cluster anchor partner", "brief", "MoH + MIIT", "review", "2026-06-25", "2 pp"),
      d("Brief — logistics hub investor", "brief", "MIIT", "in-progress", "2026-06-25", "2 pp"),
      d("Brief — Samarkand site host", "brief", "Khokimiyat", "in-progress", "2026-06-30"),
      d("Talking points — minister (pharma)", "talking-points", "MoH", "in-progress", "2026-07-01"),
      d("Talking points — minister (logistics)", "talking-points", "MoT", "in-progress", "2026-07-01"),
      d("Welcome speech — Tashkent reception", "speech", "Communications", "not-started", "2026-07-05"),
      d("Presentation — pharma cluster status", "presentation", "MoH + MIIT", "review", "2026-06-20", "20 slides"),
      d("Presentation — investment portfolio refresh", "presentation", "MIIT", "in-progress", "2026-06-20"),
      d("Analytical note — UZ pharma regulatory landscape", "analytical-note", "MoH", "in-progress", "2026-06-15"),
      d("Service memo — visit hosting plan", "service-memo", "Project Office", "approved", "2026-05-20", "2 pp"),
      d("Day-by-day agenda — Tashkent + Samarkand", "agenda", "MFA Bilateral", "in-progress", "2026-06-15"),
    ],
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    pipelineRef: "visit-pipeline-nyc-unga-2026",
    documents: [
      d("Plan-vs-actual matrix — May 2026 visit", "analytical-note", "Strategic Analysis", "in-progress", "2026-08-10", "5 pp"),
      d("Plan-vs-actual matrix — July 2026 visit", "analytical-note", "Strategic Analysis", "not-started", "2026-08-25"),
      d("Unresolved-items dossier", "analytical-note", "Project Office", "not-started", "2026-09-01"),
      d("Talking points — UNGA bilateral", "talking-points", "MFA Bilateral", "not-started", "2026-09-15"),
      d("Service memo — verification visit rationale", "service-memo", "Project Office", "in-progress", "2026-06-01"),
    ],
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
];

// =====================================================================
// Logistics Readiness Matrix — booking STATUS, no PNRs/numbers/PII.
// =====================================================================

function lc(
  row: LogisticsRow,
  status: ItemStatus,
  responsible?: string,
  coveredOf?: { covered: number; of: number },
  note?: string,
): LogisticsCell {
  return { row, status, responsible, coveredOf, note };
}

export const visitLogistics: VisitLogistics[] = [
  {
    pipelineRef: "visit-pipeline-washington-2026",
    delegationSize: 12,
    rows: [
      lc("avia", "approved", "Protocol Office", { covered: 12, of: 12 }, "TAS→IAD outbound May 12; return May 16"),
      lc("hotel", "approved", "Embassy DC", { covered: 12, of: 12 }, "DC central, 4 nights"),
      lc("transfer", "in-progress", "Embassy DC", { covered: 8, of: 12 }, "Awaiting motor pool confirmation"),
      lc("visa", "in-progress", "Embassy DC", { covered: 9, of: 12 }, "3 visa appointments scheduled"),
      lc("insurance", "in-progress", "HR", { covered: 10, of: 12 }, "Travel medical (Schengen-style A2)"),
      lc("coordination", "approved", "Protocol Office", { covered: 12, of: 12 }, "Roster + 24/7 duty officer"),
    ],
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    pipelineRef: "visit-pipeline-tashkent-2026",
    delegationSize: 18,
    rows: [
      lc("avia", "n/a", "—", undefined, "U.S. side handles their own travel"),
      lc("hotel", "in-progress", "Protocol Office", { covered: 14, of: 18 }, "Tashkent + Samarkand blocks"),
      lc("transfer", "not-started", "Protocol Office", undefined, "Inter-city + airport transfers"),
      lc("visa", "in-progress", "MFA Consular", { covered: 12, of: 18 }, "Visa support letters issued"),
      lc("insurance", "n/a", "—", undefined, "Self-arranged by U.S. delegates"),
      lc("coordination", "in-progress", "Protocol Office", { covered: 14, of: 18 }, "Bilingual liaison roster"),
    ],
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    pipelineRef: "visit-pipeline-nyc-unga-2026",
    delegationSize: 8,
    rows: [
      lc("avia", "not-started", "Protocol Office", { covered: 0, of: 8 }, "TAS→JFK September; pending booking"),
      lc("hotel", "not-started", "Protocol Office", { covered: 0, of: 8 }, "Pending UN GA accommodation block"),
      lc("transfer", "not-started", "Embassy NYC", { covered: 0, of: 8 }),
      lc("visa", "approved", "Embassy NYC", { covered: 8, of: 8 }, "Most delegates have valid US visas"),
      lc("insurance", "not-started", "HR"),
      lc("coordination", "in-progress", "Embassy NYC", { covered: 5, of: 8 }, "UNGA accreditation in progress"),
    ],
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
];

/** Helper to compute composite readiness % from a scorecard. */
export function scorecardReadinessPct(sc: VisitScorecard): number {
  const weights: Record<ItemStatus, number> = {
    "not-started": 0,
    "in-progress": 0.4,
    review: 0.7,
    approved: 1,
    blocked: 0,
    "n/a": 1, // n/a counts as complete (not relevant to this visit)
  };
  let totalItems = 0;
  let totalScore = 0;
  for (const block of sc.blocks) {
    if (!block.applicable) continue;
    for (const item of block.items) {
      totalItems += 1;
      totalScore += weights[item.status] ?? 0;
    }
  }
  return totalItems > 0 ? Math.round((totalScore / totalItems) * 100) : 0;
}

/** Per-block completion %. */
export function blockReadinessPct(block: ScorecardBlock): number {
  if (!block.applicable) return 0;
  const weights: Record<ItemStatus, number> = {
    "not-started": 0,
    "in-progress": 0.4,
    review: 0.7,
    approved: 1,
    blocked: 0,
    "n/a": 1,
  };
  if (block.items.length === 0) return 0;
  const sum = block.items.reduce((a, it) => a + (weights[it.status] ?? 0), 0);
  return Math.round((sum / block.items.length) * 100);
}
