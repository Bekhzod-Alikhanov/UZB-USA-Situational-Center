"use client";
import { useTranslations } from "next-intl";
import { ChevronDown, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

interface TzCity {
  /** Translation key inside shell.timezones. */
  labelKey: "tashkent" | "usEastern" | "usCentral" | "usMountain" | "usPacific";
  /** IANA timezone identifier. */
  tz: string;
  /** Working hours (24h, local) - start (incl.) and end (excl.). */
  workStart: number;
  workEnd: number;
}

const CITIES: TzCity[] = [
  { labelKey: "tashkent", tz: "Asia/Tashkent", workStart: 9, workEnd: 18 },
  { labelKey: "usEastern", tz: "America/New_York", workStart: 9, workEnd: 18 },
  { labelKey: "usCentral", tz: "America/Chicago", workStart: 9, workEnd: 18 },
  { labelKey: "usMountain", tz: "America/Denver", workStart: 9, workEnd: 18 },
  { labelKey: "usPacific", tz: "America/Los_Angeles", workStart: 9, workEnd: 18 },
];

function getLocalParts(tz: string, now: Date): { hh: number; mm: number; weekday: number } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  });
  const parts = fmt.formatToParts(now);
  let hh = 0;
  let mm = 0;
  let weekdayStr = "Mon";
  for (const p of parts) {
    if (p.type === "hour") hh = Number(p.value);
    if (p.type === "minute") mm = Number(p.value);
    if (p.type === "weekday") weekdayStr = p.value;
  }
  if (hh === 24) hh = 0;
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { hh, mm, weekday: weekdayMap[weekdayStr] ?? 1 };
}

function isWorkingHours(city: TzCity, now: Date): boolean {
  const { hh, weekday } = getLocalParts(city.tz, now);
  const isWeekend = weekday === 0 || weekday === 6;
  if (isWeekend) return false;
  return hh >= city.workStart && hh < city.workEnd;
}

function format(now: Date, tz: string): string {
  const { hh, mm } = getLocalParts(tz, now);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function TimezoneClocks() {
  const t = useTranslations("shell.timezones");
  const [now, setNow] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left text-[9.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink-muted)]"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="size-3" aria-hidden />
          {t("title")}
        </span>
        <ChevronDown className={"size-3 transition " + (open ? "rotate-180" : "")} aria-hidden />
      </button>

      {!open && now ? (
        <div className="grid grid-cols-2 gap-1 px-1">
          {CITIES.slice(0, 2).map((city) => (
            <CompactClock key={city.tz} city={city} now={now} label={t(city.labelKey)} />
          ))}
        </div>
      ) : null}

      {open
        ? CITIES.map((city) => {
            const time = now ? format(now, city.tz) : "--:--";
            const working = now ? isWorkingHours(city, now) : false;
            return (
              <div
                key={city.tz}
                className="flex items-center justify-between gap-2 rounded-sm px-1.5 py-0.5 text-[10.5px]"
                title={now ? (working ? t("workingHours") : t("outsideWorkingHours")) : ""}
              >
                <span className="flex items-center gap-1.5 truncate text-[var(--color-ink-muted)]">
                  <span
                    className={
                      "size-1.5 shrink-0 rounded-full " +
                      (working ? "bg-[var(--color-pos)]" : "bg-[var(--color-ink-faint)]/40")
                    }
                    aria-hidden
                  />
                  <span className="truncate">{t(city.labelKey)}</span>
                </span>
                <span className="mono shrink-0 tabular text-[var(--color-ink)]">{time}</span>
              </div>
            );
          })
        : null}
    </div>
  );
}

function CompactClock({ city, now, label }: { city: TzCity; now: Date; label: string }) {
  const working = isWorkingHours(city, now);
  return (
    <div className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-1">
      <div className="flex items-center gap-1 text-[9px] text-[var(--color-ink-faint)]">
        <span
          className={"size-1.5 rounded-full " + (working ? "bg-[var(--color-pos)]" : "bg-[var(--color-ink-faint)]/40")}
        />
        <span className="truncate">{label}</span>
      </div>
      <div className="mono mt-0.5 text-[11px] tabular text-[var(--color-ink)]">{format(now, city.tz)}</div>
    </div>
  );
}
