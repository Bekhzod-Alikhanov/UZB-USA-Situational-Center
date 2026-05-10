export type InvestmentSector =
  | "mining-metals"
  | "automotive"
  | "aviation"
  | "agri-food"
  | "energy"
  | "pharma"
  | "it-digital"
  | "textile"
  | "chemicals"
  | "finance"
  | "minerals-rare-earth";

export type InvestmentStatus = "mou" | "negotiation" | "agreed" | "construction" | "operating" | "paused";
export type InvestmentSourceConfidence =
  | "verified_official"
  | "company_confirmed"
  | "media_reported"
  | "internal_unverified"
  | "illustrative_demo"
  | "source_needed";
export type InvestmentVisibility = "public" | "internal" | "restricted" | "demo";
export type InvestmentRiskLevel = "low" | "medium" | "high" | "source_needed";

export interface Investment {
  id: string;
  title: string;
  sector: InvestmentSector;
  region: string;
  valueMusd: number;
  status: InvestmentStatus;
  partnerUs: string;
  partnerUz: string;
  jobs?: number;
  startYear: number;
  expectedCompletion?: number;
  is_demo: boolean;
  source_note?: string;
  /** Reference into `data/sources.ts`. */
  sourceId?: string;
  sourceIds?: string[];
  sourceConfidence?: InvestmentSourceConfidence;
  verificationStatus?: InvestmentSourceConfidence;
  visibility?: InvestmentVisibility;
  investmentType?: "greenfield" | "brownfield" | "portfolio" | "fund" | "equipment" | "services" | "source_needed";
  projectOwner?: string;
  governmentCounterpart?: string;
  stageDetail?: string;
  usCompanyRelevance?: string;
  riskLevel?: InvestmentRiskLevel;
  requiredApprovals?: string[];
  nextAction?: string;
  nextStep?: string;
  blockers?: string[];
  lastUpdatedDate?: string;
}

const demo = "to be supplied by MIIT and UzInvest";

