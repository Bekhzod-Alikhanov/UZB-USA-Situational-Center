/**
 * U.S. counterparts and bilateral Council members. All entries non-demo and
 * carry a `sourceId` referencing the source registry. Bio detail is limited
 * to publicly verifiable facts (visit dates, position titles, committee
 * assignments) — speculative quotes or unsourced opinions are excluded.
 */
export type CounterpartRole = "executive" | "state" | "congress-senate" | "congress-house" | "business" | "diplomat" | "council";
export type Party = "R" | "D" | "I" | "N/A";
export type Stance = "supportive" | "neutral" | "cautious";

export interface Counterpart {
  id: string;
  name: string;
  position: string;
  role: CounterpartRole;
  party?: Party;
  state?: string;
  committees?: string[];
  photo?: string;
  priorEngagements: string[];
  stanceOnUz: Stance;
  keyTopics: string[];
  is_demo: boolean;
  source_url?: string;
  /** Reference into `data/sources.ts`. */
  sourceId?: string;
}

/** Human-readable role label used in grid filter chips and detail headers. */
export const ROLE_LABEL: Record<CounterpartRole, string> = {
  executive: "Executive",
  state: "State & local",
  "congress-senate": "U.S. Senate",
  "congress-house": "U.S. House",
  business: "Business",
  diplomat: "Diplomat",
  council: "Council",
};

