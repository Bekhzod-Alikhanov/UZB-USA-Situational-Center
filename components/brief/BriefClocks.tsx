"use client";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Live Tashkent / Washington clocks for the videowall header. Ticks every
 * second; SSR renders placeholders so hydration never mismatches.
 */
export function BriefClocks() {
  const t = useTranslations("brief.clocks");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formats = useMemo(
    () => ({
      tashkent: new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Tashkent",
      }),
      washington: new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/New_York",
      }),
    }),
    [],
  );

  return (
    <div className="flex items-center gap-5">
      <div className="text-right">
        <div className="brief-clock-label">{t("tashkent")}</div>
        <div className="brief-clock mt-1">{now ? formats.tashkent.format(now) : "--:--:--"}</div>
      </div>
      <div className="h-8 w-px bg-[var(--brief-border)]" aria-hidden />
      <div className="text-right">
        <div className="brief-clock-label">{t("washington")}</div>
        <div className="brief-clock mt-1 text-[var(--brief-ink-muted)]">
          {now ? formats.washington.format(now) : "--:--"}
        </div>
      </div>
    </div>
  );
}
