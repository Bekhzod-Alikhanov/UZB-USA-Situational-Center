"use client";
import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { Database, AlertTriangle, AlertCircle } from "lucide-react";
import { computeFreshness } from "@/lib/freshness";
import { cn } from "@/lib/utils";

const REPORT = computeFreshness();

const LEVEL_TONE = {
  "up-to-date":
    "border-[color-mix(in_oklab,var(--color-pos)_30%,transparent)] bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  stale:
    "border-[color-mix(in_oklab,var(--color-warn)_30%,transparent)] bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  outdated:
    "border-[color-mix(in_oklab,var(--color-neg)_30%,transparent)] bg-[var(--color-neg-soft)] text-[var(--color-neg)]",
} as const;

const LEVEL_ICON = {
  "up-to-date": Database,
  stale: AlertTriangle,
  outdated: AlertCircle,
} as const;

interface Strings {
  upToDate: string;
  stale: string;
  outdated: string;
  panelTitle: string;
  asOf: string;
  sourcesCounted: string;
  oldestAge: string;
  medianAge: string;
  days: string;
  oldestSource: string;
  note: string;
}

const STR: Record<"en" | "ru" | "uz-latn", Strings> = {
  en: {
    upToDate: "Up-to-date",
    stale: "Stale",
    outdated: "Outdated",
    panelTitle: "Data freshness",
    asOf: "Reference date",
    sourcesCounted: "Sources counted",
    oldestAge: "Oldest source age",
    medianAge: "Median age",
    days: "d",
    oldestSource: "Oldest source",
    note: "Scale: ≤30 d — up-to-date · 30–90 d — stale · >90 d — outdated. Internal legal sources (decrees, contracts) are excluded from decay.",
  },
  ru: {
    upToDate: "Актуально",
    stale: "Устаревает",
    outdated: "Устарело",
    panelTitle: "Актуальность данных",
    asOf: "Эталонная дата",
    sourcesCounted: "Источников учтено",
    oldestAge: "Старейший возраст",
    medianAge: "Медианный возраст",
    days: "дн.",
    oldestSource: "Самый старый источник",
    note: "Шкала: ≤30 дней — актуально · 30–90 — устаревает · >90 — устарело. Внутренние юридические источники (Указы, контракты) не считаются устаревающими.",
  },
  "uz-latn": {
    upToDate: "Yangi",
    stale: "Eskirmoqda",
    outdated: "Eskirgan",
    panelTitle: "Ma'lumotlarning yangiligi",
    asOf: "Mos sana",
    sourcesCounted: "Hisobga olingan manbalar",
    oldestAge: "Eng eski yosh",
    medianAge: "Median yosh",
    days: "kun",
    oldestSource: "Eng eski manba",
    note: "Shkala: ≤30 kun — yangi · 30–90 — eskirmoqda · >90 — eskirgan. Ichki huquqiy manbalar (Farmonlar, shartnomalar) eskirmaydi.",
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

export function FreshnessPill() {
  const locale = useLocale();
  const T = pickStr(locale);
  const dateLocale = locale === "ru" ? "ru-RU" : locale === "uz-latn" ? "uz-Latn-UZ" : "en-GB";
  const DATE_FMT = new Intl.DateTimeFormat(dateLocale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const LEVEL_LABEL = {
    "up-to-date": T.upToDate,
    stale: T.stale,
    outdated: T.outdated,
  } as const;

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const Icon = LEVEL_ICON[REPORT.level];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={(e) => {
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition",
          LEVEL_TONE[REPORT.level],
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={`${T.asOf}: ${REPORT.asOf} · ${REPORT.sourcesCounted} ${T.sourcesCounted.toLowerCase()}`}
      >
        <Icon className="size-3" />
        <span className="hidden sm:inline">{LEVEL_LABEL[REPORT.level]}</span>
        <span className="mono tabular opacity-70">{DATE_FMT.format(new Date(REPORT.asOf + "T00:00:00Z"))}</span>
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-[calc(100vw-32px)] max-w-80 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[12px] shadow-lg sm:w-80">
          <div className="mb-2 flex items-center justify-between">
            <span className="serif font-semibold text-[var(--color-ink)]">{T.panelTitle}</span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                LEVEL_TONE[REPORT.level],
              )}
            >
              {LEVEL_LABEL[REPORT.level]}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-y-1.5 text-[11.5px]">
            <dt className="text-[var(--color-ink-muted)]">{T.asOf}</dt>
            <dd className="mono tabular text-right text-[var(--color-ink)]">
              {DATE_FMT.format(new Date(REPORT.asOf + "T00:00:00Z"))}
            </dd>
            <dt className="text-[var(--color-ink-muted)]">{T.sourcesCounted}</dt>
            <dd className="mono tabular text-right text-[var(--color-ink)]">{REPORT.sourcesCounted}</dd>
            <dt className="text-[var(--color-ink-muted)]">{T.oldestAge}</dt>
            <dd className="mono tabular text-right text-[var(--color-ink)]">
              {REPORT.oldestAgeDays} {T.days}
            </dd>
            <dt className="text-[var(--color-ink-muted)]">{T.medianAge}</dt>
            <dd className="mono tabular text-right text-[var(--color-ink)]">
              {REPORT.medianAgeDays} {T.days}
            </dd>
          </dl>

          <div className="mt-3 rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">{T.oldestSource}</div>
            <div className="mt-0.5 text-[11.5px] font-medium text-[var(--color-ink)]">{REPORT.oldestSourceName}</div>
            <div className="mono mt-0.5 text-[10px] tabular text-[var(--color-ink-muted)]">
              ID: {REPORT.oldestSourceId}
            </div>
          </div>

          <p className="mt-2 text-[10.5px] text-[var(--color-ink-faint)]">{T.note}</p>
        </div>
      ) : null}
    </div>
  );
}
