"use client";
import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Check, Clock, Eye, Circle, AlertTriangle } from "lucide-react";
import { visitScorecards, visitPipelines, blockReadinessPct, type ScorecardBlock } from "@/data/visit-prep";
import { cn } from "@/lib/utils";

interface TMinusCheckpoint {
  tMinusDays: number;
  label: string;
  description: string;
  blockNumbers: ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6 | 7>;
}

interface CheckpointDescriptions {
  t30: string;
  t14: string;
  t7: string;
  t1: string;
}

const CP_DESC: Record<"en" | "ru" | "uz-latn", CheckpointDescriptions> = {
  en: {
    t30: "Initiation: objectives, delegation, funding",
    t14: "Programme + agreements: agenda, MoU drafts, legal review",
    t7: "Materials + logistics: briefs, talking points, tickets, hotels",
    t1: "Final situational briefing",
  },
  ru: {
    t30: "Инициация: цели, делегация, финансирование",
    t14: "Программа и договорной блок: повестка, MoU драфты, юридическое",
    t7: "Материалы и логистика: брифы, talking points, билеты, отели",
    t1: "Финальный ситуационный брифинг",
  },
  "uz-latn": {
    t30: "Boshlash: maqsadlar, delegatsiya, moliyalashtirish",
    t14: "Dastur va shartnoma: kun tartibi, MoU loyihalar, huquqiy",
    t7: "Materiallar va logistika: brif, talking points, chiptalar, mehmonxona",
    t1: "Yakuniy vaziyat brifingi",
  },
};

function buildCheckpoints(locale: string): ReadonlyArray<TMinusCheckpoint> {
  const desc = locale === "ru" ? CP_DESC.ru : locale === "uz-latn" ? CP_DESC["uz-latn"] : CP_DESC.en;
  return [
    { tMinusDays: 30, label: "T-30", description: desc.t30, blockNumbers: [1, 2] },
    { tMinusDays: 14, label: "T-14", description: desc.t14, blockNumbers: [3, 5] },
    { tMinusDays: 7, label: "T-7", description: desc.t7, blockNumbers: [4, 6] },
    { tMinusDays: 1, label: "T-1", description: desc.t1, blockNumbers: [4, 6] },
  ];
}

type CheckpointStatus = "completed" | "on-track" | "at-risk" | "due" | "missed" | "future";

const STATUS_TONE: Record<CheckpointStatus, string> = {
  completed: "bg-[var(--color-pos)] text-white border-[var(--color-pos)]",
  "on-track": "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary)]/40",
  "at-risk": "bg-[var(--color-warn-soft)] text-[var(--color-warn)] border-[var(--color-warn)]/40",
  due: "bg-[var(--color-neg-soft)] text-[var(--color-neg)] border-[var(--color-neg)]/40",
  missed: "bg-[var(--color-neg)] text-white border-[var(--color-neg)]",
  future: "bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border-[var(--color-border)]",
};

const STATUS_LABEL_BY_LOCALE: Record<"en" | "ru" | "uz-latn", Record<CheckpointStatus, string>> = {
  en: {
    completed: "Completed",
    "on-track": "On track",
    "at-risk": "At risk",
    due: "Due",
    missed: "Missed",
    future: "Upcoming",
  },
  ru: {
    completed: "Выполнено",
    "on-track": "По графику",
    "at-risk": "Под риском",
    due: "Срок",
    missed: "Пропущено",
    future: "Впереди",
  },
  "uz-latn": {
    completed: "Bajarildi",
    "on-track": "Jadvalda",
    "at-risk": "Xavf ostida",
    due: "Muddat",
    missed: "O'tkazildi",
    future: "Oldinda",
  },
};

const STATUS_ICON: Record<CheckpointStatus, React.ComponentType<{ className?: string }>> = {
  completed: Check,
  "on-track": Eye,
  "at-risk": Clock,
  due: AlertTriangle,
  missed: AlertTriangle,
  future: Circle,
};

