"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { roadmapAttention, roadmapProjectTitle, roadmapStepTitle } from "@/data/roadmaps";
import { intlLocale } from "@/components/brief/brief-data";

/**
 * "Requires attention" — at most three triaged roadmap tasks (overdue first,
 * then due-soon), quiet by design: a status dot and a due month, no table
 * chrome. Health is date-derived → computed client-side after mount.
 */
export function AttentionList() {
  const t = useTranslations("brief.attention");
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  const monthFmt = useMemo(
    () => new Intl.DateTimeFormat(intlLocale(locale), { month: "long", year: "numeric" }),
    [locale],
  );

  const rows = now ? roadmapAttention(3, now) : [];

  return (
    <div className="brief-print-block mt-5 border-t border-[var(--brief-border)] pt-3.5">
      <h2 className="brief-eyebrow">{t("title")}</h2>
      {!now ? (
        <div className="mt-3 space-y-2.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[34px] animate-pulse rounded bg-[var(--brief-surface-2)]" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-3 text-[12.5px] text-[var(--brief-ink-muted)]">{t("allGreen")}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {rows.map((row) => {
            const [y, m] = row.step.due.split("-").map(Number);
            return (
              <li key={row.step.id} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-[7px] inline-block size-2 shrink-0 rounded-full"
                  style={{ background: row.health === "overdue" ? "var(--brief-neg)" : "var(--brief-accent)" }}
                />
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] leading-snug text-[var(--brief-ink)]">
                    {roadmapStepTitle(row.step, locale)}
                  </p>
                  <p className="truncate text-[11.5px] text-[var(--brief-ink-faint)]">
                    {roadmapProjectTitle(row.project, locale)} ·{" "}
                    {row.health === "overdue" ? t("overdue") : t("dueSoon")} ·{" "}
                    {t("due", { date: monthFmt.format(new Date(y, m - 1, 1)) })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
