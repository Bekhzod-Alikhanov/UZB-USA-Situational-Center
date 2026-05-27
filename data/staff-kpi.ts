/**
 * Staff KPI templates — the Situational Center has an authorized headcount
 * of 10 per Center founding mandate. Real names and per-person KPIs are
 * internal HR data; this module ships role-slot templates with realistic
 * ranges so the UI can be validated. Each entry stays `is_demo: true`
 * pending the Center's HR department supplying the production roster.
 */
export interface StaffMember {
  id: string;
  /** Role-slot identifier (e.g. "Slot 01 · Investments"), not a person name. */
  name: string;
  role: string;
  directionality: "visits" | "commitments" | "investments" | "trade" | "legal" | "protocol" | "analytics" | "comms";
  tasksAssigned: number;
  tasksCompleted: number;
  avgResponseHrs: number;
  overdueTasks: number;
  monthlyContribution: number;
  is_demo: boolean;
  /** Reference into `data/sources.ts`. */
  sourceId?: string;
}

export const staff: StaffMember[] = [
  {
    id: "s-01-inv",
    name: "Slot 01 · Investments",
    role: "Project analyst — investment pipeline",
    directionality: "investments",
    tasksAssigned: 32,
    tasksCompleted: 28,
    avgResponseHrs: 4.1,
    overdueTasks: 1,
    monthlyContribution: 14,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "s-02-trade",
    name: "Slot 02 · Trade",
    role: "Trade analyst — Census/Stat reconciliation",
    directionality: "trade",
    tasksAssigned: 27,
    tasksCompleted: 22,
    avgResponseHrs: 6.2,
    overdueTasks: 2,
    monthlyContribution: 11,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "s-03-inv",
    name: "Slot 03 · Investments",
    role: "Investment analyst — DFC pipeline",
    directionality: "investments",
    tasksAssigned: 41,
    tasksCompleted: 33,
    avgResponseHrs: 5.8,
    overdueTasks: 3,
    monthlyContribution: 16,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "s-04-proto",
    name: "Slot 04 · Protocol",
    role: "Protocol & scheduling",
    directionality: "protocol",
    tasksAssigned: 58,
    tasksCompleted: 54,
    avgResponseHrs: 2.3,
    overdueTasks: 0,
    monthlyContribution: 22,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "s-05-data",
    name: "Slot 05 · Analytics",
    role: "Data & analytics — platform authority",
    directionality: "analytics",
    tasksAssigned: 19,
    tasksCompleted: 17,
    avgResponseHrs: 7.4,
    overdueTasks: 0,
    monthlyContribution: 9,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "s-06-legal",
    name: "Slot 06 · Legal",
    role: "Legal analyst — agreements register",
    directionality: "legal",
    tasksAssigned: 14,
    tasksCompleted: 10,
    avgResponseHrs: 11.5,
    overdueTasks: 2,
    monthlyContribution: 6,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "s-07-visits",
    name: "Slot 07 · Visit prep",
    role: "Visit preparation — pipeline owner",
    directionality: "visits",
    tasksAssigned: 48,
    tasksCompleted: 45,
    avgResponseHrs: 3.7,
    overdueTasks: 1,
    monthlyContribution: 19,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "s-08-events",
    name: "Slot 08 · Events",
    role: "Event management — calendar & iCal",
    directionality: "visits",
    tasksAssigned: 36,
    tasksCompleted: 31,
    avgResponseHrs: 4.9,
    overdueTasks: 1,
    monthlyContribution: 13,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "s-09-comms",
    name: "Slot 09 · Communications",
    role: "Communications — press & briefings",
    directionality: "comms",
    tasksAssigned: 22,
    tasksCompleted: 19,
    avgResponseHrs: 5.4,
    overdueTasks: 0,
    monthlyContribution: 8,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "s-10-fa",
    name: "Slot 10 · Foreign affairs",
    role: "Foreign affairs officer — commitments tracker",
    directionality: "commitments",
    tasksAssigned: 30,
    tasksCompleted: 24,
    avgResponseHrs: 6.8,
    overdueTasks: 3,
    monthlyContribution: 12,
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
];
