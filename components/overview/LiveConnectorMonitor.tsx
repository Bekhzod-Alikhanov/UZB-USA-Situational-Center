"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, Server, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type ProbeStatus = number | "not-probed" | "not-configured" | "error";

interface HealthProbe {
  id: string;
  ok: boolean;
  status: ProbeStatus;
  message: string;
  fetchedAt: string;
  sourceUrl?: string;
}

interface HealthConnector {
  id: string;
  name: string;
  status: "live-ready" | "key-required" | "manual-review" | "planned";
}

interface HealthPayload {
  database: {
    mode: "static" | "supabase";
    configured: boolean;
    writable: boolean;
    message: string;
  };
  connectors: HealthConnector[];
  probes: HealthProbe[];
}

const STATUS_CLASS = {
  ok: "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  warn: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  neutral: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

function probeTone(probe?: HealthProbe) {
  if (!probe) return "neutral";
  if (probe.ok) return "ok";
  if (probe.status === "not-probed" || probe.status === "not-configured") return "neutral";
  return "warn";
}

async function fetchHealth(probe = false) {
  const response = await fetch(`/api/live-data/health${probe ? "?probe=1" : ""}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as HealthPayload;
}

export function LiveConnectorMonitor() {
  const t = useTranslations("overview.sourceQuality.monitor");
  const [payload, setPayload] = useState<HealthPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [probing, setProbing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchHealth()
      .then((health) => {
        if (!cancelled) {
          setPayload(health);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : t("unavailable"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  const probesById = useMemo(() => new Map(payload?.probes.map((probe) => [probe.id, probe]) ?? []), [payload]);
  const liveReady = payload?.connectors.filter((connector) => connector.status === "live-ready").length ?? 0;

  async function runProbe() {
    setProbing(true);
    setError(null);
    try {
      setPayload(await fetchHealth(true));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unavailable"));
    } finally {
      setProbing(false);
    }
  }

  function statusLabel(status: ProbeStatus | HealthConnector["status"]) {
    return typeof status === "number" ? String(status) : t(`probeStatus.${status}`);
  }

  return (
    <div className="border-t border-[var(--color-border)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Server className="size-4 shrink-0 text-[var(--color-primary)]" />
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-[var(--color-ink)]">{t("title")}</div>
            <div className="truncate text-[10.5px] text-[var(--color-ink-muted)]">
              {payload
                ? t("ready", {
                    mode: payload.database.mode,
                    liveReady,
                    total: payload.connectors.length,
                  })
                : loading
                  ? t("checking")
                  : t("unavailable")}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={runProbe}
          disabled={probing}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-[11px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-wait disabled:opacity-60"
          aria-label={t("probeAria")}
        >
          <RefreshCw className={cn("size-3.5", probing && "animate-spin")} />
          {t("probe")}
        </button>
      </div>

      {error ? (
        <div className="mt-3 flex items-start gap-2 rounded-md bg-[var(--color-neg-soft)] px-3 py-2 text-[11px] text-[var(--color-neg)]">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {payload ? (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-md bg-[var(--color-surface-2)] px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                {t("database")}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider",
                  payload.database.writable ? STATUS_CLASS.ok : STATUS_CLASS.neutral,
                )}
              >
                {payload.database.writable ? t("writable") : t("readOnly")}
              </span>
            </div>
            <div className="mt-1 text-[10.5px] leading-relaxed text-[var(--color-ink-muted)]">
              {payload.database.configured ? t("databaseConfigured") : t("databaseStatic")}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {payload.connectors.slice(0, 4).map((connector) => {
              const probe = probesById.get(connector.id);
              const tone = probeTone(probe);
              return (
                <div
                  key={connector.id}
                  className="flex min-w-0 items-center justify-between gap-2 rounded-md bg-[var(--color-surface-2)] px-3 py-2"
                >
                  <span className="truncate text-[10.5px] font-medium text-[var(--color-ink)]">{connector.name}</span>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider",
                      STATUS_CLASS[tone],
                    )}
                    >
                    {tone === "ok" ? <CheckCircle2 className="size-3" /> : null}
                    {statusLabel(probe?.status ?? connector.status)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
