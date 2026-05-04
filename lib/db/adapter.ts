export type DataBackend = "static" | "supabase";

export interface DatabaseHealth {
  mode: DataBackend;
  configured: boolean;
  writable: boolean;
  message: string;
}

export function getDataBackend(): DataBackend {
  return process.env.DATA_BACKEND === "supabase" ? "supabase" : "static";
}

export function databaseHealth(): DatabaseHealth {
  const mode = getDataBackend();
  if (mode === "static") {
    return {
      mode,
      configured: true,
      writable: false,
      message: "Static TypeScript data mode. Safe for demos and static deployment; not suitable for multi-user operations.",
    };
  }

  const configured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  return {
    mode,
    configured,
    writable: configured,
    message: configured
      ? "Supabase REST adapter is configured. Use only server-side calls with row-level security and audit logging."
      : "DATA_BACKEND=supabase is selected, but SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.",
  };
}

export async function fetchSupabaseTable<T>(table: string, query = "select=*"): Promise<T[]> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");

  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase ${table} fetch failed with HTTP ${response.status}`);
  }
  return (await response.json()) as T[];
}

export async function insertSupabaseRows<T extends Record<string, unknown>>(
  table: string,
  rows: T[],
  options: { upsert?: boolean; onConflict?: string } = {},
): Promise<T[]> {
  if (!rows.length) return [];

  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");

  const search = new URLSearchParams();
  if (options.onConflict) search.set("on_conflict", options.onConflict);
  const endpoint = `${url}/rest/v1/${table}${search.toString() ? `?${search.toString()}` : ""}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      accept: "application/json",
      "content-type": "application/json",
      prefer: options.upsert ? "resolution=merge-duplicates,return=representation" : "return=representation",
    },
    body: JSON.stringify(rows),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Supabase ${table} insert failed with HTTP ${response.status}${body ? `: ${body}` : ""}`);
  }
  return (await response.json()) as T[];
}
