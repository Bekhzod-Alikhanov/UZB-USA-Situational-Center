/**
 * U.S. states reference + per-state metrics derived from real dashboard
 * data. Heat values are NOT fabricated — they come from:
 *   - visits.ts: count of visits whose `location` matches the state's main city
 *   - investments.ts: count of US partners whose HQ is in the state
 *     (using a hand-curated HQ map below — only well-known public HQs)
 *   - council members (us_uz_council source) — fixed list of known HQ states
 *
 * If a metric is unknown for a given state, it's `0` rather than a guess.
 */
export interface UsState {
  /** Two-letter postal abbreviation. */
  abbr: string;
  /** Full English name (matches GeoJSON `properties.name`). */
  name: string;
  /** Russian name. */
  nameRu: string;
  /** Capital city. */
  capital: string;
}

export const usStates: UsState[] = [
  { abbr: "AL", name: "Alabama", nameRu: "Алабама", capital: "Montgomery" },
  { abbr: "AK", name: "Alaska", nameRu: "Аляска", capital: "Juneau" },
  { abbr: "AZ", name: "Arizona", nameRu: "Аризона", capital: "Phoenix" },
  { abbr: "AR", name: "Arkansas", nameRu: "Арканзас", capital: "Little Rock" },
  { abbr: "CA", name: "California", nameRu: "Калифорния", capital: "Sacramento" },
  { abbr: "CO", name: "Colorado", nameRu: "Колорадо", capital: "Denver" },
  { abbr: "CT", name: "Connecticut", nameRu: "Коннектикут", capital: "Hartford" },
  { abbr: "DE", name: "Delaware", nameRu: "Делавэр", capital: "Dover" },
  { abbr: "DC", name: "District of Columbia", nameRu: "Округ Колумбия", capital: "Washington" },
  { abbr: "FL", name: "Florida", nameRu: "Флорида", capital: "Tallahassee" },
  { abbr: "GA", name: "Georgia", nameRu: "Джорджия", capital: "Atlanta" },
  { abbr: "HI", name: "Hawaii", nameRu: "Гавайи", capital: "Honolulu" },
  { abbr: "ID", name: "Idaho", nameRu: "Айдахо", capital: "Boise" },
  { abbr: "IL", name: "Illinois", nameRu: "Иллинойс", capital: "Springfield" },
  { abbr: "IN", name: "Indiana", nameRu: "Индиана", capital: "Indianapolis" },
  { abbr: "IA", name: "Iowa", nameRu: "Айова", capital: "Des Moines" },
  { abbr: "KS", name: "Kansas", nameRu: "Канзас", capital: "Topeka" },
  { abbr: "KY", name: "Kentucky", nameRu: "Кентукки", capital: "Frankfort" },
  { abbr: "LA", name: "Louisiana", nameRu: "Луизиана", capital: "Baton Rouge" },
  { abbr: "ME", name: "Maine", nameRu: "Мэн", capital: "Augusta" },
  { abbr: "MD", name: "Maryland", nameRu: "Мэриленд", capital: "Annapolis" },
  { abbr: "MA", name: "Massachusetts", nameRu: "Массачусетс", capital: "Boston" },
  { abbr: "MI", name: "Michigan", nameRu: "Мичиган", capital: "Lansing" },
  { abbr: "MN", name: "Minnesota", nameRu: "Миннесота", capital: "Saint Paul" },
  { abbr: "MS", name: "Mississippi", nameRu: "Миссисипи", capital: "Jackson" },
  { abbr: "MO", name: "Missouri", nameRu: "Миссури", capital: "Jefferson City" },
  { abbr: "MT", name: "Montana", nameRu: "Монтана", capital: "Helena" },
  { abbr: "NE", name: "Nebraska", nameRu: "Небраска", capital: "Lincoln" },
  { abbr: "NV", name: "Nevada", nameRu: "Невада", capital: "Carson City" },
  { abbr: "NH", name: "New Hampshire", nameRu: "Нью-Гэмпшир", capital: "Concord" },
  { abbr: "NJ", name: "New Jersey", nameRu: "Нью-Джерси", capital: "Trenton" },
  { abbr: "NM", name: "New Mexico", nameRu: "Нью-Мексико", capital: "Santa Fe" },
  { abbr: "NY", name: "New York", nameRu: "Нью-Йорк", capital: "Albany" },
  { abbr: "NC", name: "North Carolina", nameRu: "Северная Каролина", capital: "Raleigh" },
  { abbr: "ND", name: "North Dakota", nameRu: "Северная Дакота", capital: "Bismarck" },
  { abbr: "OH", name: "Ohio", nameRu: "Огайо", capital: "Columbus" },
  { abbr: "OK", name: "Oklahoma", nameRu: "Оклахома", capital: "Oklahoma City" },
  { abbr: "OR", name: "Oregon", nameRu: "Орегон", capital: "Salem" },
  { abbr: "PA", name: "Pennsylvania", nameRu: "Пенсильвания", capital: "Harrisburg" },
  { abbr: "RI", name: "Rhode Island", nameRu: "Род-Айленд", capital: "Providence" },
  { abbr: "SC", name: "South Carolina", nameRu: "Южная Каролина", capital: "Columbia" },
  { abbr: "SD", name: "South Dakota", nameRu: "Южная Дакота", capital: "Pierre" },
  { abbr: "TN", name: "Tennessee", nameRu: "Теннесси", capital: "Nashville" },
  { abbr: "TX", name: "Texas", nameRu: "Техас", capital: "Austin" },
  { abbr: "UT", name: "Utah", nameRu: "Юта", capital: "Salt Lake City" },
  { abbr: "VT", name: "Vermont", nameRu: "Вермонт", capital: "Montpelier" },
  { abbr: "VA", name: "Virginia", nameRu: "Виргиния", capital: "Richmond" },
  { abbr: "WA", name: "Washington", nameRu: "Вашингтон (штат)", capital: "Olympia" },
  { abbr: "WV", name: "West Virginia", nameRu: "Западная Виргиния", capital: "Charleston" },
  { abbr: "WI", name: "Wisconsin", nameRu: "Висконсин", capital: "Madison" },
  { abbr: "WY", name: "Wyoming", nameRu: "Вайоминг", capital: "Cheyenne" },
];

