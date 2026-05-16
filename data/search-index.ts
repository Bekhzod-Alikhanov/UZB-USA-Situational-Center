/**
 * Compact command-search projection.
 *
 * Keep this file free of imports from full data modules so the lazy command
 * palette does not bundle every dashboard dataset just to search names.
 */
export interface SearchProjection {
  id: string;
  title: string;
  subtitle: string;
}

export const searchVisits: SearchProjection[] = [
  {
    id: "v-2025-03-miller",
    title: "Congresswoman Carol Miller visits Uzbekistan",
    subtitle: "2025-03-16 · congress",
  },
  {
    id: "v-2025-04-saidov",
    title: "FM Bakhtiyor Saidov visits Washington",
    subtitle: "2025-04-08 · minister",
  },
  {
    id: "v-2025-08-zampolli",
    title: "Special Envoy Paolo Zampolli visits Uzbekistan",
    subtitle: "2025-08-28 · minister",
  },
  {
    id: "v-2025-09-unga",
    title: "Bilateral meeting at 80th UNGA",
    subtitle: "2025-09-23 · president",
  },
  {
    id: "v-2025-10-gor-landau",
    title: "SPE Sergio Gor + DepSecState Christopher Landau",
    subtitle: "2025-10-25 · minister",
  },
  {
    id: "v-2025-11-c5-1",
    title: "President Mirziyoyev — C5+1 Summit in Washington",
    subtitle: "2025-11-04 · president",
  },
  {
    id: "v-2025-11-adams",
    title: "NYC Mayor Eric Adams visits Uzbekistan",
    subtitle: "2025-11-19 · governor",
  },
  {
    id: "v-2025-11-utah",
    title: "Utah delegation (Elder Bednar, Stirling Foundation)",
    subtitle: "2025-11-11 · business",
  },
  {
    id: "v-2025-11-miit",
    title: "Minister of Investment, Industry and Trade visits USA",
    subtitle: "2025-11-24 · minister",
  },
  {
    id: "v-2026-01-davos",
    title: "Signing of the Charter of the Council of Peace",
    subtitle: "2026-01-22 · president",
  },
  {
    id: "v-2026-02-04-minerals",
    title: "Critical Minerals Ministerial — MoU signed",
    subtitle: "2026-02-04 · minister",
  },
  {
    id: "v-2026-02-06-gor",
    title: "SPE Sergio Gor visit — 1st US-UZ Business & Investment Council",
    subtitle: "2026-02-06 · minister",
  },
  {
    id: "v-2026-02-17-state",
    title: "President Mirziyoyev — working visit to Washington (Council of Peace inaugural session)",
    subtitle: "2026-02-17 · president",
  },
  {
    id: "v-2026-04-upcoming-council",
    title: "Full first session of US-UZ Business & Investment Council (planned)",
    subtitle: "2026-04-15 · business",
  },
];

