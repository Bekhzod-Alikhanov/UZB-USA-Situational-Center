import { getTranslations } from "next-intl/server";
import { Users, CalendarDays, FileText, ExternalLink } from "lucide-react";
import {
  visitTitle,
  visitPurpose,
  materialsReceived,
  type UpcomingVisit,
  type VisitMaterialType,
} from "@/data/visit-prep";
import { intlLocale } from "@/components/brief/brief-data";
import { MaterialUploadsPanel } from "@/components/visit-prep/MaterialUploadsPanel";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<UpcomingVisit["status"], string> = {
  planning: "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]",
  confirmed: "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  "in-progress": "border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] text-[var(--color-warn)]",
  completed: "border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] text-[var(--color-pos)]",
};

const MATERIAL_TYPE_KEY: Record<VisitMaterialType, string> = {
  presentation: "presentation",
  speech: "speech",
  agenda: "agenda",
  briefing: "briefing",
  other: "other",
};

/**
 * One visit dossier for the password-gated /prepare page: who travels
 * (delegation), when/where (dates, destinations), why (purpose + day-by-day
 * meeting program), and the hokimiyat material package. Delegation names are
 * permitted here ONLY because the route sits behind the admin cookie gate —
 * see CLAUDE.md hard rule #8 before touching the data model.
 */
export async function VisitCard({ visit, locale }: { visit: UpcomingVisit; locale: string }) {
  const t = await getTranslations("prepare");
  const dayFmt = new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "long", year: "numeric" });
  const shortDay = new Intl.DateTimeFormat(intlLocale(locale), { weekday: "short", day: "numeric", month: "short" });
  const parse = (d: string) => {
    const [y, m, dd] = d.split("-").map(Number);
    return new Date(y, m - 1, dd);
  };
  const materials = materialsReceived(visit);
  const meetingsByDay = new Map<string, typeof visit.meetings>();
  for (const meeting of visit.meetings) {
    meetingsByDay.set(meeting.day, [...(meetingsByDay.get(meeting.day) ?? []), meeting]);
  }
  const anyDemo =
    visit.is_demo ||
    visit.delegation.some((d) => d.is_demo) ||
    visit.meetings.some((m) => m.is_demo) ||
    visit.materials.some((m) => m.is_demo);

  return (
    <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
      {/* Header: who-when-where-why summary */}
      <header className="border-b border-[var(--color-border)] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold leading-snug text-[var(--color-ink)]">
              {visitTitle(visit, locale)}
              {anyDemo ? <DemoBadge variant="dot" className="ml-1.5 align-middle" /> : null}
            </h2>
            <p className="mt-1 text-[12px] text-[var(--color-ink-muted)]">
              {t(`card.direction.${visit.direction === "UZ to USA" ? "uzToUsa" : "usaToUz"}`)} ·{" "}
              {dayFmt.format(parse(visit.startDate))} — {dayFmt.format(parse(visit.endDate))} ·{" "}
              {visit.destinations.join(" · ")}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-wider",
              STATUS_TONE[visit.status],
            )}
          >
            {t(`card.status.${visit.status}`)}
          </span>
        </div>
        <p className="mt-2.5 max-w-3xl text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">
          {visitPurpose(visit, locale)}
        </p>
      </header>

      <div className="grid gap-5 px-5 py-4 lg:grid-cols-3">
        {/* Delegation */}
        <section>
          <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
            <Users className="size-3.5" /> {t("card.delegation")} · {visit.delegation.length}
          </h3>
          <ul className="mt-2.5 space-y-2">
            {visit.delegation.map((member, i) => (
              <li key={i} className="text-[12.5px] leading-snug">
                <span className="font-medium text-[var(--color-ink)]">
                  {member.name ?? member.role}
                  {member.is_demo ? <DemoBadge variant="dot" className="ml-1" /> : null}
                </span>
                <span className="block text-[11px] text-[var(--color-ink-faint)]">
                  {member.name ? `${member.role} · ` : ""}
                  {member.org}
                </span>
              </li>
            ))}
            {visit.delegation.length === 0 ? (
              <li className="text-[12px] text-[var(--color-ink-faint)]">{t("card.emptyDelegation")}</li>
            ) : null}
          </ul>
        </section>

        {/* Day-by-day program */}
        <section>
          <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
            <CalendarDays className="size-3.5" /> {t("card.program")} · {visit.meetings.length}
          </h3>
          <ol className="mt-2.5 space-y-2.5">
            {[...meetingsByDay.entries()].map(([day, meetings]) => (
              <li key={day}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                  {shortDay.format(parse(day))}
                </div>
                <ul className="mt-1 space-y-1.5 border-l border-[var(--color-border)] pl-2.5">
                  {meetings.map((meeting, i) => (
                    <li key={i} className="text-[12.5px] leading-snug">
                      <span className="text-[var(--color-ink)]">
                        {meeting.time ? <span className="mono mr-1 text-[11px]">{meeting.time}</span> : null}
                        {meeting.counterpart}
                        {meeting.is_demo ? <DemoBadge variant="dot" className="ml-1" /> : null}
                      </span>
                      <span className="block text-[11px] text-[var(--color-ink-faint)]">
                        {meeting.topic}
                        {meeting.location ? ` · ${meeting.location}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {visit.meetings.length === 0 ? (
              <li className="text-[12px] text-[var(--color-ink-faint)]">{t("card.emptyProgram")}</li>
            ) : null}
          </ol>
        </section>

        {/* Material package */}
        <section>
          <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
            <FileText className="size-3.5" /> {t("card.materials")} · {materials.received}/{materials.total}
          </h3>
          <ul className="mt-2.5 space-y-2">
            {visit.materials.map((material) => (
              <li key={material.id} className="text-[12.5px] leading-snug">
                <span className="flex items-start gap-1.5">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-[5px] inline-block size-2 shrink-0 rounded-full",
                      material.status === "received" ? "bg-[var(--color-pos)]" : "bg-[var(--color-warn)]",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="text-[var(--color-ink)]">
                      {material.title}
                      {material.is_demo ? <DemoBadge variant="dot" className="ml-1" /> : null}
                      {material.url ? (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${material.title} — ${t("card.openMaterial")}`}
                          className="ml-1 inline-flex align-middle text-[var(--color-primary)] hover:opacity-80"
                        >
                          <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                    </span>
                    <span className="block text-[11px] text-[var(--color-ink-faint)]">
                      {t(`card.materialType.${MATERIAL_TYPE_KEY[material.type]}`)} · {material.owner} ·{" "}
                      {material.status === "received" ? t("card.materialReceived") : t("card.materialExpected")}
                      {material.status === "received" && !material.url ? ` · ${t("card.fileOnRequest")}` : ""}
                    </span>
                  </span>
                </span>
              </li>
            ))}
            {visit.materials.length === 0 ? (
              <li className="text-[12px] text-[var(--color-ink-faint)]">{t("card.emptyMaterials")}</li>
            ) : null}
          </ul>
          <MaterialUploadsPanel visitId={visit.id} region={visit.region} />
        </section>
      </div>

      {visit.sourceId ? (
        <footer className="border-t border-[var(--color-border)] px-5 py-2 text-[10.5px]">
          <SourceBadge sourceId={visit.sourceId} />
        </footer>
      ) : null}
    </article>
  );
}
