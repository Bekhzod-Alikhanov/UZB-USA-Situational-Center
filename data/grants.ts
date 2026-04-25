export interface Grant {
  id: string;
  title: string;
  initiator: string;
  donor: string;
  valueMusd: number;
  sector: "health" | "education" | "military" | "water" | "agriculture" | "research";
  region?: string;
  is_demo: boolean;
  source_url?: string;
  /** Reference into `data/sources.ts`. */
  sourceId?: string;
  status: "active" | "completed" | "planned";
  startYear?: number;
}

export const grants: Grant[] = [
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
];

export const grantsMeta = {
  total: grants.reduce((a, g) => a + g.valueMusd, 0),
  source: "Internal report — Grants to the Republic of Uzbekistan as of 07.01.2026",
  sourceId: "input_grants_xlsx",
  is_demo: false,
};
