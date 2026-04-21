export interface TradeYear {
  year: number;
  turnover: number;
  exports: number;
  imports: number;
  balance: number;
  sharePct?: { turnover: number; exports: number; imports: number };
}

export interface CommodityItem {
  code?: string;
  name: string;
  value: number;
  sharePct: number;
}

export interface CompanyRanking {
  rank: number;
  name: string;
  sector: string;
  value: number;
  is_demo: boolean;
  source_note?: string;
}

export const tradeAnnual: TradeYear[] = [
  { year: 2017, turnover: 395.8, exports: 78.1, imports: 317.7, balance: -239.6, sharePct: { turnover: 1.5, exports: 0.6, imports: 2.3 } },
  { year: 2018, turnover: 701.5, exports: 132.4, imports: 569.0, balance: -436.6, sharePct: { turnover: 2.1, exports: 0.9, imports: 2.9 } },
  { year: 2019, turnover: 603.9, exports: 36.6, imports: 567.2, balance: -530.6, sharePct: { turnover: 1.4, exports: 0.2, imports: 2.3 } },
  { year: 2020, turnover: 275.0, exports: 26.7, imports: 248.3, balance: -221.6, sharePct: { turnover: 0.8, exports: 0.2, imports: 1.2 } },
  { year: 2021, turnover: 426.3, exports: 60.8, imports: 365.5, balance: -304.7, sharePct: { turnover: 1.0, exports: 0.4, imports: 1.4 } },
  { year: 2022, turnover: 436.8, exports: 68.5, imports: 368.7, balance: -299.7, sharePct: { turnover: 0.9, exports: 0.4, imports: 1.2 } },
  { year: 2023, turnover: 765.1, exports: 253.1, imports: 512.0, balance: -258.9, sharePct: { turnover: 1.2, exports: 1.0, imports: 1.3 } },
  { year: 2024, turnover: 1024.9, exports: 430.7, imports: 594.1, balance: -163.3, sharePct: { turnover: 1.5, exports: 1.6, imports: 1.5 } },
  { year: 2025, turnover: 1004.0, exports: 291.7, imports: 712.2, balance: -420.5, sharePct: { turnover: 1.2, exports: 0.9, imports: 1.5 } },
];

export const tradeJan2026 = {
  turnover: 0.093,
  exports: 0.032,
  imports: 0.061,
  turnoverGrowthPct: 69,
  exportsGrowthPct: 107,
  importsGrowthPct: 54,
  note: "Jan 2026, $ millions",
};

export const exportStructure2025: CommodityItem[] = [
  { name: "Fuels and electricity", value: 25.1, sharePct: 8.6 },
  { name: "Food products", value: 9.5, sharePct: 3.3 },
  { name: "Non-ferrous metals", value: 7.8, sharePct: 3.3 },
  { name: "Mechanical equipment", value: 4.5, sharePct: 1.6 },
  { name: "Textile products", value: 2.1, sharePct: 0.7 },
  { name: "Grains and milling products", value: 1.4, sharePct: 0.5 },
  { name: "Base metals (non-precious)", value: 1.1, sharePct: 0.4 },
  { name: "Construction materials", value: 0.4, sharePct: 0.2 },
  { name: "Chemicals", value: 0.4, sharePct: 0.2 },
  { name: "Plastics", value: 0.3, sharePct: 0.1 },
  { name: "Pearls, precious stones", value: 0.1, sharePct: 0.1 },
  { name: "Finished goods (misc.)", value: 1.5, sharePct: 0.5 },
  { name: "Other goods", value: 0.9, sharePct: 0.3 },
  { name: "Services", value: 235.5, sharePct: 80.7 },
];

