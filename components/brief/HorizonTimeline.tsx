"use client";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { upcomingHorizon, intlLocale, parseDay, type HorizonItem } from "@/components/brief/brief-data";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";

/**
 * 30-day horizon strip. The window is computed on the client from the real
 * "now" (the page is statically generated, so a server-side Date would be
 * frozen at build time). SSR renders a fixed-height skeleton to keep CLS at 0.
 */
export function HorizonTimeline() {
  const t = useTranslations("brief.horizon");
  const locale = useLocale();
  const [items, setItems] = useState<HorizonItem[] | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(upcomingHorizon(new Date(), 30));
  }, []);

  const day = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short" });

  return (
    <div className="brief-print-block min-h-[180px]">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brief-ink-faint)]">
        {t("title")}
      </h2>
      {items === null ? (
        <ul className="mt-4 space-y-3.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-[30px] animate-pulse rounded-sm bg-[var(--brief-surface-2)]" />
          ))}
        </ul>
      ) : items.length === 0 ? (
        <p className="mt-4 text-[13px] text-[var(--brief-ink-muted)]">{t("empty")}</p>
      ) : (
        <ol className="mt-4 space-y-3.5">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span className="mt-px w-[52px] shrink-0 text-[12px] font-semibold uppercase tracking-wide text-[var(--brief-accent)] tabular-nums">
                {day.format(parseDay(item.date))}
              </span>
              <div className="min-w-0 border-l border-[var(--brief-border)] pl-3">
                <p className="text-[13.5px] leading-snug text-[var(--brief-ink)]">
                  {item.title} {item.isDemo ? <DemoBadge className="ml-1 align-middle" /> : null}
                </p>
                <p className="text-[11.5px] text-[var(--brief-ink-faint)]">
                  {item.location ? `${item.location} · ` : ""}
                  {item.beyondWindow ? t("beyond") : t("inWindow")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
