/**
 * Localized content for overview data entities — owner
 * labels, Situational Center milestone titles, and connector cadence phrases.
 *
 * The English source-of-truth stays in the `data/*.ts` modules; this file only
 * holds the ru / uz-latn translations plus pure lookup helpers. It deliberately
 * imports NO data modules so a client component (e.g. `RiskRadar`) and a
 * server-side data builder (e.g. `data/executive.ts`) can share one source of
 * truth without pulling heavy data into the client bundle.
 *
 * Names of foreign agencies/programmes that read identically across languages
 * (DFC, EXIM, USTR, USAID, USGS, WTO, GTL, BIT) are kept as-is per the project
 * localization rules; only the surrounding Russian/Uzbek copy is translated.
 */

export type OverviewLocale = "en" | "ru" | "uz-latn";

function normalizeOverviewLocale(locale?: string): OverviewLocale {
  if (locale === "ru") return "ru";
  if (locale === "uz-latn") return "uz-latn";
  return "en";
}

type Localized = { ru: string; "uz-latn": string };

/** Commitment / opportunity owner labels keyed by the English owner string. */
const OWNER_LABELS: Record<string, Localized> = {
  "Council Secretariat / MIIT": {
    ru: "Секретариат Совета / МИПТ",
    "uz-latn": "Kengash kotibiyati / IISV",
  },
  "Council Secretariat": {
    ru: "Секретариат Совета",
    "uz-latn": "Kengash kotibiyati",
  },
  "MIIT / FRDU / DFC counterparts": {
    ru: "МИПТ / УФРР / партнёры DFC",
    "uz-latn": "IISV / UzFRR / DFC hamkorlari",
  },
  "MIIT + Ministry of Mining and Geology": {
    ru: "МИПТ + Министерство горнодобычи и геологии",
    "uz-latn": "IISV + Kon-geologiya vazirligi",
  },
  "EXIM liaison / Uzbek line ministries": {
    ru: "Координатор EXIM / профильные министерства Узбекистана",
    "uz-latn": "EXIM muvofiqlashtiruvchisi / O'zbekiston tarmoq vazirliklari",
  },
  "MFA + Ministry of Mining and Geology": {
    ru: "МИД + Министерство горнодобычи и геологии",
    "uz-latn": "TIV + Kon-geologiya vazirligi",
  },
  "UzGeo + USGS": {
    ru: "Узгеология + USGS",
    "uz-latn": "Uzgeologiya + USGS",
  },
  "MFA legal department + Situational Center": {
    ru: "Юридический департамент МИД + Ситуационный центр",
    "uz-latn": "TIV yuridik departamenti + Situatsion markaz",
  },
  "MIIT / USTR liaison": {
    ru: "МИПТ / координатор USTR",
    "uz-latn": "IISV / USTR muvofiqlashtiruvchisi",
  },
  "MIIT + USTR": {
    ru: "МИПТ + USTR",
    "uz-latn": "IISV + USTR",
  },
  "Ministry of Foreign Affairs + Tourism Committee": {
    ru: "МИД + Комитет по туризму",
    "uz-latn": "TIV + Turizm qo'mitasi",
  },
  "MIIT + DFC + FRDU": {
    ru: "МИПТ + DFC + УФРР",
    "uz-latn": "IISV + DFC + UzFRR",
  },
  "MIIT + Uzbekistan GTL": {
    ru: "МИПТ + Uzbekistan GTL",
    "uz-latn": "IISV + Uzbekistan GTL",
  },
  "Ministry of Health + U.S. Embassy": {
    ru: "Министерство здравоохранения + Посольство США",
    "uz-latn": "Sog'liqni saqlash vazirligi + AQSh elchixonasi",
  },
  "MIIT / UzInvest / Situational Center": {
    ru: "МИПТ / UzInvest / Ситуационный центр",
    "uz-latn": "IISV / UzInvest / Situatsion markaz",
  },
  "Situational Center": {
    ru: "Ситуационный центр",
    "uz-latn": "Situatsion markaz",
  },
  "Situational Center data lead": {
    ru: "Руководитель данных Ситуационного центра",
    "uz-latn": "Situatsion markaz ma'lumotlar rahbari",
  },
  // Opportunity owners (from data/executive.ts opportunities)
  "MIIT / DFC liaison": {
    ru: "МИПТ / координатор DFC",
    "uz-latn": "IISV / DFC muvofiqlashtiruvchisi",
  },
  "Data engineering": {
    ru: "Инженерия данных",
    "uz-latn": "Ma'lumotlar muhandisligi",
  },
  "Tourism Committee / MFA": {
    ru: "Комитет по туризму / МИД",
    "uz-latn": "Turizm qo'mitasi / TIV",
  },
  "MFA / Higher Education Ministry": {
    ru: "МИД / Министерство высшего образования",
    "uz-latn": "TIV / Oliy ta'lim vazirligi",
  },
};

