"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { AlertTriangle, Clock, FileWarning, CalendarClock, ClipboardCheck, ArrowRight } from "lucide-react";
import { commitments, type Commitment } from "@/data/commitments";
import { agreements, type Agreement } from "@/data/agreements";
import { centerMilestones, deriveMilestoneStatus, type CenterMilestone } from "@/data/center-milestones";
import { visitScorecards, visitPipelines, scorecardReadinessPct, type VisitScorecard } from "@/data/visit-prep";
import { cn } from "@/lib/utils";

type Severity = "critical" | "warn" | "watch";

interface RiskItem {
  id: string;
  source: "commitment" | "agreement" | "milestone" | "visit-readiness";
  severity: Severity;
  title: string;
  context: string;
  href: string;
  dueDate?: string;
}

interface Strings {
  critical: string;
  warn: string;
  watch: string;
  sourceCommitment: string;
  sourceAgreement: string;
  sourceMilestone: string;
  sourceVisitReadiness: string;
  aggregator: string;
  countCritical: string;
  countWarn: string;
  countWatch: string;
  allGreen: string;
  showing: (limit: number, total: number) => string;
  visitReadinessLabel: (pct: number) => string;
  milestoneStage: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    critical: "Escalation",
    warn: "Watch",
    watch: "Monitor",
    sourceCommitment: "Commitment",
    sourceAgreement: "Agreement",
    sourceMilestone: "Center milestone",
    sourceVisitReadiness: "Visit readiness",
    aggregator: "Aggregator: commitments + agreements + center milestones + visit readiness",
    countCritical: "escalation",
    countWarn: "watch",
    countWatch: "monitor",
    allGreen: "All commitments, agreements, milestones and visit pipelines are tracking green.",
    showing: (limit, total) => `Showing ${limit} of ${total}. Full list on the source pages.`,
    visitReadinessLabel: (pct) => ` — readiness ${pct}%`,
    milestoneStage: "Stage",
  },
  ru: {
    critical: "Эскалация",
    warn: "Контроль",
    watch: "Наблюдение",
    sourceCommitment: "Поручение",
    sourceAgreement: "Соглашение",
    sourceMilestone: "Этап Штаба",
    sourceVisitReadiness: "Готовность визита",
    aggregator: "Агрегатор: commitments + agreements + center milestones + visit readiness",
    countCritical: "эскалация",
    countWarn: "контроль",
    countWatch: "наблюдение",
    allGreen: "Все обязательства, соглашения, этапы и визиты в зелёной зоне.",
    showing: (limit, total) => `Показаны ${limit} из ${total}. Полный список — на страницах источников.`,
    visitReadinessLabel: (pct) => ` — готовность ${pct}%`,
    milestoneStage: "Этап",
  },
  "uz-latn": {
    critical: "Eskalatsiya",
    warn: "Nazorat",
    watch: "Kuzatuv",
    sourceCommitment: "Topshiriq",
    sourceAgreement: "Bitim",
    sourceMilestone: "Markaz bosqichi",
    sourceVisitReadiness: "Tashrif tayyorligi",
    aggregator: "Agregator: commitments + agreements + center milestones + visit readiness",
    countCritical: "eskalatsiya",
    countWarn: "nazorat",
    countWatch: "kuzatuv",
    allGreen: "Barcha topshiriqlar va tashriflar yashil zonada.",
    showing: (limit, total) => `${total} dan ${limit} ko'rsatildi. To'liq ro'yxat manba sahifalarda.`,
    visitReadinessLabel: (pct) => ` — tayyorlik ${pct}%`,
    milestoneStage: "Bosqich",
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

const SEVERITY_TONE: Record<Severity, string> = {
  critical: "border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
  warn: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  watch: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
};

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warn: 1, watch: 2 };

const SOURCE_ICON: Record<RiskItem["source"], React.ComponentType<{ className?: string }>> = {
  commitment: AlertTriangle,
  agreement: FileWarning,
  milestone: CalendarClock,
  "visit-readiness": ClipboardCheck,
};

