import {
  allRoadmapSteps,
  stepHealth,
  roadmapProjectTitle,
  roadmapStepTitle,
  type RoadmapProject,
  type RoadmapStep,
} from "./roadmaps";
import { events } from "./events";
import { externalDataSummary } from "./external-data";
import { investments } from "./investments";
import { news } from "./news";
import { relationshipPillars } from "./relationship-pillars";
import { nextAnchorVisit } from "./visits";
import { sourceQualitySummary } from "@/lib/source-quality";
import { localizedOwner } from "@/lib/i18n/overview-content";

export type ExecutiveItemTone = "critical" | "watch" | "positive" | "neutral";

export interface ExecutiveItem {
  id: string;
  title: string;
  detail: string;
  owner: string;
  due?: string;
  href: string;
  tone: ExecutiveItemTone;
  sourceId?: string;
}

export interface ExecutiveBriefing {
  asOf: string;
  headline: string;
  readout: string;
  metrics: { label: string; value: string; tone: ExecutiveItemTone }[];
  priorityActions: ExecutiveItem[];
  risks: ExecutiveItem[];
  opportunities: ExecutiveItem[];
  changes: ExecutiveItem[];
}

const AS_OF = "2026-07-04";
type ExecutiveLocale = "en" | "ru" | "uz-latn";

const COPY: Record<
  ExecutiveLocale,
  {
    headline: string;
    readout: string;
    overdue: (days: number) => string;
    dueSoon: (days: number) => string;
    demoRiskTitle: string;
    demoRiskDetail: (count: number) => string;
    methodologyRiskTitle: string;
    methodologyRiskDetail: string;
    opportunities: {
      dfc: { title: string; detail: string };
      census: { title: string; detail: string };
      visa: { title: string; detail: string };
      education: { title: string; detail: string };
    };
    nextAnchorVisit: (title: string) => string;
    anchorDetail: (location: string, date: string) => string;
  }
