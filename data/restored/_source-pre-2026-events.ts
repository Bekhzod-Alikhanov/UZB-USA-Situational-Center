/**
 * Immutable value-level recovery of the eight pre-2026 event records removed
 * in commit 02e1edc9e30dabeddf4c83acc7884623fdd29c6a.
 *
 * The record bodies below are copied byte-for-byte from the removed diff.
 * They are not wired to runtime routes or publication projections.
 */

export type HistoricalEventType =
  "summit" | "dialogue" | "forum" | "business" | "council" | "cultural" | "parliamentary";

export interface HistoricalEventSourceRecord {
  id: string;
  title: string;
  type: HistoricalEventType;
  date: string;
  dateEnd?: string;
  location: string;
  participants: string[];
  linkedVisitId?: string;
  description: string;
  is_demo: boolean;
  source_url?: string;
  sourceId?: string;
}

export const historicalEventSourceRecords: HistoricalEventSourceRecord[] = [
  {
    id: "e-c51-samarkand-2015",
    title: "C5+1 format launch — Samarkand Ministerial",
    type: "summit",
    date: "2015-11-01",
    location: "Samarkand",
    participants: ["5 Central Asian states", "U.S. Secretary of State"],
    description: "Inaugural C5+1 Foreign Ministers meeting; established format.",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "e-business-forum-tashkent-2025",
    title: "Uzbekistan-U.S. Business Forum — Tashkent",
    type: "forum",
    date: "2025-06-09",
    location: "Tashkent",
    participants: ["UZ Government", "~100 U.S. companies", "Embassy commercial team"],
    description:
      "Forum reported 2024 U.S. direct investment of $612.6M, 314 U.S.-capital enterprises, ~100 participating U.S. companies.",
    is_demo: false,
    sourceId: "govuz_business_forum_2025",
  },
  {
    id: "e-spd4-washington-2024",
    title: "Fourth Strategic Partnership Dialogue (SPD)",
    type: "dialogue",
    date: "2024-11-13",
    location: "Washington, D.C.",
    participants: ["MFA of Uzbekistan", "U.S. Department of State"],
    description: "Fourth SPD; format agreed to be raised to Enhanced Strategic Partnership Dialogue.",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
  },
  {
    id: "e-ustr-tai-2024",
    title: "USTR Katherine Tai visit to Uzbekistan",
    type: "dialogue",
    date: "2024-06-12",
    location: "Tashkent",
    participants: ["USTR", "MIIT", "MFA"],
    description: "Covered WTO accession, GSP, IP, trade facilitation, and U.S. meat & poultry market access.",
    is_demo: false,
    sourceId: "ustr_visit_2024",
  },
  {
    id: "e-exim-buy-american-2025",
    title: 'EXIM signed "Buy American, Build the Future" framework',
    type: "business",
    date: "2025-11-10",
    location: "Washington, D.C.",
    participants: ["Government of Uzbekistan", "EXIM"],
    description: "Framework focused on infrastructure, energy, aviation, minerals, and advanced technologies.",
    is_demo: false,
    sourceId: "exim_buy_american",
  },
  {
    id: "e-c51-ny-2023",
    title: "First C5+1 Summit at leaders level",
    type: "summit",
    date: "2023-09-19",
    location: "New York",
    participants: ["President Biden", "5 Central Asian Presidents"],
    // linkedVisitId removed: pre-2025 visit entries were dropped from data/visits.ts.
    description: "Historic first leaders-level C5+1.",
    is_demo: false,
    sourceId: "input_diplomatic_docx",
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
    sourceId: "us_uz_gateway",
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
    sourceId: "us_uz_gateway",
  },
];