interface Strings {
  visitDate: string;
  daysToVisit: string;
  coverageBlocks: string;
  checkpointPassed: string;
  explainer: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    visitDate: "Visit date",
    daysToVisit: "Days to visit",
    coverageBlocks: "Covers scorecard blocks:",
    checkpointPassed: " · checkpoint passed",
    explainer:
      "T-minus is computed from the visit date. Each checkpoint's status is a function of the average readiness of the scorecard blocks it covers and whether the checkpoint date has already passed. Link to the 7-block scorecard above: T-30 → B1+B2 · T-14 → B3+B5 · T-7 → B4+B6 · T-1 → final briefing.",
  },
  ru: {
    visitDate: "Дата визита",
    daysToVisit: "До визита",
    coverageBlocks: "Покрывает блоки скоркарта:",
    checkpointPassed: " · контрольная точка пройдена",
    explainer:
      "T-minus считается автоматически из даты визита. Статус каждого чекпойнта — функция от средней готовности блоков скоркарта, которые он покрывает, и от того, прошла ли уже контрольная дата. Связка с 7-block scorecard выше: T-30→B1+B2 · T-14→B3+B5 · T-7→B4+B6 · T-1→финальный брифинг.",
  },
  "uz-latn": {
    visitDate: "Tashrif sanasi",
    daysToVisit: "Tashrifgacha",
    coverageBlocks: "Skorkarta bloklarini qamraydi:",
    checkpointPassed: " · nazorat nuqtasi o'tdi",
    explainer:
      "T-minus tashrif sanasidan avtomatik hisoblanadi. Har bir nazorat nuqtasi statusi qoplanadigan skorkarta bloklarining o'rtacha tayyorligi funksiyasidir.",
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

function classifyCheckpoint(
  blocksCovered: ScorecardBlock[],
  daysToVisit: number,
  tMinusDays: number,
): { status: CheckpointStatus; pct: number } {
  const applicable = blocksCovered.filter((b) => b.applicable);
  if (applicable.length === 0) return { status: "future", pct: 0 };
  const pct = Math.round(applicable.reduce((sum, b) => sum + blockReadinessPct(b), 0) / applicable.length);
  const checkpointInPast = daysToVisit <= tMinusDays;
  const checkpointInFuture = daysToVisit > tMinusDays;
  if (pct >= 90) return { status: "completed", pct };
  if (checkpointInPast) {
    if (pct >= 70) return { status: "on-track", pct };
    if (pct >= 40) return { status: "at-risk", pct };
    return daysToVisit < 0 ? { status: "missed", pct } : { status: "due", pct };
  }
  if (checkpointInFuture) {
    const slack = daysToVisit - tMinusDays;
    if (pct >= 60) return { status: "on-track", pct };
    if (pct >= 30 && slack > 14) return { status: "on-track", pct };
    if (pct >= 30) return { status: "at-risk", pct };
    return { status: "future", pct };
  }
  return { status: "due", pct };
}

export function TMinusTimeline() {
  const locale = useLocale();
  const T = pickStr(locale);
  const STATUS_LABEL =
    STATUS_LABEL_BY_LOCALE[(locale === "ru" || locale === "uz-latn" ? locale : "en") as "en" | "ru" | "uz-latn"];
  const CHECKPOINTS = useMemo(() => buildCheckpoints(locale), [locale]);
  const dateLocale = locale === "ru" ? "ru-RU" : locale === "uz-latn" ? "uz-Latn-UZ" : "en-GB";
  const DATE_FMT = new Intl.DateTimeFormat(dateLocale, { day: "2-digit", month: "short" });

  const [activeRef, setActiveRef] = useState<string>(visitScorecards[0]?.pipelineRef ?? "");

  const active = useMemo(() => visitScorecards.find((s) => s.pipelineRef === activeRef), [activeRef]);
  const pipeline = useMemo(() => visitPipelines.find((p) => p.id === activeRef), [activeRef]);

  if (!active || !pipeline) return null;

  const today = new Date();
  const visitDate = new Date(pipeline.date + "T00:00:00Z");
  const daysToVisit = Math.round((visitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const enriched = CHECKPOINTS.map((cp) => {
    const blocks = (cp.blockNumbers as ReadonlyArray<number>)
      .map((bn) => active.blocks.find((b) => b.blockNumber === bn))
      .filter((b): b is ScorecardBlock => !!b);
    const { status, pct } = classifyCheckpoint(blocks, daysToVisit, cp.tMinusDays);
    const checkpointDate = new Date(visitDate);
    checkpointDate.setUTCDate(checkpointDate.getUTCDate() - cp.tMinusDays);
    return { cp, status, pct, checkpointDate };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {visitScorecards.map((sc) => {
          const p = visitPipelines.find((x) => x.id === sc.pipelineRef);
          const isActive = sc.pipelineRef === activeRef;
          return (
            <button
              key={sc.pipelineRef}
              type="button"
              onClick={() => setActiveRef(sc.pipelineRef ?? "")}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-left text-[12px] transition",
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-border-strong)]",
              )}
            >
              <span className="serif font-medium">{p?.title ?? sc.pipelineRef}</span>
              <span className="ml-2 mono text-[10.5px] tabular text-[var(--color-ink-muted)]">{p?.dateRange}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
        <div>
          <div className="text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">{T.visitDate}</div>
          <div className="mono text-[14px] font-semibold tabular text-[var(--color-ink)]">
            {DATE_FMT.format(visitDate)}, {visitDate.getUTCFullYear()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10.5px] uppercase tracking-wider text-[var(--color-ink-faint)]">{T.daysToVisit}</div>
          <div
            className={cn(
              "mono text-[18px] font-semibold tabular",
              daysToVisit < 0
                ? "text-[var(--color-ink-muted)]"
                : daysToVisit <= 7
                  ? "text-[var(--color-neg)]"
                  : daysToVisit <= 30
                    ? "text-[var(--color-warn)]"
                    : "text-[var(--color-ink)]",
            )}
          >
            {daysToVisit >= 0 ? `T-${daysToVisit}` : `T+${Math.abs(daysToVisit)}`}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-3 bottom-3 w-px bg-[var(--color-border)]" aria-hidden />
        <ol className="flex flex-col gap-3">
          {enriched.map(({ cp, status, pct, checkpointDate }) => {
            const Icon = STATUS_ICON[status];
            const checkpointHasPassed = daysToVisit <= cp.tMinusDays;
            return (
              <li key={cp.label} className="relative flex gap-3">
                <span
                  className={cn(
                    "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                    STATUS_TONE[status],
                  )}
                  aria-hidden
                >
                  <Icon className="size-3" />
                </span>
                <div className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="mono font-semibold tabular text-[var(--color-ink)]">{cp.label}</span>
                      <span className="mono text-[10.5px] tabular text-[var(--color-ink-muted)]">
                        ({DATE_FMT.format(checkpointDate)})
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider",
                          STATUS_TONE[status],
                        )}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-20 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background:
                              pct >= 70 ? "var(--color-pos)" : pct >= 40 ? "var(--color-primary)" : "var(--color-warn)",
                          }}
                        />
                      </div>
                      <span className="mono w-10 text-right text-[11px] font-semibold tabular text-[var(--color-ink)]">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-[11.5px] text-[var(--color-ink-muted)]">{cp.description}</p>
                  <div className="mt-1 text-[10px] text-[var(--color-ink-faint)]">
                    {T.coverageBlocks} {cp.blockNumbers.map((b) => `B${b}`).join(", ")}
                    {checkpointHasPassed ? T.checkpointPassed : ""}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="text-[10.5px] text-[var(--color-ink-faint)]">{T.explainer}</p>
    </div>
  );
}
