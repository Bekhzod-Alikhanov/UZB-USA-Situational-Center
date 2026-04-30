"use client";
import { useState, useRef } from "react";
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

const LEVEL_LABEL = {
  "up-to-date": "Актуально",
  stale: "Устаревает",
  outdated: "Устарело",
} as const;

const LEVEL_ICON = {
  "up-to-date": Database,
  stale: AlertTriangle,
  outdated: AlertCircle,
} as const;

const DATE_FMT = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", year: "numeric" });

export function FreshnessPill() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const Icon = LEVEL_ICON[REPORT.level];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={(e) => {
          // Close when focus leaves entirely
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium transition",
          LEVEL_TONE[REPORT.level],
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={`As-of ${REPORT.asOf} · ${REPORT.sourcesCounted} sources tracked`}
      >
        <Icon className="size-3" />
        {LEVEL_LABEL[REPORT.level]}
        <span className="mono tabular opacity-70">· {DATE_FMT.format(new Date(REPORT.asOf + "T00:00:00Z"))}</span>
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-[12px] shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="serif font-semibold text-[var(--color-ink)]">Актуальность данных</span>
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
            <dt className="text-[var(--color-ink-muted)]">Эталонная дата</dt>
            <dd className="mono tabular text-right text-[var(--color-ink)]">
              {DATE_FMT.format(new Date(REPORT.asOf + "T00:00:00Z"))}
            </dd>
            <dt className="text-[var(--color-ink-muted)]">Источников учтено</dt>
            <dd className="mono tabular text-right text-[var(--color-ink)]">{REPORT.sourcesCounted}</dd>
            <dt className="text-[var(--color-ink-muted)]">Старейший возраст</dt>
            <dd className="mono tabular text-right text-[var(--color-ink)]">{REPORT.oldestAgeDays} дн.</dd>
            <dt className="text-[var(--color-ink-muted)]">Медианный возраст</dt>
            <dd className="mono tabular text-right text-[var(--color-ink)]">{REPORT.medianAgeDays} дн.</dd>
          </dl>

          <div className="mt-3 rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)]">
              Самый старый источник
            </div>
            <div className="mt-0.5 text-[11.5px] font-medium text-[var(--color-ink)]">{REPORT.oldestSourceName}</div>
            <div className="mono mt-0.5 text-[10px] tabular text-[var(--color-ink-muted)]">
              ID: {REPORT.oldestSourceId}
            </div>
          </div>

          <p className="mt-2 text-[10.5px] text-[var(--color-ink-faint)]">
            Шкала: ≤30 дней — актуально · 30–90 — устаревает · &gt;90 — устарело. Внутренние юридические источники
            (Указы, контракты) не считаются устаревающими.
          </p>
        </div>
      ) : null}
    </div>
  );
}
