import { fetchJsonWithTimeout } from "./fetcher";
import type { NormalizedObservation } from "@/lib/data-governance/types";
import type { LiveMacroPoint } from "./types";

export const WORLD_BANK_INDICATORS = {
  gdp: "NY.GDP.MKTP.CD",
  population: "SP.POP.TOTL",
  fdiInflows: "BX.KLT.DINV.CD.WD",
} as const;

type WorldBankResponse = [
  { source?: { lastupdated?: string } },
  Array<{
    countryiso3code: string;
    date: string;
    value: number | null;
    indicator: { id: string; value: string };
  }>,
];

const INDICATOR_META: Record<string, { metricKey: string; label: string; unit: string; scale: number; relevanceScore: number }> = {
  [WORLD_BANK_INDICATORS.gdp]: {
    metricKey: "macro.uz.gdp.current_usd",
    label: "Uzbekistan GDP",
    unit: "USD billions",
    scale: 1_000_000_000,
    relevanceScore: 0.86,
  },
  [WORLD_BANK_INDICATORS.population]: {
    metricKey: "macro.uz.population",
    label: "Uzbekistan population",
    unit: "millions",
    scale: 1_000_000,
    relevanceScore: 0.82,
  },
  [WORLD_BANK_INDICATORS.fdiInflows]: {
    metricKey: "macro.uz.fdi_inflows.current_usd",
    label: "Uzbekistan FDI inflows",
    unit: "USD billions",
    scale: 1_000_000_000,
    relevanceScore: 0.78,
  },
};

export function worldBankIndicatorUrl(country = "UZB", indicator: string = WORLD_BANK_INDICATORS.gdp, date = "2020:2026") {
  return `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&per_page=80&date=${date}`;
}

export async function fetchWorldBankLatest(country = "UZB"): Promise<LiveMacroPoint[]> {
  const rows = await Promise.all(
    Object.values(WORLD_BANK_INDICATORS).map(async (indicator): Promise<LiveMacroPoint> => {
      const data = await fetchJsonWithTimeout<WorldBankResponse>(worldBankIndicatorUrl(country, indicator));
      const value = data[1]?.find((row) => row.value !== null);
      return {
        country,
        indicator,
        year: value?.date ?? "n/a",
        value: value?.value ?? null,
        source: data[0]?.source?.lastupdated ? `World Bank updated ${data[0].source.lastupdated}` : "World Bank WDI",
      };
    }),
  );
  return rows;
}

export async function fetchWorldBankObservations(country = "UZB"): Promise<NormalizedObservation[]> {
  const fetchedAt = new Date().toISOString();
  const rows: Array<NormalizedObservation | undefined> = await Promise.all(
    Object.values(WORLD_BANK_INDICATORS).map(async (indicator): Promise<NormalizedObservation | undefined> => {
      const data = await fetchJsonWithTimeout<WorldBankResponse>(worldBankIndicatorUrl(country, indicator));
      const latest = data[1]?.find((row) => row.value !== null);
      if (!latest || latest.value === null) return undefined;
      const meta = INDICATOR_META[indicator];
      return {
        connectorId: "world-bank-wdi",
        sourceId: "worldbank_data",
        metricKey: meta.metricKey,
        label: meta.label,
        domain: "macro" as const,
        value: latest.value / meta.scale,
        unit: meta.unit,
        periodStart: `${latest.date}-01-01`,
        periodEnd: `${latest.date}-12-31`,
        dimensions: { country: "UZ", sourceMethodology: "world-bank-wdi", indicator },
        sourceUrl: worldBankIndicatorUrl(country, indicator),
        sourcePublishedAt: data[0]?.source?.lastupdated,
        fetchedAt,
        relevanceScore: meta.relevanceScore,
        recommendedUse: "Official macro benchmark context; always display observation year because WDI can lag.",
        qualityFlags: latest.date === "n/a" ? ["missing-year"] : [],
      };
    }),
  );
  return rows.filter((row): row is NormalizedObservation => row !== undefined);
}
