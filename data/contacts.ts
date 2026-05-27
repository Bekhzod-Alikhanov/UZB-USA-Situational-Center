export interface Contact {
  id: string;
  org: string;
  type: "hq" | "embassy-uz-in-us" | "embassy-us-in-uz" | "chamber" | "gov-agency" | "council";
  addressLines: string[];
  phones?: string[];
  emails?: string[];
  web?: string;
  people?: { name: string; role: string; side?: "uz" | "us"; is_demo: boolean }[];
  is_demo: boolean;
  source_url?: string;
  /** Reference into `data/sources.ts`. */
  sourceId?: string;
}

export const contacts: Contact[] = [
  {
    id: "k-hq",
    org: "Situational Center on Uzbekistan–USA cooperation (HQ)",
    type: "hq",
    addressLines: ["1 Mustakillik Maydoni", "Tashkent, 100159"],
    phones: ["+998 71 000 00 00"],
    emails: ["sc-us@mfa.uz"],
    people: [
      // Official Center roster (per HR Штаба, April 2026).
      { name: "Bekzod Bahodirov", role: "Head of the Center", is_demo: false },
      { name: "A. Abdukodirov", role: "Coordinator", is_demo: false },
      { name: "Behzodkhon Alikhanov", role: "Consultant", is_demo: false },
      { name: "Mardon Fayzullaev", role: "Consultant", is_demo: false },
      { name: "Alisher Alimov", role: "Consultant", is_demo: false },
    ],
    is_demo: false,
  },
  {
    id: "k-emb-uz",
    org: "Embassy of the Republic of Uzbekistan in Washington",
    type: "embassy-uz-in-us",
    addressLines: ["1746 Massachusetts Avenue NW", "Washington, DC 20036"],
    phones: ["+1 202 887 5300", "Emergency: +1 202 251 8298"],
    emails: ["info.washington@mfa.uz"],
    web: "https://uzbekistan.org",
    people: [
      { name: "Furkat Siddikov", role: "Ambassador", side: "uz", is_demo: false },
      { name: "Alisher Akhmedov", role: "Embassy senior staff", side: "uz", is_demo: false },
      { name: "Okil Ubaydullaev", role: "Embassy senior staff", side: "uz", is_demo: false },
      { name: "Bobur Rahmonov", role: "Embassy staff", side: "uz", is_demo: false },
      { name: "Jamshidjon Khayrullaev", role: "Embassy staff", side: "uz", is_demo: false },
    ],
    is_demo: false,
    sourceId: "uzbek_embassy_dc",
    source_url: "https://uzbekistan.org/contact-us/",
  },
  {
    id: "k-emb-us",
    org: "Embassy of the United States of America in Tashkent",
    type: "embassy-us-in-uz",
    addressLines: ["5th Block, Yunusobod District", "Tashkent, 100093"],
    phones: ["+998 78 120 5450"],
    emails: ["TashkentInfo@state.gov"],
    web: "https://uz.usembassy.gov",
    people: [
      { name: "Jonathan Henick", role: "Ambassador", side: "us", is_demo: false },
      { name: "Heather Byrnes", role: "Senior diplomatic staff", side: "us", is_demo: false },
    ],
    is_demo: false,
    sourceId: "us_embassy_tashkent",
    source_url: "https://uz.usembassy.gov/contact/",
  },
  {
    id: "k-commercial-service",
    org: "U.S. Commercial Service / Embassy commercial-economic team",
    type: "gov-agency",
    addressLines: ["U.S. Embassy Tashkent + partner posts"],
    web: "https://www.trade.gov/uzbekistan-country-commercial-guide",
    people: [
      { name: "Daniel Hall", role: "Commercial Service team", side: "us", is_demo: false },
      { name: "Makhmud Abdusatarov", role: "Commercial Service team", side: "us", is_demo: false },
      { name: "Jimmy Church", role: "Commercial Service team", side: "us", is_demo: false },
      { name: "Naz Demirdoven", role: "Commercial Service team", side: "us", is_demo: false },
    ],
    is_demo: false,
    sourceId: "tradegov_market_opportunities",
  },
  {
    id: "k-aucc",
    org: "American–Uzbekistan Chamber of Commerce (AUCC)",
    type: "chamber",
    addressLines: ["2020 Pennsylvania Ave NW #274", "Washington, DC 20006"],
    phones: ["+1 202 509 3744"],
    emails: ["info@aucconline.com"],
    web: "https://aucconline.com",
    people: [{ name: "Carolyn B. Lamm", role: "Co-founder & senior counsel", side: "us", is_demo: false }],
    is_demo: false,
    sourceId: "aucc_online",
    source_url: "https://aucconline.com/",
  },
  {
    id: "k-invest-uz",
    org: "Invest Uzbekistan / Investment Promotion Agency",
    type: "gov-agency",
    addressLines: ["13 Amir Temur Avenue", "Tashkent, 100060"],
    phones: ["+998 71 202 02 10 ext. 402"],
    emails: ["uzipa@invest.gov.uz", "info@invest.gov.uz"],
    web: "https://invest.gov.uz",
    is_demo: false,
    sourceId: "invest_uzbekistan",
  },
  {
    id: "k-miit",
    org: "Ministry of Investments, Industry and Trade (MIIT) — operational entry point",
    type: "gov-agency",
    addressLines: ["Tashkent"],
    phones: ["+998 71 238 50 05", "Trust line: +998 71 238 50 00"],
    web: "https://miit.uz",
    is_demo: false,
    sourceId: "input_deep_review_docx",
  },
  {
    id: "k-pp314-group",
    org: "ПП-314 Coordination Group for state-region pairings",
    type: "council",
    addressLines: ["MFA — Department of Americas"],
    people: [{ name: "Staff Lead 1", role: "Coordinator", is_demo: true }],
    is_demo: true,
  },
  {
    id: "k-usuz-council",
    org: "American–Uzbek Business and Investment Council",
    type: "council",
    addressLines: ["Tashkent — Washington, DC"],
    web: "https://us-uz.gov.uz/en/about/council",
    people: [
      { name: "Saida Mirziyoyeva", role: "Co-Chair (Uzbek side)", side: "uz", is_demo: false },
      {
        name: "Komil Allamjonov",
        role: "Special Envoy; Advisor to the Head of the Administration of the President",
        side: "uz",
        is_demo: false,
      },
      { name: "Nozima Davletova", role: "Head of Council Secretariat", side: "uz", is_demo: false },
      {
        name: "Timur Ishmetov",
        role: "Chairman, Central Bank of the Republic of Uzbekistan",
        side: "uz",
        is_demo: false,
      },
      {
        name: "Shukhrat Vafaev",
        role: "Executive Director, Fund for Reconstruction and Development of Uzbekistan",
        side: "uz",
        is_demo: false,
      },
      { name: "Laziz Kudratov", role: "Minister of Investments, Industry and Trade", side: "uz", is_demo: false },
      { name: "Bobir Islamov", role: "Minister of Mining Industry and Geology", side: "uz", is_demo: false },
      { name: "Furkat Siddikov", role: "Ambassador of Uzbekistan to the United States", side: "uz", is_demo: false },
      {
        name: "David L. Fogel",
        role: "Assistant Secretary of Commerce; Director General, U.S. and Foreign Commercial Service",
        side: "us",
        is_demo: false,
      },
      {
        name: "Isabel Galdiz",
        role: "Vice President, International Relations Division, EXIM",
        side: "us",
        is_demo: false,
      },
      { name: "Bethany Brez", role: "Vice President, Office of Foreign Policy, DFC", side: "us", is_demo: false },
      {
        name: "Caleb Orr",
        role: "Assistant Secretary of State for Economic, Energy, and Business Affairs",
        side: "us",
        is_demo: false,
      },
      { name: "Jonathan Henick", role: "Ambassador of the United States to Uzbekistan", side: "us", is_demo: false },
    ],
    is_demo: false,
    sourceId: "us_uz_council",
    source_url: "https://us-uz.gov.uz/en/about/council",
  },
];
