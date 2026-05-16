/**
 * UN Comtrade UZ-US bilateral trade slices.
 *
 * Generated from the original consolidated Comtrade export so lazy UI
 * components can import only the dataset they render.
 */

export const comtradeAnnualUzReporter: Record<number, { exportsToUs: number; importsFromUs: number }> = {
  "2021": {
    exportsToUs: 20173096.39,

    importsFromUs: 100203997.15999998,
  },

  "2022": {
    exportsToUs: 16552078.051000003,

    importsFromUs: 121088345.84999989,
  },

  "2023": {
    exportsToUs: 61734204.41000001,

    importsFromUs: 318093567.7000009,
  },

  "2024": {
    exportsToUs: 157537189.73000014,

    importsFromUs: 338101183.72000074,
  },

  "2025": {
    exportsToUs: 0,

    importsFromUs: 0,
  },
};

/** Annual totals as reported by US side. */

export const comtradeAnnualUsReporter: Record<number, { exportsToUz: number; importsFromUz: number }> = {
  "2021": {
    exportsToUz: 401627442,

    importsFromUz: 189145447,
  },

  "2022": {
    exportsToUz: 272674484,

    importsFromUz: 61036309,
  },

  "2023": {
    exportsToUz: 236446356,

    importsFromUz: 96774310,
  },

  "2024": {
    exportsToUz: 149895644,

    importsFromUz: 44409142,
  },

  "2025": {
    exportsToUz: 137009077,

    importsFromUz: 578195212,
  },
};

export const comtradeMeta = {
  source: "UN Comtrade preview API (public, no auth)",

  sourceId: "comtrade_hs6" as const,

  endpoint: "https://comtradeapi.un.org/public/v1/preview/C/A/HS",

  fetched_at: "2026-04-29",

  classificationCode: "H6",

  reporters: { uz: 860, us: 842 },

  yearsCovered: [2021, 2022, 2023, 2024, 2025],

  uzReporting2025: false,

  is_demo: false,
};
