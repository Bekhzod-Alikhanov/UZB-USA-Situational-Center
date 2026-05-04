import type { LiveConnectorProbe } from "./types";

export async function fetchJsonWithTimeout<T>(url: string, init: RequestInit = {}, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        accept: "application/json",
        ...(init.headers ?? {}),
      },
      next: { revalidate: 60 * 60 * 6 },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function probeUrl(id: string, url: string): Promise<LiveConnectorProbe> {
  const fetchedAt = new Date().toISOString();
  const controller = new AbortController();
  const timeoutMs = 6000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: { accept: "application/json,text/csv,*/*" },
      next: { revalidate: 60 * 60 * 6 },
    });
    return {
      id,
      ok: response.ok,
      status: response.status,
      message: response.ok ? "Reachable" : `HTTP ${response.status}`,
      fetchedAt,
      sourceUrl: url,
    };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      id,
      ok: false,
      status: "error",
      message: aborted ? `Timed out after ${timeoutMs}ms` : error instanceof Error ? error.message : "Request failed",
      fetchedAt,
      sourceUrl: url,
    };
  } finally {
    clearTimeout(timeout);
  }
}