function buildRisks(locale: string, today: Date): RiskItem[] {
  const T = pickStr(locale);
  const out: RiskItem[] = [];

  for (const c of commitments as Commitment[]) {
    if (c.status === "overdue") {
      out.push({
        id: `commit-${c.id}`,
        source: "commitment",
        severity: "critical",
        title: c.title,
        context: `${c.owner} · due ${c.dueDate}`,
        href: `/${locale}/commitments?status=overdue&q=${encodeURIComponent(c.title.slice(0, 24))}`,
        dueDate: c.dueDate,
      });
    } else if (c.status === "watch") {
      out.push({
        id: `commit-${c.id}`,
        source: "commitment",
        severity: "warn",
        title: c.title,
        context: `${c.owner} · ${c.progressPct}% complete`,
        href: `/${locale}/commitments?status=watch&q=${encodeURIComponent(c.title.slice(0, 24))}`,
        dueDate: c.dueDate,
      });
    }
  }

  for (const a of agreements as Agreement[]) {
    if (a.status === "signed-not-in-force") {
      out.push({
        id: `agree-${a.id}`,
        source: "agreement",
        severity: "warn",
        title: a.title,
        context: `Signed ${a.signedOn} · awaiting ratification / entry into force`,
        href: `/${locale}/agreements`,
        dueDate: a.signedOn,
      });
    }
  }

  for (const m of centerMilestones as CenterMilestone[]) {
    const status = deriveMilestoneStatus(m.dueDate, today);
    if (status === "overdue") {
      out.push({
        id: `milestone-${m.stage}`,
        source: "milestone",
        severity: "critical",
        title: `${T.milestoneStage} ${m.stage}: ${m.title}`,
        context: `Deadline ${m.dueDate}`,
        href: `/${locale}/staff`,
        dueDate: m.dueDate,
      });
    } else if (status === "in-progress") {
      out.push({
        id: `milestone-${m.stage}`,
        source: "milestone",
        severity: "watch",
        title: `${T.milestoneStage} ${m.stage}: ${m.title}`,
        context: `Due ${m.dueDate}`,
        href: `/${locale}/staff`,
        dueDate: m.dueDate,
      });
    }
  }

  for (const sc of visitScorecards as VisitScorecard[]) {
    const pipeline = visitPipelines.find((p) => p.id === sc.pipelineRef);
    if (!pipeline) continue;
    const visitDate = new Date(pipeline.date + "T00:00:00Z");
    const daysToVisit = Math.round((visitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const pct = scorecardReadinessPct(sc);
    if (daysToVisit < 0) continue;
    if (daysToVisit <= 30 && pct < 70) {
      out.push({
        id: `visit-${pipeline.id}`,
        source: "visit-readiness",
        severity: pct < 50 ? "critical" : "warn",
        title: `${pipeline.title}${T.visitReadinessLabel(pct)}`,
        context: `T-${daysToVisit} days · ${pipeline.dateRange}`,
        href: `/${locale}/prepare`,
        dueDate: pipeline.date,
      });
    }
  }

  return out.sort((a, b) => {
    const rank = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (rank !== 0) return rank;
    return (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
  });
}

export function RiskRadar({ limit = 6 }: { limit?: number }) {
  const locale = useLocale();
  const T = pickStr(locale);
  const items = useMemo(() => buildRisks(locale, new Date()), [locale]);
  const SEVERITY_LABEL: Record<Severity, string> = {
    critical: T.critical,
    warn: T.warn,
    watch: T.watch,
  };
  const SOURCE_LABEL: Record<RiskItem["source"], string> = {
    commitment: T.sourceCommitment,
    agreement: T.sourceAgreement,
    milestone: T.sourceMilestone,
    "visit-readiness": T.sourceVisitReadiness,
  };

  const counts = {
    critical: items.filter((i) => i.severity === "critical").length,
    warn: items.filter((i) => i.severity === "warn").length,
    watch: items.filter((i) => i.severity === "watch").length,
  };

  const visible = items.slice(0, limit);

  if (visible.length === 0) {
    return (
      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-[12.5px] text-[var(--color-ink-muted)]">
        {T.allGreen}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-[11px] sm:gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] px-2 py-0.5 font-medium text-[var(--color-neg)]">
          <Clock className="size-3" />
          {counts.critical} {T.countCritical}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] px-2 py-0.5 font-medium text-[var(--color-warn)]">
          {counts.warn} {T.countWarn}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] px-2 py-0.5 font-medium text-[var(--color-primary)]">
          {counts.watch} {T.countWatch}
        </span>
        <span className="ml-auto hidden text-[10.5px] text-[var(--color-ink-faint)] lg:inline">{T.aggregator}</span>
      </div>

      <ul className="flex flex-col gap-2">
        {visible.map((it) => {
          const Icon = SOURCE_ICON[it.source];
          return (
            <li key={it.id}>
              <Link
                href={it.href}
                prefetch={false}
                className="group flex items-start gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]"
              >
                <Icon
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    it.severity === "critical"
                      ? "text-[var(--color-neg)]"
                      : it.severity === "warn"
                        ? "text-[var(--color-warn)]"
                        : "text-[var(--color-primary)]",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-[12.5px] font-medium text-[var(--color-ink)]">{it.title}</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10.5px] text-[var(--color-ink-muted)]">
                    <span className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 uppercase tracking-wider text-[var(--color-ink-faint)]">
                      {SOURCE_LABEL[it.source]}
                    </span>
                    <span className="truncate">{it.context}</span>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider",
                    SEVERITY_TONE[it.severity],
                  )}
                >
                  {SEVERITY_LABEL[it.severity]}
                </span>
                <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-[var(--color-ink-faint)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-ink-muted)]" />
              </Link>
            </li>
          );
        })}
      </ul>

      {items.length > limit ? (
        <div className="text-[10.5px] text-[var(--color-ink-muted)]">{T.showing(limit, items.length)}</div>
      ) : null}
    </div>
  );
}
