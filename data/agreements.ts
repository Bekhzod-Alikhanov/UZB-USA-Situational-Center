export type AgreementCategory = "interstate" | "intergov" | "interagency" | "other" | "invest";
export type AgreementSphere =
  | "political"
  | "economy-trade"
  | "investment"
  | "finance"
  | "energy"
  | "minerals"
  | "agriculture"
  | "education"
  | "healthcare"
  | "it-digital"
  | "transport"
  | "defense"
  | "humanitarian"
  | "other";

export interface Agreement {
  id: string;
  title: string;
  category: AgreementCategory;
  sphere: AgreementSphere;
  signedOn: string;
  signedBy: { uz: string; us: string };
  status: "in-force" | "signed" | "pending" | "expired" | "signed-not-in-force";
  textRefBy?: "MFA of Uzbekistan";
  is_demo: boolean;
  /** Reference into `data/sources.ts`. */
  sourceId?: string;
  /** Optional descriptive note. */
  note?: string;
}

export const agreementsAggregate = {
  totalDocuments: 138,
  totalInvestAgreements: 16,
  byCategory: { interstate: 1, intergov: 71, interagency: 44, other: 22 } as Record<AgreementCategory, number>,
  source: "MFA of the Republic of Uzbekistan",
  sourceId: "input_agreements_docx",
  is_demo: false,
};

const sign = (uz: string, us: string) => ({ uz, us });