export const importStructure2025: CommodityItem[] = [
  { name: "Vehicles and parts", value: 228.8, sharePct: 32.1 },
  { name: "Mechanical equipment", value: 121.0, sharePct: 17.0 },
  { name: "Electrical equipment", value: 65.9, sharePct: 9.3 },
  { name: "Pharmaceutical products", value: 54.4, sharePct: 7.6 },
  { name: "Food products", value: 25.5, sharePct: 3.6 },
  { name: "Optical instruments", value: 15.5, sharePct: 2.2 },
  { name: "Textile products", value: 7.1, sharePct: 1.0 },
  { name: "Chemicals", value: 7.0, sharePct: 1.0 },
  { name: "Wood and articles", value: 6.9, sharePct: 1.0 },
  { name: "Ferrous metals", value: 6.4, sharePct: 0.9 },
  { name: "Plastics", value: 5.4, sharePct: 0.8 },
  { name: "Rubber", value: 3.4, sharePct: 0.5 },
  { name: "Finished goods (misc.)", value: 1.9, sharePct: 0.3 },
  { name: "Services", value: 146.3, sharePct: 20.5 },
];

export const topExportersUZ: CompanyRanking[] = [
  { rank: 1, name: "UzAuto Motors", sector: "Automotive parts", value: 48.2, is_demo: true, source_note: "to be supplied by MIIT" },
  { rank: 2, name: "Almalyk MMC", sector: "Non-ferrous metals (copper, zinc)", value: 32.5, is_demo: true, source_note: "to be supplied by MIIT" },
  { rank: 3, name: "Uzbekneftegaz", sector: "Petroleum derivatives", value: 21.4, is_demo: true, source_note: "to be supplied by MIIT" },
  { rank: 4, name: "Navoi MMC", sector: "Non-ferrous metals", value: 17.8, is_demo: true, source_note: "to be supplied by MIIT" },
  { rank: 5, name: "Uztextileprom", sector: "Textiles & apparel", value: 12.6, is_demo: true, source_note: "to be supplied by MIIT" },
  { rank: 6, name: "UzbekChimProm", sector: "Chemicals", value: 9.3, is_demo: true, source_note: "to be supplied by MIIT" },
  { rank: 7, name: "Agroexport MCHJ", sector: "Food / dried fruit", value: 7.6, is_demo: true, source_note: "to be supplied by MIIT" },
  { rank: 8, name: "Uzelectroapparat", sector: "Electrical equipment", value: 5.1, is_demo: true, source_note: "to be supplied by MIIT" },
  { rank: 9, name: "Bukhara Silk", sector: "Textile specialty", value: 4.0, is_demo: true, source_note: "to be supplied by MIIT" },
  { rank: 10, name: "Uz-IT Park Exporters", sector: "IT services export", value: 3.2, is_demo: true, source_note: "to be supplied by MIIT" },
];

export const topImportersUS: CompanyRanking[] = [
  { rank: 1, name: "Boeing", sector: "Aerospace / parts", value: 185.4, is_demo: true, source_note: "to be supplied by MIIT customs" },
  { rank: 2, name: "Caterpillar", sector: "Heavy equipment", value: 84.2, is_demo: true, source_note: "to be supplied by MIIT customs" },
  { rank: 3, name: "John Deere", sector: "Agricultural machinery", value: 62.7, is_demo: true, source_note: "to be supplied by MIIT customs" },
  { rank: 4, name: "Pfizer", sector: "Pharmaceuticals", value: 33.1, is_demo: true, source_note: "to be supplied by MIIT customs" },
  { rank: 5, name: "General Electric", sector: "Power / turbines", value: 28.6, is_demo: true, source_note: "to be supplied by MIIT customs" },
  { rank: 6, name: "Honeywell", sector: "Industrial automation", value: 24.3, is_demo: true, source_note: "to be supplied by MIIT customs" },
  { rank: 7, name: "Ford", sector: "Automotive", value: 21.0, is_demo: true, source_note: "to be supplied by MIIT customs" },
  { rank: 8, name: "Merck", sector: "Pharmaceuticals", value: 18.4, is_demo: true, source_note: "to be supplied by MIIT customs" },
  { rank: 9, name: "Emerson Electric", sector: "Electrical equipment", value: 16.0, is_demo: true, source_note: "to be supplied by MIIT customs" },
  { rank: 10, name: "Johnson Controls", sector: "Building automation", value: 12.8, is_demo: true, source_note: "to be supplied by MIIT customs" },
];

export const tradeMeta = {
  source: "State Statistics Committee of the Republic of Uzbekistan",
  source_url: "https://stat.uz",
  last_updated: "2026-02-15",
  is_demo: false,
};
