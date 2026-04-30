"use client";
import { useEffect, useState } from "react";

interface TzCity {
  /** Display label. */
  label: string;
  /** IANA timezone identifier. */
  tz: string;
  /** Working hours (24h, local) — start (incl.) and end (excl.). */
  workStart: number;
  workEnd: number;
}

const CITIES: TzCity[] = [
  { label: "Ташкент", tz: "Asia/Tashkent", workStart: 9, workEnd: 18 },
  // Continental US (5)
  { label: "Восточное США (NY/DC)", tz: "America/New_York", workStart: 9, workEnd: 18 },
  { label: "Центральное США (TX/IL)", tz: "America/Chicago", workStart: 9, workEnd: 18 },
  { label: "Горное США (CO/AZ)", tz: "America/Denver", workStart: 9, workEnd: 18 },
  { label: "Тихоокеанское США (CA/WA)", tz: "America/Los_Angeles", workStart: 9, workEnd: 18 },
  // Non-continental US territories
  { label: "Аляска", tz: "America/Anchorage", workStart: 9, workEnd: 18 },
  { label: "Гавайи", tz: "Pacific/Honolulu", workStart: 9, workEnd: 18 },
  { label: "Самоа США", tz: "Pacific/Pago_Pago", workStart: 9, workEnd: 18 },
  { label: "Гуам", tz: "Pacific/Guam", workStart: 9, workEnd: 18 },
];

function getLocalParts(tz: string, now: Date): { hh: number; mm: number; weekday: number } {
  // Use Intl to get local hour/minute/weekday in the target tz
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
  // 24:xx is sometimes returned by formatToParts — normalize
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
  // Render placeholder server-side; hydrate client-side once mounted.
  // We deliberately bootstrap state inside the effect (not in the initializer)
  // so SSR sees `null` and the client picks up the real time post-hydration —
  // this is the SSR-safe pattern for live clocks and lint should allow it.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-0.5">
      <div className="px-1 pb-1 text-[9.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
        Часовые пояса
      </div>
      {CITIES.map((city) => {
        const time = now ? format(now, city.tz) : "—";
        const working = now ? isWorkingHours(city, now) : false;
        return (
          <div
            key={city.tz}
            className="flex items-center justify-between gap-2 rounded-sm px-1.5 py-0.5 text-[10.5px]"
            title={
              now
                ? working
                  ? "Рабочие часы (Mon–Fri 9:00–18:00 локально)"
                  : "Вне рабочих часов"
                : ""
            }
          >
            <span className="flex items-center gap-1.5 truncate text-[var(--color-ink-muted)]">
              <span
                className={
                  "size-1.5 shrink-0 rounded-full " +
                  (working ? "bg-[var(--color-pos)]" : "bg-[var(--color-ink-faint)]/40")
                }
                aria-hidden
              />
              <span className="truncate">{city.label}</span>
            </span>
            <span className="mono shrink-0 tabular text-[var(--color-ink)]">{time}</span>
          </div>
        );
      })}
    </div>
  );
}