export const searchCounterparts: SearchProjection[] = [
  {
    id: "c-trump",
    title: "Donald J. Trump",
    subtitle: "President of the United States (47th)",
  },
  {
    id: "c-rubio",
    title: "Marco Rubio",
    subtitle: "Secretary of State",
  },
  {
    id: "c-waltz",
    title: "Michael Waltz",
    subtitle: "National Security Advisor",
  },
  {
    id: "c-gor",
    title: "Sergio Gor",
    subtitle: "Special Presidential Envoy for South & Central Asia",
  },
  {
    id: "c-landau",
    title: "Christopher Landau",
    subtitle: "Deputy Secretary of State",
  },
  {
    id: "c-zampolli",
    title: "Paolo Zampolli",
    subtitle: "Special Envoy for Global Partnerships",
  },
  {
    id: "c-meyer",
    title: "Elizabeth Meyer",
    subtitle: "Acting Assistant Secretary, Bureau of South & Central Asian Affairs",
  },
  {
    id: "c-power",
    title: "Samantha Power",
    subtitle: "Former USAID Administrator (2021–2025)",
  },
  {
    id: "c-fogel",
    title: "David L. Fogel",
    subtitle: "Assistant Secretary of Commerce; Director General, U.S. and Foreign Commercial Service",
  },
  {
    id: "c-galdiz",
    title: "Isabel Galdiz",
    subtitle: "Vice President, International Relations Division, EXIM Bank",
  },
  {
    id: "c-brez",
    title: "Bethany Brez",
    subtitle: "Vice President, Office of Foreign Policy, DFC",
  },
  {
    id: "c-orr",
    title: "Caleb Orr",
    subtitle: "Assistant Secretary of State for Economic, Energy, and Business Affairs",
  },
  {
    id: "c-henick",
    title: "Jonathan Henick",
    subtitle: "U.S. Ambassador to Uzbekistan",
  },
  {
    id: "c-adams-nyc",
    title: "Eric Adams",
    subtitle: "Mayor of New York City",
  },
  {
    id: "c-adams-sen",
    title: "J. Stuart Adams",
    subtitle: "President of the Utah State Senate",
  },
  {
    id: "c-daines",
    title: "Steve Daines",
    subtitle: "U.S. Senator",
  },
  {
    id: "c-rogers",
    title: "Mike Rogers",
    subtitle: "U.S. Representative — Chair, House Armed Services Committee",
  },
  {
    id: "c-miller",
    title: "Carol Miller",
    subtitle: "U.S. Representative",
  },
  {
    id: "c-gonzalez",
    title: "Vicente Gonzalez",
    subtitle: "U.S. Representative — Co-chair, Uzbekistan Caucus",
  },
  {
    id: "c-kelly",
    title: "Trent Kelly",
    subtitle: "U.S. Representative — Co-chair, Uzbekistan Caucus",
  },
];

