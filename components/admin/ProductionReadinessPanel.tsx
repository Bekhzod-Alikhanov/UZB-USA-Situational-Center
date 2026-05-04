import { CheckCircle2, CircleDashed, LockKeyhole, XCircle } from "lucide-react";
import type { ComponentType } from "react";
import { productionReadinessItems, readinessSummary, type ReadinessStatus } from "@/data/production-readiness";
import { externalDataConnectors } from "@/data/external-data";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<ReadinessStatus, string> = {
  ready: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  partial: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  blocked: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
};

const STATUS_ICON: Record<ReadinessStatus, ComponentType<{ className?: string }>> = {
  ready: CheckCircle2,
  partial: CircleDashed,
  blocked: XCircle,
};

export function ProductionReadinessPanel() {
  const summary = readinessSummary();
  const env = {
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
    adminSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET),
    assistantEnabled: process.env.ASSISTANT_ENABLED === "true" && Boolean(process.env.ANTHROPIC_API_KEY),
    dataBackend: process.env.DATA_BACKEND || "static",
    supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <ReadinessStat label="Ready" value={summary.ready} tone="ready" />
        <ReadinessStat label="Partial" value={summary.partial} tone="partial" />
        <ReadinessStat label="Blocked" value={summary.blocked} tone="blocked" />
        <ReadinessStat label="Total" value={summary.total} tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[var(--color-ink)]">
            <LockKeyhole className="size-4 text-[var(--color-primary)]" />
            Environment gates
          </div>
          <EnvRow label="ADMIN_PASSWORD" ok={env.adminPassword} detail="Required for admin login" />
          <EnvRow label="ADMIN_SESSION_SECRET" ok={env.adminSessionSecret} detail="Recommended for signed cookies" />
          <EnvRow
            label="AI assistant"
            ok={env.assistantEnabled}
            detail="ASSISTANT_ENABLED=true and ANTHROPIC_API_KEY"
            optional
          />
          <EnvRow
            label="DATA_BACKEND"
            ok={env.dataBackend !== "static"}
            detail={`Current mode: ${env.dataBackend}`}
            optional
          />
          <EnvRow
            label="Supabase REST adapter"
            ok={env.supabase}
            detail="SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY"
            optional
          />
        </section>

        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="mb-2 text-[13px] font-semibold text-[var(--color-ink)]">Connector state</div>
          <div className="grid grid-cols-1 gap-1.5">
            {externalDataConnectors.map((connector) => (
              <div
                key={connector.id}
                className="flex items-center justify-between gap-2 rounded-md bg-[var(--color-surface-2)] px-2.5 py-1.5"
              >
                <span className="truncate text-[11.5px] text-[var(--color-ink)]">{connector.name}</span>
                <span className="shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  {connector.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
        {productionReadinessItems.map((item) => {
          const Icon = STATUS_ICON[item.status];
          return (
            <article
              key={item.id}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-full border",
                    STATUS_CLASS[item.status],
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold text-[var(--color-ink)]">{item.title}</div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                    {item.area}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">{item.why}</p>
              <p className="mt-2 border-t border-[var(--color-border)] pt-2 text-[11.5px] leading-relaxed text-[var(--color-ink)]">
                {item.next}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ReadinessStat({ label, value, tone }: { label: string; value: number; tone: ReadinessStatus | "neutral" }) {
  const className =
    tone === "neutral"
      ? "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]"
      : STATUS_CLASS[tone];
  return (
    <div className={cn("rounded-md border px-3 py-2", className)}>
      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</div>
      <div className="mono mt-1 text-[18px] font-semibold tabular">{value}</div>
    </div>
  );
}

function EnvRow({ label, ok, detail, optional }: { label: string; ok: boolean; detail: string; optional?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-[var(--color-border)] py-2 first:border-t-0 first:pt-0">
      <div>
        <div className="mono text-[11px] font-semibold text-[var(--color-ink)]">{label}</div>
        <div className="text-[10.5px] text-[var(--color-ink-muted)]">{detail}</div>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider",
          ok
            ? "bg-[var(--color-pos-soft)] text-[var(--color-pos)]"
            : optional
              ? "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]"
              : "bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
        )}
      >
        {ok ? "set" : optional ? "off" : "missing"}
      </span>
    </div>
  );
}