/** Party-affiliation chip background + text colors. */
export const PARTY_TONE: Record<string, string> = {
  R: "bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  D: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  I: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  "N/A": "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

/** Stance-on-UZ — plain colored text variant (used in compact grid cards). */
export const STANCE_TEXT: Record<Stance, string> = {
  supportive: "text-[var(--color-pos)]",
  neutral: "text-[var(--color-ink-muted)]",
  cautious: "text-[var(--color-warn)]",
};

/** Stance-on-UZ — full bordered chip variant (used in detail headers). */
export const STANCE_CHIP: Record<Stance, string> = {
  supportive: "text-[var(--color-pos)] bg-[var(--color-pos-soft)] border-[var(--color-pos)]/30",
  neutral: "text-[var(--color-ink-muted)] bg-[var(--color-surface-2)] border-[var(--color-border)]",
  cautious: "text-[var(--color-warn)] bg-[var(--color-warn-soft)] border-[var(--color-warn)]/30",
};

export const counterparts: Counterpart[] = [
  // -- Executive ----------------------------------------------------------
  {
    id: "c-trump",
    name: "Donald J. Trump",
    position: "President of the United States (47th)",
    role: "executive",
    party: "R",
    priorEngagements: [
      "2017-05-21 Riyadh — first meeting with President Mirziyoyev",
      "2017-09-20 UNGA — bilateral meeting",
      "2017-12-19 presidential phone call",
      "2018-05-16 White House — state visit",
      "2025-09-23 UNGA 80 — bilateral meeting",
      "2025-11-06 Washington — C5+1 leaders summit",
      "2026-02-17 Washington — Council of Peace inaugural session",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["Critical minerals", "Council of Peace", "C5+1", "Investment partnership"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
    source_url: "https://www.whitehouse.gov",
  },
  {
    id: "c-rubio",
    name: "Marco Rubio",
    position: "Secretary of State",
    role: "executive",
    party: "R",
    state: "FL",
    priorEngagements: [
      "2025-02-21 phone call with FM Saidov",
      "2025-04-08 met FM Saidov in Washington",
      "2026-02-04 Critical Minerals Ministerial Conference",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["Central Asia strategy", "Critical minerals", "Regional security", "WTO accession"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
    source_url: "https://www.state.gov",
  },
  {
    id: "c-waltz",
    name: "Michael Waltz",
    position: "National Security Advisor",
    role: "executive",
    party: "R",
    priorEngagements: ["2025-04-09 met FM Saidov at the National Security Council"],
    stanceOnUz: "supportive",
    keyTopics: ["Regional security", "Afghanistan stabilization", "Counter-terrorism"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "c-gor",
    name: "Sergio Gor",
    position: "Special Presidential Envoy for South & Central Asia",
    role: "executive",
    party: "R",
    priorEngagements: [
      "2025-10-25 to 2025-10-27 Tashkent visit with Deputy Secretary of State Landau (received by President)",
      "2026-02-06 Tashkent — first American-Uzbek Business and Investment Council session",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["Investment", "People-to-people", "Council operations", "Energy"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "c-landau",
    name: "Christopher Landau",
    position: "Deputy Secretary of State",
    role: "executive",
    party: "R",
    priorEngagements: ["2025-10-25 Tashkent visit with Special Envoy Gor"],
    stanceOnUz: "supportive",
    keyTopics: ["C5+1", "Investment", "Rule of law"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "c-zampolli",
    name: "Paolo Zampolli",
    position: "Special Envoy for Global Partnerships",
    role: "executive",
    party: "R",
    priorEngagements: [
      "2025-08-28 broad ministerial visit to Tashkent — met MFA, MIIT, MinDigital, MinEnergy, Ministry of Geology, Transport, Sport, Health, and Culture",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["Global partnerships", "Sectoral cooperation", "Culture"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "c-meyer",
    name: "Elizabeth Meyer",
    position: "Acting Assistant Secretary, Bureau of South & Central Asian Affairs",
    role: "executive",
    party: "N/A",
    priorEngagements: ["2025-06 Tashkent — Strategic Partnership Dialogue preparations"],
    stanceOnUz: "supportive",
    keyTopics: ["Strategic Partnership Dialogue", "Regional cooperation"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "c-power",
    name: "Samantha Power",
    position: "Former USAID Administrator (2021–2025)",
    role: "executive",
    party: "D",
    priorEngagements: ["2023-10-23 to 2023-10-25 first USAID Administrator visit since 2001 — received by the President"],
    stanceOnUz: "supportive",
    keyTopics: ["Development cooperation", "Governance reform"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },

  // -- American-Uzbek Business and Investment Council (U.S. side) -------
  {
    id: "c-fogel",
    name: "David L. Fogel",
    position: "Assistant Secretary of Commerce; Director General, U.S. and Foreign Commercial Service",
    role: "council",
    party: "N/A",
    priorEngagements: [
      "2026-04-06 Washington — Council formal launch",
      "Member, American-Uzbek Business and Investment Council (U.S. side)",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["Commercial diplomacy", "Trade promotion", "Foreign Commercial Service"],
    is_demo: false,
    sourceId: "us_uz_council",
    source_url: "https://us-uz.gov.uz/en/about/council",
  },
  {
    id: "c-galdiz",
    name: "Isabel Galdiz",
    position: "Vice President, International Relations Division, EXIM Bank",
    role: "council",
    party: "N/A",
    priorEngagements: [
      "2025-11-10 EXIM \"Buy American, Build the Future\" framework signing",
      "Member, American-Uzbek Business and Investment Council (U.S. side)",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["Export finance", "Aviation / energy / minerals procurement"],
    is_demo: false,
    sourceId: "us_uz_council",
    source_url: "https://us-uz.gov.uz/en/about/council",
  },
  {
    id: "c-brez",
    name: "Bethany Brez",
    position: "Vice President, Office of Foreign Policy, DFC",
    role: "council",
    party: "N/A",
    priorEngagements: [
      "2026-02-18 DFC Heads of Terms / Joint Investment Framework announcement",
      "Member, American-Uzbek Business and Investment Council (U.S. side)",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["Investment finance", "Critical minerals pipeline", "Strategic-sector financing"],
    is_demo: false,
    sourceId: "us_uz_council",
    source_url: "https://us-uz.gov.uz/en/about/council",
  },
  {
    id: "c-orr",
    name: "Caleb Orr",
    position: "Assistant Secretary of State for Economic, Energy, and Business Affairs",
    role: "council",
    party: "N/A",
    priorEngagements: ["Member, American-Uzbek Business and Investment Council (U.S. side)"],
    stanceOnUz: "supportive",
    keyTopics: ["Economic diplomacy", "Energy cooperation", "Business affairs"],
    is_demo: false,
    sourceId: "us_uz_council",
    source_url: "https://us-uz.gov.uz/en/about/council",
  },
  {
    id: "c-henick",
    name: "Jonathan Henick",
    position: "U.S. Ambassador to Uzbekistan",
    role: "diplomat",
    party: "N/A",
    priorEngagements: [
      "Resident in Tashkent — primary U.S. diplomatic representative",
      "Member, American-Uzbek Business and Investment Council (U.S. side)",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["Diplomatic representation", "Economic engagement", "Public diplomacy"],
    is_demo: false,
    sourceId: "us_embassy_tashkent",
    source_url: "https://uz.usembassy.gov/contact/",
  },

  // -- State / municipal -------------------------------------------------
  {
    id: "c-adams-nyc",
    name: "Eric Adams",
    position: "Mayor of New York City",
    role: "state",
    party: "D",
    state: "NY",
    priorEngagements: [
      "2025-11-19 to 2025-11-23 — visit to Uzbekistan; met MFA, line ministries, the Chamber of Commerce, and hokimiyats of Tashkent City, Tashkent Region, and Samarkand Region",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["City-to-city cooperation", "Culture", "Investment"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "c-adams-sen",
    name: "J. Stuart Adams",
    position: "President of the Utah State Senate",
    role: "state",
    party: "R",
    state: "UT",
    priorEngagements: [
      "2024-04-22 first delegation visit to Uzbekistan",
      "2025-05-14 second delegation visit",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["State-level cooperation", "Education", "Humanitarian ties"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },

  // -- Senate -----------------------------------------------------------
  {
    id: "c-daines",
    name: "Steve Daines",
    position: "U.S. Senator",
    role: "congress-senate",
    party: "R",
    state: "MT",
    committees: ["Senate Foreign Relations Committee", "Senate Energy and Natural Resources Committee"],
    priorEngagements: ["2024-03-26 Tashkent visit with Rep. Mike Rogers"],
    stanceOnUz: "supportive",
    keyTopics: ["Defense cooperation", "Agriculture", "Critical minerals"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },

  // -- House ------------------------------------------------------------
  {
    id: "c-rogers",
    name: "Mike Rogers",
    position: "U.S. Representative — Chair, House Armed Services Committee",
    role: "congress-house",
    party: "R",
    state: "AL",
    committees: ["House Armed Services Committee (Chair)"],
    priorEngagements: ["2024-03-26 Tashkent visit with Sen. Steve Daines"],
    stanceOnUz: "supportive",
    keyTopics: ["Defense cooperation", "Aerospace", "Foreign military sales"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "c-miller",
    name: "Carol Miller",
    position: "U.S. Representative",
    role: "congress-house",
    party: "R",
    state: "WV",
    committees: ["House Ways and Means Committee"],
    priorEngagements: ["2025-03-16 received by President Mirziyoyev in Tashkent"],
    stanceOnUz: "supportive",
    keyTopics: ["Trade policy", "Energy"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "c-gonzalez",
    name: "Vicente Gonzalez",
    position: "U.S. Representative — Co-chair, Uzbekistan Caucus",
    role: "congress-house",
    party: "D",
    state: "TX",
    committees: ["House Financial Services Committee"],
    priorEngagements: ["Uzbekistan Caucus co-chair since 2018"],
    stanceOnUz: "supportive",
    keyTopics: ["Trade", "Legislative diplomacy", "Caucus engagement"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "c-kelly",
    name: "Trent Kelly",
    position: "U.S. Representative — Co-chair, Uzbekistan Caucus",
    role: "congress-house",
    party: "R",
    state: "MS",
    committees: ["House Armed Services Committee", "House Agriculture Committee"],
    priorEngagements: [
      "Uzbekistan Caucus co-chair since 2018",
      "Mississippi National Guard — Uzbekistan State Partnership Program lead",
    ],
    stanceOnUz: "supportive",
    keyTopics: ["State Partnership Program", "Defense", "Agriculture"],
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
];
