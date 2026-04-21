export interface DemoEntry {
  where: string;
  what: string;
  file: string;
  agency: string;
  status: "pending" | "requested" | "confirmed-demo";
}

export const demoRegistry: DemoEntry[] = [
  { where: "Trade / rankings", what: "Top UZ exporters to USA", file: "data/trade.ts:topExportersUZ", agency: "MIIT + State Customs Committee", status: "requested" },
  { where: "Trade / rankings", what: "Top US importers to Uzbekistan", file: "data/trade.ts:topImportersUS", agency: "MIIT + State Customs Committee", status: "requested" },
  { where: "Investments", what: "35 US-UZ investment projects portfolio", file: "data/investments.ts", agency: "MIIT + UzInvest", status: "requested" },
  { where: "Commitments", what: "32 commitments tied to visits", file: "data/commitments.ts", agency: "Situational Center internal + responsible agencies", status: "pending" },
  { where: "Agreements / detail", what: "Specific agreement text identifiers", file: "data/agreements.ts", agency: "MFA (Dept. of Americas)", status: "requested" },
  { where: "Regions", what: "14 UZ regions × 3 US state twinnings (ПП-314)", file: "data/regions.ts", agency: "MFA + Khokimiyats", status: "pending" },
  { where: "Map / Delegations", what: "3 live delegations", file: "data/delegations.ts", agency: "Situational Center internal", status: "pending" },
  { where: "Benchmark", what: "Non-UZ CA-5 + GE/AZ regional metrics", file: "data/benchmark.ts", agency: "World Bank, UN Comtrade (to validate)", status: "pending" },
  { where: "Staff KPI", what: "10 staff placeholders", file: "data/staff-kpi.ts", agency: "Situational Center HR", status: "pending" },
  { where: "News", what: "22 curated posts with external sources", file: "data/news.ts", agency: "Situational Center comms", status: "pending" },
  { where: "Contacts", what: "HQ staff 1–10 placeholders", file: "data/contacts.ts", agency: "Situational Center HR", status: "pending" },
  { where: "Events / calendar", what: "Future enhanced SD-5 entry", file: "data/events.ts:e-sd5-2026", agency: "MFA", status: "pending" },
  { where: "Compliance", what: "CAATSA exposure rating", file: "data/compliance.ts:ofac-caatsa", agency: "MFA + Treasury (open source)", status: "pending" },
];