export const investments: Investment[] = [
  // ------------------------------------------------------------------
  // REAL — named-company projects with verified public sources.
  // Sourced from ITA mining country guide and the deep-review document.
  // ------------------------------------------------------------------
  {
    id: "real-air-products-gtl",
    title: "Air Products — Uzbekistan GTL industrial gas complex",
    sector: "energy",
    region: "Kashkadarya",
    valueMusd: 1000,
    status: "operating",
    partnerUs: "Air Products",
    partnerUz: "Uzbekistan GTL (Qashqadaryo / Qarshi)",
    startYear: 2021,
    jobs: 400,
    is_demo: false,
    sourceId: "tradegov_mining_2025",
  },
  {
    id: "real-air-products-fergana-h2",
    title: "Air Products — Fergana Refinery hydrogen assets",
    sector: "energy",
    region: "Fergana",
    valueMusd: 140,
    status: "agreed",
    partnerUs: "Air Products",
    partnerUz: "Fergana Oil Refinery (Saneg)",
    startYear: 2024,
    jobs: 80,
    is_demo: false,
    sourceId: "tradegov_mining_2025",
  },
  {
    id: "real-air-products-navoiy-co2",
    title: "Air Products — food-grade liquid CO₂ facility",
    sector: "chemicals",
    region: "Navoi",
    valueMusd: 0,
    status: "agreed",
    partnerUs: "Air Products",
    partnerUz: "Navoi industrial cluster",
    startYear: 2024,
    is_demo: false,
    source_note: "Amount not publicly disclosed",
    sourceId: "input_deep_review_docx",
  },
  {
    id: "real-coca-cola-expansion",
    title: "Coca-Cola Bottlers Uzbekistan — Samarkand & Namangan expansion",
    sector: "agri-food",
    region: "Samarkand / Namangan",
    valueMusd: 165,
    status: "operating",
    partnerUs: "The Coca-Cola Company / Coca-Cola Bottlers Uzbekistan",
    partnerUz: "Coca-Cola Ichimligi Uzbekistan",
    startYear: 2024,
    jobs: 600,
    is_demo: false,
    sourceId: "input_deep_review_docx",
  },
  {
    id: "real-franklin-templeton-uznif",
    title: "Franklin Templeton — UzNIF investment management mandate",
    sector: "finance",
    region: "Tashkent city (national)",
    valueMusd: 2000,
    status: "operating",
    partnerUs: "Franklin Templeton",
    partnerUz: "National Investment Fund of Uzbekistan (UzNIF)",
    startYear: 2024,
    jobs: 50,
    is_demo: false,
    sourceId: "input_deep_review_docx",
  },
  {
    id: "real-traxys-critical-minerals",
    title: "Traxys & partners — critical-minerals project portfolio",
    sector: "minerals-rare-earth",
    region: "Multi-region (working group)",
    valueMusd: 1000,
    status: "agreed",
    partnerUs: "Traxys",
    partnerUz: "Ministry of Mining and Geology",
    startYear: 2026,
    is_demo: false,
    sourceId: "input_deep_review_docx",
  },
  {
    id: "real-mining-metallurgy-850",
    title: "Mining & metallurgy package (top portfolio item)",
    sector: "mining-metals",
    region: "To be confirmed",
    valueMusd: 850,
    status: "construction",
    partnerUs: "(under registration)",
    partnerUz: "MIIT pipeline",
    startYear: 2025,
    is_demo: false,
    sourceId: "input_figma_pdf",
  },
  {
    id: "real-mining-metallurgy-200",
    title: "Mining & metallurgy package (secondary)",
    sector: "mining-metals",
    region: "To be confirmed",
    valueMusd: 200,
    status: "construction",
    partnerUs: "(under registration)",
    partnerUz: "MIIT pipeline",
    startYear: 2025,
    is_demo: false,
    sourceId: "input_figma_pdf",
  },
  {
    id: "real-gf6-css-prime",
    title: "GF-6 transmission parts + CSS Prime engine cylinder-head localization",
    sector: "automotive",
    region: "To be confirmed",
    valueMusd: 130,
    status: "construction",
    partnerUs: "GF-6 / CSS Prime",
    partnerUz: "UzAuto Motors",
    startYear: 2025,
    is_demo: false,
    sourceId: "input_figma_pdf",
  },
  {
    id: "real-ai-digital-fund",
    title: "Joint investment fund for AI and digital-tech startups",
    sector: "it-digital",
    region: "Tashkent city (national)",
    valueMusd: 250,
    status: "agreed",
    partnerUs: "(US fund partner — under registration)",
    partnerUz: "IT Park Uzbekistan",
    startYear: 2026,
    is_demo: false,
    sourceId: "input_figma_pdf",
  },

  // ------------------------------------------------------------------
  // DEMO — illustrative pipeline; pending MIIT / UzInvest project register.
  // ------------------------------------------------------------------
  {
    id: "inv-1",
    title: "Tungsten / molybdenum concentrate JV",
    sector: "minerals-rare-earth",
    region: "Navoi",
    valueMusd: 340,
    status: "agreed",
    partnerUs: "Westinghouse / Cove Mountain Partners",
    partnerUz: "Almalyk MMC",
    startYear: 2026,
    expectedCompletion: 2029,
    jobs: 1200,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-2",
    title: "Copper downstream processing line",
    sector: "mining-metals",
    region: "Tashkent region",
    valueMusd: 520,
    status: "construction",
    partnerUs: "Freeport-McMoRan",
    partnerUz: "Almalyk MMC",
    startYear: 2024,
    expectedCompletion: 2027,
    jobs: 800,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-3",
    title: "Boeing 787 MRO facility",
    sector: "aviation",
    region: "Tashkent city",
    valueMusd: 180,
    status: "agreed",
    partnerUs: "Boeing",
    partnerUz: "Uzbekistan Airways",
    startYear: 2025,
    expectedCompletion: 2028,
    jobs: 450,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-4",
    title: "John Deere precision agriculture hub",
    sector: "agri-food",
    region: "Fergana",
    valueMusd: 65,
    status: "operating",
    partnerUs: "John Deere",
    partnerUz: "Uzagrotexnika",
    startYear: 2024,
    jobs: 180,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-5",
    title: "GE Vernova 450 MW combined-cycle",
    sector: "energy",
    region: "Surkhandarya",
    valueMusd: 670,
    status: "construction",
    partnerUs: "GE Vernova",
    partnerUz: "Thermal Power Plants JSC",
    startYear: 2024,
    expectedCompletion: 2027,
    jobs: 320,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-6",
    title: "Pfizer cold-chain pharma distribution",
    sector: "pharma",
    region: "Tashkent city",
    valueMusd: 42,
    status: "operating",
    partnerUs: "Pfizer",
    partnerUz: "Ministry of Health",
    startYear: 2023,
    jobs: 120,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-7",
    title: "Amazon Web Services regional edge",
    sector: "it-digital",
    region: "Tashkent city",
    valueMusd: 85,
    status: "negotiation",
    partnerUs: "AWS",
    partnerUz: "IT Park Uzbekistan",
    startYear: 2026,
    expectedCompletion: 2027,
    jobs: 200,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-8",
    title: "Cargill corn oil refinery",
    sector: "agri-food",
    region: "Jizzakh",
    valueMusd: 55,
    status: "agreed",
    partnerUs: "Cargill",
    partnerUz: "UzAgroExport",
    startYear: 2025,
    jobs: 140,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-9",
    title: "Honeywell airport control modernization",
    sector: "aviation",
    region: "Tashkent city",
    valueMusd: 38,
    status: "operating",
    partnerUs: "Honeywell",
    partnerUz: "Uzaeronavigatsiya",
    startYear: 2023,
    jobs: 60,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-10",
    title: "Ford Transit assembly line",
    sector: "automotive",
    region: "Andijan",
    valueMusd: 215,
    status: "construction",
    partnerUs: "Ford Motor Co.",
    partnerUz: "UzAuto Motors",
    startYear: 2024,
    expectedCompletion: 2027,
    jobs: 700,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-11",
    title: "Air Products hydrogen facility",
    sector: "energy",
    region: "Navoi",
    valueMusd: 480,
    status: "agreed",
    partnerUs: "Air Products",
    partnerUz: "Navoiyazot",
    startYear: 2026,
    expectedCompletion: 2029,
    jobs: 260,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-12",
    title: "Stirling Foundation medical centre",
    sector: "pharma",
    region: "Tashkent city",
    valueMusd: 120,
    status: "mou",
    partnerUs: "Stirling (Utah)",
    partnerUz: "Ministry of Health",
    startYear: 2026,
    expectedCompletion: 2028,
    jobs: 300,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-13",
    title: "Caterpillar mining fleet supply",
    sector: "mining-metals",
    region: "Navoi",
    valueMusd: 145,
    status: "operating",
    partnerUs: "Caterpillar",
    partnerUz: "Navoi MMC",
    startYear: 2022,
    jobs: 90,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-14",
    title: "Microsoft Azure government cloud",
    sector: "it-digital",
    region: "Tashkent city",
    valueMusd: 60,
    status: "mou",
    partnerUs: "Microsoft",
    partnerUz: "MinDigital",
    startYear: 2026,
    expectedCompletion: 2027,
    jobs: 80,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-15",
    title: "Dow Chemical polymer plant",
    sector: "chemicals",
    region: "Kashkadarya",
    valueMusd: 290,
    status: "negotiation",
    partnerUs: "Dow Chemical",
    partnerUz: "Uzbekneftegaz",
    startYear: 2026,
    expectedCompletion: 2029,
    jobs: 410,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-16",
    title: "Bechtel highway modernization PPP",
    sector: "energy",
    region: "Samarkand",
    valueMusd: 410,
    status: "mou",
    partnerUs: "Bechtel",
    partnerUz: "Ministry of Transport",
    startYear: 2026,
    expectedCompletion: 2030,
    jobs: 950,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-17",
    title: "Citi trade finance platform",
    sector: "finance",
    region: "Tashkent city",
    valueMusd: 40,
    status: "agreed",
    partnerUs: "Citigroup",
    partnerUz: "Uzpromstroybank",
    startYear: 2025,
    jobs: 60,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-18",
    title: "Pratt & Whitney engine servicing",
    sector: "aviation",
    region: "Tashkent city",
    valueMusd: 95,
    status: "negotiation",
    partnerUs: "Pratt & Whitney",
    partnerUz: "Uzbekistan Airways Technics",
    startYear: 2026,
    expectedCompletion: 2028,
    jobs: 150,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-19",
    title: "Northrop Grumman defense systems MRO",
    sector: "minerals-rare-earth",
    region: "Tashkent region",
    valueMusd: 75,
    status: "mou",
    partnerUs: "Northrop Grumman",
    partnerUz: "MoD",
    startYear: 2026,
    expectedCompletion: 2028,
    jobs: 100,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-20",
    title: "Cotton Inc. supply-chain traceability",
    sector: "textile",
    region: "Bukhara",
    valueMusd: 25,
    status: "operating",
    partnerUs: "Cotton Incorporated",
    partnerUz: "Uztextileprom",
    startYear: 2023,
    jobs: 80,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-21",
    title: "Merck insulin manufacturing",
    sector: "pharma",
    region: "Tashkent region",
    valueMusd: 180,
    status: "construction",
    partnerUs: "Merck & Co.",
    partnerUz: "Uzpharm",
    startYear: 2024,
    expectedCompletion: 2026,
    jobs: 220,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-22",
    title: "Black & Veatch water desalination",
    sector: "energy",
    region: "Karakalpakstan",
    valueMusd: 140,
    status: "agreed",
    partnerUs: "Black & Veatch",
    partnerUz: "Karakalpak Water Authority",
    startYear: 2025,
    expectedCompletion: 2028,
    jobs: 170,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-23",
    title: "Kinross Gold exploration JV",
    sector: "minerals-rare-earth",
    region: "Navoi",
    valueMusd: 95,
    status: "negotiation",
    partnerUs: "Kinross Gold",
    partnerUz: "UzGeo",
    startYear: 2026,
    expectedCompletion: 2028,
    jobs: 130,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-24",
    title: "Tesla EV charging network",
    sector: "automotive",
    region: "Samarkand",
    valueMusd: 30,
    status: "mou",
    partnerUs: "Tesla",
    partnerUz: "MinEnergy",
    startYear: 2026,
    expectedCompletion: 2027,
    jobs: 40,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-25",
    title: "Halliburton oilfield services",
    sector: "energy",
    region: "Bukhara",
    valueMusd: 120,
    status: "operating",
    partnerUs: "Halliburton",
    partnerUz: "Uzbekneftegaz",
    startYear: 2023,
    jobs: 250,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-26",
    title: "IBM public-sector AI cluster",
    sector: "it-digital",
    region: "Tashkent city",
    valueMusd: 45,
    status: "agreed",
    partnerUs: "IBM",
    partnerUz: "MinDigital",
    startYear: 2025,
    jobs: 65,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-27",
    title: "Chevron Phillips polyethylene",
    sector: "chemicals",
    region: "Surkhandarya",
    valueMusd: 380,
    status: "mou",
    partnerUs: "Chevron Phillips Chemical",
    partnerUz: "Uzbekneftegaz",
    startYear: 2026,
    expectedCompletion: 2030,
    jobs: 480,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-28",
    title: "Procter & Gamble consumer products",
    sector: "agri-food",
    region: "Tashkent region",
    valueMusd: 70,
    status: "construction",
    partnerUs: "P&G",
    partnerUz: "Uzbek Industries",
    startYear: 2024,
    expectedCompletion: 2026,
    jobs: 200,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-29",
    title: "Archer-Daniels-Midland grain storage",
    sector: "agri-food",
    region: "Sirdarya",
    valueMusd: 48,
    status: "agreed",
    partnerUs: "ADM",
    partnerUz: "UzAgroExport",
    startYear: 2025,
    jobs: 110,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-30",
    title: "Raytheon air-traffic radar upgrade",
    sector: "aviation",
    region: "Tashkent city",
    valueMusd: 58,
    status: "negotiation",
    partnerUs: "Raytheon",
    partnerUz: "Uzaeronavigatsiya",
    startYear: 2026,
    expectedCompletion: 2028,
    jobs: 75,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-31",
    title: "Cummins diesel engine plant",
    sector: "automotive",
    region: "Jizzakh",
    valueMusd: 130,
    status: "construction",
    partnerUs: "Cummins Inc.",
    partnerUz: "UzAuto Motors",
    startYear: 2024,
    expectedCompletion: 2026,
    jobs: 320,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-32",
    title: "Coca-Cola bottling modernization",
    sector: "agri-food",
    region: "Tashkent city",
    valueMusd: 85,
    status: "operating",
    partnerUs: "The Coca-Cola Company",
    partnerUz: "Coca-Cola Ichimligi Uzbekiston",
    startYear: 2022,
    jobs: 280,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-33",
    title: "GE Aerospace engine fleet deal",
    sector: "aviation",
    region: "Tashkent city",
    valueMusd: 1200,
    status: "mou",
    partnerUs: "GE Aerospace",
    partnerUz: "Uzbekistan Airways",
    startYear: 2026,
    expectedCompletion: 2031,
    jobs: 0,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-34",
    title: "Mastercard digital-payments hub",
    sector: "finance",
    region: "Tashkent city",
    valueMusd: 28,
    status: "operating",
    partnerUs: "Mastercard",
    partnerUz: "Central Bank of Uzbekistan",
    startYear: 2023,
    jobs: 45,
    is_demo: true,
    source_note: demo,
  },
  {
    id: "inv-35",
    title: "Visa fintech acceleration",
    sector: "finance",
    region: "Tashkent city",
    valueMusd: 22,
    status: "operating",
    partnerUs: "Visa",
    partnerUz: "Central Bank of Uzbekistan",
    startYear: 2023,
    jobs: 35,
    is_demo: true,
    source_note: demo,
  },
];

