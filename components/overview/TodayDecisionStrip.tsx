import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, RadioTower } from "lucide-react";
import { buildExecutiveBriefing, type ExecutiveItem } from "@/data/executive";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

const COPY = {
  en: {
    eyebrow: "Today",
    title: "Decision strip",
    change: "Top change",
    risk: "Top risk",
    action: "Top action",
    open: "Open",
  },
  ru: {
    eyebrow: "Сегодня",
    title: "Полоса решений",
    change: "Главное изменение",
    risk: "Главный риск",
    action: "Главное действие",
    open: "Открыть",
  },
  "uz-latn": {
    eyebrow: "Bugun",
    title: "Qarorlar paneli",
    change: "Asosiy o'zgarish",
    risk: "Asosiy xatar",
    action: "Asosiy harakat",
    open: "Ochish",
  },
} as const;

function pickCopy(locale: string) {
  if (locale === "ru") return COPY.ru;
  if (locale === "uz-latn") return COPY["uz-latn"];
  return COPY.en;
}

export function TodayDecisionStrip({ locale }: { locale: string }) {
  const briefing = buildExecutiveBriefing(locale);
  const copy = pickCopy(locale);
  const cards = [
    {
      key: "change",
      label: copy.change,
      item: briefing.changes[0],
      icon: RadioTower,
      tone: "primary",
    },
    {
      key: "risk",
      label: copy.risk,
      item: briefing.risks[0],
      icon: AlertTriangle,
      tone: "rose",
    },
    {
      key: "action",
      label: copy.action,
      item: briefing.priorityActions[0],
      icon: CheckCircle2,
      tone: "invest",
    },
  ] as const;

  return (
    <section className="rounded-lg border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-surface)_88%,transparent)] p-3 shadow-[var(--shadow-card)]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-[var(--color-primary)]" aria-hidden />
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
            {copy.eyebrow}
          </div>
        </div>
        <div className="hidden text-[11px] text-[var(--color-ink-muted)] sm:block">{copy.title}</div>
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        {cards.map(({ key, label, item, icon: Icon, tone }) => (
          <DecisionCard
            key={key}
            label={label}
            item={item}
            locale={locale}
            openLabel={copy.open}
            icon={<Icon className="size-3.5" aria-hidden />}
            tone={tone}
          />
        ))}
      </div>
    </section>
  );
}

function DecisionCard({
  label,
  item,
  icon,
  locale,
  openLabel,
  tone,
}: {
  label: string;
  item: ExecutiveItem | undefined;
  icon: ReactNode;
  locale: string;
  openLabel: string;
  tone: "primary" | "rose" | "invest";
}) {
  if (!item) return null;

  const toneClass =
    tone === "rose"
      ? "text-[var(--color-rose)] bg-[var(--color-rose-soft)] border-[var(--color-rose)]/30"
      : tone === "invest"
        ? "text-[var(--color-invest)] bg-[var(--color-invest-soft)] border-[var(--color-invest)]/30"
        : "text-[var(--color-primary)] bg-[var(--color-primary-soft)] border-[var(--color-primary)]/30";

  return (
    <article className="group rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition hover:border-[var(--color-border-strong)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", toneClass)}>
          {icon}
          {label}
        </span>
        {item.sourceId ? <SourceBadge sourceId={item.sourceId} /> : null}
      </div>
      <h2 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[var(--color-ink)]">{item.title}</h2>
      <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-[var(--color-ink-muted)]">{item.detail}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="truncate text-[10.5px] text-[var(--color-ink-faint)]">{item.owner}</span>
        <Link
          href={`/${locale}${item.href}`}
          prefetch={false}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[var(--color-border)] px-2 py-1 text-[11px] font-medium text-[var(--color-ink-muted)] transition group-hover:bg-[var(--color-surface-2)] group-hover:text-[var(--color-ink)]"
        >
          {openLabel}
          <ArrowRight className="size-3" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
