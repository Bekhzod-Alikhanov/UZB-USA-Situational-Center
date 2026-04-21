export interface Contact {
  id: string;
  org: string;
  type: "hq" | "embassy-uz-in-us" | "embassy-us-in-uz" | "chamber" | "gov-agency" | "council";
  addressLines: string[];
  phones?: string[];
  emails?: string[];
  web?: string;
  people?: { name: string; role: string; is_demo: boolean }[];
  is_demo: boolean;
  source_url?: string;
}

export const contacts: Contact[] = [
  {
    id: "k-hq",
    org: "Situational Center on Uzbekistan–USA cooperation (HQ)",
    type: "hq",
    addressLines: ["Presidential Administration of the Republic of Uzbekistan", "1 Mustakillik Maydoni", "Tashkent, 100159"],
    phones: ["+998 71 000 00 00"],
    emails: ["sc-us@mfa.uz"],
    people: [
      { name: "E. Umurzakov", role: "Head of the Center", is_demo: false },
      { name: "A. Abdukodirov", role: "Deputy Head", is_demo: false },
      { name: "Staff Member 1", role: "Project analyst", is_demo: true },
      { name: "Staff Member 2", role: "Trade analyst", is_demo: true },
      { name: "Staff Member 3", role: "Investment analyst", is_demo: true },
      { name: "Staff Member 4", role: "Protocol & scheduling", is_demo: true },
      { name: "Staff Member 5", role: "Data & analytics", is_demo: true },
      { name: "Staff Member 6", role: "Legal analyst", is_demo: true },
      { name: "Staff Member 7", role: "Visit preparation", is_demo: true },
      { name: "Staff Member 8", role: "Event management", is_demo: true },
      { name: "Staff Member 9", role: "Communications", is_demo: true },
      { name: "Staff Member 10", role: "Foreign affairs officer", is_demo: true },
    ],
    is_demo: false,
  },
  {
    id: "k-emb-uz",
    org: "Embassy of the Republic of Uzbekistan in the USA",
    type: "embassy-uz-in-us",
    addressLines: ["1746 Massachusetts Ave NW", "Washington, DC 20036"],
    phones: ["+1 202 887 5300"],
    emails: ["info@uzbekistan.org"],
    web: "https://www.uzbekistan.org",
    is_demo: false,
    source_url: "https://www.uzbekistan.org",
  },
  {
    id: "k-emb-us",
    org: "Embassy of the United States of America in Uzbekistan",
    type: "embassy-us-in-uz",
    addressLines: ["3 Moyqorghon St., 5th Block", "Tashkent, 100093"],
    phones: ["+998 78 120 5450"],
    web: "https://uz.usembassy.gov",
    is_demo: false,
    source_url: "https://uz.usembassy.gov",
  },
  {
    id: "k-aucc",
    org: "American–Uzbekistan Chamber of Commerce (AUCC)",
    type: "chamber",
    addressLines: ["Washington, DC"],
    web: "https://www.aucconline.com",
    is_demo: false,
    source_url: "https://www.aucconline.com",
  },
  {
    id: "k-pp314-group",
    org: "ПП-314 Coordination Group for state-region pairings",
    type: "council",
    addressLines: ["MFA — Department of Americas"],
    people: [
      { name: "Staff Lead 1", role: "Coordinator", is_demo: true },
    ],
    is_demo: true,
  },
  {
    id: "k-usuz-council",
    org: "US–Uzbekistan Business & Investment Council",
    type: "council",
    addressLines: ["Tashkent — Washington"],
    is_demo: false,
  },
];
