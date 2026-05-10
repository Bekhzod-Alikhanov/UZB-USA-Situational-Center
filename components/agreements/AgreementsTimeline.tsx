"use client";
import { agreements } from "@/data/agreements";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

export function AgreementsTimeline() {
  const t = useTranslations("agreements.timeline");
  const byYear = useMemo(() => {
    const m = new Map<number, number>();
    for (const a of agreements) {
      const y = Number(a.signedOn.slice(0, 4));
      m.set(y, (m.get(y) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => a[0] - b[0]);
  }, []);
  const max = Math.max(...byYear.map(([, v]) => v));

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
        {t("signaturesPerYear")}
      </div>
      <div className="flex items-end gap-2" role="list" aria-label={t("signaturesPerYear")}>
        {byYear.map(([y, v]) => (
          <div key={y} role="listitem" className="flex min-w-[28px] flex-1 flex-col items-center gap-1">
            <div
              role="img"
              className="w-full rounded-sm bg-[var(--color-primary)]/80"
              style={{ height: `${(v / max) * 100}px` }}
              aria-label={t("barLabel", { count: v, year: y })}
            />
            <div className="mono text-[10px] tabular text-[var(--color-ink-muted)]">{y}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
