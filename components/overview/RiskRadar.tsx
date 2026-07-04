"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import { AlertTriangle, Clock, FileWarning, CalendarClock, ClipboardCheck, ArrowRight } from "lucide-react";
import { allRoadmapSteps, stepHealth, roadmapProjectTitle, roadmapStepTitle } from "@/data/roadmaps";
import { agreements, type Agreement } from "@/data/agreements";
import { centerMilestones, deriveMilestoneStatus, type CenterMilestone } from "@/data/center-milestones";
import { upcomingVisits, visitTitle, materialsReceived } from "@/data/visit-prep";
import { localizedMilestoneTitle } from "@/lib/i18n/overview-content";
import { cn } from "@/lib/utils";

type Severity = "critical" | "warn" | "watch";

interface RiskItem {
  id: string;
  source: "roadmap" | "agreement" | "milestone" | "visit-readiness";
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
  sourceRoadmap: string;
  sourceAgreement: string;
  sourceMilestone: string;
  sourceVisitReadiness: string;
  aggregator: string;
  countCritical: string;
  countWarn: string;
  countWatch: string;
  allGreen: string;
  showing: (limit: number, total: number) => string;
  visitReadinessLabel: (received: number, total: number) => string;
  milestoneStage: string;
  ctxDue: (date: string) => string;
  ctxAgreement: (date: string) => string;
  ctxDeadline: (date: string) => string;
  ctxDueDate: (date: string) => string;
  ctxVisit: (days: number, range: string) => string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    critical: "Escalation",
    warn: "Watch",
    watch: "Monitor",
    sourceRoadmap: "Roadmap task",
    sourceAgreement: "Agreement",
    sourceMilestone: "Center milestone",
    sourceVisitReadiness: "Visit readiness",
    aggregator: "Aggregator: roadmap tasks + agreements + center milestones + visit readiness",
    countCritical: "escalation",
    countWarn: "watch",
    countWatch: "monitor",
    allGreen: "All roadmap tasks, agreements, milestones and visit pipelines are tracking green.",
    showing: (limit, total) => `Showing ${limit} of ${total}. Full list on the source pages.`,
    visitReadinessLabel: (received, total) => ` — materials ${received}/${total}`,
    milestoneStage: "Stage",
    ctxDue: (date) => `due ${date}`,
    ctxAgreement: (date) => `Signed ${date} · awaiting ratification / entry into force`,
    ctxDeadline: (date) => `Deadline ${date}`,
    ctxDueDate: (date) => `Due ${date}`,
    ctxVisit: (days, range) => `T-${days} days · ${range}`,
  },
  ru: {
    critical: "Эскалация",
    warn: "Контроль",
    watch: "Наблюдение",
    sourceRoadmap: "Задача дорожной карты",
    sourceAgreement: "Соглашение",
    sourceMilestone: "Этап Штаба",
    sourceVisitReadiness: "Готовность визита",
    aggregator: "Агрегатор: задачи дорожных карт + соглашения + этапы Центра + готовность визитов",
    countCritical: "эскалация",
    countWarn: "контроль",
    countWatch: "наблюдение",
    allGreen: "Все задачи дорожных карт, соглашения, этапы и визиты в зелёной зоне.",
    showing: (limit, total) => `Показаны ${limit} из ${total}. Полный список — на страницах источников.`,
    visitReadinessLabel: (received, total) => ` — материалы ${received}/${total}`,
    milestoneStage: "Этап",
    ctxDue: (date) => `срок ${date}`,
    ctxAgreement: (date) => `Подписано ${date} · ожидает ратификации / вступления в силу`,
    ctxDeadline: (date) => `Срок ${date}`,
    ctxDueDate: (date) => `Срок ${date}`,
    ctxVisit: (days, range) => `T-${days} дн. · ${range}`,
  },
  "uz-latn": {
    critical: "Eskalatsiya",
    warn: "Nazorat",
    watch: "Kuzatuv",
    sourceRoadmap: "Yo'l xaritasi vazifasi",
    sourceAgreement: "Bitim",
    sourceMilestone: "Markaz bosqichi",
    sourceVisitReadiness: "Tashrif tayyorligi",
    aggregator: "Agregator: yo'l xaritasi vazifalari + bitimlar + Markaz bosqichlari + tashrif tayyorligi",
    countCritical: "eskalatsiya",
    countWarn: "nazorat",
    countWatch: "kuzatuv",
    allGreen: "Barcha yo'l xaritasi vazifalari va tashriflar yashil zonada.",
    showing: (limit, total) => `${total} dan ${limit} ko'rsatildi. To'liq ro'yxat manba sahifalarda.`,
    visitReadinessLabel: (received, total) => ` — materiallar ${received}/${total}`,
    milestoneStage: "Bosqich",
    ctxDue: (date) => `muddat ${date}`,
    ctxAgreement: (date) => `Imzolangan ${date} · ratifikatsiya / kuchga kirishni kutmoqda`,
    ctxDeadline: (date) => `Muddat ${date}`,
    ctxDueDate: (date) => `Muddat ${date}`,
    ctxVisit: (days, range) => `T-${days} kun · ${range}`,
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warn: 1, watch: 2 };

