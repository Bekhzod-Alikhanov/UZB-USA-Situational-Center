"use client";

import { useEffect, useMemo, useState } from "react";
import { DatabaseZap, Play, ShieldCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusPayload {
  database: {
    mode: string;
    configured: boolean;
    writable: boolean;
    message: string;
  };
  connectors: Array<{ id: string; name: string; status: string; cadence: string; dashboardUse: string }>;
  policies: Array<{ connectorId: string; owner: string; replaceRule: string; minRelevanceScore: number; allowAutoPublish: boolean }>;
  staticBaselineCount: number;
  recentRuns: Array<{ id: string; scope: string; mode: string; started_at: string; summary: unknown }>;
  guardrails: string[];
}

interface RunPayload {
  mode: "dry-run" | "write";
  databaseWritable: boolean;
  summary: {
    observations: number;
    snapshots: number;
    publishCandidates: number;
    manualReview: number;
    rejectedOlder: number;
    ignoredIrrelevant: number;
    failedConnectors: number;
    writtenRows: number;
  };
  connectors: Array<{ connectorId: string; ok: boolean; error?: string; observations: unknown[]; reviewItems: unknown[]; rejected: unknown[] }>;
}

const STATUS_CLASS: Record<string, string> = {
  "live-ready": "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  "key-required": "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  "manual-review": "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  planned: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

export function DataOperationsPanel() {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [run, setRun] = useState<RunPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/ingest/status", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as StatusPayload;
      })
      .then((payload) => {
        if (!cancelled) {
          setStatus(payload);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Status check failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const connectorSummary = useMemo(() => {
    const connectors = status?.connectors ?? [];
    return {
      total: connectors.length,
      liveReady: connectors.filter((connector) => connector.status === "live-ready").length,
      review: connectors.filter((connector) => connector.status === "manual-review").length,
      keys: connectors.filter((connector) => connector.status === "key-required").length,
    };
  }, [status]);

  async function runDryRun() {
    setRunning(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/ingest/run?scope=scheduled", { method: "POST" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setRun((await response.json()) as RunPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dry run failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Stat label="Official connectors" value={connectorSummary.total} />
        <Stat label="Live-ready" value={connectorSummary.liveReady} tone="pos" />
        <Stat label="Manual review" value={connectorSummary.review} tone="warn" />
        <Stat label="Key required" value={connectorSummary.keys} tone="warn" />
      </div>

      <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
          <div className="flex items-center gap-2">
            <DatabaseZap className="size-4 text-[var(--color-primary)]" />
            <div>
              <div className="text-[13px] font-semibold text-[var(--color-ink)]">Governed ingestion</div>
              <div className="text-[11px] text-[var(--color-ink-muted)]">
                {loading
                  ? "Checking data operations..."
                  : status
                    ? `${status.database.mode} mode, ${status.staticBaselineCount} protected static baseline metrics`
                    : "Status unavailable"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={runDryRun}
            disabled={running}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-[11px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60"
          >
            <Play className="size-3.5" />
            Dry run
          </button>
        </div>

        {error ? (
          <div className="m-4 flex items-start gap-2 rounded-md bg-[var(--color-neg-soft)] px-3 py-2 text-[11px] text-[var(--color-neg)]">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {status ? (
          <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-md bg-[var(--color-surface-2)] p-3">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-[var(--color-ink)]">
                <ShieldCheck className="size-4 text-[var(--color-pos)]" />
                Publication guardrails
              </div>
              <ul className="flex flex-col gap-1.5">
                {status.guardrails.map((item) => (
                  <li key={item} className="text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
                {status.database.message}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {status.connectors.map((connector) => (
                <div key={connector.id} className="flex min-w-0 items-start justify-between gap-3 rounded-md bg-[var(--color-surface-2)] px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-[11.5px] font-semibold text-[var(--color-ink)]">{connector.name}</div>
                    <div className="mt-0.5 line-clamp-2 text-[10.5px] text-[var(--color-ink-muted)]">{connector.dashboardUse}</div>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider", STATUS_CLASS[connector.status] ?? STATUS_CLASS.planned)}>
                    {connector.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {run ? (
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="mb-3 text-[13px] font-semibold text-[var(--color-ink)]">
            Dry-run result: {run.summary.observations} observations, {run.summary.publishCandidates + run.summary.manualReview} review items
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <Stat label="Snapshots" value={run.summary.snapshots} />
            <Stat label="Rejected older" value={run.summary.rejectedOlder} tone={run.summary.rejectedOlder ? "warn" : "pos"} />
            <Stat label="Ignored" value={run.summary.ignoredIrrelevant} />
            <Stat label="Failed" value={run.summary.failedConnectors} tone={run.summary.failedConnectors ? "neg" : "pos"} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Stat({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "pos" | "warn" | "neg" }) {
  const toneClass =
    tone === "pos"
      ? "bg-[var(--color-pos-soft)] text-[var(--color-pos)]"
      : tone === "warn"
        ? "bg-[var(--color-warn-soft)] text-[var(--color-warn)]"
        : tone === "neg"
          ? "bg-[var(--color-neg-soft)] text-[var(--color-neg)]"
          : "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]";
  return (
    <div className={cn("rounded-md px-3 py-2", toneClass)}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</div>
      <div className="mono mt-1 text-[18px] font-semibold tabular">{value}</div>
    </div>
  );
}
