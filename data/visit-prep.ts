/**
 * Visit-preparation data, v2 (roadmaps-monitoring pass): the Center monitors
 * WHO travels (delegation composition), WHEN and WHERE (dates, destinations),
 * WHY (purpose + day-by-day meeting program), and the hokimiyat material
 * package (presentations, speeches, agendas) registered on the platform.
 *
 * ACCESS BOUNDARY: /prepare is behind the admin password gate (proxy.ts), so
 * delegation member NAMES and material titles are permitted here by owner
 * decision. Passport/visa numbers, PNRs, booking codes, talking-point text,
 * and personal contact details remain forbidden (CLAUDE.md hard rule #8) —
 * they belong to the operational system, not this monitoring platform.
 */

import type { RoadmapRegionId } from "./roadmaps";

export interface DelegationMember {
  /** Person's name — only ever populated for the password-gated section. */
  name?: string;
  role: string;
  org: string;
  is_demo?: boolean;
}

export interface VisitMeeting {
  /** Program day, YYYY-MM-DD. */
  day: string;
  time?: string;
  counterpart: string;
  topic: string;
  location?: string;
  is_demo?: boolean;
}

export type VisitMaterialType = "presentation" | "speech" | "agenda" | "briefing" | "other";

export interface VisitMaterial {
  id: string;
  title: string;
  type: VisitMaterialType;
  /** Which hokimiyat/agency owes or supplied the material. */
  owner: string;
  receivedOn?: string;
  /** External link. File uploads to platform storage are этап 2 (Supabase). */
  url?: string;
  status: "expected" | "received";
  is_demo?: boolean;
}

export type UpcomingVisitStatus = "planning" | "confirmed" | "in-progress" | "completed";

export interface UpcomingVisit {
  id: string;
  title: string;
  titleRu: string;
  /** Link to the regional roadmap born from (or driving) this visit. */
  region?: RoadmapRegionId;
  direction: "UZ to USA" | "USA to UZ";
  startDate: string;
  endDate: string;
  destinations: string[];
  purpose: string;
  purposeRu: string;
  delegation: DelegationMember[];
  meetings: VisitMeeting[];
  materials: VisitMaterial[];
  status: UpcomingVisitStatus;
  is_demo: boolean;
  sourceId?: string;
}

