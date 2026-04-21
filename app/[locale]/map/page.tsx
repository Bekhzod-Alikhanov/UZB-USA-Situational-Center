import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { MapClient } from "@/components/map/MapClient";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import { investments } from "@/data/investments";
import { liveDelegations } from "@/data/delegations";

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("map");

  const totalProjects = investments.length;
  const totalValue = investments.reduce((a, i) => a + i.valueMusd, 0);
  const activeDeleg = liveDelegations.filter((d) => d.status !== "preparing").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <DemoBadge source="MIIT · Situational Center · AUCC" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MiniStat label="Investment projects" value={`${totalProjects}`} sub={`$${(totalValue / 1000).toFixed(1)}B portfolio`} />
        <MiniStat label="UZ regions covered" value="14" sub="All regions + Karakalpakstan" />
        <MiniStat label="US city endpoints" value="8" sub="Top corridors" />
        <MiniStat label="Delegations in transit" value={`${activeDeleg}`} sub={`${liveDelegations.length} total live`} />
      </div>

      <Card>
        <CardHeader title="Interactive layers" sub="Investments · trade arcs · delegations — click bubbles for details" />
        <CardBody>
          <MapClient />
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
      <div className="mt-1 mono text-[22px] font-semibold tabular text-[var(--color-ink)]">{value}</div>
      <div className="mt-0.5 text-[11px] text-[var(--color-ink-muted)]">{sub}</div>
    </div>
  );
}
