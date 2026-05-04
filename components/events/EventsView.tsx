"use client";
import { events, type DiplomaticEvent, type EventType } from "@/data/events";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Calendar, MapPin, Users, Download, ExternalLink, Search } from "lucide-react";

const TYPE_TONE: Record<EventType, string> = {
  summit: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  dialogue: "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  forum: "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  business: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
  council: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  cultural: "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  parliamentary: "border-[var(--color-ink-muted)]/30 bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
};

const TYPE_LABEL: Record<EventType, string> = {
  summit: "Summit",
  dialogue: "Dialogue",
  forum: "Forum",
  business: "Business",
  council: "Council",
  cultural: "Cultural",
  parliamentary: "Parliamentary",
};

const TODAY = new Date("2026-04-21");

function daysBetween(a: Date, b: Date) {
  return Math.round((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function icsDate(iso: string) {
  return iso.replace(/-/g, "");
}

function buildIcs(evs: DiplomaticEvent[]): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//US-UZ Situational Center//EN"];
  for (const e of evs) {
    const end = e.dateEnd ?? e.date;
    const endPlusOne = new Date(end);
    endPlusOne.setUTCDate(endPlusOne.getUTCDate() + 1);
    const endIso = endPlusOne.toISOString().slice(0, 10);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.id}@uz-us-center`,
      `DTSTART;VALUE=DATE:${icsDate(e.date)}`,
      `DTEND;VALUE=DATE:${icsDate(endIso)}`,
      `SUMMARY:${e.title.replace(/[,;]/g, " ")}`,
      `LOCATION:${e.location}`,
      `DESCRIPTION:${e.description.replace(/\n/g, " ")}`,
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadIcs(evs: DiplomaticEvent[]) {
  const ics = buildIcs(evs);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "uz-us-events.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function EventsView({ locale }: { locale: string }) {
  const [typeFilter, setTypeFilter] = useState<EventType | "all">("all");
  const [search, setSearch] = useState("");

  const { upcoming, past } = useMemo(() => {
    const list = events
      .filter((e) => (typeFilter === "all" ? true : e.type === typeFilter))
      .filter((e) =>
        search
          ? e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.location.toLowerCase().includes(search.toLowerCase())
          : true,
      )
      .sort((a, b) => a.date.localeCompare(b.date));
    return {
      upcoming: list.filter((e) => new Date(e.date) >= TODAY),
      past: list.filter((e) => new Date(e.date) < TODAY).reverse(),
    };
  }, [typeFilter, search]);

  const TYPES: (EventType | "all")[] = ["all", "summit", "dialogue", "forum", "business", "council"];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-0.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={cn(
                "rounded px-2.5 py-1 text-[11.5px] font-medium transition",
                typeFilter === t
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]",
              )}
            >
              {t === "all" ? "All" : TYPE_LABEL[t]}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px]">
          <Search className="size-3.5 text-[var(--color-ink-muted)]" aria-hidden />
          <input
            type="search"
            aria-label="Search events by title or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or location"
            className="w-56 bg-transparent outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </label>

        <button
          type="button"
          onClick={() => downloadIcs([...upcoming, ...past])}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[12px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]"
        >
          <Download className="size-3.5" />
          Export .ics
        </button>
      </div>

      {upcoming.length > 0 ? (
        <section>
          <h2 className="stat-label mb-2">Upcoming · {upcoming.length}</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} locale={locale} highlight />
            ))}
          </div>
        </section>
      ) : null}

      {past.length > 0 ? (
        <section>
          <h2 className="stat-label mb-2">Past · {past.length}</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {past.map((e) => (
              <EventCard key={e.id} event={e} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function EventCard({
  event,
  locale,
  highlight = false,
}: {
  event: DiplomaticEvent;
  locale: string;
  highlight?: boolean;
}) {
  const date = new Date(event.date);
  const delta = daysBetween(date, TODAY);
  const countdown = delta >= 0 ? `in ${delta}d` : `${Math.abs(delta)}d ago`;
  return (
    <article
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-[var(--color-surface)] p-4",
        highlight ? "border-[var(--color-primary)]/30" : "border-[var(--color-border)]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
            TYPE_TONE[event.type],
          )}
        >
          {TYPE_LABEL[event.type]}
        </span>
        <span
          className={cn(
            "mono text-[11px] tabular",
            highlight ? "text-[var(--color-primary)]" : "text-[var(--color-ink-muted)]",
          )}
        >
          {countdown}
        </span>
      </div>
      <h3 className="serif text-[15px] font-medium leading-snug text-[var(--color-ink)]">{event.title}</h3>
      <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-[var(--color-ink-muted)]">
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-3" />
          {formatDate(event.date)}
          {event.dateEnd ? ` → ${formatDate(event.dateEnd)}` : ""}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3" />
          {event.location}
        </span>
      </div>
      <p className="text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">{event.description}</p>
      {event.participants.length > 0 ? (
        <div className="flex items-start gap-1.5 text-[11px] text-[var(--color-ink-muted)]">
          <Users className="mt-0.5 size-3 shrink-0" />
          <span>{event.participants.join(" · ")}</span>
        </div>
      ) : null}
      {event.linkedVisitId ? (
        <a
          href={`/${locale}/visits#${event.linkedVisitId}`}
          className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-[var(--color-primary)] hover:underline"
        >
          <ExternalLink className="size-3" />
          Linked visit
        </a>
      ) : null}
    </article>
  );
}
