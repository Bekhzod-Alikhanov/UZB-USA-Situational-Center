"use client";
import { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { AlertCircle, AlertTriangle, Database } from "lucide-react";
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

const MONTHS: Record<"en" | "ru" | "uz-latn", string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ru: ["янв.", "фев.", "мар.", "апр.", "мая", "июн.", "июл.", "авг.", "сен.", "окт.", "ноя.", "дек."],
  "uz-latn": ["yan", "fev", "mar", "apr", "may", "iyun", "iyul", "avg", "sen", "okt", "noy", "dek"],
};

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
    upToDate: "Reviewed",
    stale: "Review soon",
    outdated: "Needs review",
    panelTitle: "Source freshness",
    asOf: "Last reviewed",
    sourcesCounted: "Sources counted",
    oldestAge: "Oldest source age",
    medianAge: "Median age",
    days: "d",
    oldestSource: "Oldest source",
    note: "Platform review grade, set by the oldest tracked source: <=30 d reviewed, 30-90 d review soon, >90 d needs review. This is separate from per-source freshness shown on the overview. Internal legal sources do not decay.",
  },
  ru: {
    upToDate: "Проверено",
    stale: "Нужна проверка",
    outdated: "Требует проверки",
    panelTitle: "Актуальность источников",
    asOf: "Последняя проверка",
    sourcesCounted: "Источников учтено",
    oldestAge: "Возраст старейшего",
    medianAge: "Медианный возраст",
    days: "дн.",
    oldestSource: "Самый старый источник",
    note: "Грейд проверки платформы по самому старому источнику: <=30 дней — проверено, 30-90 дней — нужна проверка, >90 дней — требует проверки. Это не то же, что свежесть отдельных источников на обзоре. Внутренние юридические источники не устаревают.",
  },
  "uz-latn": {
    upToDate: "Tekshirildi",
    stale: "Tekshiruv kerak",
    outdated: "Qayta ko'rish kerak",
    panelTitle: "Manbalar yangiligi",
    asOf: "So'nggi tekshiruv",
    sourcesCounted: "Hisobga olingan manbalar",
    oldestAge: "Eng eski manba yoshi",
    medianAge: "Median yosh",
    days: "kun",
    oldestSource: "Eng eski manba",
    note: "Platforma tekshiruvi bahosi eng eski manba bo'yicha: <=30 kun — tekshirilgan, 30-90 kun — tekshiruv kerak, >90 kun — qayta ko'rish kerak. Bu obzordagi alohida manbalar yangiligidan farq qiladi. Ichki huquqiy manbalar eskirmaydi.",
  },
};

function pickStr(locale: string): Strings {
  if (locale === "ru") return STR.ru;
  if (locale === "uz-latn") return STR["uz-latn"];
  return STR.en;
}

function pickLocale(locale: string): "en" | "ru" | "uz-latn" {
  if (locale === "ru") return "ru";
  if (locale === "uz-latn") return "uz-latn";
  return "en";
}

function formatAsOf(asOf: string, locale: "en" | "ru" | "uz-latn") {
  const [year, month, day] = asOf.split("-");
  const monthLabel = MONTHS[locale][Number(month) - 1] ?? month;

  if (locale === "uz-latn") return `${day}-${monthLabel}, ${year}`;
  return `${day} ${monthLabel} ${year}`;
}

export function FreshnessPill() {
  const locale = useLocale();
  const resolvedLocale = pickLocale(locale);
  const T = pickStr(locale);
  const formattedAsOf = formatAsOf(REPORT.asOf, resolvedLocale);

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
        title={`${T.asOf}: ${REPORT.asOf} - ${REPORT.sourcesCounted} ${T.sourcesCounted.toLowerCase()}`}
      >
        <Icon className="size-3" />
        <span className="hidden sm:inline">{LEVEL_LABEL[REPORT.level]}</span>
        <span className="mono tabular opacity-70">{formattedAsOf}</span>
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
            <dd className="mono tabular text-right text-[var(--color-ink)]">{formattedAsOf}</dd>
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