export const searchInvestments: SearchProjection[] = [
  {
    id: "real-air-products-gtl",
    title: "Air Products — Uzbekistan GTL industrial gas complex",
    subtitle: "energy · Kashkadarya",
  },
  {
    id: "real-air-products-fergana-h2",
    title: "Air Products — Fergana Refinery hydrogen assets",
    subtitle: "energy · Fergana",
  },
  {
    id: "real-air-products-navoiy-co2",
    title: "Air Products — food-grade liquid CO₂ facility",
    subtitle: "chemicals · Navoi",
  },
  {
    id: "real-coca-cola-expansion",
    title: "Coca-Cola Bottlers Uzbekistan — Samarkand & Namangan expansion",
    subtitle: "agri-food · Samarkand / Namangan",
  },
  {
    id: "real-franklin-templeton-uznif",
    title: "Franklin Templeton — UzNIF investment management mandate",
    subtitle: "finance · Tashkent city (national)",
  },
  {
    id: "real-traxys-critical-minerals",
    title: "Traxys & partners — critical-minerals project portfolio",
    subtitle: "minerals-rare-earth · Multi-region (working group)",
  },
  {
    id: "real-mining-metallurgy-850",
    title: "Mining & metallurgy package (top portfolio item)",
    subtitle: "mining-metals · To be confirmed",
  },
  {
    id: "real-mining-metallurgy-200",
    title: "Mining & metallurgy package (secondary)",
    subtitle: "mining-metals · To be confirmed",
  },
  {
    id: "real-gf6-css-prime",
    title: "GF-6 transmission parts + CSS Prime engine cylinder-head localization",
    subtitle: "automotive · To be confirmed",
  },
  {
    id: "real-ai-digital-fund",
    title: "Joint investment fund for AI and digital-tech startups",
    subtitle: "it-digital · Tashkent city (national)",
  },
  {
    id: "inv-1",
    title: "Tungsten / molybdenum concentrate JV",
    subtitle: "minerals-rare-earth · Navoi",
  },
  {
    id: "inv-2",
    title: "Copper downstream processing line",
    subtitle: "mining-metals · Tashkent region",
  },
  {
    id: "inv-3",
    title: "Boeing 787 MRO facility",
    subtitle: "aviation · Tashkent city",
  },
  {
    id: "inv-4",
    title: "John Deere precision agriculture hub",
    subtitle: "agri-food · Fergana",
  },
  {
    id: "inv-5",
    title: "GE Vernova 450 MW combined-cycle",
    subtitle: "energy · Surkhandarya",
  },
  {
    id: "inv-6",
    title: "Pfizer cold-chain pharma distribution",
    subtitle: "pharma · Tashkent city",
  },
  {
    id: "inv-7",
    title: "Amazon Web Services regional edge",
    subtitle: "it-digital · Tashkent city",
  },
  {
    id: "inv-8",
    title: "Cargill corn oil refinery",
    subtitle: "agri-food · Jizzakh",
  },
  {
    id: "inv-9",
    title: "Honeywell airport control modernization",
    subtitle: "aviation · Tashkent city",
  },
  {
    id: "inv-10",
    title: "Ford Transit assembly line",
    subtitle: "automotive · Andijan",
  },
  {
    id: "inv-11",
    title: "Air Products hydrogen facility",
    subtitle: "energy · Navoi",
  },
  {
    id: "inv-12",
    title: "Stirling Foundation medical centre",
    subtitle: "pharma · Tashkent city",
  },
  {
    id: "inv-13",
    title: "Caterpillar mining fleet supply",
    subtitle: "mining-metals · Navoi",
  },
  {
    id: "inv-14",
    title: "Microsoft Azure government cloud",
    subtitle: "it-digital · Tashkent city",
  },
  {
    id: "inv-15",
    title: "Dow Chemical polymer plant",
    subtitle: "chemicals · Kashkadarya",
  },
  {
    id: "inv-16",
    title: "Bechtel highway modernization PPP",
    subtitle: "energy · Samarkand",
  },
  {
    id: "inv-17",
    title: "Citi trade finance platform",
    subtitle: "finance · Tashkent city",
  },
  {
    id: "inv-18",
    title: "Pratt & Whitney engine servicing",
    subtitle: "aviation · Tashkent city",
  },
  {
    id: "inv-19",
    title: "Northrop Grumman defense systems MRO",
    subtitle: "minerals-rare-earth · Tashkent region",
  },
  {
    id: "inv-20",
    title: "Cotton Inc. supply-chain traceability",
    subtitle: "textile · Bukhara",
  },
  {
    id: "inv-21",
    title: "Merck insulin manufacturing",
    subtitle: "pharma · Tashkent region",
  },
  {
    id: "inv-22",
    title: "Black & Veatch water desalination",
    subtitle: "energy · Karakalpakstan",
  },
  {
    id: "inv-23",
    title: "Kinross Gold exploration JV",
    subtitle: "minerals-rare-earth · Navoi",
  },
  {
    id: "inv-24",
    title: "Tesla EV charging network",
    subtitle: "automotive · Samarkand",
  },
  {
    id: "inv-25",
    title: "Halliburton oilfield services",
    subtitle: "energy · Bukhara",
  },
  {
    id: "inv-26",
    title: "IBM public-sector AI cluster",
    subtitle: "it-digital · Tashkent city",
  },
  {
    id: "inv-27",
    title: "Chevron Phillips polyethylene",
    subtitle: "chemicals · Surkhandarya",
  },
  {
    id: "inv-28",
    title: "Procter & Gamble consumer products",
    subtitle: "agri-food · Tashkent region",
  },
  {
    id: "inv-29",
    title: "Archer-Daniels-Midland grain storage",
    subtitle: "agri-food · Sirdarya",
  },
  {
    id: "inv-30",
    title: "Raytheon air-traffic radar upgrade",
    subtitle: "aviation · Tashkent city",
  },
  {
    id: "inv-31",
    title: "Cummins diesel engine plant",
    subtitle: "automotive · Jizzakh",
  },
  {
    id: "inv-32",
    title: "Coca-Cola bottling modernization",
    subtitle: "agri-food · Tashkent city",
  },
  {
    id: "inv-33",
    title: "GE Aerospace engine fleet deal",
    subtitle: "aviation · Tashkent city",
  },
  {
    id: "inv-34",
    title: "Mastercard digital-payments hub",
    subtitle: "finance · Tashkent city",
  },
  {
    id: "inv-35",
    title: "Visa fintech acceleration",
    subtitle: "finance · Tashkent city",
  },
];