/** Situational Center milestone titles keyed by `data/center-milestones.ts` stage. */
const MILESTONE_TITLES: Record<number, Localized> = {
  1: { ru: "Запуск Центра", "uz-latn": "Markazni ishga tushirish" },
  2: {
    ru: "Ежемесячный мониторинг предстоящих визитов делегаций Узбекистана в США",
    "uz-latn": "O'zbekiston delegatsiyalarining AQShga bo'lajak tashriflarini oylik monitoring qilish",
  },
  3: {
    ru: "Пакет улучшений платформы по итогам пилотного тестирования",
    "uz-latn": "Pilot sinovdan so'ng platformani yaxshilash to'plami",
  },
  4: {
    ru: "Запуск системы экспертизы визитов",
    "uz-latn": "Tashriflar ekspertizasi tizimini ishga tushirish",
  },
  5: {
    ru: "Приоритетные направления сотрудничества с США",
    "uz-latn": "AQSh bilan hamkorlikning ustuvor yo'nalishlari",
  },
  6: {
    ru: "Полугодовой отчёт о результатах в Администрацию Президента",
    "uz-latn": "Prezident Administratsiyasiga olti oylik natijalar hisoboti",
  },
  7: {
    ru: "Обновление базы инвестиционных проектов",
    "uz-latn": "Investitsiya loyihalari bazasini yangilash",
  },
  8: {
    ru: "Анализ реформ США и новые двусторонние инициативы",
    "uz-latn": "AQSh islohotlari tahlili va yangi ikki tomonlama tashabbuslar",
  },
  9: {
    ru: "Повышение квалификации руководства министерств и регионов",
    "uz-latn": "Vazirliklar va hududlar rahbariyati malakasini oshirish",
  },
  10: {
    ru: "Передача пакета документов по визиту в Специальный штаб",
    "uz-latn": "Tashrif hujjatlari paketini Maxsus shtabga topshirish",
  },
  11: {
    ru: "Глубокий анализ институциональных практик США",
    "uz-latn": "AQSh institutsional amaliyotlarini chuqur tahlil qilish",
  },
  12: {
    ru: "Годовой итоговый отчёт в Администрацию Президента",
    "uz-latn": "Prezident Administratsiyasiga yillik yakuniy hisobot",
  },
};

