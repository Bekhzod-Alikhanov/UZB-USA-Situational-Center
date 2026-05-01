import { setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { UsCenteredMap } from "@/components/map/UsCenteredMap";
import { uzMissionsUs } from "@/data/uz-missions-us";
import { uzPlannedVisitsUs } from "@/data/uz-planned-visits-us";
import { totalFor, usStateMetricsMeta } from "@/data/us-state-metrics";

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const totalGdp = totalFor("gdp");
  const totalPop = totalFor("population");
  const totalDiaspora = totalFor("diaspora");
  const activeMissions = uzMissionsUs.filter((m) => m.status === "active" || m.status === "opened-2026").length;
  const plannedMissions = uzMissionsUs.filter((m) => m.status.startsWith("planned")).length;
  const plannedVisits = uzPlannedVisitsUs.length;

  const title =
    locale === "ru"
      ? "Карта США — присутствие Узбекистана"
      : locale === "uz-latn"
        ? "AQSh xaritasi — O'zbekiston ishtiroki"
        : "United States — Uzbekistan footprint";
  const subtitle =
    locale === "ru"
      ? "ВВП штата (BEA 2024), население (Census V2024), диаспора УЗ, диппредставительства и плановые визиты"
      : locale === "uz-latn"
        ? "Shtat YaIM (BEA 2024), aholi (Census V2024), UZ diasporasi, vakolatxonalar va rejalashtirilgan tashriflar"
        : "State GDP (BEA 2024), population (Census V2024), UZ diaspora, missions, and planned visits";

  const labels =
    locale === "ru"
      ? {
          gdp: "Совокупный ВВП 50 штатов",
          gdpSub: `BEA SAGDP1 ${usStateMetricsMeta.gdp.year}`,
          pop: "Население США",
          popSub: `Census V${usStateMetricsMeta.population.year}`,
          dia: "Диаспора Узбекистана",
          diaSub: `Оценка ${usStateMetricsMeta.diaspora.year}`,
          missions: "Диппредставительства",
          missionsSub: `${activeMissions} действующих · ${plannedMissions} планируется`,
          visits: "Плановые визиты УЗ",
          visitsSub: `${plannedVisits} в графике на 2026`,
        }
      : locale === "uz-latn"
        ? {
            gdp: "AQSh shtatlar YaIMi",
            gdpSub: `BEA SAGDP1 ${usStateMetricsMeta.gdp.year}`,
            pop: "AQSh aholisi",
            popSub: `Census V${usStateMetricsMeta.population.year}`,
            dia: "O'zbek diasporasi",
            diaSub: `${usStateMetricsMeta.diaspora.year} taxmin`,
            missions: "Vakolatxonalar",
            missionsSub: `${activeMissions} faol · ${plannedMissions} rejalashtirilgan`,
            visits: "Rejalashtirilgan tashriflar",
            visitsSub: `2026-yilga ${plannedVisits} ta`,
          }
        : {
            gdp: "Total US state GDP",
            gdpSub: `BEA SAGDP1 ${usStateMetricsMeta.gdp.year}`,
            pop: "Total US population",
            popSub: `Census V${usStateMetricsMeta.population.year}`,
            dia: "UZ diaspora total",
            diaSub: `${usStateMetricsMeta.diaspora.year} estimate`,
            missions: "UZ missions",
            missionsSub: `${activeMissions} active · ${plannedMissions} planned`,
            visits: "Planned UZ visits",
            visitsSub: `${plannedVisits} on the 2026 calendar`,
          };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{title}</h1>
          <p className="section-sub">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <MiniStat label={labels.gdp} value={`$${(totalGdp / 1000).toFixed(1)}T`} sub={labels.gdpSub} />
        <MiniStat
          label={labels.pop}
          value={`${(totalPop / 1000).toFixed(1)}M`}
          sub={labels.popSub}
        />
        <MiniStat
          label={labels.dia}
          value={`~${(totalDiaspora / 1000).toFixed(0)}k`}
          sub={labels.diaSub}
        />
        <MiniStat
          label={labels.missions}
          value={`${uzMissionsUs.length}`}
          sub={labels.missionsSub}
        />
        <MiniStat label={labels.visits} value={`${plannedVisits}`} sub={labels.visitsSub} />
      </div>

      <Card tone="people">
        <CardHeader title={title} sub={subtitle} />
        <CardBody>
          <UsCenteredMap />
        </CardBody>
      </Card>
    </div>
  );
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="text-[10.5px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
        {label}
      </div>
      <div className="mt-1 mono text-[20px] font-semibold tabular text-[var(--color-ink)]">{value}</div>
      <div className="mt-0.5 text-[11px] text-[var(--color-ink-muted)]">{sub}</div>
    </div>
  );
}
