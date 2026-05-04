export interface Grant {
  id: string;
  title: string;
  initiator: string;
  donor: string;
  valueMusd: number;
  sector: "health" | "education" | "military" | "water" | "agriculture" | "research" | "economy";
  region?: string;
  is_demo: boolean;
  source_url?: string;
  /** Reference into `data/sources.ts`. */
  sourceId?: string;
  status: "active" | "completed" | "planned";
  startYear?: number;
  /** Optional explanatory note (period of performance, methodology caveats, etc.). */
  note?: string;
}

export const grants: Grant[] = [
  // --- Internal-report rows (Jan 2026 UZ-side accounting) ----------------
  {
    id: "g-1",
    title: "Delivery of 2 mammographs and additional oncology equipment",
    initiator: "Ministry of Health",
    donor: "U.S. charitable organization",
    valueMusd: 0.327,
    sector: "health",
    status: "active",
    is_demo: false,
    sourceId: "input_grants_xlsx",
    startYear: 2025,
  },
  {
    id: "g-2",
    title: "Supply of medical equipment",
    initiator: "Ministry of Health",
    donor: "Abbott (USA), Grifols (Spain), Haier Biomedical (PRC)",
    valueMusd: 2.812,
    sector: "health",
    status: "active",
    is_demo: false,
    sourceId: "input_grants_xlsx",
    startYear: 2024,
  },
  {
    id: "g-3",
    title: "Bukhara State University — donor-funded projects",
    initiator: "Ministry of Higher Education; Bukhara State University",
    donor: "Japan, U.S. Embassy, DAAD, Erasmus+, China, Korea, Hungary",
    valueMusd: 0.967,
    sector: "education",
    region: "Bukhara",
    status: "active",
    is_demo: false,
    sourceId: "input_grants_xlsx",
    startYear: 2024,
  },
  {
    id: "g-4",
    title: "TIFO Aral Sea public health impact study",
    initiator: "Ministry of Health, Republic of Karakalpakstan",
    donor: "TIFO (USA)",
    valueMusd: 0.265,
    sector: "research",
    region: "Karakalpakstan",
    status: "active",
    is_demo: false,
    sourceId: "input_grants_xlsx",
    startYear: 2024,
  },
  {
    id: "g-5",
    title: "USAID Regional Water & Environment — IT equipment for Kegeyli Agro-Melioration College",
    initiator: "Kegeyli / Beruniy agro-tech colleges",
    donor: "USAID",
    valueMusd: 0.01,
    sector: "water",
    region: "Karakalpakstan",
    status: "active",
    is_demo: false,
    sourceId: "input_grants_xlsx",
    startYear: 2024,
  },
  {
    id: "g-6",
    title: "Modern medical equipment for Samarkand region clinics",
    initiator: "U.S. Embassy in Uzbekistan",
    donor: "Project C.U.R.E.",
    valueMusd: 10,
    sector: "health",
    region: "Samarkand",
    status: "active",
    is_demo: false,
    sourceId: "input_grants_xlsx",
    startYear: 2024,
  },
  {
    id: "g-7",
    title: "Technical assistance programme for the Armed Forces of the Republic of Uzbekistan",
    initiator: "Ministry of Defence; U.S. Embassy",
    donor: "U.S. Congress",
    valueMusd: 1,
    sector: "military",
    status: "active",
    is_demo: false,
    sourceId: "input_grants_xlsx",
    startYear: 2024,
  },

  // --- Major U.S.-side programs (USAID / State / DOAG) -------------------
  // These are *cumulative or multi-year obligated* amounts from US-side
  // accounting (ForeignAssistance.gov / USAID Mission). They overlap in
  // theme with the UZ-side rows above but use different methodology, so
  // both views are kept and labeled.
  {
    id: "g-usaid-doag-edu",
    title: "USAID DOAG — Ministry of Preschool & School Education partnership",
    initiator: "Ministry of Preschool & School Education; U.S. Embassy",
    donor: "USAID",
    valueMusd: 47,
    sector: "education",
    status: "active",
    is_demo: false,
    sourceId: "foreign_assistance_gov",
    source_url: "https://uz.usembassy.gov/new-grant-opportunity-to-boost-key-sectors-in-uzbekistan/",
    startYear: 2018,
    note: "Cumulative DOAG investment; latest $6.1M tranche announced Sept 2024.",
  },
  {
    id: "g-usaid-wave",
    title: "USAID WAVE — Regional Water and Vulnerable Environment Activity",
    initiator: "Government of Uzbekistan + Central Asia regional partners",
    donor: "USAID",
    valueMusd: 21.5,
    sector: "water",
    region: "Karakalpakstan / Multi-region",
    status: "active",
    is_demo: false,
    sourceId: "usaid_wave",
    source_url: "https://pdf.usaid.gov/pdf_docs/PA00ZQVJ.pdf",
    startYear: 2020,
    note: "Five-year regional activity 2020–2025 covering Central Asia, including Uzbekistan workstreams.",
  },
  {
    id: "g-usaid-business-support",
    title: "USAID Business Support Project — SME competitiveness",
    initiator: "U.S. Embassy + Uzbek private sector partners",
    donor: "USAID",
    valueMusd: 17.7,
    sector: "economy",
    status: "active",
    is_demo: false,
    sourceId: "foreign_assistance_gov",
    source_url: "https://uz.usembassy.gov/new-project-to-support-businesses-in-uzbekistan/",
    startYear: 2024,
    note: "Five-year program 2024–2029 supporting ICT, tourism, textiles, and the green economy.",
  },
  {
    id: "g-usaid-eras-ii",
    title: "USAID ERAS II — Environment Restoration of the Aral Sea II",
    initiator: "Ministry of Health of Karakalpakstan + local partners",
    donor: "USAID",
    valueMusd: 1.65,
    sector: "water",
    region: "Muynak, Karakalpakstan",
    status: "active",
    is_demo: false,
    sourceId: "usaid_eras_ii",
    source_url:
      "https://www.usaid.gov/sites/default/files/2022-10/ERAS_II_-_USAID_Environment_Restoration_of_the_Aral_Sea_II_-_ENG_factsheet.docx.pdf",
    startYear: 2022,
    note: "Three-year activity 2022–2025 focused on Aral Sea restoration and community resilience.",
  },
];

export const grantsMeta = {
  total: grants.reduce((a, g) => a + g.valueMusd, 0),
  source: "Internal report (07.01.2026) + USAID programs (US-side accounting)",
  sourceId: "foreign_assistance_gov",
  is_demo: false,
};