export const investmentsTotals = {
  totalProjects: investments.length,
  totalValueUsdM: investments.reduce((a, i) => a + i.valueMusd, 0),
  totalJobs: investments.reduce((a, i) => a + (i.jobs ?? 0), 0),
  is_demo: true,
};

export interface PrivatizationOpportunity {
  id: string;
  assetName: string;
  sector: InvestmentSector | "source_needed";
  location?: string;
  ownershipStatus?: string;
  transactionType?: string;
  valueRange?: string;
  stage: "source_needed" | "screening" | "preparation" | "market-sounding" | "tender" | "closed";
  timeline?: string;
  governmentCounterpart?: string;
  advisor?: string;
  investorProfile?: string;
  usCompanyRelevance?: string;
  requiredApprovals?: string[];
  riskLevel: InvestmentRiskLevel;
  sourceIds: string[];
  sourceConfidence: InvestmentSourceConfidence;
  lastUpdatedDate?: string;
  nextStep: string;
  visibility: InvestmentVisibility;
  notes?: string;
}

export const privatizationOpportunities: PrivatizationOpportunity[] = [];

export function investmentConfidence(investment: Investment): InvestmentSourceConfidence {
  if (investment.verificationStatus) return investment.verificationStatus;
  if (investment.sourceConfidence) return investment.sourceConfidence;
  if (investment.is_demo) return "illustrative_demo";
  if (!investment.sourceId && !investment.sourceIds?.length) return "source_needed";
  if (investment.sourceId === "tradegov_mining_2025") return "verified_official";
  if (investment.sourceId?.startsWith("input_")) return "internal_unverified";
  return "media_reported";
}