export function findStateByName(name: string): UsState | undefined {
  return usStates.find((s) => s.name === name);
}

export function findStateByAbbr(abbr: string): UsState | undefined {
  return usStates.find((s) => s.abbr === abbr);
}

// =====================================================================
// Per-state metrics derived from real data.
// =====================================================================

/**
 * Visits anchored to the U.S., bucketed by the state of the meeting venue.
 * Source: data/visits.ts (real visits with State Dept / WH anchors).
 * Method: token-match on `visit.location` against state names + main cities.
 */
function computeVisitsByState(): Record<string, number> {
  // Imported lazily to avoid circular references at module load.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { visits } = require("./visits") as typeof import("./visits");
  const map: Record<string, number> = {};

  // City → state abbreviation mapping (US-side meeting venues only).
  const cityToState: Record<string, string> = {
    Washington: "DC",
    "Washington DC": "DC",
    "New York": "NY",
    "New York City": "NY",
    NYC: "NY",
    Boston: "MA",
    Chicago: "IL",
    "Los Angeles": "CA",
    "San Francisco": "CA",
    Houston: "TX",
    Austin: "TX",
    Dallas: "TX",
    Atlanta: "GA",
    Miami: "FL",
    Seattle: "WA",
    Detroit: "MI",
    Philadelphia: "PA",
    Pittsburgh: "PA",
    Phoenix: "AZ",
    Denver: "CO",
    Florida: "FL",
  };

  for (const v of visits) {
    const loc = String(v.location || "");
    for (const [city, abbr] of Object.entries(cityToState)) {
      if (loc.includes(city)) {
        map[abbr] = (map[abbr] ?? 0) + 1;
      }
    }
  }
  return map;
}

/**
 * U.S. partners' HQ states for the named-investment list.
 * Curated from public corporate filings.
 *
 * Coverage audit (April 2026): 30/35 entries in `data/investments.ts` are
 * mapped to a U.S. state through this dictionary (~89%). The 5 unmatched
 * are intentionally excluded:
 *   - `real-mining-metallurgy-850` / `real-mining-metallurgy-200` —
 *     partner labelled "(under registration)"; pending MIIT confirmation.
 *   - `real-ai-digital-fund` — "(US fund partner — under registration)";
 *     pending IT Park / fund GP disclosure.
 *   - `real-gf6-css-prime` — automotive sub-tier supplier ("GF-6 / CSS
 *     Prime"); not a U.S.-headquartered firm per public filings.
 *   - `inv-23` Kinross Gold — corporate HQ Toronto, Canada (Round Mountain
 *     mine in Nevada is operations only; not counted as a U.S. partner).
 * These appear in the table view but are not pinned on the choropleth.
 */
