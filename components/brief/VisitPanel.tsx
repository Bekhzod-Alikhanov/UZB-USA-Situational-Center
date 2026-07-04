"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { daysUntil, upcomingHorizon, intlLocale, parseDay } from "@/components/brief/brief-data";
import { nextVisit, visitTitle, visitPurpose, materialsReceived } from "@/data/visit-prep";
import { localizedEventTitle } from "@/lib/i18n/overview-content";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";

/**
 * "Nearest visit" videowall panel: date box, four counters (days left /
 * delegation size / meetings / materials received) and the rest of the
 * horizon underneath. Computed on the client from the real "now" (the page
 * is SSG; a server Date would freeze at build time). Delegation/meeting
 * details live behind the password gate on /prepare — this public panel
 * shows counts only.
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

  const visit = nextVisit(now);
  const date = parseDay(visit.startDate);
  const materials = materialsReceived(visit);
  const horizon = upcomingHorizon(now, 30)
    .filter((item) => item.id !== visit.id)
    .slice(0, 3);

  const counters = [
    { key: "days", value: String(daysUntil(visit.startDate, now)), label: t("countDays") },
    { key: "delegation", value: String(visit.delegation.length), label: t("countDelegation") },
    { key: "meetings", value: String(visit.meetings.length), label: t("countMeetings") },
    { key: "materials", value: `${materials.received}/${materials.total}`, label: t("countMaterials") },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start gap-3">
        <div className="brief-datebox">
          <strong>{day.format(date)}</strong>
          <span>{month.format(date)}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold leading-snug text-[var(--brief-ink)]">
            {visitTitle(visit, locale)}
            {visit.is_demo ? <DemoBadge variant="dot" className="ml-1" /> : null}
          </p>
          <p className="mt-1 line-clamp-2 text-[11.5px] text-[var(--brief-ink-muted)]">{visitPurpose(visit, locale)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {counters.map((c) => (
          <div key={c.key} className="rounded-md bg-[var(--brief-surface-2)] px-2.5 py-2 text-center">
            <div className="text-[18px] font-bold tabular-nums leading-none text-[var(--brief-ink)]">{c.value}</div>
            <div className="mt-1.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[var(--brief-ink-faint)]">
              {c.label}
            </div>
          </div>
        ))}
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
                    {item.kind === "event"
                      ? localizedEventTitle(item.id, item.title, locale)
                      : locale === "ru" && item.titleRu
                        ? item.titleRu
                        : item.title}{" "}
                    {item.isDemo ? <DemoBadge variant="dot" className="ml-1" /> : null}
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