export const upcomingVisits: UpcomingVisit[] = [
  /* -------------------------------------------------------------- */
  /* Completed May-2026 regional missions — dates, destinations and  */
  /* purpose are REAL (from the signed hokimiyat roadmaps). The      */
  /* delegation roster and meeting program are demo role-slots until */
  /* the hokimiyats supply their records (этап 2).                   */
  /* -------------------------------------------------------------- */
  {
    id: "uv-samarkand-usa-2026-05",
    title: "Samarkand region delegation — U.S. investment mission",
    titleRu: "Делегация Самаркандской области — инвестиционная миссия в США",
    region: "samarkand",
    direction: "UZ to USA",
    startDate: "2026-05-10",
    endDate: "2026-05-17",
    destinations: ["Washington, D.C.", "New York"],
    purpose:
      "Present the region's investment portfolio to U.S. companies; the visit produced the signed 48-project roadmap ($1.5B declared value) now tracked on /roadmaps.",
    purposeRu:
      "Представить инвестиционный портфель области американским компаниям; по итогам визита подписана дорожная карта на 48 проектов ($1,5 млрд), отслеживаемая в разделе «Дорожные карты».",
    delegation: [
      { role: "Delegation head — regional governor (khokim)", org: "Samarkand region khokimiyat", is_demo: true },
      { role: "Deputy khokim for investment", org: "Samarkand region khokimiyat", is_demo: true },
      { role: "District khokims (project initiators)", org: "Samarkand region khokimiyat", is_demo: true },
      { role: "Investment promotion team", org: "Samarkand region investment directorate", is_demo: true },
    ],
    meetings: [
      {
        day: "2026-05-12",
        counterpart: "U.S. investor and company meetings",
        topic: "Regional project presentations (B2G/B2B)",
        location: "Washington, D.C.",
        is_demo: true,
      },
      {
        day: "2026-05-15",
        counterpart: "Company-level negotiations",
        topic: "Project MoUs feeding the signed roadmap",
        location: "New York",
        is_demo: true,
      },
    ],
    materials: [
      {
        id: "vm-smq-roadmap",
        title: "Дорожная карта — Самарканд (АҚШ), 48 проектов",
        type: "briefing",
        owner: "Samarkand region khokimiyat",
        receivedOn: "2026-07-04",
        status: "received",
      },
    ],
    status: "completed",
    is_demo: false,
    sourceId: "input_roadmap_samarkand_docx",
  },
  {
    id: "uv-khorezm-usa-2026-05",
    title: "Khorezm region delegation — U.S. investment mission",
    titleRu: "Делегация Хорезмской области — инвестиционная миссия в США",
    region: "khorezm",
    direction: "UZ to USA",
    startDate: "2026-05-26",
    endDate: "2026-05-31",
    destinations: ["Washington, D.C."],
    purpose:
      "Present the region's investment portfolio to U.S. companies; the visit produced the signed 13-project roadmap ($1.0B declared value) now tracked on /roadmaps.",
    purposeRu:
      "Представить инвестиционный портфель области американским компаниям; по итогам визита подписана дорожная карта на 13 проектов ($1,0 млрд), отслеживаемая в разделе «Дорожные карты».",
    delegation: [
      { role: "Delegation head — regional governor (khokim)", org: "Khorezm region khokimiyat", is_demo: true },
      { role: "Deputy khokim for investment", org: "Khorezm region khokimiyat", is_demo: true },
      { role: "Project initiators (enterprise heads)", org: "Khorezm region enterprises", is_demo: true },
    ],
    meetings: [
      {
        day: "2026-05-27",
        counterpart: "U.S. investor and company meetings",
        topic: "Regional project presentations (B2G/B2B)",
        location: "Washington, D.C.",
        is_demo: true,
      },
    ],
    materials: [
      {
        id: "vm-khz-roadmap",
        title: "Дорожная карта — Хорезм (АҚШ), 13 проектов",
        type: "briefing",
        owner: "Khorezm region khokimiyat",
        receivedOn: "2026-07-04",
        status: "received",
      },
    ],
    status: "completed",
    is_demo: false,
    sourceId: "input_roadmap_khorezm_docx",
  },
  /* -------------------------------------------------------------- */
  /* Upcoming visits — demo workflow examples until the Center       */
  /* registers the next real missions.                               */
  /* -------------------------------------------------------------- */
  {
    id: "uv-us-delegation-tashkent-2026-07",
    title: "U.S. business delegation — Tashkent and Samarkand",
    titleRu: "Деловая делегация США — Ташкент и Самарканд",
    direction: "USA to UZ",
    startDate: "2026-07-08",
    endDate: "2026-07-10",
    destinations: ["Tashkent", "Samarkand"],
    purpose: "Return mission: AI, pharmaceuticals, logistics; site visits tied to the regional roadmaps.",
    purposeRu: "Ответная миссия: ИИ, фармацевтика, логистика; выезды на площадки по региональным дорожным картам.",
    delegation: [
      { role: "U.S. business delegates", org: "U.S. companies (healthcare, logistics, IT)", is_demo: true },
      { role: "Commercial Service escort", org: "U.S. Embassy Tashkent", is_demo: true },
    ],
    meetings: [
      {
        day: "2026-07-08",
        time: "10:00",
        counterpart: "MIIT + Situational Center",
        topic: "B2G meetings, portfolio presentation",
        location: "Tashkent",
        is_demo: true,
      },
      {
        day: "2026-07-09",
        counterpart: "Samarkand khokimiyat",
        topic: "Site visits: pharma cluster block, roadmap projects",
        location: "Samarkand",
        is_demo: true,
      },
      {
        day: "2026-07-10",
        counterpart: "Uzbek companies",
        topic: "B2B sessions and draft follow-up roadmap",
        location: "Tashkent",
        is_demo: true,
      },
    ],
    materials: [
      {
        id: "vm-tashkent-program",
        title: "Программа визита (повестка по дням)",
        type: "agenda",
        owner: "Situational Center",
        status: "expected",
        is_demo: true,
      },
      {
        id: "vm-tashkent-samarkand-deck",
        title: "Презентация проектов Самаркандской области",
        type: "presentation",
        owner: "Samarkand region khokimiyat",
        status: "expected",
        is_demo: true,
      },
    ],
    status: "confirmed",
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
  {
    id: "uv-unga-followup-2026-09",
    title: "UNGA / New York follow-up visit",
    titleRu: "Визит-сверка на полях ГА ООН, Нью-Йорк",
    direction: "UZ to USA",
    startDate: "2026-09-22",
    endDate: "2026-09-24",
    destinations: ["New York"],
    purpose: "Verify May-visit commitments against the roadmaps; follow-up meetings with companies and funds.",
    purposeRu: "Сверка обязательств майских визитов с дорожными картами; встречи с компаниями и фондами.",
    delegation: [
      { role: "Core delegation", org: "Presidential Administration / MIIT", is_demo: true },
      { role: "Project owners", org: "Regional khokimiyats", is_demo: true },
    ],
    meetings: [
      {
        day: "2026-09-23",
        counterpart: "U.S. companies from the May missions",
        topic: "Plan-vs-actual review against roadmap deadlines",
        location: "New York",
        is_demo: true,
      },
    ],
    materials: [
      {
        id: "vm-unga-planfact",
        title: "План-факт сверка по дорожным картам",
        type: "briefing",
        owner: "Situational Center",
        status: "expected",
        is_demo: true,
      },
    ],
    status: "planning",
    is_demo: true,
    sourceId: "f4_ordinance_2026",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function parseDayLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/** Nearest not-yet-finished visit (falls back to the latest one so the
 *  landing panel never renders empty after the season's last visit). */
export function nextVisit(asOf: Date): UpcomingVisit {
  const upcoming = upcomingVisits
    .filter((v) => parseDayLocal(v.endDate).getTime() >= asOf.getTime())
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return upcoming[0] ?? upcomingVisits[upcomingVisits.length - 1];
}

export function visitTitle(visit: UpcomingVisit, locale: string): string {
  return locale === "ru" ? visit.titleRu : visit.title;
}

export function visitPurpose(visit: UpcomingVisit, locale: string): string {
  return locale === "ru" ? visit.purposeRu : visit.purpose;
}

export function materialsReceived(visit: UpcomingVisit): { received: number; total: number } {
  return {
    received: visit.materials.filter((m) => m.status === "received").length,
    total: visit.materials.length,
  };
}
