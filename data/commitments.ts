/**
 * Commitments registry — internal workflow records derived from real
 * source-traced events and frameworks. Every entry stays `is_demo: true`
 * because the authoritative tracker lives in the Situational Center, but
 * each one carries a `sourceId` pointing to the originating event so
 * leadership can audit provenance even at the workflow layer.
 */
export type CommitmentStatus = "done" | "progress" | "watch" | "overdue";

export interface Commitment {
  id: string;
  title: string;
  status: CommitmentStatus;
  linkedVisitId?: string;
  owner: string;
  coOwners?: string[];
  dueDate: string;
  agreedOn: string;
  valueMusd?: number;
  sphere:
    | "investment"
    | "trade"
    | "education"
    | "health"
    | "defense"
    | "diplomacy"
    | "minerals"
    | "energy"
    | "culture";
  progressPct: number;
  lastUpdate: string;
  is_demo: boolean;
  /** Reference into `data/sources.ts` — points to the originating event/framework. */
  sourceId?: string;
  /** What the production-grade replacement record would look like. */
  expectedRealSource?: string;
}

export const commitments: Commitment[] = [
  // -- Council operating ----------------------------------------------------
  {
    id: "cm-council-cadence",
    title: "Set Council operating cadence and working-group registry",
    status: "progress",
    owner: "Council Secretariat / MIIT",
    dueDate: "2026-05-15",
    agreedOn: "2026-04-06",
    sphere: "diplomacy",
    progressPct: 62,
    lastUpdate: "2026-04-20",
    is_demo: true,
    sourceId: "us_uz_gateway",
    expectedRealSource: "Council Secretariat minutes and operating plan",
  },
  {
    id: "cm-council-roster",
    title: "Council member directory — official publication and validation",
    status: "done",
    owner: "Council Secretariat",
    dueDate: "2026-04-08",
    agreedOn: "2026-04-06",
    sphere: "diplomacy",
    progressPct: 100,
    lastUpdate: "2026-04-08",
    is_demo: true,
    sourceId: "us_uz_council",
    expectedRealSource: "Published Council member roster (Gateway page is current source)",
  },

  // -- DFC framework --------------------------------------------------------
  {
    id: "cm-dfc-pipeline",
    title: "Prepare priority pipeline for DFC Joint Investment Framework",
    status: "watch",
    owner: "MIIT / FRDU / DFC counterparts",
    dueDate: "2026-05-30",
    agreedOn: "2026-02-18",
    sphere: "investment",
    progressPct: 38,
    lastUpdate: "2026-04-15",
    is_demo: true,
    sourceId: "dfc_joint_framework",
    expectedRealSource: "Joint framework workplan and project pipeline files",
  },
  {
    id: "cm-dfc-readiness",
    title: "Project-level readiness scoring matrix for DFC shortlist",
    status: "progress",
    owner: "MIIT + Ministry of Mining and Geology",
    dueDate: "2026-05-10",
    agreedOn: "2026-02-18",
    sphere: "minerals",
    progressPct: 30,
    lastUpdate: "2026-04-12",
    is_demo: true,
    sourceId: "dfc_joint_framework",
    expectedRealSource: "Joint Investment Framework project pipeline + sponsor readiness packs",
  },

  // -- EXIM framework -------------------------------------------------------
  {
    id: "cm-exim-pipeline",
    title: "Identify EXIM-ready export finance opportunities",
    status: "progress",
    owner: "EXIM liaison / Uzbek line ministries",
    dueDate: "2026-06-10",
    agreedOn: "2025-11-10",
    sphere: "trade",
    progressPct: 45,
    lastUpdate: "2026-04-09",
    is_demo: true,
    sourceId: "exim_buy_american",
    expectedRealSource: "EXIM project intake sheets and Uzbek procurement pipeline",
  },

  // -- Critical minerals ----------------------------------------------------
  {
    id: "cm-minerals-mou",
    title: "Critical Minerals MoU — quarterly joint review framework",
    status: "progress",
    owner: "MFA + Ministry of Mining and Geology",
    dueDate: "2026-06-30",
    agreedOn: "2026-02-04",
    sphere: "minerals",
    progressPct: 35,
    lastUpdate: "2026-04-01",
    is_demo: true,
    sourceId: "input_diplomatic_docx",
    expectedRealSource: "Quarterly review minutes between MFA, MMG, and US State Department",
  },
  {
    id: "cm-minerals-survey",
    title: "Geological survey data exchange protocol with USGS",
    status: "progress",
    owner: "UzGeo + USGS",
    dueDate: "2026-08-31",
    agreedOn: "2026-02-04",
    sphere: "minerals",
    progressPct: 25,
    lastUpdate: "2026-04-01",
    is_demo: true,
    sourceId: "input_deep_review_docx",
    expectedRealSource: "Bilateral data-exchange technical annex",
  },

  // -- Agreement / legal-base register --------------------------------------
  {
    id: "cm-agreement-register",
    title: "Convert 138 aggregate agreements into agreement-level register",
    status: "overdue",
    owner: "MFA legal department + Situational Center",
    dueDate: "2026-05-01",
    agreedOn: "2026-02-17",
    sphere: "diplomacy",
    progressPct: 20,
    lastUpdate: "2026-04-10",
    is_demo: true,
    sourceId: "input_agreements_docx",
    expectedRealSource: "MFA treaty/legal registry — agreement-level metadata for all 138 documents",
  },

  // -- Visit preparation ---------------------------------------------------
  {
    id: "cm-visit-pack",
    title: "Finalize printable visit-preparation pack template",
    status: "progress",
    owner: "Situational Center",
    dueDate: "2026-04-29",
    agreedOn: "2026-02-17",
    sphere: "diplomacy",
    progressPct: 74,
    lastUpdate: "2026-04-22",
    is_demo: true,
    sourceId: "f4_ordinance_2026",
    expectedRealSource: "Approved visit file, protocol checklist, delegation roster",
  },
  {
    id: "cm-trade-agenda",
    title: "Prepare trade-agreement issue list following USTR meeting",
    status: "progress",
    owner: "MIIT / USTR liaison",
    dueDate: "2026-05-20",
    agreedOn: "2026-04-08",
    sphere: "trade",
    progressPct: 30,
    lastUpdate: "2026-04-22",
    is_demo: true,
    sourceId: "us_uz_gateway",
    expectedRealSource: "Official USTR/Council readout and tasking note",
  },

  // -- WTO accession --------------------------------------------------------
  {
    id: "cm-wto-implementation",
    title: "WTO market-access negotiation outcomes — implementation tracking",
    status: "progress",
    owner: "MIIT + USTR",
    dueDate: "2026-12-31",
    agreedOn: "2024-12-19",
    sphere: "trade",
    progressPct: 55,
    lastUpdate: "2026-04-05",
    is_demo: true,
    sourceId: "ustr_wto_2024",
    expectedRealSource: "WTO accession working-party documents and bilateral implementation log",
  },

  // -- Tourism / people-to-people ------------------------------------------
  {
    id: "cm-visa-free-rollout",
    title: "30-day visa-free regime for U.S. citizens — operational rollout",
    status: "progress",
    owner: "Ministry of Foreign Affairs + Tourism Committee",
    dueDate: "2026-06-30",
    agreedOn: "2026-01-15",
    sphere: "culture",
    progressPct: 65,
    lastUpdate: "2026-04-15",
    is_demo: true,
    sourceId: "govuz_us_visa_free_2026",
    expectedRealSource: "Border-control implementation guidance and consular notice",
  },

  // -- Investment Platform --------------------------------------------------
  {
    id: "cm-investment-platform",
    title: "Investment Platform Agreement — implementation workplan",
    status: "watch",
    owner: "MIIT + DFC + FRDU",
    dueDate: "2026-08-31",
    agreedOn: "2026-02-18",
    sphere: "investment",
    progressPct: 22,
    lastUpdate: "2026-04-18",
    is_demo: true,
    sourceId: "input_deep_review_docx",
    expectedRealSource: "Joint platform governance memo and project intake form",
  },

  // -- Council follow-up ----------------------------------------------------
  {
    id: "cm-council-tashkent-may",
    title: "Council Tashkent working session — agenda and deliverables",
    status: "progress",
    owner: "Council Secretariat",
    dueDate: "2026-05-30",
    agreedOn: "2026-04-06",
    sphere: "diplomacy",
    progressPct: 40,
    lastUpdate: "2026-04-22",
    is_demo: true,
    sourceId: "us_uz_gateway",
    expectedRealSource: "Council Tashkent session draft agenda and confirmed attendees",
  },

  // -- Air Products portfolio anchor ----------------------------------------
  {
    id: "cm-air-products-followup",
    title: "Air Products GTL operating-phase follow-up dialogue",
    status: "progress",
    owner: "MIIT + Uzbekistan GTL",
    dueDate: "2026-09-30",
    agreedOn: "2024-01-01",
    sphere: "investment",
    valueMusd: 1000,
    progressPct: 60,
    lastUpdate: "2026-04-12",
    is_demo: true,
    sourceId: "tradegov_mining_2025",
    expectedRealSource: "Operator quarterly briefing + ITA mining country-guide updates",
  },

  // -- USAID / development --------------------------------------------------
  {
    id: "cm-usaid-strategy-review",
    title: "USAID Country Development Cooperation Strategy — midterm review",
    status: "watch",
    owner: "MFA + USAID",
    dueDate: "2026-06-15",
    agreedOn: "2022-06-01",
    sphere: "education",
    progressPct: 70,
    lastUpdate: "2026-03-18",
    is_demo: true,
    sourceId: "usaid_wave",
    expectedRealSource: "USAID midterm review document and joint indicators report",
  },

  // -- Project C.U.R.E. ----------------------------------------------------
  {
    id: "cm-project-cure-tranche",
    title: "Project C.U.R.E. — final delivery tranche to Samarkand clinics",
    status: "progress",
    owner: "Ministry of Health + U.S. Embassy",
    dueDate: "2026-05-31",
    agreedOn: "2024-01-01",
    sphere: "health",
    valueMusd: 10,
    progressPct: 72,
    lastUpdate: "2026-04-08",
    is_demo: true,
    sourceId: "input_grants_xlsx",
    expectedRealSource: "Project C.U.R.E. shipping log and Embassy receipt confirmation",
  },
];

export function countByStatus(): Record<CommitmentStatus, number> {
  return commitments.reduce<Record<CommitmentStatus, number>>(
    (acc, c) => {
      acc[c.status] = (acc[c.status] ?? 0) + 1;
      return acc;
    },
    { done: 0, progress: 0, watch: 0, overdue: 0 },
  );
}
