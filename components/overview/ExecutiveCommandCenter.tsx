import Link from "next/link";
import type { ComponentType } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { buildExecutiveBriefing, type ExecutiveItem, type ExecutiveItemTone } from "@/data/executive";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const TONE_CLASS: Record<ExecutiveItemTone, string> = {
  critical: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  watch: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  positive: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  neutral: "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

const TONE_ICON: Record<ExecutiveItemTone, ComponentType<{ className?: string }>> = {
  critical: AlertTriangle,
  watch: Clock3,
  positive: CheckCircle2,
  neutral: ShieldCheck,
};

export function ExecutiveCommandCenter({ locale }: { locale: string }) {
  const briefing = buildExecutiveBriefing();

  return (
    <Card tone="primary" className="overflow-hidden">
      <CardHeader
        tone="primary"
        icon={<Sparkles className="size-3.5" />}
        title="Executive command center"
        sub={`Daily operating readout - as of ${briefing.asOf}`}
      />
      <CardBody>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.95fr]">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                Situation read
              </div>
              <h2 className="serif mt-1 text-[20px] font-medium leading-tight text-[var(--color-ink)]">
                {briefing.headline}
              </h2>
              <p className="mt-2 max-w-4xl text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                {briefing.readout}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {briefing.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className={cn("rounded-md border px-3 py-2", TONE_CLASS[metric.tone])}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{metric.label}</div>
                  <div className="mono mt-1 text-[18px] font-semibold tabular">{metric.value}</div>
                </div>
              ))}
            </div>

            <BriefingList title="Priority actions" items={briefing.priorityActions} locale={locale} />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <BriefingList title="Risks to manage" items={briefing.risks} locale={locale} compact />
            <BriefingList title="Opportunities to exploit" items={briefing.opportunities} locale={locale} compact />
            <BriefingList title="Latest changes" items={briefing.changes} locale={locale} compact />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function BriefingList({
  title,
  items,
  locale,
  compact,
}: {
  title: string;
  items: ExecutiveItem[];
  locale: string;
  compact?: boolean;
}) {
  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3 py-2">
        <h3 className="text-[12.5px] font-semibold text-[var(--color-ink)]">{title}</h3>
        <span className="mono text-[10px] text-[var(--color-ink-faint)]">{items.length}</span>
      </div>
      <ul className="flex flex-col divide-y divide-[var(--color-border)]">
        {items.map((item) => {
          const Icon = TONE_ICON[item.tone];
          return (
            <li key={item.id} className="p-3">
              <div className="flex items-start gap-2.5">
                <span className={cn("mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border", TONE_CLASS[item.tone])}>
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-medium leading-snug text-[var(--color-ink)]">{item.title}</div>
                  <p className={cn("mt-1 leading-relaxed text-[var(--color-ink-muted)]", compact ? "text-[11.5px]" : "text-[12.5px]")}>
                    {item.detail}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10.5px] text-[var(--color-ink-muted)]">
                    <span className="font-medium text-[var(--color-ink)]">{item.owner}</span>
                    {item.due ? <span className="mono tabular">{item.due}</span> : null}
                    {item.sourceId ? <SourceBadge sourceId={item.sourceId} /> : null}
                  </div>
                </div>
                <Link
                  href={`/${locale}${item.href}`}
                  className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                  aria-label={`Open ${item.title}`}
                >
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
