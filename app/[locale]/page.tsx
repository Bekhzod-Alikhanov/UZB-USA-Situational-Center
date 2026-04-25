import { getTranslations, setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { tradeAnnual, tradeJan2026 } from "@/data/trade";
import { agreementsAggregate } from "@/data/agreements";
import { investments, investmentsTotals } from "@/data/investments";
import { liveDelegations } from "@/data/delegations";
import { nextAnchorVisit } from "@/data/visits";
import { KpiCard } from "@/components/overview/KpiCard";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { TradeFlowChart } from "@/components/charts/TradeFlowChart";
import { ActivityTimeline } from "@/components/overview/ActivityTimeline";
import { UpcomingEvents } from "@/components/overview/UpcomingEvents";
import { AlertsPanel } from "@/components/overview/AlertsPanel";

// Globe3D pulls three.js + globe.gl (~250 kB). Load only on the client to keep
// Overview's First-Load JS lean.
const Globe3D = dynamic(() => import("@/components/overview/Globe3D").then((m) => m.Globe3D), {
  loading: () => (
    <div className="flex h-[300px] items-center justify-center rounded-md bg-[var(--color-surface-2)] text-[12px] text-[var(--color-ink-muted)]">
      Loading globe…
    </div>
  ),
});

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("overview");

  const y2025 = tradeAnnual.find((y) => y.year === 2025)!;
  const y2024 = tradeAnnual.find((y) => y.year === 2024)!;
  const turnoverDelta = ((y2025.turnover - y2024.turnover) / y2024.turnover) * 100;
  const exportsDelta = ((y2025.exports - y2024.exports) / y2024.exports) * 100;
  const importsDelta = ((y2025.imports - y2024.imports) / y2024.imports) * 100;

  const anchor = nextAnchorVisit();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="section-title">{t("title")}</h1>
        <p className="section-sub">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <KpiCard
          label={t("kpi.turnover2025")}
          value={<>${y2025.turnover.toLocaleString("en-US")}<span className="ml-0.5 text-[var(--color-ink-muted)]">M</span></>}
          sub="2025 full year"
          deltaPct={turnoverDelta}
          deltaLabel="vs 2024"
          href={`/${locale}/trade`}
        />
        <KpiCard
          label={t("kpi.exports2025")}
          value={<>${y2025.exports.toLocaleString("en-US")}<span className="ml-0.5 text-[var(--color-ink-muted)]">M</span></>}
          sub="Jan 2026 exports: $32K"
          deltaPct={exportsDelta}
          deltaLabel="vs 2024"
          href={`/${locale}/trade?direction=exports`}
        />
        <KpiCard
          label={t("kpi.imports2025")}
          value={<>${y2025.imports.toLocaleString("en-US")}<span className="ml-0.5 text-[var(--color-ink-muted)]">M</span></>}
          sub={`Jan 2026 imports: +${tradeJan2026.importsGrowthPct}%`}
          deltaPct={importsDelta}
          deltaLabel="vs 2024"
          href={`/${locale}/trade?direction=imports`}
        />
        <KpiCard
          label={t("kpi.balance2025")}
          value={<>−${Math.abs(y2025.balance).toLocaleString("en-US")}<span className="ml-0.5 text-[var(--color-ink-muted)]">M</span></>}
          sub="deficit widened"
          tone="neg"
          href={`/${locale}/trade`}
        />
        <KpiCard
          label={t("kpi.agreements")}
          value={agreementsAggregate.totalDocuments}
          sub={`+${agreementsAggregate.totalInvestAgreements} investment agreements`}
          href={`/${locale}/agreements`}
        />
        <KpiCard
          label={t("kpi.projects")}
          value={investments.length}
          sub={`$${(investmentsTotals.totalValueUsdM / 1000).toFixed(1)}B in pipeline`}
          is_demo
          source="MIIT + UzInvest"
          href={`/${locale}/investments`}
        />
        <KpiCard
          label={t("kpi.relations")}
          value="34"
          sub="years, since 1992-02-19"
          href={`/${locale}/visits`}
        />
        <KpiCard
          label={t("kpi.delegations")}
          value={liveDelegations.length}
          sub={
            anchor
              ? `${t("kpi.nextVisit")}: ${anchor.date}`
              : undefined
          }
          is_demo
          source="Situational Center internal"
          href={`/${locale}/visits`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader
            title={t("flow")}
            sub="USD millions · 2017–2025"
          />
          <CardBody>
            <TradeFlowChart height={300} />
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="UZ ↔ US" sub="3D globe · Tashkent ↔ key US nodes" />
          <CardBody className="p-2">
            <Globe3D height={300} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={t("timeline")} />
          <CardBody>
            <ActivityTimeline limit={6} />
          </CardBody>
        </Card>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title={t("upcoming")} />
            <CardBody>
              <UpcomingEvents limit={3} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title={t("alerts")} />
            <CardBody>
              <AlertsPanel limit={4} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
