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
}

export const events: DiplomaticEvent[] = [
  {
    id: "e-c51-samarkand-2015",
    title: "C5+1 format launch — Samarkand Ministerial",
    type: "summit",
    date: "2015-11-01",
    location: "Samarkand",
    participants: ["5 Central Asian states", "U.S. Secretary of State"],
    description: "Inaugural C5+1 Foreign Ministers meeting; established format.",
    is_demo: false,
  },
  {
    id: "e-c51-ny-2023",
    title: "First C5+1 Summit at leaders level",
    type: "summit",
    date: "2023-09-19",
    location: "New York",
    participants: ["President Biden", "5 Central Asian Presidents"],
    linkedVisitId: "v-2023-09-unga-biden",
    description: "Historic first leaders-level C5+1.",
    is_demo: false,
  },
  {
    id: "e-c51-wash-2025",
    title: "Second C5+1 Summit at leaders level",
    type: "summit",
    date: "2025-11-06",
    location: "Washington",
    participants: ["President Trump", "5 Central Asian Presidents"],
    linkedVisitId: "v-2025-11-c5-1",
    description: "Second-ever leaders summit; Kennedy Center business conference.",
    is_demo: false,
  },
  {
    id: "e-c51-kc-bus",
    title: "C5+1 Business Conference (Kennedy Center)",
    type: "business",
    date: "2025-11-06",
    location: "Kennedy Center, Washington",
    participants: ["U.S. and Central Asia business leaders"],
    description: "Two Statements of Intent on economy and cultural heritage.",
    is_demo: false,
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
