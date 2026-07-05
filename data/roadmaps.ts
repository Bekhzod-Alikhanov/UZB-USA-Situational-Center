/**
 * Regional roadmap monitoring — the Center's core registry.
 *
 * Source of truth: two hokimiyat-approved "ЙЎЛ ХАРИТАСИ" documents signed
 * after the regions' delegation visits to the USA:
 *   · Samarkand region — visit 10–17 May 2026 — 48 projects, $1.5B declared
 *   · Khorezm region  — visit 26–31 May 2026 — 13 projects, $1.0B declared
 * (sourceIds input_roadmap_samarkand_docx / input_roadmap_khorezm_docx).
 *
 * Task titles are stored VERBATIM in the document language (Uzbek Cyrillic)
 * with a Russian translation (`titleRu`) written at ingestion; the ru locale
 * shows the translation, en/uz-latn show the original (owner's decision).
 * Responsible officials are public officeholders named in the official
 * document — allowed content; personal contact data still is not.
 *
 * Status model (anti-task-tracker principle): a step's health is DERIVED
 * from its due month vs today; the only manual fields are `state`
 * ("done" | "in-progress" | null) and `note`, maintained by the Center for
 * now (hokimiyat self-service forms arrive with the Supabase stage).
 */

export type RoadmapRegionId = "samarkand" | "khorezm";
export type RoadmapStepState = "done" | "in-progress" | null;
export type RoadmapStepHealth = "done" | "on-track" | "due-soon" | "overdue";

/**
 * Stage-2 live override for one step, reduced from the Supabase
 * `roadmap_step_update` journal (see /api/roadmaps/step-updates). `state`
 * present (including null = reset) replaces the static baseline; `note`
 * present replaces the file note. Absent field → baseline wins.
 */
export interface RoadmapStepOverride {
  state?: RoadmapStepState;
  note?: string;
  updatedAt?: string;
  author?: string;
}

export type RoadmapOverrides = Record<string, RoadmapStepOverride>;

export function overrideStep(step: RoadmapStep, overrides?: RoadmapOverrides): RoadmapStep {
  const o = overrides?.[step.id];
  if (!o) return step;
  return {
    ...step,
    state: o.state !== undefined ? o.state : step.state,
    note: o.note !== undefined ? o.note : step.note,
  };
}

export interface RoadmapStep {
  id: string;
  /** Verbatim document text (Uzbek Cyrillic). */
  title: string;
  titleRu: string;
  /** Due month from the document, "YYYY-MM". */
  due: string;
  /** Responsible organizations/officials, verbatim. */
  owners: string[];
  /** Manual execution mark (edited via this file until the forms stage). */
  state: RoadmapStepState;
  /** Center / hokimiyat remark. */
  note?: string;
}

export interface RoadmapProject {
  id: string;
  region: RoadmapRegionId;
  /** № in the source document. */
  num: number;
  title: string;
  titleRu: string;
  initiator: string;
  /** Declared value, $M; null when the document states none. */
  valueMusd: number | null;
  steps: RoadmapStep[];
  sourceId: string;
  is_demo: false;
}

export interface RegionRoadmap {
  region: RoadmapRegionId;
  label: string;
  labelRu: string;
  /** Delegation visit window from the document header. */
  visitDates: string;
  visitDatesRu: string;
  /** Declared totals from the document header. */
  totalValueMusd: number;
  declaredProjects: number;
  sourceId: string;
}

/* ------------------------------------------------------------------ */
/* Step factories for the recurring document boilerplate               */
/* ------------------------------------------------------------------ */

interface StepText {
  t: string;
  ru: string;
}

const VISIT: StepText = {
  t: "Лойиҳа ташаббускорининг вилоятга ташрифини амалга ошириш.",
  ru: "Организация визита инициатора проекта в область.",
};
const VISIT_MOU: StepText = {
  t: "Лойиҳа ташаббускорининг вилоятга ташрифини амалга ошириш, ер майдонини танлаш ва ҳамкорлик меморандумини имзолаш.",
  ru: "Визит инициатора проекта в область, выбор земельного участка и подписание меморандума о сотрудничестве.",
};
const MARKET: StepText = {
  t: "Маркетинг тадқиқот ишларини олиб бориш.",
  ru: "Проведение маркетинговых исследований.",
};
const ESTIMATE: StepText = {
  t: "Лойиҳа смета ҳужжатларини ишлаб чиқиш.",
  ru: "Разработка сметной документации проекта.",
};
const START: StepText = {
  t: "Лойиҳани амалга оширишни бошлаш.",
  ru: "Начало реализации проекта.",
};
const LAND_START: StepText = {
  t: "Ер майдонини расмийлаштириш, лойиҳа ҳужжатларини тайёрлаш ва қурилишни бошлаш.",
  ru: "Оформление земельного участка, подготовка проектной документации и начало строительства.",
};

let stepSeq = 0;
function step(projectId: string, text: StepText, due: string, owners: string[]): RoadmapStep {
  stepSeq += 1;
  return { id: `${projectId}-s${stepSeq}`, title: text.t, titleRu: text.ru, due, owners, state: null };
}

/** The dominant Samarkand pattern: visit → marketing → start. */
function s3(projectId: string, dues: [string, string, string], owners: string[]): RoadmapStep[] {
  stepSeq = 0;
  return [
    step(projectId, VISIT, dues[0], owners),
    step(projectId, MARKET, dues[1], owners),
    step(projectId, START, dues[2], owners),
  ];
}

/** Four-step variant with the estimate stage before start. */
function s4(projectId: string, dues: [string, string, string, string], owners: string[]): RoadmapStep[] {
  stepSeq = 0;
  return [
    step(projectId, VISIT, dues[0], owners),
    step(projectId, MARKET, dues[1], owners),
    step(projectId, ESTIMATE, dues[2], owners),
    step(projectId, START, dues[3], owners),
  ];
}

