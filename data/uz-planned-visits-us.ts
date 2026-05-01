/**
 * Planned UZ-side delegation visits to U.S. cities — pinned on the /map page.
 *
 * Real entries are derived from confirmed agenda items in `data/visits.ts`
 * and `data/events.ts` for the active engagement window (2026+). Demo
 * entries are illustrative pipeline items and are flagged `is_demo: true`
 * with a `source_note`.
 */
export interface UzPlannedVisit {
  id: string;
  city: string;
  state: string;
  date: string;
  /** End date for multi-day visits. */
  dateEnd?: string;
  /** Sending organization on the UZ side. */
  organization: string;
  /** What the visit is for. */
  purpose: string;
  lng: number;
  lat: number;
  is_demo: boolean;
  source_note?: string;
  linkedVisitId?: string;
  linkedEventId?: string;
}

export const uzPlannedVisitsUs: UzPlannedVisit[] = [
  {
    id: "pv-bc-april-2026",
    city: "Washington, D.C.",
    state: "DC",
    date: "2026-04-15",
    organization: "US-UZ Business and Investment Council (UZ delegation)",
    purpose: "First full session of the Council — working sessions and bilateral signing round",
    lng: -77.0369,
    lat: 38.9072,
    is_demo: false,
    linkedVisitId: "v-2026-04-upcoming-council",
    linkedEventId: "e-us-uz-bc-april-2026",
  },
  {
    id: "pv-bc-april-2026-fl",
    city: "Orlando, FL",
    state: "FL",
    date: "2026-04-17",
    organization: "US-UZ Business and Investment Council (UZ delegation)",
    purpose: "Florida leg — investor meetings (per Council itinerary)",
    lng: -81.3792,
    lat: 28.5383,
    is_demo: false,
    linkedVisitId: "v-2026-04-upcoming-council",
  },
  {
    id: "pv-tiif-2026-ny",
    city: "New York, NY",
    state: "NY",
    date: "2026-05-20",
    organization: "Ministry of Investments, Industry and Trade (MIIT)",
    purpose: "Pre-TIIF investor roadshow at NYSE / EXIM headquarters",
    lng: -74.0060,
    lat: 40.7128,
    is_demo: true,
    source_note: "Illustrative agenda — final dates pending MIIT confirmation",
  },
  {
    id: "pv-mining-2026-az",
    city: "Phoenix, AZ",
    state: "AZ",
    date: "2026-06-08",
    organization: "Ministry of Mining Industry and Geology",
    purpose: "Critical-minerals dialogue with Freeport-McMoRan and Arizona regulators",
    lng: -112.0740,
    lat: 33.4484,
    is_demo: true,
    source_note: "Illustrative — pending MoU follow-up under the Critical Minerals framework",
  },
  {
    id: "pv-energy-2026-tx",
    city: "Houston, TX",
    state: "TX",
    date: "2026-09-15",
    organization: "Uzbekneftegaz + MinEnergy",
    purpose: "Energy partnership talks (LNG, downstream chemistry)",
    lng: -95.3698,
    lat: 29.7604,
    is_demo: true,
    source_note: "Illustrative — coordinated through Embassy DC commercial team",
  },
  {
    id: "pv-aviation-2026-wa",
    city: "Seattle, WA",
    state: "WA",
    date: "2026-07-22",
    organization: "Uzbekistan Airways + UzAuto Motors",
    purpose: "Boeing fleet review + Consulate Seattle inauguration follow-up",
    lng: -122.3321,
    lat: 47.6062,
    is_demo: true,
    source_note: "Illustrative — tied to Consulate-Seattle opening agenda",
  },
  {
    id: "pv-itpark-2026-ca",
    city: "San Francisco, CA",
    state: "CA",
    date: "2026-10-05",
    organization: "IT Park Uzbekistan",
    purpose: "Bay Area venture roadshow for the joint AI / digital-tech fund",
    lng: -122.4194,
    lat: 37.7749,
    is_demo: true,
    source_note: "Illustrative — under registration with the joint fund partner",
  },
  {
    id: "pv-spd5-2026-dc",
    city: "Washington, D.C.",
    state: "DC",
    date: "2026-09-10",
    organization: "Ministry of Foreign Affairs",
    purpose: "Enhanced Strategic Partnership Dialogue — 5th session",
    lng: -77.0369,
    lat: 38.9072,
    is_demo: true,
    source_note: "Tentative — locked once SPD-5 venue is confirmed",
    linkedEventId: "e-sd5-2026",
  },
];

export const uzPlannedVisitsUsMeta = {
  source: "Confirmed visits/events (data/visits.ts + data/events.ts) plus illustrative pipeline",
  fetched_at: "2026-04-30",
} as const;
