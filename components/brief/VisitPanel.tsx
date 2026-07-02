"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { nextPipeline, daysUntil, upcomingHorizon, intlLocale, parseDay } from "@/components/brief/brief-data";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";

/**
 * "Nearest visit" videowall panel: date box, readiness ring (conic gauge),
 * four counters (days left / delegation groups / program blocks / checklist)
 * and the rest of the horizon underneath. Computed on the client from the
 * real "now" (the page is SSG; a server Date would freeze at build time).
 * All pipeline records are demo workflow rows — DemoBadge-marked.
 */
export function VisitPanel() {
  const t = useTranslations("brief.visit");
  const th = useTranslations("brief.horizon");
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  const day = useMemo(() => new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric" }), [locale]);
  const month = useMemo(() => new Intl.DateTimeFormat(intlLocale(locale), { month: "short" }), [locale]);
  const dayMonth = useMemo(
    () => new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short" }),
    [locale],
  );

  if (!now) {
    return (
      <div className="min-h-[300px] space-y-3" aria-hidden>
        {[64, 108, 52, 88].map((h, i) => (
          <div key={i} className="animate-pulse rounded-md bg-[var(--brief-surface-2)]" style={{ height: h }} />
        ))}
      </div>
    );
  }

  const pipeline = nextPipeline(now);
  const date = parseDay(pipeline.date);
  const checklistDone = pipeline.checklist.filter((c) => c.state === "Done").length;
  const horizon = upcomingHorizon(now, 30)
    .filter((item) => item.id !== pipeline.id)
    .slice(0, 3);

  const counters = [
    { key: "days", value: String(daysUntil(pipeline.date, now)), label: t("countDays") },
    { key: "delegation", value: String(pipeline.delegation.length), label: t("countDelegation") },
    { key: "program", value: String(pipeline.program.length), label: t("countProgram") },
    { key: "checklist", value: `${checklistDone}/${pipeline.checklist.length}`, label: t("countChecklist") },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start gap-3">
        <div className="brief-datebox">
          <strong>{day.format(date)}</strong>
          <span>{month.format(date)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold leading-snug text-[var(--brief-ink)]">{pipeline.title}</p>
          <p className="mt-1 text-[11.5px] text-[var(--brief-ink-muted)]">
            {pipeline.theme} <DemoBadge className="ml-1 align-middle" />
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div
          className="brief-ring shrink-0"
          style={{ "--ring": pipeline.readiness } as CSSProperties}
          role="img"
          aria-label={t("readinessAria", { pct: pipeline.readiness })}
        >
          <strong>{pipeline.readiness}%</strong>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2">
          {counters.map((c) => (
            <div key={c.key} className="rounded-md bg-[var(--brief-surface-2)] px-2.5 py-2 text-center">
              <div className="text-[18px] font-bold tabular-nums leading-none text-[var(--brief-ink)]">{c.value}</div>
              <div className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[var(--brief-ink-faint)]">
                {c.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--brief-border)] pt-3">
        <div className="brief-eyebrow">{th("title")}</div>
        {horizon.length === 0 ? (
          <p className="mt-2 text-[12px] text-[var(--brief-ink-muted)]">{th("empty")}</p>
        ) : (
          <ol className="mt-2.5 space-y-2.5">
            {horizon.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5">
                <span className="mt-px w-[50px] shrink-0 text-[11px] font-bold uppercase tracking-wide text-[var(--brief-accent-2)] tabular-nums">
                  {dayMonth.format(parseDay(item.date))}
                </span>
                <div className="min-w-0 border-l border-[var(--brief-border)] pl-2.5">
                  <p className="truncate text-[12.5px] leading-snug text-[var(--brief-ink)]">
                    {item.title} {item.isDemo ? <DemoBadge className="ml-1 align-middle" /> : null}
                  </p>
                  <p className="text-[10.5px] text-[var(--brief-ink-faint)]">
                    {item.location ? `${item.location} · ` : ""}
                    {item.beyondWindow ? th("beyond") : th("inWindow")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
