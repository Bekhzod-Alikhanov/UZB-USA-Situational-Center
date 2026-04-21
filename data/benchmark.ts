export interface RegionalMetric {
  country: "UZ" | "KZ" | "KG" | "TJ" | "TM" | "AZ" | "GE";
  gdpUsdBn: number;
  populationM: number;
  tradeWithUsUsdBn: number;
  exportsToUsUsdM: number;
  importsFromUsUsdM: number;
  fdiFromUsUsdM: number;
  wbDoingBusinessRank?: number;
  visaBilateral: "visa-free" | "e-visa" | "standard";
  gspStatus: "beneficiary" | "eligible-pending" | "graduated" | "n/a";
  flagEmoji: string;
  is_demo: boolean;
}

export const benchmark: RegionalMetric[] = [
  { country: "UZ", gdpUsdBn: 112.6, populationM: 36.5, tradeWithUsUsdBn: 1.004, exportsToUsUsdM: 291.7, importsFromUsUsdM: 712.3, fdiFromUsUsdM: 1800, wbDoingBusinessRank: 69, visaBilateral: "e-visa", gspStatus: "eligible-pending", flagEmoji: "🇺🇿", is_demo: false },
  { country: "KZ", gdpUsdBn: 259.3, populationM: 20.0, tradeWithUsUsdBn: 3.1, exportsToUsUsdM: 1450, importsFromUsUsdM: 1650, fdiFromUsUsdM: 12400, wbDoingBusinessRank: 25, visaBilateral: "visa-free", gspStatus: "graduated", flagEmoji: "🇰🇿", is_demo: true },
  { country: "KG", gdpUsdBn: 12.3, populationM: 7.0, tradeWithUsUsdBn: 0.36, exportsToUsUsdM: 42, importsFromUsUsdM: 320, fdiFromUsUsdM: 310, wbDoingBusinessRank: 80, visaBilateral: "visa-free", gspStatus: "eligible-pending", flagEmoji: "🇰🇬", is_demo: true },
  { country: "TJ", gdpUsdBn: 12.1, populationM: 10.3, tradeWithUsUsdBn: 0.09, exportsToUsUsdM: 6, importsFromUsUsdM: 88, fdiFromUsUsdM: 60, wbDoingBusinessRank: 106, visaBilateral: "e-visa", gspStatus: "eligible-pending", flagEmoji: "🇹🇯", is_demo: true },
  { country: "TM", gdpUsdBn: 60.2, populationM: 6.4, tradeWithUsUsdBn: 0.18, exportsToUsUsdM: 12, importsFromUsUsdM: 168, fdiFromUsUsdM: 220, wbDoingBusinessRank: 112, visaBilateral: "standard", gspStatus: "n/a", flagEmoji: "🇹🇲", is_demo: true },
  { country: "AZ", gdpUsdBn: 78.7, populationM: 10.2, tradeWithUsUsdBn: 0.95, exportsToUsUsdM: 450, importsFromUsUsdM: 520, fdiFromUsUsdM: 2000, wbDoingBusinessRank: 34, visaBilateral: "e-visa", gspStatus: "graduated", flagEmoji: "🇦🇿", is_demo: true },
  { country: "GE", gdpUsdBn: 31.4, populationM: 3.7, tradeWithUsUsdBn: 1.8, exportsToUsUsdM: 320, importsFromUsUsdM: 1480, fdiFromUsUsdM: 1400, wbDoingBusinessRank: 7, visaBilateral: "visa-free", gspStatus: "beneficiary", flagEmoji: "🇬🇪", is_demo: true },
];

export const benchmarkMeta = {
  source: "World Bank, UN Comtrade, OECD (consolidated)",
  note: "Non-UZ figures marked is_demo:true pending validation against latest Comtrade/WB",
  fetched_at: "2026-04-18",
};