> = {
  en: {
    headline:
      "Relationship is opportunity-rich, but production readiness depends on replacing demo pipeline data and closing overdue legal-register work.",
    readout:
      "The strongest immediate lanes are investment finance, critical minerals, Council operating cadence, and visa/tourism mobility. The main executive risk is not technical: it is source ownership, methodology separation, and action accountability.",
    overdue: (days) => `${days}d overdue`,
    dueSoon: (days) => `T-${days}d`,
    demoRiskTitle: "Demo investment rows remain visible in strategic pipeline",
    demoRiskDetail: (count) =>
      `${count} investment records still require MIIT/UzInvest source-owner replacement before external publication.`,
    methodologyRiskTitle: "Grants and assistance use separate accounting systems",
    methodologyRiskDetail:
      "UZ-side internal grants, USAID program records, and ForeignAssistance.gov annual obligations should never be summed without reconciliation.",
    opportunities: {
      dfc: {
        title: "Convert DFC framework into bankable project shortlist",
        detail: "Critical minerals, infrastructure, and energy can become the highest-value bilateral investment lane.",
      },
      census: {
        title: "Automate monthly Census trade refresh",
        detail: "The Census API is live-ready and can keep the U.S.-side trade view current after deployment.",
      },
      visa: {
        title: "Turn visa-free travel into a people-to-people KPI",
        detail: "Pair UZ tourism announcements with State visa and DHS admissions data for a mobility view.",
      },
      education: {
        title: "Add education exchange as a strategic pillar",
        detail: "Open Doors and university partnership data would make education diplomacy measurable.",
      },
    },
    nextAnchorVisit: (title) => `Next anchor visit: ${title}`,
    anchorDetail: (location, date) => `${location}, ${date}.`,
  },
  ru: {
    headline:
      "Отношения богаты возможностями, но готовность к рабочему использованию зависит от замены демо-данных и закрытия просроченного реестра соглашений.",
    readout:
      "Ближайшие сильные направления: инвестиционное финансирование, критические минералы, рабочий ритм Совета и визово-туристическая мобильность. Главный исполнительный риск не технический: это владельцы источников, разделение методологий и ответственность за действия.",
    overdue: (days) => `просрочено на ${days} дн.`,
    dueSoon: (days) => `T-${days} дн.`,
    demoRiskTitle: "Демо-записи инвестиций остаются видимыми в стратегическом портфеле",
    demoRiskDetail: (count) =>
      `${count} инвестиционных записей требуют замены владельцем источника MIIT/UzInvest перед внешней публикацией.`,
    methodologyRiskTitle: "Гранты и помощь используют разные системы учета",
    methodologyRiskDetail:
      "Внутренние гранты Узбекистана, записи USAID и годовые обязательства ForeignAssistance.gov нельзя суммировать без методологической сверки.",
    opportunities: {
      dfc: {
        title: "Преобразовать рамочное соглашение DFC в банковский шорт-лист проектов",
        detail: "Критические минералы, инфраструктура и энергетика могут стать самой ценной инвестиционной линией.",
      },
      census: {
        title: "Автоматизировать ежемесячное обновление торговли Census",
        detail:
          "API Census готов к подключению и может поддерживать актуальность американской торговой методологии после внедрения.",
      },
      visa: {
        title: "Превратить безвизовый режим в KPI по связям между людьми",
        detail: "Сопоставьте туристические объявления Узбекистана со статистикой виз State Department и въездов DHS.",
      },
      education: {
        title: "Добавить образовательный обмен как стратегическую опору",
        detail: "Данные Open Doors и университетских партнерств сделают образовательную дипломатию измеримой.",
      },
    },
    nextAnchorVisit: (title) => `Следующий ключевой визит: ${title}`,
    anchorDetail: (location, date) => `${location}, ${date}.`,
  },
  "uz-latn": {
    headline:
      "Aloqalar imkoniyatlarga boy, ammo ishga tayyorlik demo portfel ma'lumotlarini almashtirish va muddati o'tgan huquqiy reestr ishini yopishga bog'liq.",
    readout:
      "Eng kuchli yaqin yo'nalishlar: investitsiya moliyasi, kritik minerallar, Kengashning operatsion ritmi va viza/turizm mobilligi. Asosiy ijro xatari texnik emas: manba egaligi, metodologiyalarni ajratish va harakatlar bo'yicha javobgarlik.",
    overdue: (days) => `${days} kun kechikkan`,
    dueSoon: (days) => `T-${days} kun`,
    demoRiskTitle: "Demo investitsiya yozuvlari strategik portfelda ko'rinib turibdi",
    demoRiskDetail: (count) =>
      `${count} investitsiya yozuvi tashqi e'lon oldidan MIIT/UzInvest manba egasi tomonidan almashtirilishi kerak.`,
    methodologyRiskTitle: "Grantlar va yordam alohida hisob tizimlaridan foydalanadi",
    methodologyRiskDetail:
      "UZ ichki grantlari, USAID dastur yozuvlari va ForeignAssistance.gov yillik majburiyatlarini metodologik tekshiruvsiz qo'shib bo'lmaydi.",
    opportunities: {
      dfc: {
        title: "DFC ramkasini bankka tayyor loyihalar qisqa ro'yxatiga aylantirish",
        detail:
          "Kritik minerallar, infratuzilma va energetika eng yuqori qiymatli ikki tomonlama investitsiya yo'nalishiga aylanishi mumkin.",
      },
      census: {
        title: "Census oylik savdo yangilanishini avtomatlashtirish",
        detail: "Census API tayyor va joriy qilingandan so'ng AQSh tomonidagi savdo ko'rinishini yangilab turadi.",
      },
      visa: {
        title: "Vizasiz rejimni odamlar o'rtasidagi aloqalar KPIiga aylantirish",
        detail: "UZ turizm e'lonlarini State visa va DHS kirish statistikasi bilan juftlang.",
      },
      education: {
        title: "Ta'lim almashinuvini strategik tayanch sifatida qo'shish",
        detail: "Open Doors va universitet hamkorliklari ma'lumotlari ta'lim diplomatiyasini o'lchanadigan qiladi.",
      },
    },
    nextAnchorVisit: (title) => `Keyingi tayanch tashrif: ${title}`,
    anchorDetail: (location, date) => `${location}, ${date}.`,
  },
};

const NEWS_TEXT: Record<string, Partial<Record<ExecutiveLocale, { title: string; detail: string }>>> = {
  "n-gateway-council-roster": {
    ru: {
      title: "Опубликован состав Совета с 13 участниками от Узбекистана и США",
      detail:
        "В реестр включены Саида Мирзиёева, Комил Алламжонов, David L. Fogel, Caleb Orr, Jonathan Henick и другие участники.",
    },
    "uz-latn": {
      title: "Kengash tarkibi O'zbekiston va AQShdan 13 nafar a'zo bilan e'lon qilindi",
      detail:
        "Ro'yxatda Saida Mirziyoyeva, Komil Allamjonov, David L. Fogel, Caleb Orr, Jonathan Henick va boshqa a'zolar bor.",
    },
  },
  "n-gateway-council-2026": {
    ru: {
      title: "Американо-узбекский деловой и инвестиционный совет начал работу в Вашингтоне",
      detail: "Совет провел официальный запуск; делегации обменялись обязательствами по рабочим группам.",
    },
    "uz-latn": {
      title: "AQSh-O'zbekiston biznes va investitsiya kengashi Vashingtonda ish boshladi",
      detail: "Kengash rasmiy ishga tushirildi; delegatsiyalar ishchi guruhlar bo'yicha majburiyatlar almashdi.",
    },
  },
};