/** Connector cadence phrases keyed by the English value in `data/external-data.ts`. */
const CADENCE_LABELS: Record<string, Localized> = {
  Monthly: { ru: "Ежемесячно", "uz-latn": "Oylik" },
  "Annual with revisions": {
    ru: "Ежегодно с пересмотрами",
    "uz-latn": "Yillik, qayta ko'rib chiqish bilan",
  },
  "Annual / quarterly depending dataset": {
    ru: "Ежегодно / ежеквартально (зависит от набора данных)",
    "uz-latn": "Yillik / choraklik (ma'lumotlar to'plamiga qarab)",
  },
  "Monthly / quarterly / annual": {
    ru: "Ежемесячно / ежеквартально / ежегодно",
    "uz-latn": "Oylik / choraklik / yillik",
  },
  "Approx. monthly": { ru: "Примерно ежемесячно", "uz-latn": "Taxminan oylik" },
  "Quarterly / latest reporting period": {
    ru: "Ежеквартально / последний отчётный период",
    "uz-latn": "Choraklik / so'nggi hisobot davri",
  },
  Periodic: { ru: "Периодически", "uz-latn": "Davriy" },
  Quarterly: { ru: "Ежеквартально", "uz-latn": "Choraklik" },
  "Dataset dependent": {
    ru: "Зависит от набора данных",
    "uz-latn": "Ma'lumotlar to'plamiga bog'liq",
  },
  "Daily / monthly / quarterly": {
    ru: "Ежедневно / ежемесячно / ежеквартально",
    "uz-latn": "Kunlik / oylik / choraklik",
  },
  "Monthly and annual": {
    ru: "Ежемесячно и ежегодно",
    "uz-latn": "Oylik va yillik",
  },
  Annual: { ru: "Ежегодно", "uz-latn": "Yillik" },
  Live: { ru: "В реальном времени", "uz-latn": "Real vaqt" },
};

export function localizedOwner(owner: string, locale?: string): string {
  const l = normalizeOverviewLocale(locale);
  if (l === "en") return owner;
  return OWNER_LABELS[owner]?.[l] ?? owner;
}

export function localizedMilestoneTitle(stage: number, fallback: string, locale?: string): string {
  const l = normalizeOverviewLocale(locale);
  if (l === "en") return fallback;
  return MILESTONE_TITLES[stage]?.[l] ?? fallback;
}

export function localizedCadence(cadence: string, locale?: string): string {
  const l = normalizeOverviewLocale(locale);
  if (l === "en") return cadence;
  return CADENCE_LABELS[cadence]?.[l] ?? cadence;
}

/** Diplomatic event titles keyed by `data/events.ts` id. */
const EVENT_TITLES: Record<string, Localized> = {
  "e-dfc-framework-2026": {
    ru: "DFC объявил о намерении создать совместную инвестиционную платформу (Heads of Terms)",
    "uz-latn": "DFC qo'shma investitsiya platformasini tuzish niyatini e'lon qildi (Heads of Terms)",
  },
  "e-council-launch-washington-2026": {
    ru: "Американо-узбекский деловой и инвестиционный совет — официальный запуск в Вашингтоне",
    "uz-latn": "Amerika-O'zbekiston biznes va investitsiya kengashi — Vashingtonda rasmiy ochilish",
  },
  "e-ustr-council-2026": {
    ru: "Обсуждение инвестиционного профиля: Совет и USTR",
    "uz-latn": "Kengash va USTR investitsiya profili muhokamasi",
  },
  "e-tiif-2026": {
    ru: "TIIF 2026 — Ташкентский международный инвестиционный форум (бизнес-форум США–Узбекистан)",
    "uz-latn": "TIIF 2026 — Toshkent xalqaro investitsiya forumi (AQSH–O'zbekiston biznes-forumi)",
  },
  "e-davos-cp-2026": {
    ru: "Подписание Хартии Совета мира",
    "uz-latn": "Tinchlik kengashi Xartiyasining imzolanishi",
  },
  "e-minerals-feb-2026": {
    ru: "Министерская конференция по критическим минералам",
    "uz-latn": "Muhim minerallar bo'yicha vazirlar konferensiyasi",
  },
  "e-b51-bishkek-2026": {
    ru: "Бизнес-форум B5+1 — Бишкек",
    "uz-latn": "B5+1 biznes-forumi — Bishkek",
  },
  "e-council-peace-feb-2026": {
    ru: "Совет мира — учредительное заседание",
    "uz-latn": "Tinchlik kengashi — ta'sis yig'ilishi",
  },
  "e-us-uz-bc-april-2026": {
    ru: "Деловой и инвестиционный совет США–УЗ — первая полноформатная сессия",
    "uz-latn": "AQSH–O'z biznes va investitsiya kengashi — birinchi to'liq sessiya",
  },
  "e-sd5-2026": {
    ru: "Расширенный диалог стратегического партнёрства — 5-е заседание",
    "uz-latn": "Kengaytirilgan strategik sheriklik muloqoti — 5-sessiya",
  },
};