const SOURCE_ICON: Record<RiskItem["source"], React.ComponentType<{ className?: string }>> = {
  roadmap: AlertTriangle,
  agreement: FileWarning,
  milestone: CalendarClock,
  "visit-readiness": ClipboardCheck,
};

function buildRisks(locale: string, today: Date): RiskItem[] {
  const T = pickStr(locale);
  const out: RiskItem[] = [];

  // Roadmap tasks: health derived from the document deadlines — overdue
  // escalates, due-soon goes on watch. Deep link opens /roadmaps filtered to
  // the task's region.
  for (const { project, step } of allRoadmapSteps()) {
    const health = stepHealth(step, today);
    if (health !== "overdue" && health !== "due-soon") continue;
    out.push({
      id: `roadmap-${step.id}`,
      source: "roadmap",
      severity: health === "overdue" ? "critical" : "warn",
      title: roadmapStepTitle(step, locale),
      context: `${roadmapProjectTitle(project, locale)} · ${T.ctxDue(step.due)}`,
      href: `/${locale}/roadmaps?region=${project.region}&q=${encodeURIComponent(project.title.slice(0, 24))}`,
      dueDate: `${step.due}-28`,
    });
  }

  for (const a of agreements as Agreement[]) {
    if (a.status === "signed-not-in-force") {
      out.push({
        id: `agree-${a.id}`,
        source: "agreement",
        severity: "warn",
        title: a.title,
        context: T.ctxAgreement(a.signedOn),
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
        title: `${T.milestoneStage} ${m.stage}: ${localizedMilestoneTitle(m.stage, m.title, locale)}`,
        context: T.ctxDeadline(m.dueDate),
        href: `/${locale}/admin`,
        dueDate: m.dueDate,
      });
    } else if (status === "in-progress") {
      out.push({
        id: `milestone-${m.stage}`,
        source: "milestone",
        severity: "watch",
        title: `${T.milestoneStage} ${m.stage}: ${localizedMilestoneTitle(m.stage, m.title, locale)}`,
        context: T.ctxDueDate(m.dueDate),
        href: `/${locale}/admin`,
        dueDate: m.dueDate,
      });
    }
  }

  // Readiness risk from the hokimiyat material package: a visit inside the
  // 30-day window with materials still outstanding goes on watch (escalates
  // when nothing has arrived at all).
  for (const visit of upcomingVisits) {
    if (visit.status === "completed") continue;
    const visitDate = new Date(visit.startDate + "T00:00:00Z");
    const daysToVisit = Math.round((visitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysToVisit < 0) continue;
    const { received, total } = materialsReceived(visit);
    if (daysToVisit <= 30 && total > 0 && received < total) {
      out.push({
        id: `visit-${visit.id}`,
        source: "visit-readiness",
        severity: received === 0 ? "critical" : "warn",
        title: `${visitTitle(visit, locale)}${T.visitReadinessLabel(received, total)}`,
        context: T.ctxVisit(daysToVisit, `${visit.startDate} → ${visit.endDate}`),
        href: `/${locale}/prepare`,
        dueDate: visit.startDate,
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
    roadmap: T.sourceRoadmap,
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
                {/* Icon already encodes the source and color encodes severity —
                    the former per-row text chips live on as tooltips
                    (bureaucracy-reduction pass; summary count pills above keep
                    the explicit wording). */}
                <span title={SOURCE_LABEL[it.source]} className="mt-0.5 shrink-0">
                  <Icon
                    className={cn(
                      "size-4",
                      it.severity === "critical"
                        ? "text-[var(--color-neg)]"
                        : it.severity === "warn"
                          ? "text-[var(--color-warn)]"
                          : "text-[var(--color-primary)]",
                    )}
                  />
                  <span className="sr-only">{SOURCE_LABEL[it.source]}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-[12.5px] font-medium text-[var(--color-ink)]">{it.title}</span>
                  </div>
                  <div className="mt-0.5 truncate text-[10.5px] text-[var(--color-ink-muted)]">{it.context}</div>
                </div>
                <span
                  title={SEVERITY_LABEL[it.severity]}
                  className={cn(
                    "mt-1.5 inline-block size-2 shrink-0 rounded-full",
                    it.severity === "critical"
                      ? "bg-[var(--color-neg)]"
                      : it.severity === "warn"
                        ? "bg-[var(--color-warn)]"
                        : "bg-[var(--color-primary)]",
                  )}
                >
                  <span className="sr-only">{SEVERITY_LABEL[it.severity]}</span>
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
