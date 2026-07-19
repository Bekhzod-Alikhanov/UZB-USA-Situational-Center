"use client";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { allRoadmapSteps, roadmapAttention, type RoadmapStepHealth } from "@/data/roadmaps";
import { intlLocale } from "@/components/brief/brief-data";
import { useRoadmapOverrides } from "@/components/roadmaps/live";

/**
 * Executive summary of roadmap attention. Source-original task titles remain
 * on the roadmap route; this briefing shows only localized counts and the
 * earliest exact deadline so the English and Uzbek shells remain clean.
 */
export function AttentionList() {
  const t = useTranslations("brief.attention");
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);
  const { overrides } = useRoadmapOverrides();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  const monthFmt = useMemo(
    () => new Intl.DateTimeFormat(intlLocale(locale), { month: "long", year: "numeric" }),
    [locale],
  );

  const rows = now ? roadmapAttention(allRoadmapSteps().length, now, overrides) : [];
  const groups: Array<{ health: Extract<RoadmapStepHealth, "overdue" | "due-soon">; count: number }> = [
    { health: "overdue", count: rows.filter((row) => row.health === "overdue").length },
    { health: "due-soon", count: rows.filter((row) => row.health === "due-soon").length },
  ].filter((group) => group.count > 0) as Array<{
    health: Extract<RoadmapStepHealth, "overdue" | "due-soon">;
    count: number;
  }>;
  const earliestDue = rows[0]?.step.due;

  return (
    <div className="brief-print-block mt-5 border-t border-[var(--brief-border)] pt-3.5">
      <h2 className="brief-eyebrow">{t("title")}</h2>
      {!now ? (
        <div className="mt-3 space-y-2.5" aria-hidden>
          {[0, 1].map((i) => (
            <div key={i} className="h-[34px] animate-pulse rounded bg-[var(--brief-surface-2)]" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-3 text-[12.5px] text-[var(--brief-ink-muted)]">{t("allGreen")}</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {groups.map((group) => (
            <li key={group.health} className="flex items-start gap-2.5">
              <span
                aria-hidden
                className="mt-[7px] inline-block size-2 shrink-0 rounded-full"
                style={{ background: group.health === "overdue" ? "var(--brief-neg)" : "var(--brief-accent)" }}
              />
              <div className="min-w-0">
                <p className="text-[13.5px] leading-snug text-[var(--brief-ink)]">
                  {group.health === "overdue"
                    ? t("overdueCount", { count: group.count })
                    : t("dueSoonCount", { count: group.count })}
                </p>
                {earliestDue ? (
                  <p className="text-[11.5px] text-[var(--brief-ink-faint)]">
                    {t("earliestDue", {
                      date: monthFmt.format(
                        new Date(Number(earliestDue.slice(0, 4)), Number(earliestDue.slice(5, 7)) - 1, 1),
                      ),
                    })}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