/** Visit titles keyed by `data/visits.ts` id. */
const VISIT_TITLES: Record<string, Localized> = {
  "v-2025-03-miller": {
    ru: "Визит конгрессвумен Кэрол Миллер в Узбекистан",
    "uz-latn": "Kongress a'zosi Kerol Millerning O'zbekistonga tashrifi",
  },
  "v-2025-04-saidov": {
    ru: "Визит главы МИД Бахтиёра Саидова в Вашингтон",
    "uz-latn": "TIV rahbari Baxtiyor Saidovning Vashingtonga tashrifi",
  },
  "v-2025-08-zampolli": {
    ru: "Визит спецпосланника Паоло Дзамполли в Узбекистан",
    "uz-latn": "Maxsus elchi Paolo Zampollining O'zbekistonga tashrifi",
  },
  "v-2025-09-unga": {
    ru: "Двусторонняя встреча на 80-й ГА ООН",
    "uz-latn": "BMT BAning 80-sessiyasida ikki tomonlama uchrashuv",
  },
  "v-2025-10-gor-landau": {
    ru: "Визит спецпосланника Серджо Гора и первого замгоссекретаря Кристофера Ландау",
    "uz-latn": "Maxsus elchi Serjio Gor va davlat kotibi o'rinbosari Kristofer Landau tashrifi",
  },
  "v-2025-11-c5-1": {
    ru: "Президент Мирзиёев — саммит C5+1 в Вашингтоне",
    "uz-latn": "Prezident Mirziyoyev — Vashingtonda C5+1 sammiti",
  },
  "v-2025-11-adams": {
    ru: "Визит мэра Нью-Йорка Эрика Адамса в Узбекистан",
    "uz-latn": "Nyu-York meri Erik Adamsning O'zbekistonga tashrifi",
  },
  "v-2025-11-utah": {
    ru: "Делегация штата Юта (элдер Беднар, Stirling Foundation)",
    "uz-latn": "Yuta shtati delegatsiyasi (Elder Bednar, Stirling Foundation)",
  },
  "v-2025-11-miit": {
    ru: "Визит министра инвестиций, промышленности и торговли в США",
    "uz-latn": "Investitsiya, sanoat va savdo vazirining AQShga tashrifi",
  },
  "v-2026-01-davos": {
    ru: "Подписание Хартии Совета мира",
    "uz-latn": "Tinchlik kengashi Xartiyasining imzolanishi",
  },
  "v-2026-02-04-minerals": {
    ru: "Министерская по критическим минералам — подписан меморандум",
    "uz-latn": "Muhim minerallar vazirlar yig'ini — memorandum imzolandi",
  },
  "v-2026-02-06-gor": {
    ru: "Визит спецпосланника Серджо Гора — 1-я сессия Делового и инвестиционного совета США–УЗ",
    "uz-latn": "Maxsus elchi Serjio Gor tashrifi — AQSH–O'z biznes va investitsiya kengashining 1-sessiyasi",
  },
  "v-2026-02-17-state": {
    ru: "Президент Мирзиёев — рабочий визит в Вашингтон (учредительное заседание Совета мира)",
    "uz-latn": "Prezident Mirziyoyev — Vashingtonga ishchi tashrif (Tinchlik kengashi ta'sis yig'ilishi)",
  },
  "v-2026-04-upcoming-council": {
    ru: "Первая полноформатная сессия Делового и инвестиционного совета США–УЗ (план)",
    "uz-latn": "AQSH–O'z biznes va investitsiya kengashining birinchi to'liq sessiyasi (reja)",
  },
};

export function localizedEventTitle(id: string, fallback: string, locale?: string): string {
  const l = normalizeOverviewLocale(locale);
  if (l === "en") return fallback;
  return EVENT_TITLES[id]?.[l] ?? fallback;
}

export function localizedVisitTitle(id: string, fallback: string, locale?: string): string {
  const l = normalizeOverviewLocale(locale);
  if (l === "en") return fallback;
  return VISIT_TITLES[id]?.[l] ?? fallback;
}
