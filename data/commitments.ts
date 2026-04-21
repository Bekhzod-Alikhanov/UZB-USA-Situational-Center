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
  sphere: "investment" | "trade" | "education" | "health" | "defense" | "diplomacy" | "minerals" | "energy" | "culture";
  progressPct: number;
  lastUpdate: string;
  is_demo: boolean;
}


export const commitments: Commitment[] = [
  { id: "cm-01", title: "Critical Minerals MoU implementation — quarterly joint review", status: "progress", linkedVisitId: "v-2026-02-04-minerals", owner: "MFA + MinEnergy", dueDate: "2026-06-30", agreedOn: "2026-02-04", sphere: "minerals", progressPct: 35, lastUpdate: "2026-04-01", is_demo: true },
  { id: "cm-02", title: "Council of Peace UZ delegation roster finalization", status: "done", linkedVisitId: "v-2026-02-17-state", owner: "Presidential Admin.", dueDate: "2026-02-15", agreedOn: "2026-01-22", sphere: "diplomacy", progressPct: 100, lastUpdate: "2026-02-12", is_demo: true },
  { id: "cm-03", title: "US-UZ Business Council full session in Washington/Florida", status: "progress", linkedVisitId: "v-2026-02-06-gor", owner: "MIIT", coOwners: ["AUCC"], dueDate: "2026-04-30", agreedOn: "2026-02-06", sphere: "investment", valueMusd: 0, progressPct: 60, lastUpdate: "2026-04-10", is_demo: true },
  { id: "cm-04", title: "UzAuto × Ford Transit line commissioning", status: "progress", owner: "UzAuto Motors", dueDate: "2027-06-30", agreedOn: "2024-03-01", sphere: "trade", valueMusd: 215, progressPct: 48, lastUpdate: "2026-03-28", is_demo: true },
  { id: "cm-05", title: "Almalyk copper processing line ribbon-cutting", status: "progress", owner: "Almalyk MMC", dueDate: "2027-12-31", agreedOn: "2024-01-01", sphere: "trade", valueMusd: 520, progressPct: 55, lastUpdate: "2026-04-05", is_demo: true },
  { id: "cm-06", title: "USAID Country Strategy midterm review", status: "watch", owner: "MFA + USAID", dueDate: "2026-06-15", agreedOn: "2022-06-01", sphere: "education", progressPct: 70, lastUpdate: "2026-03-18", is_demo: true },
  { id: "cm-07", title: "Fulbright exchange renewal — signed MoU to take effect", status: "done", owner: "MinHigherEd", dueDate: "2024-09-01", agreedOn: "2023-02-28", sphere: "education", progressPct: 100, lastUpdate: "2024-09-02", is_demo: true },
  { id: "cm-08", title: "DFC financing framework — first project approvals", status: "progress", owner: "MIIT + DFC", dueDate: "2026-12-31", agreedOn: "2023-09-20", sphere: "investment", valueMusd: 500, progressPct: 25, lastUpdate: "2026-03-11", is_demo: true },
  { id: "cm-09", title: "Project C.U.R.E. — final delivery tranche Samarkand", status: "progress", owner: "Ministry of Health + U.S. Embassy", dueDate: "2026-05-31", agreedOn: "2024-01-01", sphere: "health", valueMusd: 10, progressPct: 72, lastUpdate: "2026-04-08", is_demo: true },
  { id: "cm-10", title: "Mississippi National Guard bilateral exercise", status: "progress", owner: "MoD + MS National Guard", dueDate: "2026-09-30", agreedOn: "2024-07-01", sphere: "defense", progressPct: 40, lastUpdate: "2026-04-02", is_demo: true },
  { id: "cm-11", title: "Open Skies — quarterly slot expansion review", status: "done", owner: "MinTransport + DoT", dueDate: "2025-12-31", agreedOn: "2019-10-01", sphere: "trade", progressPct: 100, lastUpdate: "2026-01-15", is_demo: true },
  { id: "cm-12", title: "Kyrgyz B5+1 follow-up — UZ deliverables", status: "progress", owner: "MFA + MIIT", dueDate: "2026-06-30", agreedOn: "2026-02-05", sphere: "investment", progressPct: 30, lastUpdate: "2026-04-07", is_demo: true },
  { id: "cm-13", title: "ПП-314 — visits of 11 remaining regional governors", status: "progress", owner: "Khokimiyats + MFA", dueDate: "2026-12-31", agreedOn: "2025-10-22", sphere: "diplomacy", progressPct: 27, lastUpdate: "2026-04-04", is_demo: true },
  { id: "cm-14", title: "AWS regional edge — MoU to firm commitment", status: "watch", owner: "MinDigital + IT Park", dueDate: "2026-07-31", agreedOn: "2026-02-06", sphere: "investment", valueMusd: 85, progressPct: 15, lastUpdate: "2026-04-02", is_demo: true },
  { id: "cm-15", title: "Council of Peace working group on Afghanistan", status: "progress", owner: "MFA", dueDate: "2026-06-30", agreedOn: "2026-02-17", sphere: "diplomacy", progressPct: 20, lastUpdate: "2026-04-06", is_demo: true },
  { id: "cm-16", title: "2025 C5+1 Declaration — cultural heritage deliverables", status: "progress", owner: "Ministry of Culture", dueDate: "2026-11-06", agreedOn: "2025-11-06", sphere: "culture", progressPct: 12, lastUpdate: "2026-04-01", is_demo: true },
  { id: "cm-17", title: "GSP renewal — U.S. Congress outreach", status: "watch", owner: "MFA + Embassy DC", dueDate: "2026-09-30", agreedOn: "2025-11-01", sphere: "trade", progressPct: 55, lastUpdate: "2026-04-05", is_demo: true },
  { id: "cm-18", title: "Boeing MRO facility site finalisation", status: "progress", owner: "MIIT + Uzbekistan Airways", dueDate: "2026-12-31", agreedOn: "2025-11-24", sphere: "trade", valueMusd: 180, progressPct: 45, lastUpdate: "2026-04-03", is_demo: true },
  { id: "cm-19", title: "Critical Minerals geological survey exchange", status: "progress", owner: "UzGeo + USGS", dueDate: "2026-08-31", agreedOn: "2026-02-04", sphere: "minerals", progressPct: 30, lastUpdate: "2026-04-01", is_demo: true },
  { id: "cm-20", title: "EXIM Bank facility for Boeing 787 order", status: "progress", owner: "MoF + EXIM", dueDate: "2026-07-31", agreedOn: "2025-11-06", sphere: "investment", valueMusd: 4000, progressPct: 62, lastUpdate: "2026-04-09", is_demo: true },
  { id: "cm-21", title: "C5+1 trade facilitation working group Q2 output", status: "overdue", owner: "MIIT", dueDate: "2026-03-31", agreedOn: "2025-11-06", sphere: "trade", progressPct: 60, lastUpdate: "2026-04-10", is_demo: true },
  { id: "cm-22", title: "Stirling medical centre — land plot allocation", status: "progress", owner: "Khokimiyat Tashkent", dueDate: "2026-06-30", agreedOn: "2025-11-12", sphere: "health", valueMusd: 120, progressPct: 55, lastUpdate: "2026-04-07", is_demo: true },
  { id: "cm-23", title: "Utah cooperation — State Capitol return visit", status: "watch", owner: "Khokimiyats + Utah Senate", dueDate: "2026-10-31", agreedOn: "2025-11-12", sphere: "diplomacy", progressPct: 25, lastUpdate: "2026-03-29", is_demo: true },
  { id: "cm-24", title: "Pfizer Rx cold-chain localization — tranche 2", status: "progress", owner: "MoH", dueDate: "2026-08-31", agreedOn: "2025-05-01", sphere: "health", valueMusd: 42, progressPct: 70, lastUpdate: "2026-04-02", is_demo: true },
  { id: "cm-25", title: "Tesla charging pilot corridor approval", status: "watch", owner: "MinEnergy", dueDate: "2026-09-30", agreedOn: "2026-02-06", sphere: "trade", progressPct: 10, lastUpdate: "2026-03-30", is_demo: true },
  { id: "cm-26", title: "Bilateral IT-Park partnership — AWS training track", status: "progress", owner: "IT Park", dueDate: "2026-07-31", agreedOn: "2026-02-06", sphere: "education", progressPct: 25, lastUpdate: "2026-04-04", is_demo: true },
  { id: "cm-27", title: "Microsoft Azure government cloud PoC", status: "progress", owner: "MinDigital", dueDate: "2026-06-30", agreedOn: "2026-02-06", sphere: "investment", valueMusd: 60, progressPct: 35, lastUpdate: "2026-04-06", is_demo: true },
  { id: "cm-28", title: "UN GA 80 bilateral — follow-ups on education MoU", status: "done", owner: "MinEdu", dueDate: "2025-12-31", agreedOn: "2025-09-23", sphere: "education", progressPct: 100, lastUpdate: "2025-12-20", is_demo: true },
  { id: "cm-29", title: "Mastercard/Visa merchant expansion benchmark", status: "overdue", owner: "Central Bank", dueDate: "2026-02-28", agreedOn: "2024-01-01", sphere: "trade", progressPct: 70, lastUpdate: "2026-03-20", is_demo: true },
  { id: "cm-30", title: "BIS EAR 99/licence tracking dashboard — quarterly review", status: "progress", owner: "State Customs Committee", dueDate: "2026-06-30", agreedOn: "2024-01-01", sphere: "trade", progressPct: 50, lastUpdate: "2026-04-05", is_demo: true },
  { id: "cm-31", title: "Caucus on Uzbekistan — new members onboarding", status: "progress", owner: "Embassy DC", dueDate: "2026-09-30", agreedOn: "2025-11-06", sphere: "diplomacy", progressPct: 40, lastUpdate: "2026-04-01", is_demo: true },
  { id: "cm-32", title: "C5+1 — cultural heritage exhibition in Washington", status: "watch", owner: "MinCulture", dueDate: "2026-10-31", agreedOn: "2025-11-06", sphere: "culture", progressPct: 30, lastUpdate: "2026-04-05", is_demo: true },
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
