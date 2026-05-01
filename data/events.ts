export type EventType = "summit" | "dialogue" | "forum" | "business" | "council" | "cultural" | "parliamentary";

export interface DiplomaticEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  dateEnd?: string;
  location: string;
  participants: string[];
  linkedVisitId?: string;
  description: string;
  is_demo: boolean;
  source_url?: string;
  /** Reference into `data/sources.ts`. */
  sourceId?: string;
}

// Calendar shows 2026+ events only. Pre-2026 history (Samarkand C5+1 2015,
// SPD-4 2024, USTR Tai 2024, Tashkent business forum 2025, EXIM framework
// 2025, NY C5+1 2023, Washington C5+1 2025) was removed at user request.
export const events: DiplomaticEvent[] = [
  {
    id: "e-dfc-framework-2026",
    title: "DFC announced Heads of Terms / Joint Investment Framework intent",
    type: "business",
    date: "2026-02-18",
    location: "Washington, D.C.",
    participants: ["Government of Uzbekistan", "DFC"],
    description: "Collaboration to expand private investment in critical minerals, infrastructure, and energy.",
    is_demo: false,
    sourceId: "dfc_joint_framework",
  },
  {
    id: "e-council-launch-washington-2026",
    title: "American-Uzbek Business and Investment Council — official launch in Washington",
    type: "council",
    date: "2026-04-06",
    location: "Washington, D.C.",
    participants: ["UZ delegation", "U.S. delegation"],
    description: "Delegations convened in Washington for the official launch of the Council.",
    is_demo: false,
    sourceId: "us_uz_gateway",
  },
  {
    id: "e-ustr-council-2026",
    title: "Council and USTR investment-profile discussion",
    type: "dialogue",
    date: "2026-04-08",
    location: "Washington, D.C.",
    participants: ["Council leadership", "USTR"],
    description: "Council leadership met with the U.S. Trade Representative on Uzbekistan's investor positioning.",
    is_demo: false,
    sourceId: "us_uz_gateway",
  },
  {
    id: "e-tiif-2026",
    title: "TIIF 2026 — Tashkent International Investment Forum (U.S.-Uzbekistan business forum)",
    type: "forum",
    date: "2026-06-01",
    location: "Tashkent",
    participants: ["UZ Government", "U.S. delegation (TBC)"],
    description: "Confirmed upcoming venue with a U.S.-Uzbekistan business forum; delegation composition pending.",
    is_demo: false,
    sourceId: "input_deep_review_docx",
  },
  {
    id: "e-davos-cp-2026",
    title: "Signing of the Charter of the Council of Peace",
    type: "council",
    date: "2026-01-22",
    location: "Davos",
    participants: ["President Mirziyoyev", "initiator: President Trump"],
    linkedVisitId: "v-2026-01-davos",
    description: "Uzbekistan among founding members.",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "e-minerals-feb-2026",
    title: "Ministerial Conference on Critical Minerals",
    type: "forum",
    date: "2026-02-04",
    location: "Washington",
    participants: ["FM Saidov", "U.S. State Department", "C5+1 colleagues"],
    linkedVisitId: "v-2026-02-04-minerals",
    description: "MoU on supply-chain resilience signed.",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "e-b51-bishkek-2026",
    title: "B5+1 Business Forum — Bishkek",
    type: "business",
    date: "2026-02-04",
    dateEnd: "2026-02-05",
    location: "Bishkek",
    participants: ["U.S. and Central Asian business delegations"],
    description: "Regional economic cooperation agenda.",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "e-council-peace-feb-2026",
    title: "Council of Peace — inaugural session",
    type: "council",
    date: "2026-02-17",
    dateEnd: "2026-02-19",
    location: "Washington",
    participants: ["President Mirziyoyev", "President Trump", "founding members"],
    linkedVisitId: "v-2026-02-17-state",
    description: "Inaugural working session.",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "e-us-uz-bc-april-2026",
    title: "US-UZ Business & Investment Council — first full session",
    type: "business",
    date: "2026-04-15",
    location: "Washington / Florida",
    participants: ["UZ Business Council", "U.S. Business Council"],
    linkedVisitId: "v-2026-04-upcoming-council",
    description: "Working sessions and bilateral signing round.",
    is_demo: false,
    sourceId: "us_uz_gateway",
  },
  {
    id: "e-sd5-2026",
    title: "Enhanced Strategic Partnership Dialogue — 5th session",
    type: "dialogue",
    date: "2026-09-10",
    location: "Tashkent",
    participants: ["MFA of Uzbekistan", "U.S. Department of State"],
    description: "Upgraded strategic dialogue format.",
    is_demo: true,
  },
];
