/**
 * Diplomatic, consular, and UN missions of the Republic of Uzbekistan in
 * the United States — pinned on the /map page.
 *
 * Active missions (verified):
 *   - Embassy of Uzbekistan, Washington, D.C. (1996)
 *   - Consulate General of Uzbekistan, New York
 *   - Permanent Mission of Uzbekistan to the United Nations, New York
 *   - Consulate of Uzbekistan, Seattle (opened 2026 per MFA roster)
 *
 * Planned missions (per MFA expansion plan, 2026–2027):
 *   - Consulate of Uzbekistan, Philadelphia
 *   - Consulate of Uzbekistan, Chicago
 *   - Consulate of Uzbekistan, Orlando
 */
export type UzMissionType = "embassy" | "consulate-general" | "consulate" | "un-mission";
export type UzMissionStatus = "active" | "opened-2026" | "planned-2026" | "planned-2027";

export interface UzMission {
  id: string;
  type: UzMissionType;
  city: string;
  state: string;
  /** Display name in EN. */
  name: string;
  status: UzMissionStatus;
  address?: string;
  web?: string;
  lng: number;
  lat: number;
  is_demo: boolean;
  source_url?: string;
}

export const uzMissionsUs: UzMission[] = [
  {
    id: "uz-emb-dc",
    type: "embassy",
    city: "Washington, D.C.",
    state: "DC",
    name: "Embassy of Uzbekistan",
    status: "active",
    address: "1746 Massachusetts Ave NW, Washington, DC 20036",
    web: "https://uzbekistan.org",
    lng: -77.0461,
    lat: 38.9101,
    is_demo: false,
    source_url: "https://uzbekistan.org/contact-us/",
  },
  {
    id: "uz-cg-ny",
    type: "consulate-general",
    city: "New York, NY",
    state: "NY",
    name: "Consulate General of Uzbekistan",
    status: "active",
    address: "866 United Nations Plaza, Suite 326, New York, NY 10017",
    lng: -73.9683,
    lat: 40.7508,
    is_demo: false,
  },
  {
    id: "uz-un-ny",
    type: "un-mission",
    city: "New York, NY",
    state: "NY",
    name: "Permanent Mission of Uzbekistan to the United Nations",
    status: "active",
    address: "801 Second Avenue, 20th Floor, New York, NY 10017",
    lng: -73.97,
    lat: 40.748,
    is_demo: false,
  },
  {
    id: "uz-cons-seattle",
    type: "consulate",
    city: "Seattle, WA",
    state: "WA",
    name: "Consulate of Uzbekistan in Seattle",
    status: "opened-2026",
    lng: -122.3321,
    lat: 47.6062,
    is_demo: false,
  },
  {
    id: "uz-cons-philadelphia",
    type: "consulate",
    city: "Philadelphia, PA",
    state: "PA",
    name: "Consulate of Uzbekistan in Philadelphia (planned)",
    status: "planned-2026",
    lng: -75.1652,
    lat: 39.9526,
    is_demo: false,
  },
  {
    id: "uz-cons-chicago",
    type: "consulate",
    city: "Chicago, IL",
    state: "IL",
    name: "Consulate of Uzbekistan in Chicago (planned)",
    status: "planned-2026",
    lng: -87.6298,
    lat: 41.8781,
    is_demo: false,
  },
  {
    id: "uz-cons-orlando",
    type: "consulate",
    city: "Orlando, FL",
    state: "FL",
    name: "Consulate of Uzbekistan in Orlando (planned)",
    status: "planned-2027",
    lng: -81.3792,
    lat: 28.5383,
    is_demo: false,
  },
];

export const uzMissionsUsMeta = {
  source: "MFA of the Republic of Uzbekistan — diplomatic and consular roster",
  fetched_at: "2026-04-30",
} as const;