export const agreements: Agreement[] = [
  {
    id: "a-1992-relations",
    title: "Establishment of diplomatic relations",
    category: "interstate",
    sphere: "political",
    signedOn: "1992-02-19",
    signedBy: sign("President of Uzbekistan", "U.S. Secretary of State"),
    status: "in-force",
    is_demo: false,
    sourceId: "state_history_uz",
    note: "UZ-side legal framework for diplomatic missions: lex.uz №649-XII (03.07.1992) https://lex.uz/ru/docs/19509",
  },
  {
    id: "a-1993-embassy-dc",
    title: "Opening of the Embassy of Uzbekistan in the United States",
    category: "interstate",
    sphere: "political",
    signedOn: "1993-05-10",
    signedBy: sign("Cabinet of Ministers of Uzbekistan", "—"),
    status: "in-force",
    is_demo: false,
    sourceId: "lex_uz_embassy_us_1993",
    note: "Cabinet of Ministers Resolution №212 (10.05.1993) establishing the UZ Embassy in Washington, DC.",
  },
  {
    id: "a-2025-visa-free-us",
    title: "30-day visa-free regime for U.S. citizens",
    category: "interstate",
    sphere: "political",
    signedOn: "2025-11-03",
    signedBy: sign("President of Uzbekistan", "—"),
    status: "in-force",
    is_demo: false,
    sourceId: "lex_uz_visa_free_2025",
    note: "Presidential Decree УП-203 (03.11.2025); 30-day visa-free entry for U.S. citizens, effective 1 January 2026.",
  },
  {
    id: "a-1994-bit",
    title: "U.S.-Uzbekistan Bilateral Investment Treaty (BIT)",
    category: "interstate",
    sphere: "investment",
    signedOn: "1994-12-16",
    signedBy: sign("Government of Uzbekistan", "Government of the United States"),
    status: "signed-not-in-force",
    is_demo: false,
    sourceId: "input_deep_review_docx",
    note: "BIT signed but did not enter into force.",
  },
  {
    id: "a-2002-strategic-framework",
    title: "Declaration on Strategic Partnership and Cooperation Framework",
    category: "intergov",
    sphere: "political",
    signedOn: "2002-03-12",
    signedBy: sign("Government of Uzbekistan", "U.S. Department of State"),
    status: "in-force",
    is_demo: false,
    sourceId: "input_deep_review_docx",
    note: "Core political-economic framework document in the bilateral legal base.",
  },
  {
    id: "a-2004-tifa",
    title: "U.S.-Central Asian Trade and Investment Framework Agreement (TIFA)",
    category: "intergov",
    sphere: "economy-trade",
    signedOn: "2004-06-01",
    signedBy: sign("Central Asia signatories", "USTR"),
    status: "in-force",
    is_demo: false,
    sourceId: "tradegov_agreements",
    note: "Regional TIFA covering the United States and Central Asian countries, including Uzbekistan.",
  },
  {
    id: "a-2018-strategic-partnership",
    title: "Joint Statement on Strategic Partnership",
    category: "intergov",
    sphere: "political",
    signedOn: "2018-05-16",
    signedBy: sign("President Mirziyoyev", "President Trump"),
    status: "in-force",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "a-2021-strategic-dialogue",
    title: "Memorandum on Strategic Partnership Dialogue",
    category: "intergov",
    sphere: "political",
    signedOn: "2021-12-01",
    signedBy: sign("MFA of Uzbekistan", "U.S. Department of State"),
    status: "in-force",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "a-2024-customs-maa",
    title: "Customs Mutual Assistance Agreement",
    category: "interagency",
    sphere: "economy-trade",
    signedOn: "2024-09-01",
    signedBy: sign("State Customs Committee", "U.S. Customs and Border Protection"),
    status: "in-force",
    is_demo: false,
    sourceId: "input_deep_review_docx",
    note: "Major step forward in the 2024 Strategic Partnership Dialogue.",
  },
  {
    id: "a-2024-critical-minerals-mou",
    title: "Critical Minerals MOU",
    category: "intergov",
    sphere: "minerals",
    signedOn: "2024-09-01",
    signedBy: sign("MFA of Uzbekistan", "U.S. Department of State"),
    status: "in-force",
    is_demo: false,
    sourceId: "input_deep_review_docx",
    note: "Part of the 2024-2026 critical-minerals cooperation agenda.",
  },
  {
    id: "a-2024-minerals-dialogue",
    title: "Launch of the Critical Minerals Dialogue (C5+1)",
    category: "intergov",
    sphere: "minerals",
    signedOn: "2024-02-01",
    signedBy: sign("MFA of Uzbekistan", "U.S. Department of State"),
    status: "in-force",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "a-2024-wto-market-access",
    title: "Completion of bilateral WTO market-access negotiations",
    category: "intergov",
    sphere: "economy-trade",
    signedOn: "2024-12-19",
    signedBy: sign("Government of Uzbekistan", "USTR"),
    status: "in-force",
    is_demo: false,
    sourceId: "ustr_wto_2024",
    note: "USTR announced completion of bilateral market-access negotiations on goods and services.",
  },
  {
    id: "a-2025-exim-buy-american",
    title: "EXIM \"Buy American, Build the Future\" framework",
    category: "intergov",
    sphere: "finance",
    signedOn: "2025-11-10",
    signedBy: sign("Government of Uzbekistan", "Export-Import Bank of the United States"),
    status: "in-force",
    is_demo: false,
    sourceId: "exim_buy_american",
    note: "Framework focused on infrastructure, energy, aviation, minerals, and advanced technologies.",
  },
  {
    id: "a-2026-investment-platform",
    title: "Agreement on the Establishment of an Investment Platform",
    category: "intergov",
    sphere: "investment",
    signedOn: "2026-02-18",
    signedBy: sign("Government of Uzbekistan", "Government of the United States"),
    status: "in-force",
    is_demo: false,
    sourceId: "input_deep_review_docx",
    note: "Exchanged during the February 2026 Washington visit.",
  },
  {
    id: "a-2026-dfc-framework",
    title: "Heads of Terms / Joint Investment Framework intent (DFC)",
    category: "intergov",
    sphere: "investment",
    signedOn: "2026-02-18",
    signedBy: sign("Government of Uzbekistan", "U.S. International Development Finance Corporation"),
    status: "signed",
    is_demo: false,
    sourceId: "dfc_joint_framework",
    note: "Intent to establish a Joint Investment Framework, with possible joint holding company.",
  },
  {
    id: "a-2026-minerals-mou",
    title: "MoU on supply-chain resilience — critical minerals and rare earths",
    category: "intergov",
    sphere: "minerals",
    signedOn: "2026-02-04",
    signedBy: sign("FM Saidov", "U.S. Department of State"),
    status: "in-force",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "a-demo-tax-dta",
    title: "Double Taxation Avoidance Agreement (DTA) — modernization",
    category: "intergov",
    sphere: "finance",
    signedOn: "2024-11-13",
    signedBy: sign("Ministry of Finance", "U.S. Department of the Treasury"),
    status: "signed",
    is_demo: true,
  },
  {
    id: "a-demo-gsp",
    title: "Agreement on Generalized System of Preferences (GSP)",
    category: "intergov",
    sphere: "economy-trade",
    signedOn: "2021-03-01",
    signedBy: sign("MFA", "USTR"),
    status: "in-force",
    is_demo: true,
  },
  {
    id: "a-demo-air-services",
    title: "Open Skies / Air Services Agreement",
    category: "intergov",
    sphere: "transport",
    signedOn: "2019-10-01",
    signedBy: sign("MoT", "DoT"),
    status: "in-force",
    is_demo: true,
  },
  {
    id: "a-demo-usaid-health",
    title: "USAID Country Development Cooperation Strategy 2022–2027",
    category: "interagency",
    sphere: "humanitarian",
    signedOn: "2022-06-01",
    signedBy: sign("MFA", "USAID"),
    status: "in-force",
    is_demo: true,
  },
  {
    id: "a-demo-customs",
    title: "Cooperation in customs matters",
    category: "interagency",
    sphere: "economy-trade",
    signedOn: "2018-05-16",
    signedBy: sign("State Customs Committee", "CBP"),
    status: "in-force",
    is_demo: true,
  },
  {
    id: "a-demo-ifdc",
    title: "International Finance Development Cooperation (DFC) framework",
    category: "intergov",
    sphere: "investment",
    signedOn: "2023-09-20",
    signedBy: sign("MIIT", "DFC"),
    status: "in-force",
    is_demo: true,
  },
  {
    id: "a-demo-fbi-law",
    title: "Law-enforcement cooperation MoU",
    category: "interagency",
    sphere: "other",
    signedOn: "2019-03-01",
    signedBy: sign("MVD of Uzbekistan", "FBI"),
    status: "in-force",
    is_demo: true,
  },
  {
    id: "a-demo-export-import",
    title: "EXIM Bank general financing framework",
    category: "intergov",
    sphere: "finance",
    signedOn: "2023-11-07",
    signedBy: sign("MoF", "EXIM Bank"),
    status: "in-force",
    is_demo: true,
  },
  {
    id: "a-demo-fulbright",
    title: "Fulbright academic exchange MoU (renewal)",
    category: "interagency",
    sphere: "education",
    signedOn: "2023-02-28",
    signedBy: sign("Ministry of Higher Education", "State Department / ECA"),
    status: "in-force",
    is_demo: true,
  },
  {
    id: "a-demo-usda",
    title: "Cooperation in agriculture and food safety",
    category: "interagency",
    sphere: "agriculture",
    signedOn: "2022-04-01",
    signedBy: sign("MinAgri of Uzbekistan", "USDA"),
    status: "in-force",
    is_demo: true,
  },
];

export function byCategoryCount(): Record<AgreementCategory, number> {
  return agreements.reduce<Record<AgreementCategory, number>>(
    (acc, a) => {
      acc[a.category] = (acc[a.category] ?? 0) + 1;
      return acc;
    },
    { interstate: 0, intergov: 0, interagency: 0, other: 0, invest: 0 },
  );
}
