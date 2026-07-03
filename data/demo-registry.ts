export interface DemoEntry {
  where: string;
  what: string;
  file: string;
  agency: string;
  status: "pending" | "requested" | "confirmed-demo";
}

/**
 * Typed view of `DEMO_DATA_REGISTRY.md`. Used in the Admin UI to surface
 * remaining demo entries. Keep in sync with the markdown master.
 */
export const demoRegistry: DemoEntry[] = [
  {
    where: "Investments / portfolio",
    what: "25 illustrative rows plus 10 source-backed/pending rows; UI separates verified, pending, and demo totals",
    file: "data/investments.ts",
    agency: "MIIT + UzInvest + Invest Uzbekistan",
    status: "requested",
  },
  {
    where: "Commitments / registry",
    what: "17 source-anchored workflow records — sourceId points to originating event",
    file: "data/commitments.ts",
    agency: "Situational Center internal + responsible agencies",
    status: "pending",
  },
  {
    where: "Agreements / detail",
    what: "9 agreement-level rows beyond the aggregate",
    file: "data/agreements.ts",
    agency: "MFA — Department of Americas",
    status: "requested",
  },
  {
    where: "Map / Delegations",
    what: "3 live delegations",
    file: "data/delegations.ts",
    agency: "Situational Center internal",
    status: "pending",
  },
  {
    where: "Benchmark",
    what: "Non-UZ CA-5 + Caucasus regional metrics",
    file: "data/benchmark.ts",
    agency: "World Bank · UN Comtrade (validation)",
    status: "pending",
  },
  {
    where: "Contacts / staff",
    what: "10 HQ staff placeholders ('Staff Member 1–10')",
    file: "data/contacts.ts:k-hq.people",
    agency: "Situational Center HR",
    status: "pending",
  },
  {
    where: "Events / future",
    what: "Upcoming Strategic Partnership Dialogue entry",
    file: "data/events.ts:e-sd5-2026",
    agency: "MFA",
    status: "pending",
  },
  {
    where: "Compliance",
    what: "CAATSA exposure rating",
    file: "data/compliance.ts:ofac-caatsa",
    agency: "MFA + Treasury (open source)",
    status: "pending",
  },
  {
    where: "Visit prep / pipelines",
    what: "3 upcoming visits with readiness scores",
    file: "data/visit-prep.ts:visitPipelines",
    agency: "Situational Center internal",
    status: "pending",
  },
  {
    where: "Visit prep / roadmaps",
    what: "3 cross-visit cooperation roadmaps",
    file: "data/visit-prep.ts:visitRoadmaps",
    agency: "Situational Center internal",
    status: "pending",
  },
];