export interface InvestmentActionProfile {
  projectOwner: string;
  counterpart: string;
  stage: string;
  nextAction: string;
  blockers: string[];
  usCompanyRelevance: string;
  quoteSafe: boolean;
  publicationGuidance: string;
}

function statusAction(status: InvestmentStatus) {
  switch (status) {
    case "operating":
      return "Capture aftercare needs, expansion signals, and measurable outcomes.";
    case "construction":
      return "Confirm implementation milestone, permits, financing, and delivery risks.";
    case "agreed":
      return "Turn agreement into an implementation owner, timetable, and source-backed milestone.";
    case "negotiation":
      return "Clarify decision maker, commercial terms, bottlenecks, and next meeting.";
    case "mou":
      return "Convert MoU into due-diligence pack, counterpart owner, and decision deadline.";
    case "paused":
      return "Document blocker, reactivation condition, and whether the row should remain visible.";
  }
}

export function investmentActionProfile(investment: Investment): InvestmentActionProfile {
  const confidence = investmentConfidence(investment);
  const sourceBacked = confidence === "verified_official" || confidence === "company_confirmed";
  const needsSource = confidence === "source_needed" || confidence === "illustrative_demo";

  const blockers = investment.blockers?.length
    ? investment.blockers
    : needsSource
      ? ["Owner-supplied source record required", "Public briefing use not approved"]
      : confidence === "internal_unverified"
        ? ["Owner review required before external publication"]
        : [];

  return {
    projectOwner:
      investment.projectOwner ??
      (investment.is_demo ? "MIIT / UzInvest source owner needed" : investment.partnerUz || "Owner to confirm"),
    counterpart: investment.governmentCounterpart ?? investment.partnerUz,
    stage: investment.stageDetail ?? investment.status,
    nextAction: investment.nextAction ?? investment.nextStep ?? statusAction(investment.status),
    blockers,
    usCompanyRelevance:
      investment.usCompanyRelevance ??
      (investment.partnerUs.includes("under registration") || investment.partnerUs.includes("(")
        ? "U.S. company/investor fit requires owner confirmation."
        : `Relevant U.S. counterpart: ${investment.partnerUs}.`),
    quoteSafe: sourceBacked && !investment.is_demo,
    publicationGuidance: sourceBacked
      ? "Can support executive briefing when shown with source badge and as-of context."
      : investment.is_demo
        ? "Illustrative workflow row only; do not cite as a real project or official pipeline value."
        : "Useful for internal coordination; owner review and source confirmation required before publication.",
  };
}

function summarizeInvestmentSet(rows: Investment[]) {
  return {
    totalProjects: rows.length,
    totalValueUsdM: rows.reduce((a, i) => a + i.valueMusd, 0),
    totalJobs: rows.reduce((a, i) => a + (i.jobs ?? 0), 0),
  };
}

const verifiedInvestments = investments.filter((i) =>
  ["verified_official", "company_confirmed"].includes(investmentConfidence(i)),
);
const pendingInvestments = investments.filter((i) =>
  ["media_reported", "internal_unverified", "source_needed"].includes(investmentConfidence(i)),
);
const demoInvestments = investments.filter((i) => investmentConfidence(i) === "illustrative_demo");

export const investmentCredibilitySummary = {
  verified: summarizeInvestmentSet(verifiedInvestments),
  pending: summarizeInvestmentSet(pendingInvestments),
  illustrativeDemo: summarizeInvestmentSet(demoInvestments),
  mixedPortfolio: summarizeInvestmentSet(investments),
};