export const searchAgreements: SearchProjection[] = [
  {
    id: "a-1992-relations",
    title: "Establishment of diplomatic relations",
    subtitle: "interstate · 1992-02-19",
  },
  {
    id: "a-1993-embassy-dc",
    title: "Opening of the Embassy of Uzbekistan in the United States",
    subtitle: "interstate · 1993-05-10",
  },
  {
    id: "a-2025-visa-free-us",
    title: "30-day visa-free regime for U.S. citizens",
    subtitle: "interstate · 2025-11-03",
  },
  {
    id: "a-1994-bit",
    title: "U.S.-Uzbekistan Bilateral Investment Treaty (BIT)",
    subtitle: "interstate · 1994-12-16",
  },
  {
    id: "a-2002-strategic-framework",
    title: "Declaration on Strategic Partnership and Cooperation Framework",
    subtitle: "intergov · 2002-03-12",
  },
  {
    id: "a-2004-tifa",
    title: "U.S.-Central Asian Trade and Investment Framework Agreement (TIFA)",
    subtitle: "intergov · 2004-06-01",
  },
  {
    id: "a-2018-strategic-partnership",
    title: "Joint Statement on Strategic Partnership",
    subtitle: "intergov · 2018-05-16",
  },
  {
    id: "a-2021-strategic-dialogue",
    title: "Memorandum on Strategic Partnership Dialogue",
    subtitle: "intergov · 2021-12-01",
  },
  {
    id: "a-2024-customs-maa",
    title: "Customs Mutual Assistance Agreement",
    subtitle: "interagency · 2024-09-01",
  },
  {
    id: "a-2024-critical-minerals-mou",
    title: "Critical Minerals MOU",
    subtitle: "intergov · 2024-09-01",
  },
  {
    id: "a-2024-minerals-dialogue",
    title: "Launch of the Critical Minerals Dialogue (C5+1)",
    subtitle: "intergov · 2024-02-01",
  },
  {
    id: "a-2024-wto-market-access",
    title: "Completion of bilateral WTO market-access negotiations",
    subtitle: "intergov · 2024-12-19",
  },
  {
    id: "a-2025-exim-buy-american",
    title: 'EXIM "Buy American, Build the Future" framework',
    subtitle: "intergov · 2025-11-10",
  },
  {
    id: "a-2026-investment-platform",
    title: "Agreement on the Establishment of an Investment Platform",
    subtitle: "intergov · 2026-02-18",
  },
  {
    id: "a-2026-dfc-framework",
    title: "Heads of Terms / Joint Investment Framework intent (DFC)",
    subtitle: "intergov · 2026-02-18",
  },
  {
    id: "a-2026-minerals-mou",
    title: "MoU on supply-chain resilience — critical minerals and rare earths",
    subtitle: "intergov · 2026-02-04",
  },
  {
    id: "a-demo-tax-dta",
    title: "Double Taxation Avoidance Agreement (DTA) — modernization",
    subtitle: "intergov · 2024-11-13",
  },
  {
    id: "a-demo-gsp",
    title: "Agreement on Generalized System of Preferences (GSP)",
    subtitle: "intergov · 2021-03-01",
  },
  {
    id: "a-demo-air-services",
    title: "Open Skies / Air Services Agreement",
    subtitle: "intergov · 2019-10-01",
  },
  {
    id: "a-demo-usaid-health",
    title: "USAID Country Development Cooperation Strategy 2022–2027",
    subtitle: "interagency · 2022-06-01",
  },
  {
    id: "a-demo-customs",
    title: "Cooperation in customs matters",
    subtitle: "interagency · 2018-05-16",
  },
  {
    id: "a-demo-ifdc",
    title: "International Finance Development Cooperation (DFC) framework",
    subtitle: "intergov · 2023-09-20",
  },
  {
    id: "a-demo-fbi-law",
    title: "Law-enforcement cooperation MoU",
    subtitle: "interagency · 2019-03-01",
  },
  {
    id: "a-demo-export-import",
    title: "EXIM Bank general financing framework",
    subtitle: "intergov · 2023-11-07",
  },
  {
    id: "a-demo-fulbright",
    title: "Fulbright academic exchange MoU (renewal)",
    subtitle: "interagency · 2023-02-28",
  },
  {
    id: "a-demo-usda",
    title: "Cooperation in agriculture and food safety",
    subtitle: "interagency · 2022-04-01",
  },
];
