export type VisitLevel = "president" | "minister" | "ambassador" | "congress" | "business" | "usaid" | "governor";
export type VisitDirection = "uz-us" | "us-uz" | "bilateral-3p";
export type VisitFormat = "state" | "working" | "official" | "phone" | "meeting" | "summit" | "forum";

export interface Visit {
  id: string;
  date: string;
  dateEnd?: string;
  title: string;
  level: VisitLevel;
  direction: VisitDirection;
  format: VisitFormat;
  location: string;
  participantsUz: string[];
  participantsUs: string[];
  outcomes: string[];
  agreementsSigned?: string[];
  is_demo: boolean;
  source_url?: string;
  /** Reference into `data/sources.ts` — preferred over inline `source_url`. */
  sourceId?: string;
}

// Visits register: 2025+ only. Pre-2025 history (Baker 1992, Albright 2000,
// Powell 2001, Clinton 2010/2011, Kerry 2015, Riyadh/UNGA/phone 2017,
// State Visit 2018, Pompeo 2020, SPD 1–4, UNGA-Biden 2023, Power 2023,
// Blinken 2023, Daines/Rogers 2024) was removed at the user's request to
// keep the timeline focused on the active engagement window.
export const visits: Visit[] = [
  {
    id: "v-2025-03-miller",
    date: "2025-03-16",
    dateEnd: "2025-03-19",
    title: "Congresswoman Carol Miller visits Uzbekistan",
    level: "congress",
    direction: "us-uz",
    format: "working",
    location: "Tashkent",
    participantsUz: ["President Mirziyoyev"],
    participantsUs: ["Rep. Carol Miller (R-WV)"],
    outcomes: ["Received by the President"],
    is_demo: false,
  },
  {
    id: "v-2025-04-saidov",
    date: "2025-04-08",
    dateEnd: "2025-04-10",
    title: "FM Bakhtiyor Saidov visits Washington",
    level: "minister",
    direction: "uz-us",
    format: "working",
    location: "Washington",
    participantsUz: ["FM Bakhtiyor Saidov"],
    participantsUs: ["Secretary Marco Rubio", "NSA Michael Waltz"],
    outcomes: ["Meetings at State and NSC"],
    is_demo: false,
  },
  {
    id: "v-2025-08-zampolli",
    date: "2025-08-28",
    dateEnd: "2025-09-01",
    title: "Special Envoy Paolo Zampolli visits Uzbekistan",
    level: "minister",
    direction: "us-uz",
    format: "working",
    location: "Tashkent",
    participantsUz: ["President Mirziyoyev", "9 Ministers"],
    participantsUs: ["SPE for Global Partnerships P. Zampolli"],
    outcomes: ["Received by the President", "Broad ministerial outreach"],
    is_demo: false,
  },
  {
    id: "v-2025-09-unga",
    date: "2025-09-23",
    title: "Bilateral meeting at 80th UNGA",
    level: "president",
    direction: "bilateral-3p",
    format: "meeting",
    location: "New York",
    participantsUz: ["President Mirziyoyev"],
    participantsUs: ["President Trump"],
    outcomes: ["Reaffirmed strategic partnership"],
    is_demo: false,
  },
  {
    id: "v-2025-10-gor-landau",
    date: "2025-10-25",
    dateEnd: "2025-10-27",
    title: "SPE Sergio Gor + DepSecState Christopher Landau",
    level: "minister",
    direction: "us-uz",
    format: "working",
    location: "Tashkent",
    participantsUz: ["President Mirziyoyev"],
    participantsUs: ["Sergio Gor (SPE for S/C Asia)", "Christopher Landau (DepSec State)"],
    outcomes: ["Delegation received by President"],
    is_demo: false,
  },
  {
    id: "v-2025-11-c5-1",
    date: "2025-11-04",
    dateEnd: "2025-11-06",
    title: "President Mirziyoyev — C5+1 Summit in Washington",
    level: "president",
    direction: "uz-us",
    format: "summit",
    location: "Washington",
    participantsUz: ["President Mirziyoyev and delegation"],
    participantsUs: ["President Trump", "White House senior staff", "U.S. Congress members"],
    outcomes: ["Second-ever C5+1 Summit at leaders level", "Bilateral meeting with President Trump"],
    is_demo: false,
    sourceId: "whitehouse_c5_2025",
  },
  {
    id: "v-2025-11-adams",
    date: "2025-11-19",
    dateEnd: "2025-11-23",
    title: "NYC Mayor Eric Adams visits Uzbekistan",
    level: "governor",
    direction: "us-uz",
    format: "working",
    location: "Tashkent, Samarkand",
    participantsUz: ["MFA, MinDigital, MinSport, MIIT, CCI"],
    participantsUs: ["NYC Mayor Eric Adams"],
    outcomes: ["City-level cooperation pathways"],
    is_demo: false,
  },
  {
    id: "v-2025-11-utah",
    date: "2025-11-11",
    dateEnd: "2025-11-12",
    title: "Utah delegation (Elder Bednar, Stirling Foundation)",
    level: "business",
    direction: "us-uz",
    format: "working",
    location: "Tashkent",
    participantsUz: ["President Mirziyoyev"],
    participantsUs: ["Elder David Bednar", "Michael Hansen (Stirling)"],
    outcomes: ["Received by the President"],
    is_demo: false,
  },
  {
    id: "v-2025-11-miit",
    date: "2025-11-24",
    dateEnd: "2025-11-26",
    title: "Minister of Investment, Industry and Trade visits USA",
    level: "minister",
    direction: "uz-us",
    format: "working",
    location: "Washington, New York",
    participantsUz: ["MIIT delegation"],
    participantsUs: ["U.S. investors and corporates"],
    outcomes: ["Strategic investment project pipelines"],
    is_demo: false,
  },
  {
    id: "v-2026-01-davos",
    date: "2026-01-22",
    title: "Signing of the Charter of the Council of Peace",
    level: "president",
    direction: "bilateral-3p",
    format: "summit",
    location: "Davos, Switzerland",
    participantsUz: ["President Mirziyoyev"],
    participantsUs: ["Initiator: President Trump"],
    outcomes: ["Uzbekistan joins the Council of Peace as founding member"],
    is_demo: false,
  },
  {
    id: "v-2026-02-04-minerals",
    date: "2026-02-04",
    title: "Critical Minerals Ministerial — MoU signed",
    level: "minister",
    direction: "uz-us",
    format: "forum",
    location: "Washington",
    participantsUz: ["FM Bakhtiyor Saidov"],
    participantsUs: ["Critical Minerals Ministerial participants"],
    outcomes: ["MoU on supply-chain resilience for critical minerals and rare earths"],
    agreementsSigned: ["Critical Minerals MoU"],
    is_demo: false,
  },
  {
    id: "v-2026-02-06-gor",
    date: "2026-02-06",
    title: "SPE Sergio Gor visit — 1st US-UZ Business & Investment Council",
    level: "minister",
    direction: "us-uz",
    format: "forum",
    location: "Tashkent",
    participantsUz: ["Head of Presidential Administration S. Mirziyoyeva"],
    participantsUs: ["SPE Sergio Gor", "U.S. business delegation"],
    outcomes: ["Informal first session of US-UZ Business & Investment Council"],
    is_demo: false,
  },
  {
    id: "v-2026-02-17-state",
    date: "2026-02-17",
    dateEnd: "2026-02-19",
    title: "President Mirziyoyev — working visit to Washington (Council of Peace inaugural session)",
    level: "president",
    direction: "uz-us",
    format: "working",
    location: "Washington",
    participantsUz: ["President Mirziyoyev and delegation"],
    participantsUs: ["President Trump", "Council of Peace members"],
    outcomes: ["Inaugural session of the Council of Peace"],
    is_demo: false,
  },
  {
    id: "v-2026-04-upcoming-council",
    date: "2026-04-15",
    title: "Full first session of US-UZ Business & Investment Council (planned)",
    level: "business",
    direction: "uz-us",
    format: "forum",
    location: "Washington / Florida",
    participantsUz: ["UZ Business Council members"],
    participantsUs: ["U.S. Business Council members"],
    outcomes: ["Planned working sessions"],
    is_demo: false,
  },
];

export function visitsByYear(): Record<number, Visit[]> {
  return visits.reduce<Record<number, Visit[]>>((acc, v) => {
    const y = Number(v.date.slice(0, 4));
    (acc[y] ??= []).push(v);
    return acc;
  }, {});
}

export function nextAnchorVisit(from: Date = new Date()): Visit | undefined {
  return visits
    .filter((v) => new Date(v.date).getTime() >= from.getTime())
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}
