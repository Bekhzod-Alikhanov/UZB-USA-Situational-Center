import { DatabaseZap, FileCheck2 } from "lucide-react";
import { sourceQualitySummary } from "@/lib/source-quality";
import { externalDataConnectors } from "@/data/external-data";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { LiveConnectorMonitor } from "@/components/overview/LiveConnectorMonitor";
import { cn } from "@/lib/utils";

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

export function SourceQualityPanel() {
  const summary = sourceQualitySummary();

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <FileCheck2 className="size-4 text-[var(--color-primary)]" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--color-ink)]">Source confidence and freshness</div>
            <div className="text-[11px] text-[var(--color-ink-muted)]">
              {summary.total} registered sources, {summary.official} official, {summary.internal} internal
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-4">
          <MiniStat label="Fresh" value={summary.fresh} tone="pos" />
          <MiniStat label="Watch" value={summary.watch} tone="warn" />
          <MiniStat label="Stale" value={summary.stale} tone="neg" />
        </div>
        <ul className="flex flex-col divide-y divide-[var(--color-border)]">
          {summary.needsAttention.slice(0, 4).map((source) => (
            <li key={source.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-[12px] font-medium text-[var(--color-ink)]">{source.name}</div>
                <div className="mt-0.5 text-[10.5px] text-[var(--color-ink-muted)]">{source.reason}</div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                  STATUS_CLASS[source.freshness],
                )}
              >
                {source.freshness}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
          <DatabaseZap className="size-4 text-[var(--color-primary)]" />
          <div>
            <div className="text-[13px] font-semibold text-[var(--color-ink)]">Live data and database readiness</div>
            <div className="text-[11px] text-[var(--color-ink-muted)]">
              Public APIs are wired as optional server connectors; private operations need credentials.
            </div>
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
                {connector.status}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-[var(--color-ink)]">{connector.name}</div>
                <div className="mt-0.5 text-[10.5px] leading-relaxed text-[var(--color-ink-muted)]">
                  {connector.dashboardUse}
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
