import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EventsView } from "@/components/events/EventsView";
import { events } from "@/data/events";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("events");

  const today = new Date("2026-04-21");
  const upcomingCount = events.filter((e) => new Date(e.date) >= today).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="hidden items-center gap-4 text-right text-[11px] text-[var(--color-ink-muted)] md:flex">
          <div className="flex flex-col items-end">
            <span className="mono text-[10px] uppercase tracking-wider opacity-70">Total</span>
            <span className="mono text-[15px] font-medium tabular text-[var(--color-ink)]">{events.length}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="mono text-[10px] uppercase tracking-wider opacity-70">Upcoming</span>
            <span className="mono text-[15px] font-medium tabular text-[var(--color-primary)]">{upcomingCount}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader title="Calendar" sub="C5+1 · dialogues · forums · councils · business" />
        <CardBody>
          <EventsView locale={locale} />
        </CardBody>
      </Card>
    </div>
  );
}
