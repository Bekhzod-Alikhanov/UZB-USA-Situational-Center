import { DatabaseZap, FileCheck2 } from "lucide-react";
import { sourceQualitySummary } from "@/lib/source-quality";
import { externalDataConnectors } from "@/data/external-data";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { LiveConnectorMonitor } from "@/components/overview/LiveConnectorMonitor";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const STATUS_CLASS = {
  fresh: "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  watch: "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  stale: "bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  undated: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

const CONNECTOR_CLASS = {
  "live-ready": "bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  "key-required": "bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  "manual-review": "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  planned: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

export async function SourceQualityPanel() {
  const summary = sourceQualitySummary();
  const t = await getTranslations("overview.sourceQuality");

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <FileCheck2 className="size-4 text-[var(--color-primary)]" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--color-ink)]">{t("sourceTitle")}</div>
            <div className="text-[11px] text-[var(--color-ink-muted)]">
              {t("sourceSub", {
                total: summary.total,
                official: summary.official,
                internal: summary.internal,
              })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-4">
          <MiniStat label={t("stats.fresh")} value={summary.fresh} tone="pos" />
          <MiniStat label={t("stats.watch")} value={summary.watch} tone="warn" />
          <MiniStat label={t("stats.stale")} value={summary.stale} tone="neg" />
        </div>
        <div className="border-t border-[var(--color-border)] px-4 py-2 text-[10.5px] leading-relaxed text-[var(--color-ink-faint)]">
          {t("thresholdNote")}
        </div>
        <ul className="flex flex-col divide-y divide-[var(--color-border)]">
          {summary.needsAttention.slice(0, 4).map((source) => (
            <li key={source.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-[12px] font-medium text-[var(--color-ink)]">{source.name}</div>
                <div className="mt-0.5 text-[10.5px] text-[var(--color-ink-muted)]">
                  {localizedSourceReason(source, t)}
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  STATUS_CLASS[source.freshness],
                )}
              >
                {t(`freshness.${source.freshness}`)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <DatabaseZap className="size-4 text-[var(--color-primary)]" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--color-ink)]">{t("liveTitle")}</div>
            <div className="text-[11px] text-[var(--color-ink-muted)]">{t("liveSub")}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-[var(--color-border)]">
          {externalDataConnectors.slice(0, 5).map((connector) => (
            <div key={connector.id} className="flex items-start gap-3 px-4 py-3">
              <span
                className={cn(
                  "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider",
                  CONNECTOR_CLASS[connector.status],
                )}
              >
                {t(`connectorStatus.${connector.status}`)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-[var(--color-ink)]">{connector.name}</div>
                <div className="mt-0.5 text-[10.5px] leading-relaxed text-[var(--color-ink-muted)]">
                  {localizedConnectorUse(connector.id, connector.dashboardUse, t)}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">
                    {connector.cadence}
                  </span>
                  <SourceBadge sourceId={connector.sourceId} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <LiveConnectorMonitor />
      </section>
    </div>
  );
}

type SourceQualityTranslator = (key: string, values?: Record<string, string | number>) => string;
type AttentionSource = ReturnType<typeof sourceQualitySummary>["needsAttention"][number];

function localizedSourceReason(source: AttentionSource, t: SourceQualityTranslator) {
  const age =
    source.ageDays === undefined ? t("age.undated") : t("age.days", { days: source.ageDays });

  if (source.level === "A") return t("reasons.internal", { age });
  if (source.freshness === "stale") return t("reasons.stale", { age });
  if (source.confidence === "official") return t("reasons.official", { age });
  return t("reasons.partner", { age });
}

const LOCALIZED_CONNECTOR_USE = new Set([
  "census-hs-trade",
  "world-bank-wdi",
  "bea-services",
  "imf-data",
  "foreign-assistance",
]);

function localizedConnectorUse(id: string, fallback: string, t: SourceQualityTranslator) {
  return LOCALIZED_CONNECTOR_USE.has(id) ? t(`connectorUse.${id}`) : fallback;
}

function MiniStat({ label, value, tone }: { label: string; value: number; tone: "pos" | "warn" | "neg" }) {
  const toneClass =
    tone === "pos"
      ? "bg-[var(--color-pos-soft)] text-[var(--color-pos)]"
      : tone === "warn"
        ? "bg-[var(--color-warn-soft)] text-[var(--color-warn)]"
        : "bg-[var(--color-neg-soft)] text-[var(--color-neg)]";
  return (
    <div className={cn("rounded-md px-3 py-2", toneClass)}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink)]">{label}</div>
      <div className="mono mt-1 text-[18px] font-semibold tabular">{value}</div>
    </div>
  );
}