/** Fully custom steps: [text, due] tuples sharing the project owner list. */
function sx(
  projectId: string,
  items: Array<[StepText | { t: string; ru: string }, string]>,
  owners: string[],
): RoadmapStep[] {
  stepSeq = 0;
  return items.map(([text, due]) => step(projectId, text, due, owners));
}

/* ------------------------------------------------------------------ */
/* Khorezm — 13 projects, $1.0B (visit 26–31 May 2026)                 */
/* ------------------------------------------------------------------ */

const KHZ = "input_roadmap_khorezm_docx";

export const khorezmProjects: RoadmapProject[] = [
  {
    id: "khz-01",
    region: "khorezm",
    num: 1,
    title: "Хива туманида 50 гектар ер майдонида замонавий кўнгилочар марказ ташкил қилиш",
    titleRu: "Создание современного развлекательного центра на участке 50 га в Хивинском районе",
    initiator: "«Heidner Properties»",
    valueMusd: 280,
    steps: sx(
      "khz-01",
      [
        [VISIT_MOU, "2026-08"],
        [
          {
            t: "Маркетинг тадқиқот ишларини олиб бориш ва кўнгилочар марказнинг дастлабки лойиҳасини тайёрлаш.",
            ru: "Проведение маркетинговых исследований и подготовка эскизного проекта развлекательного центра.",
          },
          "2026-09",
        ],
        [LAND_START, "2027-02"],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (Б.Саидов)", "Хива тумани ҳокими (С.Полвонов)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-02",
    region: "khorezm",
    num: 2,
    title: "Урганч ва Хива шаҳарларида кўп қаватли турар-жой мажмуалари барпо этиш",
    titleRu: "Строительство многоэтажных жилых комплексов в городах Ургенч и Хива",
    initiator: "«Heidner Properties»",
    valueMusd: 225,
    steps: sx(
      "khz-02",
      [
        [VISIT_MOU, "2026-08"],
        [MARKET, "2026-09"],
        [LAND_START, "2027-03"],
      ],
      [
        "Хоразм вилояти ҳокими ўринбосари (С.Бекчанов)",
        "Урганч шаҳар ҳокими (Б.Раджабов)",
        "Хива шаҳар ҳокими (Т.Давлетов)",
      ],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-03",
    region: "khorezm",
    num: 3,
    title: "Урганч ва Хива шаҳарларида 100 гектар ер майдонида тематик парк ташкил қилиш",
    titleRu: "Создание тематического парка на участке 100 га в городах Ургенч и Хива",
    initiator: "«Infinity city»",
    valueMusd: 220,
    steps: sx(
      "khz-03",
      [
        [
          {
            t: "Лойиҳа ташаббускорининг Урганч ва Хива шаҳарларига ташрифини ташкил қилиш.",
            ru: "Организация визита инициатора проекта в города Ургенч и Хива.",
          },
          "2026-09",
        ],
        [
          {
            t: "Маркетинг тадқиқотларини олиб бориш ва бозор таҳлилини ўтказиш.",
            ru: "Проведение маркетинговых исследований и анализа рынка.",
          },
          "2026-11",
        ],
        [
          {
            t: "Лойиҳанинг смета ҳужжатларини тайёрлаш ва тасдиқлаш.",
            ru: "Подготовка и утверждение сметной документации проекта.",
          },
          "2027-02",
        ],
        [LAND_START, "2027-05"],
      ],
      [
        "Хоразм вилояти ҳокими ўринбосари (Б.Саидов)",
        "Урганч шаҳар ҳокими (Б.Раджабов)",
        "Хива шаҳар ҳокими (Т.Давлетов)",
      ],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-04",
    region: "khorezm",
    num: 4,
    title: "«Khorezm Innovation & Venture Pilot Hub» ташкил этиш",
    titleRu: "Создание «Khorezm Innovation & Venture Pilot Hub»",
    initiator: "«Plug and Play Tech Center»",
    valueMusd: 30,
    steps: sx(
      "khz-04",
      [
        [
          {
            t: "Ташаббускор билан онлайн мулоқот ўтказиш ва лойиҳани муҳокама қилиш.",
            ru: "Онлайн-переговоры с инициатором и обсуждение проекта.",
          },
          "2026-07",
        ],
        [MARKET, "2026-09"],
        [{ t: "Лойиҳани амалга ошириш ишларини бошлаш.", ru: "Начало работ по реализации проекта." }, "2027-03"],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (А.Дусчанов)", "IT парк Хоразм вилояти филиали (Ҳ.Бобожонов)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-05",
    region: "khorezm",
    num: 5,
    title: "Рақамли инвестиция бошқаруви ва маълумотлар марказини ривожлантириш",
    titleRu: "Развитие центра цифрового управления инвестициями и обработки данных",
    initiator: "«DNC Partners»",
    valueMusd: 25,
    steps: sx(
      "khz-05",
      [
        [
          {
            t: "Лойиҳа ташаббускорлари билан лойиҳани амалга ошириш юзасидан онлайн мулоқот ташкил қилиш.",
            ru: "Организация онлайн-переговоров с инициаторами по реализации проекта.",
          },
          "2026-09",
        ],
        [MARKET, "2026-10"],
        [{ t: "Лойиҳани амалга ошириш ишларини бошлаш.", ru: "Начало работ по реализации проекта." }, "2027-02"],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (А.Дусчанов)", "IT парк Хоразм вилояти филиали (Ҳ.Бобожонов)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-06",
    region: "khorezm",
    num: 6,
    title: "Тиббий суғурта доирасида травматология йўналишида замонавий клиника ташкил қилиш",
    titleRu: "Создание современной травматологической клиники в рамках медицинского страхования",
    initiator: "«Vital Surance»",
    valueMusd: 20,
    steps: sx(
      "khz-06",
      [
        [VISIT_MOU, "2026-08"],
        [MARKET, "2026-10"],
        [ESTIMATE, "2027-03"],
        [{ t: "Лойиҳани амалга ошириш ишларини бошлаш.", ru: "Начало работ по реализации проекта." }, "2027-06"],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (С.Салаев)", "Хоразм вилояти соғлиқни сақлаш бошқармаси (К.Тангрибердиев)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-07",
    region: "khorezm",
    num: 7,
    title: "Турар-жой мажмуалари барпо этиш",
    titleRu: "Строительство жилых комплексов",
    initiator: "«Supreme International Construction»",
    valueMusd: 55,
    steps: sx(
      "khz-07",
      [
        [VISIT_MOU, "2026-06"],
        [MARKET, "2026-09"],
        [LAND_START, "2027-03"],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (С.Бекчанов)", "Хоразм вилояти қурилиш бошқармаси (М.Қаландаров)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-08",
    region: "khorezm",
    num: 8,
    title: "Тиббий клиника ташкил қилиш",
    titleRu: "Создание медицинской клиники",
    initiator: "«Supreme International Construction»",
    valueMusd: 45,
    steps: sx(
      "khz-08",
      [
        [VISIT, "2026-06"],
        [MARKET, "2026-10"],
        [ESTIMATE, "2027-02"],
        [{ t: "Лойиҳа қурилиш ишларини бошлаш.", ru: "Начало строительных работ по проекту." }, "2027-04"],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (С.Салаев)", "Хоразм вилояти соғлиқни сақлаш бошқармаси (К.Тангрибердиев)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-09",
    region: "khorezm",
    num: 9,
    title: "Урганч шаҳридаги эски «Трансгаз» биноси негизида янги меҳмонхона ташкил қилиш",
    titleRu: "Создание новой гостиницы на базе старого здания «Трансгаз» в Ургенче",
    initiator: "«Choice Hotels»",
    valueMusd: 40,
    steps: sx(
      "khz-09",
      [
        [
          {
            t: "Лойиҳа ташаббускорининг вилоятга ташрифини ташкил этиш ва аукцион савдоларида иштирок этиб бинони олиш.",
            ru: "Организация визита инициатора в область и приобретение здания через аукционные торги.",
          },
          "2026-06",
        ],
        [ESTIMATE, "2026-09"],
        [MARKET, "2026-11"],
        [{ t: "Лойиҳани амалга ошириш ишларини бошлаш.", ru: "Начало работ по реализации проекта." }, "2027-03"],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (А.Дусчанов)", "Урганч шаҳар ҳокими (Б.Раджабов)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-10",
    region: "khorezm",
    num: 10,
    title:
      "Соғлиқни сақлаш, экология, тадбиркорликни ривожлантириш, мактаб ва тиббий муассасаларни жиҳозлаш йўналишларида грант ва техник кўмак лойиҳаларини биргаликда ишлаб чиқиш",
    titleRu:
      "Совместная разработка грантовых проектов и техпомощи: здравоохранение, экология, предпринимательство, оснащение школ и медучреждений",
    initiator: "«Asia Foundation», «Zakat», «Project C.U.R.E.», «PATH», «Visa Foundation»",
    valueMusd: 5,
    steps: sx(
      "khz-10",
      [
        [
          {
            t: "Фонд раҳбариятлари билан онлайн учрашувлар ташкил этиш ва ҳамкорлик имкониятларини муҳокама қилиш.",
            ru: "Онлайн-встречи с руководством фондов и обсуждение возможностей сотрудничества.",
          },
          "2026-08",
        ],
        [
          {
            t: "Грант маблағларини жалб қилиш учун лойиҳа концепцияси ва зарур ҳужжатларни ишлаб чиқиш.",
            ru: "Разработка концепции проекта и документов для привлечения грантовых средств.",
          },
          "2026-09",
        ],
        [
          {
            t: "Зарур грант дастурларини аниқлаб, ариза топшириш орқали молиявий маблағларни жалб қилиш.",
            ru: "Определение грантовых программ и привлечение финансирования через подачу заявок.",
          },
          "2026-12",
        ],
      ],
      [
        "Хоразм вилояти ҳокими ўринбосари (А.Дусчанов)",
        "Хоразм вилояти соғлиқни сақлаш бошқармаси (К.Тангрибердиев)",
        "Хоразм вилояти мактабгача ва мактаб таълими бошқармаси (Ҳ.Бектемиров)",
      ],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-11",
    region: "khorezm",
    num: 11,
    title: "Урганч туманида болалар боғчаси ташкил қилиш",
    titleRu: "Создание детского сада в Ургенчском районе",
    initiator: "Камол Саидов",
    valueMusd: 15,
    steps: sx(
      "khz-11",
      [
        [
          {
            t: "Лойиҳа ташаббускорининг Урганч туманига ташрифини ташкил этиш.",
            ru: "Организация визита инициатора проекта в Ургенчский район.",
          },
          "2026-07",
        ],
        [ESTIMATE, "2026-09"],
        [{ t: "Қурилиш ва жиҳозлаш ишларини бошлаш.", ru: "Начало строительных работ и оснащения." }, "2026-12"],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (А.Дусчанов)", "Урганч тумани ҳокими (Ғ.Султанов)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-12",
    region: "khorezm",
    num: 12,
    title: "Логистика ва транспорт маркази офиси ташкил қилиш",
    titleRu: "Создание офиса логистического и транспортного центра",
    initiator: "«UGL Holding»",
    valueMusd: 20,
    steps: sx(
      "khz-12",
      [
        [
          {
            t: "«UGL Holding» компанияси раҳбариятининг вилоятга ташрифини ташкил этиш.",
            ru: "Организация визита руководства компании «UGL Holding» в область.",
          },
          "2026-07",
        ],
        [
          {
            t: "Логистика ва транспорт хизматларига бўлган талабни аниқлаш мақсадида маркетинг тадқиқотларини ўтказиш.",
            ru: "Маркетинговые исследования спроса на логистические и транспортные услуги.",
          },
          "2026-10",
        ],
        [
          {
            t: "Лойиҳани амалга ошириш ишларини бошлаш, логистика ва транспорт маркази офисини ташкил этиш.",
            ru: "Начало реализации проекта, открытие офиса логистического и транспортного центра.",
          },
          "2027-02",
        ],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (А.Дусчанов)", "IT парк Хоразм вилояти филиали (Ҳ.Бобожонов)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
  {
    id: "khz-13",
    region: "khorezm",
    num: 13,
    title: "IT ва логистика маркази ташкил қилиш",
    titleRu: "Создание IT- и логистического центра",
    initiator: "Нурмухаммад Парпиев",
    valueMusd: 20,
    steps: sx(
      "khz-13",
      [
        [VISIT, "2026-07"],
        [
          {
            t: "IT ва логистика хизматларига бўлган талабни аниқлаш мақсадида маркетинг тадқиқотларини ўтказиш.",
            ru: "Маркетинговые исследования спроса на IT- и логистические услуги.",
          },
          "2027-02",
        ],
        [{ t: "Лойиҳани амалга ошириш ишларини бошлаш.", ru: "Начало работ по реализации проекта." }, "2027-04"],
      ],
      ["Хоразм вилояти ҳокими ўринбосари (А.Дусчанов)", "IT парк Хоразм вилояти филиали (Ҳ.Бобожонов)"],
    ),
    sourceId: KHZ,
    is_demo: false,
  },
];

/* ------------------------------------------------------------------ */
/* Samarkand — 48 projects, $1.5B (visit 10–17 May 2026)               */
/* ------------------------------------------------------------------ */

const SMQ = "input_roadmap_samarkand_docx";

// Recurring responsible parties, verbatim from the document.
const USM = "Самарқанд туман ҳокими (С.Усманов)";
const SAM = "Самарқанд вилоят ҳокимининг ўринбосари (Х.Самиев)";
const ANV = "Вилоят ҳокимлиги (А.Анваров)";
const RUZ = "Иштихон туман ҳокими (Ф.Рузиев)";
const KAD = "Кадастр агентлиги Самарқанд вилоят бошқармаси";
const TUR = "Самарқанд вилояти Туризм бошқармаси";
const QUR = "Самарқанд вилояти Қурилиш ва уй-жой коммунал хўжалиги бошқармаси";
const SOG = "Самарқанд вилояти Соғлиқни сақлаш бошқармаси";
const MAK = "Самарқанд вилояти Мактабгача ва мактаб таълими бошқармаси";
const OLIY = "Олий таълим, фан ва инновациялар вазирлиги Самарқанд вилояти ҳудудий бошқармаси";
const RAQ = "Рақамли технологиялар вазирлиги Самарқанд вилояти ҳудудий шўбаси";
const BOJ = "Самарқанд вилояти Божхона бошқармаси";
const SPORT = "Самарқанд вилояти спорт бошқармаси";
const QISH = "Самарқанд вилояти Қишлоқ хўжалиги бошқармаси";
const KATT = "Каттақўрғон туман ҳокими (Ж.Насриддинов)";

/** The document's dominant deadline pattern: Dec 2026 / Feb 2027 / Apr 2027. */
const D3: [string, string, string] = ["2026-12", "2027-02", "2027-04"];

function smq(
  num: number,
  title: string,
  titleRu: string,
  initiator: string,
  valueMusd: number | null,
  steps: (id: string) => RoadmapStep[],
): RoadmapProject {
  const id = `smq-${String(num).padStart(2, "0")}`;
  return {
    id,
    region: "samarkand",
    num,
    title,
    titleRu,
    initiator,
    valueMusd,
    steps: steps(id),
    sourceId: SMQ,
    is_demo: false,
  };
}

export const samarkandProjects: RoadmapProject[] = [
  smq(
    1,
    "Самарқанд вилояти М-37 йўли бўйида замонавий меҳмонхона, умумий овқатланиш ва дам олиш мажмуасини қуриш",
    "Строительство современной гостиницы, комплекса питания и отдыха вдоль трассы М-37",
    "«ASIA MIX INC»",
    3,
    (id) => s3(id, D3, [USM, SAM, KAD, TUR]),
  ),
  smq(
    2,
    "АҚШга экспорт қилинадиган озиқ-овқат маҳсулотларини қадоқлаш корхонаси, омборхона ва офис қуриш",
    "Строительство предприятия по упаковке экспортируемых в США продуктов, склада и офиса",
    "«AZ HALAL EXPRESS» LLC",
    3,
    (id) => s3(id, D3, [USM, SAM]),
  ),
  smq(3, "Ҳайвонот боғи барпо этиш", "Создание зоопарка", "«AZ HALAL EXPRESS» LLC", 2, (id) =>
    s3(id, D3, [USM, KAD, TUR]),
  ),
  smq(
    4,
    "Гўшт ва гўшт маҳсулотлари ишлаб чиқариш лойиҳасини ташкил этиш",
    "Организация производства мяса и мясной продукции",
    "«786 AUTO REPAIR SHOP» LLC",
    0.5,
    (id) => s3(id, D3, [USM, SAM]),
  ),
  smq(
    5,
    "Самарқанд туманида логистика марказини ташкил этиш",
    "Создание логистического центра в Самаркандском районе",
    "«Toshkent supermarketi» LLC",
    10,
    (id) => s3(id, D3, [USM, SAM]),
  ),
  smq(
    6,
    "Болалар учун TRAMPOLINE PARK қуриш лойиҳасини амалга ошириш",
    "Строительство детского батутного парка (Trampoline Park)",
    "«SLS GROUPS WORLDWIDE» LLC",
    5,
    (id) => s3(id, D3, [USM, SPORT]),
  ),
  smq(
    7,
    "Савдо уйи қуриш лойиҳасини амалга ошириш",
    "Строительство торгового дома",
    "«786 AUTO REPAIR SHOP» LLC",
    1,
    (id) => s3(id, D3, [USM, SAM]),
  ),
  smq(
    8,
    "Самарқанд шаҳрида тиббиёт маркази лойиҳасини амалга ошириш",
    "Создание медицинского центра в городе Самарканде",
    "«LOGEX transport»",
    5,
    (id) => s3(id, D3, [USM, SOG, KAD]),
  ),
  smq(
    9,
    "Булутли технологиялар ва маълумотларни қайта ишлаш маркази ҳамда замонавий трансформаторлар ишлаб чиқариш заводини ташкил этиш",
    "Создание центра облачных технологий и обработки данных, а также завода современных трансформаторов",
    "«ECOLOGY MIRROR GROUP» LLC",
    200,
    (id) => s3(id, ["2026-08", "2026-12", "2027-03"], [ANV, RAQ, KATT]),
  ),
  smq(
    10,
    "Саноат каннабиси етиштириш, халқаро кўнгилочар (казино) маркази ҳамда кончилик соҳасида инвестиция лойиҳаларини амалга ошириш",
    "Выращивание промышленной конопли, международный развлекательный центр (казино) и инвестпроекты в горнодобыче",
    "«SANGITA CAPITAL PARTNERS» LLC",
    250,
    (id) => s3(id, ["2026-06", "2026-12", "2027-03"], [SAM, TUR]),
  ),
  smq(
    11,
    "Самарқанд шаҳрида АҚШ кондитерлик ва болалар озиқ-овқати маҳсулотларининг МДҲ Глобал Хабини очиш",
    "Открытие глобального хаба СНГ по американским кондитерским изделиям и детскому питанию",
    "«TASTY FOOD» LLC",
    5,
    (id) =>
      sx(
        id,
        [
          [
            {
              t: "Самарқанд шаҳрида МДҲ Глобал Хабини ташкил этиш бўйича музокаралар ўтказиш.",
              ru: "Переговоры о создании глобального хаба СНГ в Самарканде.",
            },
            "2026-12",
          ],
          [{ t: "Хаб фаолиятини йўлга қўйиш.", ru: "Запуск деятельности хаба." }, "2027-09"],
          [
            {
              t: "Маҳсулотларни импорт ва реализация қилиш тизимини ташкил этиш.",
              ru: "Организация системы импорта и реализации продукции.",
            },
            "2027-12",
          ],
        ],
        [USM, BOJ],
      ),
  ),
  smq(
    12,
    "Абитуриентларни АҚШ олий ўқув юртларига киришга тайёрлаш, ўқитиш, ҳуқуқий ҳамроҳлик қилиш академиясини очиш",
    "Академия подготовки абитуриентов к поступлению в вузы США, обучения и правового сопровождения",
    "«USA EDUCATION ACADEMY»",
    0.5,
    (id) => s4(id, ["2026-12", "2027-02", "2027-04", "2027-12"], [USM, OLIY]),
  ),
  smq(
    13,
    "Ўзбекистонлик ватандошлар учун халқаро миқёсда ҳуқуқий, ижтимоий-иқтисодий, молиявий хизматлар кўрсатиш онлайн платформасини яратиш",
    "Онлайн-платформа международных правовых, социально-экономических и финансовых услуг для соотечественников",
    "«VATAN GLOBAL ALLIANCE»",
    3,
    (id) =>
      sx(
        id,
        [
          [
            {
              t: "Онлайн платформани яратиш юзасидан хорижий ҳамкорлар билан музокаралар ўтказиш.",
              ru: "Переговоры с зарубежными партнёрами о создании онлайн-платформы.",
            },
            "2026-09",
          ],
          [{ t: "Онлайн платформани ишлаб чиқиш.", ru: "Разработка онлайн-платформы." }, "2027-03"],
          [{ t: "Платформа фаолиятини йўлга қўйиш.", ru: "Запуск работы платформы." }, "2027-07"],
        ],
        [ANV, RAQ],
      ),
  ),
  smq(
    14,
    "Самарқанд шаҳрида меҳмонхона қуриш лойиҳасини амалга ошириш",
    "Строительство гостиницы в городе Самарканде",
    "«UZ SAMTRANS INC»",
    3,
    (id) => s3(id, D3, [USM, TUR]),
  ),
  smq(
    15,
    "Самарқанд вилоятида кўчмас мулк лойиҳалари ва қурилишини амалга ошириш",
    "Реализация проектов недвижимости и строительства в Самаркандской области",
    "TMGx Global (Сюзан Нох)",
    200,
    (id) => s3(id, D3, [USM, QUR, KAD]),
  ),
  smq(
    16,
    "Замонавий мева-сабзавотларни қайта ишлаш, қуритиш ва сақлаш лойиҳасини амалга ошириш",
    "Современная переработка, сушка и хранение фруктов и овощей",
    "«SUZANGARON» LLC",
    1,
    (id) => s3(id, D3, [USM, SAM, KAD]),
  ),
  smq(
    17,
    "Самарқанд шаҳрида 190–200 ўринли, мактабгача таълимнинг илғор дастурлари асосидаги хусусий боғча лойиҳаси",
    "Частный детский сад на 190–200 мест по передовым программам дошкольного образования",
    "Асосчиси «IDEAL TRANS» LLC",
    1.1,
    (id) => s4(id, ["2026-08", "2026-10", "2027-02", "2027-04"], [USM, MAK]),
  ),
  smq(
    18,
    "Жомбой туманида замонавий IT-таълим ва лойиҳаларни қўллаб-қувватлаш тренинг марказини ташкил этиш",
    "Тренинг-центр современного IT-образования и поддержки проектов в Джамбайском районе",
    "Асосчиси «IDEAL TRANS» LLC",
    5,
    (id) => s4(id, ["2026-09", "2026-12", "2027-03", "2027-04"], [ANV, RAQ, OLIY]),
  ),
  smq(
    19,
    "Самарқанд шаҳрида Америка замонавий таълим дастурлари асосида 1–9 синф ўқувчилари учун хусусий мактаб қуриш",
    "Частная школа для 1–9 классов по современным американским образовательным программам",
    "Асосчиси «IDEAL TRANS» LLC",
    7,
    (id) => s3(id, D3, [USM, OLIY, MAK, KAD]),
  ),
  smq(
    20,
    "Самарқанд шаҳрида 1,5 гектар ер майдонида замонавий дам олиш маскани қуриш",
    "Современная зона отдыха на участке 1,5 га в городе Самарканде",
    "Асосчиси «IDEAL TRANS» LLC",
    1.3,
    (id) => s4(id, ["2026-09", "2026-12", "2027-02", "2027-04"], [TUR]),
  ),
  smq(
    21,
    "Замонавий МДФ эшиклар ва деразалар ишлаб чиқариш корхонасини кенгайтириш",
    "Расширение производства современных дверей и окон из МДФ",
    "«ASADOV TRUCKING» LLC",
    0.5,
    (id) => s3(id, D3, [USM, SAM]),
  ),
  smq(
    22,
    "Самарқанд вилоятида кўчмас мулк ва қурилиш лойиҳаларини амалга ошириш",
    "Реализация проектов недвижимости и строительства в Самаркандской области",
    "«AD EXPRESS TRUCKING» LLC",
    100,
    (id) =>
      sx(
        id,
        [
          [VISIT, "2026-09"],
          [MARKET, "2026-11"],
          [
            {
              t: "Қурилиш ва инфратузилма лойиҳаларини ишлаб чиқиш.",
              ru: "Разработка строительных и инфраструктурных проектов.",
            },
            "2027-02",
          ],
          [{ t: "Ер майдонини танлаш.", ru: "Выбор земельного участка." }, "2027-07"],
          [ESTIMATE, "2027-09"],
          [START, "2028-02"],
        ],
        [USM, QUR, KAD],
      ),
  ),
  smq(
    23,
    "Самарқанд вилоятида замонавий дам олиш маскани қурилишини ташкил этиш",
    "Строительство современной зоны отдыха в Самаркандской области",
    "Азиз Иргашев",
    6,
    (id) => s3(id, D3, [USM, TUR, QUR]),
  ),
  smq(
    24,
    "Самарқанд шаҳрида иқтидорли болалар учун тўлиқ инглиз тилидаги махсус мактаб қуриш",
    "Специализированная полностью англоязычная школа для одарённых детей",
    "Акобир Мустафакулов",
    5,
    (id) => s3(id, D3, [USM, MAK]),
  ),
  smq(
    25,
    "Самарқанд вилоятида «Time Burger» брендининг фаст-фуд шохобчаларини очиш",
    "Открытие сети фастфуда бренда «Time Burger» в Самаркандской области",
    "«Time Burger» LLC",
    5,
    (id) => s3(id, D3, [USM, TUR]),
  ),
  smq(
    26,
    "Кўчмас мулк соҳасида инвестиция қилиш, «Трамп Тауэр» меҳмонхона мажмуасини қуриш",
    "Инвестиции в недвижимость, строительство гостиничного комплекса «Трамп Тауэр»",
    "«Naples American Steel»",
    400,
    (id) => s3(id, D3, [USM, SAM, QUR, KAD, TUR]),
  ),
  smq(
    27,
    "Самарқанд шаҳрида макарон маҳсулотлари ишлаб чиқаришни ташкил этиш",
    "Организация производства макаронных изделий в городе Самарканде",
    "«ASR Food Market»",
    5,
    (id) => s4(id, ["2026-09", "2026-11", "2027-01", "2027-02"], [USM, SAM]),
  ),
  smq(
    28,
    "Самарқанд шаҳрида меҳмонхона ташкил этиш",
    "Создание гостиницы в городе Самарканде",
    "«LIONSSU TRANSPORTATION INC»",
    0.5,
    (id) => s4(id, ["2026-09", "2026-11", "2026-12", "2027-02"], [USM, QUR, KAD, TUR]),
  ),
  smq(
    29,
    "Дарғом канали бўйида дам олиш маскани барпо этиш лойиҳаси",
    "Создание зоны отдыха вдоль канала Даргом",
    "«ASA UNIVERSAL INC»",
    0.5,
    (id) => s4(id, ["2026-09", "2026-11", "2026-12", "2027-02"], [RUZ, TUR]),
  ),
  smq(30, "Замонавий эко-виллаж барпо этиш", "Создание современного эко-виллиджа", "«Samtoro Restoration»", 2, (id) =>
    s4(id, ["2026-09", "2026-11", "2026-12", "2027-02"], [RUZ, TUR]),
  ),
  smq(
    31,
    "Самарқанд шаҳрида 350 ўринли замонавий жигар трансплантацияси клиникасини ташкил этиш",
    "Современная клиника трансплантации печени на 350 мест в городе Самарканде",
    "«Praxis Ethica Healthcare Compliance Group»",
    15,
    (id) => s3(id, D3, [SAM, SOG]),
  ),
  smq(
    32,
    "Тадбиркорлар учун бино-иншоотлар қуриш ва ижарага бериш лойиҳаси",
    "Строительство зданий и сооружений для предпринимателей и сдача их в аренду",
    "Фируз Баходиров",
    5,
    (id) => s4(id, ["2026-09", "2026-11", "2026-12", "2027-02"], [USM, QUR, KAD]),
  ),
  smq(33, "Чорвачилик кластерини ташкил этиш", "Создание животноводческого кластера", "Дамиржон Хусаинов", 10, (id) =>
    s3(id, D3, [USM, SAM, QISH]),
  ),
  smq(
    34,
    "Ижарага машиналар тақдим этиш («rent a car») хизматини ташкил этиш",
    "Организация сервиса аренды автомобилей (rent a car)",
    "Бахтиёр Кадиров",
    50,
    (id) => s3(id, D3, [USM, TUR]),
  ),
  smq(
    35,
    "Замонавий логистика марказини ташкил этиш",
    "Создание современного логистического центра",
    "Улуғбек Авазхонов",
    1,
    (id) => s3(id, D3, [USM, SAM]),
  ),
  smq(
    36,
    "Экотуризм ва логистика хизматларини йўлга қўйиш лойиҳаси",
    "Запуск услуг экотуризма и логистики",
    "«DADAXON TRANS CORP» LLC",
    2,
    (id) => s3(id, D3, [RUZ, SAM, TUR]),
  ),
  smq(
    37,
    "Замонавий кўнгилочар маскан ташкил этиш лойиҳаси",
    "Создание современного развлекательного объекта",
    "«ENERCO TRUCKING» LLC",
    1.5,
    (id) => s3(id, D3, [RUZ, TUR]),
  ),
  smq(
    38,
    "Қурилиш материаллари савдосини ташкил этиш лойиҳаси",
    "Организация торговли строительными материалами",
    "«TEMUR TRUCKING» LLC",
    3.5,
    (id) => s3(id, D3, [RUZ, SAM, QUR]),
  ),
  smq(
    39,
    "Ҳар хил турдаги ичимликлар ишлаб чиқаришни ташкил этиш лойиҳаси",
    "Организация производства различных напитков",
    "«Hello express» LLC",
    1.2,
    (id) => s3(id, D3, [RUZ, SAM]),
  ),
  smq(
    40,
    "Савдо ва маиший хизмат кўрсатиш марказини ташкил этиш лойиҳаси",
    "Создание торгово-бытового центра обслуживания",
    "«ABS EXPRESS» INC",
    4,
    (id) => s3(id, D3, [RUZ, SAM]),
  ),
  smq(
    41,
    "Меҳмонхона, логистика ва кўнгилочар марказ ташкил этиш лойиҳаси",
    "Создание гостиницы, логистического и развлекательного центра",
    "Зокир Қобилов",
    20,
    (id) => s3(id, D3, [RUZ, SAM, TUR]),
  ),
  smq(
    42,
    "АҚШнинг Филаделфия шаҳрида савдо уйи ташкил этиш ҳамда мева ва сабзавотларни экспорт қилишни йўлга қўйиш",
    "Создание торгового дома в Филадельфии (США) и запуск экспорта фруктов и овощей",
    "Хабиб Хабибулаев",
    0.5,
    (id) => s3(id, D3, [RUZ, SAM]),
  ),
  smq(
    43,
    "Замонавий тиббиёт жиҳозларини етказиб бериш",
    "Поставка современного медицинского оборудования",
    "Project C.U.R.E.",
    10,
    (id) =>
      sx(
        id,
        [
          [
            {
              t: "Жиҳозларни етказиб бериш бўйича мижозларни аниқлаш.",
              ru: "Определение получателей поставляемого оборудования.",
            },
            "2026-12",
          ],
          [
            {
              t: "Етказиб бериш бўйича ҳамкорлик шартномасини тузиш.",
              ru: "Заключение договора о сотрудничестве по поставкам.",
            },
            "2027-02",
          ],
        ],
        [SAM, SOG],
      ),
  ),
  smq(
    44,
    "Каттақўрғон туманида Америка франшизаси иштирокида хусусий мактаб қурилишини ташкил этиш",
    "Строительство частной школы с участием американской франшизы в Каттакурганском районе",
    "Сунатулло Мухамадиев",
    20,
    (id) => s3(id, D3, [ANV, MAK]),
  ),
  smq(
    45,
    "Сан-Франциско шаҳрида «Самарқанд–Калифорния дижитал ҲУБ» ташкил этиш",
    "Создание «Самарканд–Калифорния диджитал-хаба» в Сан-Франциско",
    "Сунатулло Мухамадиев",
    5,
    (id) =>
      sx(
        id,
        [
          [
            {
              t: "«Самарқанд–Калифорния дижитал ҲУБ»ни ташкил этиш юзасидан ҳамкорлар билан музокаралар ўтказиш.",
              ru: "Переговоры с партнёрами о создании диджитал-хаба «Самарканд–Калифорния».",
            },
            "2026-08",
          ],
          [
            {
              t: "Дижитал ҲУБ фаолияти учун технологик ва ташкилий инфратузилмани яратиш.",
              ru: "Создание технологической и организационной инфраструктуры хаба.",
            },
            "2026-12",
          ],
          [
            {
              t: "Халқаро IT ҳамкорлик ва рақамли лойиҳаларни йўлга қўйиш.",
              ru: "Запуск международного IT-сотрудничества и цифровых проектов.",
            },
            "2027-03",
          ],
        ],
        [ANV, RAQ],
      ),
  ),
  smq(
    46,
    "Самарқанд туманида «Downtown ECO CITY Samarkand» замонавий урбанистик шаҳарча қуриш лойиҳаси",
    "Строительство современного урбанистического городка «Downtown ECO CITY Samarkand»",
    "«AGAD GROUP INC»",
    120,
    // The source document lists the 4th deadline as Feb 2027 (kept verbatim).
    (id) => s4(id, ["2026-12", "2027-02", "2027-04", "2027-02"], [USM]),
  ),
  smq(
    47,
    "Самарқанд туманида замонавий туристик дам олиш ва экотуризм мажмуасини ташкил этиш",
    "Создание современного туристического комплекса отдыха и экотуризма в Самаркандском районе",
    "«AGAD GROUP INC»",
    1.5,
    (id) => s3(id, D3, [USM]),
  ),
  smq(
    48,
    "Самарқанд туманида замонавий автокемпинг, йўлбўйи сервис ва маиший хизмат кўрсатиш инновацион комплексини қуриш",
    "Строительство инновационного комплекса автокемпинга, придорожного сервиса и бытового обслуживания",
    "«AGAD GROUP INC»",
    1.5,
    (id) => s3(id, ["2026-08", "2026-12", "2027-03"], [USM]),
  ),
];

/* ------------------------------------------------------------------ */
/* Region metadata (document headers) and lookups                      */
/* ------------------------------------------------------------------ */

export const regionRoadmaps: RegionRoadmap[] = [
  {
    region: "samarkand",
    label: "Samarqand viloyati",
    labelRu: "Самаркандская область",
    visitDates: "10–17 May 2026",
    visitDatesRu: "10–17 мая 2026",
    totalValueMusd: 1500,
    declaredProjects: 48,
    sourceId: SMQ,
  },
  {
    region: "khorezm",
    label: "Xorazm viloyati",
    labelRu: "Хорезмская область",
    visitDates: "26–31 May 2026",
    visitDatesRu: "26–31 мая 2026",
    totalValueMusd: 1000,
    declaredProjects: 13,
    sourceId: KHZ,
  },
];

export const roadmapProjects: RoadmapProject[] = [...samarkandProjects, ...khorezmProjects];

export function projectsOf(region: RoadmapRegionId): RoadmapProject[] {
  return roadmapProjects.filter((p) => p.region === region);
}

/* ------------------------------------------------------------------ */
/* Derived health (anti-task-tracker: computed from dates, not typed   */
/* in by hand; the only manual signal is step.state)                   */
/* ------------------------------------------------------------------ */

/** Last day of the step's due month, local time. */
function dueMonthEnd(due: string): Date {
  const [y, m] = due.split("-").map(Number);
  return new Date(y, m, 0, 23, 59, 59);
}

export function stepHealth(step: RoadmapStep, today: Date = new Date()): RoadmapStepHealth {
  if (step.state === "done") return "done";
  const end = dueMonthEnd(step.due);
  if (end.getTime() < today.getTime()) return "overdue";
  const days = (end.getTime() - today.getTime()) / 86_400_000;
  return days <= 30 ? "due-soon" : "on-track";
}

export type RoadmapProjectHealth = "done" | "on-track" | "attention" | "off-track";

export function projectHealth(
  project: RoadmapProject,
  today: Date = new Date(),
  overrides?: RoadmapOverrides,
): RoadmapProjectHealth {
  const healths = project.steps.map((s) => stepHealth(overrideStep(s, overrides), today));
  if (healths.every((h) => h === "done")) return "done";
  if (healths.includes("overdue")) return "off-track";
  if (healths.includes("due-soon")) return "attention";
  return "on-track";
}

export interface RegionRollup {
  projects: number;
  done: number;
  onTrack: number;
  attention: number;
  offTrack: number;
  doneSteps: number;
  totalSteps: number;
  /** Nearest not-done step across the region (for the "next milestone" line). */
  nextMilestone?: { project: RoadmapProject; step: RoadmapStep };
}

export function regionRollup(
  region: RoadmapRegionId,
  today: Date = new Date(),
  overrides?: RoadmapOverrides,
): RegionRollup {
  const projects = projectsOf(region);
  const rollup: RegionRollup = {
    projects: projects.length,
    done: 0,
    onTrack: 0,
    attention: 0,
    offTrack: 0,
    doneSteps: 0,
    totalSteps: 0,
  };
  for (const project of projects) {
    const health = projectHealth(project, today, overrides);
    if (health === "done") rollup.done += 1;
    else if (health === "on-track") rollup.onTrack += 1;
    else if (health === "attention") rollup.attention += 1;
    else rollup.offTrack += 1;
    for (const raw of project.steps) {
      const s = overrideStep(raw, overrides);
      rollup.totalSteps += 1;
      if (s.state === "done") rollup.doneSteps += 1;
      else if (!rollup.nextMilestone || s.due < rollup.nextMilestone.step.due) {
        rollup.nextMilestone = { project, step: s };
      }
    }
  }
  return rollup;
}

/** All steps across both regions (feed for brief widgets / risk radar). */
export function allRoadmapSteps(): Array<{ project: RoadmapProject; step: RoadmapStep }> {
  return roadmapProjects.flatMap((project) => project.steps.map((step) => ({ project, step })));
}

/** Top overdue → due-soon steps for the landing "needs attention" list. */
export function roadmapAttention(
  limit = 3,
  today: Date = new Date(),
  overrides?: RoadmapOverrides,
): Array<{ project: RoadmapProject; step: RoadmapStep; health: RoadmapStepHealth }> {
  const rows = allRoadmapSteps()
    .map(({ project, step }) => {
      const patched = overrideStep(step, overrides);
      return { project, step: patched, health: stepHealth(patched, today) };
    })
    .filter((row) => row.health === "overdue" || row.health === "due-soon");
  const rank: Record<RoadmapStepHealth, number> = { overdue: 0, "due-soon": 1, "on-track": 2, done: 3 };
  return rows.sort((a, b) => rank[a.health] - rank[b.health] || a.step.due.localeCompare(b.step.due)).slice(0, limit);
}

/** Share of steps across both regions that are marked done, whole %. */
export function roadmapDonePct(overrides?: RoadmapOverrides): number {
  const steps = allRoadmapSteps();
  if (steps.length === 0) return 0;
  const done = steps.filter(({ step }) => overrideStep(step, overrides).state === "done").length;
  return Math.round((done / steps.length) * 100);
}

/** Step-status counts for the landing execution bar. */
export function roadmapStepCounts(
  today: Date = new Date(),
  overrides?: RoadmapOverrides,
): Record<RoadmapStepHealth, number> {
  const counts: Record<RoadmapStepHealth, number> = { done: 0, "on-track": 0, "due-soon": 0, overdue: 0 };
  for (const { step } of allRoadmapSteps()) counts[stepHealth(overrideStep(step, overrides), today)] += 1;
  return counts;
}

/* ------------------------------------------------------------------ */
/* Locale helpers (owner's language policy: ru shows the translation,  */
/* en/uz-latn show the document original)                              */
/* ------------------------------------------------------------------ */

export function roadmapProjectTitle(project: RoadmapProject, locale: string): string {
  return locale === "ru" ? project.titleRu : project.title;
}

export function roadmapStepTitle(step: RoadmapStep, locale: string): string {
  return locale === "ru" ? step.titleRu : step.title;
}

export function regionLabel(meta: RegionRoadmap, locale: string): string {
  return locale === "ru" ? meta.labelRu : meta.label;
}

export function regionVisitDates(meta: RegionRoadmap, locale: string): string {
  return locale === "ru" ? meta.visitDatesRu : meta.visitDates;
}
