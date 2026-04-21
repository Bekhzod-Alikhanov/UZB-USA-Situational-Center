export interface LiveDelegation {
  id: string;
  title: string;
  head: string;
  direction: "uz-us" | "us-uz";
  status: "traveling" | "in-program" | "returning" | "preparing";
  members: number;
  originCity: string;
  currentCity: string;
  destinationCity: string;
  lat: number;
  lng: number;
  startDate: string;
  endDate: string;
  agenda: string[];
  is_demo: boolean;
}

export const liveDelegations: LiveDelegation[] = [
  {
    id: "d-1",
    title: "MIIT investment roadshow — Q2 2026",
    head: "Deputy Minister, MIIT",
    direction: "uz-us",
    status: "in-program",
    members: 14,
    originCity: "Tashkent",
    currentCity: "New York",
    destinationCity: "Washington",
    lat: 40.7128,
    lng: -74.006,
    startDate: "2026-04-18",
    endDate: "2026-04-25",
    agenda: ["NYSE listing exchange", "DFC meetings", "EXIM outreach"],
    is_demo: true,
  },
  {
    id: "d-2",
    title: "Utah State Partnership return delegation",
    head: "Khokim, Bukhara region",
    direction: "uz-us",
    status: "traveling",
    members: 8,
    originCity: "Bukhara",
    currentCity: "Istanbul (transit)",
    destinationCity: "Salt Lake City",
    lat: 41.0082,
    lng: 28.9784,
    startDate: "2026-04-19",
    endDate: "2026-04-27",
    agenda: ["Utah Senate meetings", "Stirling Foundation", "BYU"],
    is_demo: true,
  },
  {
    id: "d-3",
    title: "AUCC business mission to Tashkent",
    head: "AUCC Board Chair",
    direction: "us-uz",
    status: "preparing",
    members: 22,
    originCity: "Washington",
    currentCity: "Washington",
    destinationCity: "Tashkent",
    lat: 38.9072,
    lng: -77.0369,
    startDate: "2026-05-10",
    endDate: "2026-05-17",
    agenda: ["MIIT roundtable", "CCI meetings", "Samarkand free-zone tour"],
    is_demo: true,
  },
];
