"use client";
import { events } from "@/data/events";
import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function UpcomingEvents({ limit = 4 }: { limit?: number }) {
  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= now.getTime())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);

  if (upcoming.length === 0) {
    return <div className="text-sm text-[var(--color-ink-muted)]">No upcoming events</div>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {upcoming.map((e) => {
        const daysLeft = Math.ceil(
          (new Date(e.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        return (
          <li
            key={e.id}
            className="flex items-start gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3"
          >
            <div
              className={cn(
                "flex min-w-[44px] shrink-0 flex-col items-center rounded-md border px-2 py-1",
                daysLeft < 14
                  ? "border-[var(--color-warn)]/40 bg-[var(--color-warn-soft)] text-[var(--color-warn)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)]",
              )}
            >
              <span className="mono text-[17px] font-semibold leading-none">{daysLeft}</span>
              <span className="mt-0.5 text-[9px] uppercase tracking-wider opacity-80">days</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-[var(--color-ink)]">{e.title}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--color-ink-muted)]">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {e.date}
                  {e.dateEnd ? `…${e.dateEnd.slice(5)}` : ""}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {e.location}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