const EVENT_TEXT: Record<string, Partial<Record<ExecutiveLocale, { title: string; detail: string }>>> = {
  "e-tiif-2026": {
    ru: {
      title: "ТИИФ 2026: Ташкентский международный инвестиционный форум",
      detail: "Подтверждена площадка с бизнес-форумом Узбекистан-США; состав делегации ожидает подтверждения.",
    },
    "uz-latn": {
      title: "TIIF 2026: Toshkent xalqaro investitsiya forumi",
      detail: "AQSh-O'zbekiston biznes forumi bilan maydon tasdiqlangan; delegatsiya tarkibi kutilmoqda.",
    },
  },
  "e-sd5-2026": {
    ru: {
      title: "Расширенный стратегический диалог: 5-я сессия",
      detail: "Обновленный формат стратегического диалога.",
    },
    "uz-latn": {
      title: "Kengaytirilgan strategik sheriklik muloqoti: 5-sessiya",
      detail: "Yangilangan strategik muloqot formati.",
    },
  },
};

function normalizeLocale(locale?: string): ExecutiveLocale {
  if (locale === "ru") return "ru";
  if (locale === "uz-latn") return "uz-latn";
  return "en";
}

function daysUntil(date: string, asOf = AS_OF) {
  const target = new Date(`${date}T00:00:00Z`).getTime();
  const now = new Date(`${asOf}T00:00:00Z`).getTime();
  return Math.ceil((target - now) / (24 * 60 * 60 * 1000));
}

