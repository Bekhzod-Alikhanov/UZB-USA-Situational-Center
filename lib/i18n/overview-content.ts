/**
 * Localized content for overview data entities — commitment titles, owner
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

/** Commitment titles keyed by `data/commitments.ts` id. */
const COMMITMENT_TITLES: Record<string, Localized> = {
  "cm-council-cadence": {
    ru: "Установить рабочий ритм Совета и реестр рабочих групп",
    "uz-latn": "Kengashning ish ritmi va ishchi guruhlar reestrini belgilash",
  },
  "cm-council-roster": {
    ru: "Справочник членов Совета — официальная публикация и валидация",
    "uz-latn": "Kengash a'zolari ma'lumotnomasi — rasmiy e'lon va tasdiqlash",
  },
  "cm-dfc-pipeline": {
    ru: "Подготовить приоритетный портфель для рамочного соглашения DFC",
    "uz-latn": "DFC qo'shma investitsiya ramkasi uchun ustuvor portfel tayyorlash",
  },
  "cm-dfc-readiness": {
    ru: "Матрица готовности проектов для шорт-листа DFC",
    "uz-latn": "DFC qisqa ro'yxati uchun loyiha tayyorligi matritsasi",
  },
  "cm-exim-pipeline": {
    ru: "Определить возможности экспортного финансирования, готовые для EXIM",
    "uz-latn": "EXIM uchun tayyor eksport moliyalashtirish imkoniyatlarini aniqlash",
  },
  "cm-minerals-mou": {
    ru: "Меморандум по критическим минералам — рамка ежеквартального совместного обзора",
    "uz-latn": "Kritik minerallar bo'yicha memorandum — choraklik qo'shma ko'rib chiqish ramkasi",
  },
  "cm-minerals-survey": {
    ru: "Протокол обмена данными геологической разведки с USGS",
    "uz-latn": "USGS bilan geologik qidiruv ma'lumotlari almashinuvi protokoli",
  },
  "cm-agreement-register": {
    ru: "Преобразовать 138 агрегированных соглашений в реестр уровня отдельных документов",
    "uz-latn": "138 ta umumiy kelishuvni hujjat darajasidagi reestrga aylantirish",
  },
  "cm-visit-pack": {
    ru: "Завершить печатный шаблон пакета подготовки визита",
    "uz-latn": "Tashrifga tayyorgarlik paketi shablonini yakunlash",
  },
  "cm-trade-agenda": {
    ru: "Подготовить перечень вопросов по торговому соглашению после встречи с USTR",
    "uz-latn": "USTR uchrashuvidan so'ng savdo kelishuvi bo'yicha masalalar ro'yxatini tayyorlash",
  },
  "cm-wto-implementation": {
    ru: "Итоги переговоров о доступе на рынки ВТО — отслеживание реализации",
    "uz-latn": "JST bozorga kirish bo'yicha muzokaralar natijalari — amalga oshirishni kuzatish",
  },
  "cm-visa-free-rollout": {
    ru: "30-дневный безвизовый режим для граждан США — операционный запуск",
    "uz-latn": "AQSh fuqarolari uchun 30 kunlik vizasiz rejim — operatsion ishga tushirish",
  },
  "cm-investment-platform": {
    ru: "Рабочий план реализации инвестиционной платформы",
    "uz-latn": "Investitsiya platformasi bo'yicha amalga oshirish rejasi",
  },
  "cm-council-tashkent-may": {
    ru: "Рабочая сессия Совета в Ташкенте — повестка и результаты",
    "uz-latn": "Kengashning Toshkentdagi ishchi sessiyasi — kun tartibi va natijalar",
  },
  "cm-air-products-followup": {
    ru: "Диалог по эксплуатационной фазе проекта Air Products GTL",
    "uz-latn": "Air Products GTL loyihasining ishlash bosqichi bo'yicha muloqot",
  },
  "cm-usaid-strategy-review": {
    ru: "Среднесрочный обзор стратегии USAID по развитию страны",
    "uz-latn": "USAID mamlakat taraqqiyoti strategiyasini oraliq ko'rib chiqish",
  },
  "cm-project-cure-tranche": {
    ru: "Project C.U.R.E. — финальная поставка для клиник Самарканда",
    "uz-latn": "Project C.U.R.E. — Samarqand klinikalariga yakuniy yetkazib berish",
  },
};

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

export function localizedCommitmentTitle(id: string, fallback: string, locale?: string): string {
  const l = normalizeOverviewLocale(locale);
  if (l === "en") return fallback;
  return COMMITMENT_TITLES[id]?.[l] ?? fallback;
}

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
