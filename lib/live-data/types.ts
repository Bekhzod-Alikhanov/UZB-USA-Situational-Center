export interface LiveConnectorProbe {
  id: string;
  ok: boolean;
  status: number | "not-probed" | "not-configured" | "error";
  message: string;
  fetchedAt: string;
  sourceUrl?: string;
}

export interface LiveTradeSnapshot {
  source: "census";
  time: string;
  exportsUsd?: number;
  importsUsd?: number;
  lastUpdate?: string;
}

export interface LiveMacroPoint {
  country: string;
  indicator: string;
  year: string;
  value: number | null;
  source?: string;
}