/** Last day of a roadmap step's "YYYY-MM" due month, ISO date string. */
function stepDueDate(due: string): string {
  const [y, m] = due.split("-").map(Number);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${due}-${String(lastDay).padStart(2, "0")}`;
}

function actionFromRoadmapStep(
  row: { project: RoadmapProject; step: RoadmapStep },
  locale: ExecutiveLocale,
  copy = COPY[locale],
): ExecutiveItem {
  const { project, step } = row;
  const dueDate = stepDueDate(step.due);
  const delta = daysUntil(dueDate);
  const dueText = delta < 0 ? copy.overdue(Math.abs(delta)) : copy.dueSoon(delta);
  const health = stepHealth(step, new Date(`${AS_OF}T00:00:00Z`));
  const tone: ExecutiveItemTone =
    health === "overdue" ? "critical" : health === "due-soon" ? "watch" : health === "done" ? "positive" : "neutral";
  return {
    id: step.id,
    title: roadmapStepTitle(step, locale),
    detail: `${roadmapProjectTitle(project, locale)} · ${dueText}`,
    owner: step.owners.join(", "),
    due: dueDate,
    href: "/roadmaps",
    tone,
    sourceId: project.sourceId,
  };
}

export function buildExecutiveBriefing(localeInput?: string): ExecutiveBriefing {
  const locale = normalizeLocale(localeInput);
  const copy = COPY[locale];
  const sourceSummary = sourceQualitySummary(new Date(`${AS_OF}T00:00:00Z`));
  const asOfDate = new Date(`${AS_OF}T00:00:00Z`);
  const steps = allRoadmapSteps();
  const overdue = steps.filter((row) => stepHealth(row.step, asOfDate) === "overdue");
  const watch = steps.filter((row) => stepHealth(row.step, asOfDate) === "due-soon");
  const dueSoon = steps
    .filter((row) => row.step.state !== "done")
    .sort((a, b) => a.step.due.localeCompare(b.step.due))
    .slice(0, 5);
  const demoInvestments = investments.filter((item) => item.is_demo).length;
  const totalInvestmentValue = investments.reduce((sum, item) => sum + item.valueMusd, 0);
  const anchor = nextAnchorVisit(new Date(`${AS_OF}T00:00:00Z`));
  const latestNews = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);
  const upcomingEvents = events
    .filter((event) => daysUntil(event.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 2);

  return {
    asOf: AS_OF,
    headline: copy.headline,
    readout: copy.readout,
    metrics: [
      { label: "Priority actions", value: dueSoon.length.toString(), tone: "watch" },
      { label: "Overdue", value: overdue.length.toString(), tone: overdue.length ? "critical" : "positive" },
      { label: "Watchlist", value: watch.length.toString(), tone: watch.length ? "watch" : "positive" },
      { label: "Investment pipeline", value: `$${(totalInvestmentValue / 1000).toFixed(1)}B`, tone: "positive" },
      {
        label: "Demo investment rows",
        value: demoInvestments.toString(),
        tone: demoInvestments ? "watch" : "positive",
      },
      {
        label: "Live-ready connectors",
        value: `${externalDataSummary.liveReady}/${externalDataSummary.total}`,
        tone: "positive",
      },
      { label: "Fresh sources", value: `${sourceSummary.fresh}/${sourceSummary.total}`, tone: "positive" },
      { label: "Relationship pillars", value: relationshipPillars.length.toString(), tone: "neutral" },
    ],
    priorityActions: dueSoon.map((row) => actionFromRoadmapStep(row, locale, copy)),
    risks: (
      [
        ...overdue.map((row) => actionFromRoadmapStep(row, locale, copy)),
        {
          id: "risk-demo-investments",
          title: copy.demoRiskTitle,
          detail: copy.demoRiskDetail(demoInvestments),
          owner: localizedOwner("MIIT / UzInvest / Situational Center", locale),
          href: "/investments",
          tone: demoInvestments ? ("watch" as const) : ("positive" as const),
          sourceId: "input_figma_pdf",
        },
        {
          id: "risk-methodology-mix",
          title: copy.methodologyRiskTitle,
          detail: copy.methodologyRiskDetail,
          owner: localizedOwner("Situational Center data lead", locale),
          href: "/grants",
          tone: "watch",
          sourceId: "foreign_assistance_gov",
        },
      ] satisfies ExecutiveItem[]
    ).slice(0, 5),
    opportunities: [
      {
        id: "opp-dfc",
        title: copy.opportunities.dfc.title,
        detail: copy.opportunities.dfc.detail,
        owner: localizedOwner("MIIT / DFC liaison", locale),
        href: "/investments",
        tone: "positive",
        sourceId: "dfc_joint_framework",
      },
      {
        id: "opp-census-live",
        title: copy.opportunities.census.title,
        detail: copy.opportunities.census.detail,
        owner: localizedOwner("Data engineering", locale),
        href: "/trade",
        tone: "positive",
        sourceId: "census_intl_trade_api",
      },
      {
        id: "opp-visa",
        title: copy.opportunities.visa.title,
        detail: copy.opportunities.visa.detail,
        owner: localizedOwner("Tourism Committee / MFA", locale),
        href: "/visits",
        tone: "positive",
        sourceId: "govuz_us_visa_free_2026",
      },
      {
        id: "opp-education",
        title: copy.opportunities.education.title,
        detail: copy.opportunities.education.detail,
        owner: localizedOwner("MFA / Higher Education Ministry", locale),
        href: "/grants",
        tone: "neutral",
        sourceId: "iie_open_doors",
      },
    ],
    changes: [
      ...latestNews.map((item): ExecutiveItem => ({
        id: item.id,
        title: NEWS_TEXT[item.id]?.[locale]?.title ?? item.title,
        detail: NEWS_TEXT[item.id]?.[locale]?.detail ?? item.summary,
        owner: item.source,
        due: item.date,
        href: "/visits",
        tone: item.tonality === "positive" ? "positive" : "neutral",
        sourceId: item.sourceId,
      })),
      ...upcomingEvents.map((item): ExecutiveItem => ({
        id: item.id,
        title: EVENT_TEXT[item.id]?.[locale]?.title ?? item.title,
        detail: EVENT_TEXT[item.id]?.[locale]?.detail ?? item.description,
        owner: item.location,
        due: item.date,
        href: "/visits",
        tone: "neutral" as const,
        sourceId: item.sourceId,
      })),
      ...(anchor
        ? [
            {
              id: `anchor-${anchor.id}`,
              title: copy.nextAnchorVisit(anchor.title),
              detail: copy.anchorDetail(anchor.location, anchor.date),
              owner: anchor.participantsUz[0] ?? "Situational Center",
              due: anchor.date,
              href: "/visits",
              tone: "watch" as const,
              sourceId: anchor.sourceId,
            },
          ]
        : []),
    ].slice(0, 5),
  };
}