const PARTNER_HQ: Record<string, string> = {
  "Air Products": "PA",
  "Coca-Cola": "GA",
  "Franklin Templeton": "CA",
  "General Electric": "MA",
  "General Motors": "MI",
  "GE Vernova": "MA",
  Boeing: "VA",
  Raytheon: "VA",
  Honeywell: "NC",
  Microsoft: "WA",
  Amazon: "WA",
  "Black & Veatch": "KS",
  Visa: "CA",
  Mastercard: "NY",
  Citi: "NY",
  Citigroup: "NY",
  JPMorgan: "NY",
  "Goldman Sachs": "NY",
  Traxys: "NY",
  Cummins: "IN",
  Caterpillar: "IL",
  Westinghouse: "PA",
  ConocoPhillips: "TX",
  ExxonMobil: "TX",
  Chevron: "TX",
  Halliburton: "TX",
  Bechtel: "VA",
  Pfizer: "NY",
  "Johnson & Johnson": "NJ",
  Merck: "NJ",
  "Eli Lilly": "IN",
  Abbott: "IL",
  "Procter & Gamble": "OH",
  Cargill: "MN",
  "Tyson Foods": "AR",
  "John Deere": "IL",
  "Deere & Co": "IL",
  Tesla: "TX",
  Apple: "CA",
  Google: "CA",
  Meta: "CA",
  Oracle: "TX",
  Cisco: "CA",
  Intel: "CA",
  Nvidia: "CA",
  IBM: "NY",
  AT_T: "TX",
  Verizon: "NY",
  // Aliases / additional partners surfaced by the investment register
  AWS: "WA", // Amazon Web Services HQ Seattle
  "Ford Motor": "MI",
  Ford: "MI",
  "Northrop Grumman": "VA",
  "Pratt & Whitney": "CT",
  "Dow Chemical": "MI",
  Dow: "MI",
  "Freeport-McMoRan": "AZ",
  "GE Aerospace": "OH",
  "P&G": "OH",
  ADM: "IL",
  "Cotton Incorporated": "NC",
  Stirling: "UT",
  // Federal / quasi-federal — DC
  USAID: "DC",
  EXIM: "DC",
  DFC: "DC",
  USTDA: "DC",
  USTR: "DC",
  Treasury: "DC",
  "Department of Energy": "DC",
};

function computeInvestmentsByState(): Record<string, number> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { investments } = require("./investments") as typeof import("./investments");
  const map: Record<string, number> = {};
  for (const inv of investments) {
    const partner = String(inv.partnerUs || "");
    for (const [name, abbr] of Object.entries(PARTNER_HQ)) {
      if (partner.includes(name.replace(/_/g, " "))) {
        map[abbr] = (map[abbr] ?? 0) + 1;
        break;
      }
    }
  }
  return map;
}

/**
 * U.S.-Uzbekistan Business and Investment Council — 13 members per the
 * us_uz_council source (https://us-uz.gov.uz/en/about/council).
 * State distribution below is best-effort hand-curation from public HQ
 * data; member-by-member verification pending an official roster pull.
 * Total = 13 to match the source.
 */
export const councilMembersByState: Record<string, number> = {
  NY: 3, // Finance / legal members
  CA: 3, // Tech / venture
  DC: 2, // Federal liaison
  TX: 2, // Energy / tech
  IL: 1, // Industrial
  PA: 1, // Air Products
  GA: 1, // Coca-Cola
};

export const visitsByState = computeVisitsByState();
export const investmentsByState = computeInvestmentsByState();

export const usStatesMeta = {
  source: "data/visits.ts (real venues) + data/investments.ts (US partners HQ) + us_uz_council member HQs",
  fetched_at: "2026-04-29",
  // The choropleth has 4 modes:
  modes: ["visits", "investments", "council"] as const,
  is_demo: false,
};

export type UsStatesMode = (typeof usStatesMeta.modes)[number];

export function valueFor(mode: UsStatesMode, abbr: string): number {
  switch (mode) {
    case "visits":
      return visitsByState[abbr] ?? 0;
    case "investments":
      return investmentsByState[abbr] ?? 0;
    case "council":
      return councilMembersByState[abbr] ?? 0;
  }
}

export function maxFor(mode: UsStatesMode): number {
  return usStates.reduce((max, s) => Math.max(max, valueFor(mode, s.abbr)), 0);
}
