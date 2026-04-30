import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  TrendingUp,
  ArrowUpFromLine,
  ArrowDownToLine,
  Scale,
  FileText,
  Briefcase,
  Calendar,
  Users2,
  Activity,
  AlertTriangle,
  CalendarDays,
  Bell,
} from "lucide-react";
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
import { RiskRadar } from "@/components/overview/RiskRadar";

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
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="section-title">{t("title")}</h1>
        <p className="section-sub">{t("subtitle")}</p>
      </div>

      {/* Hero KPIs — trade flow + balance, big and tone-coded */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          tone="trade"
          icon={<TrendingUp className="size-4" />}
          label={t("kpi.turnover2025")}
          value={
            <>
              ${y2025.turnover.toLocaleString("en-US")}
              <span className="ml-0.5 text-[20px] font-medium text-[var(--color-ink-muted)]">M</span>
            </>
          }
          sub="2025 full year · UZ Stat"
          deltaPct={turnoverDelta}
          deltaLabel="vs 2024"
          href={`/${locale}/trade`}
        />
        <KpiCard
          tone="invest"
          icon={<ArrowUpFromLine className="size-4" />}
          label={t("kpi.exports2025")}
          value={
            <>
              ${y2025.exports.toLocaleString("en-US")}
              <span className="ml-0.5 text-[20px] font-medium text-[var(--color-ink-muted)]">M</span>
            </>
          }
          sub="Jan 2026: $32K"
          deltaPct={exportsDelta}
          deltaLabel="vs 2024"
          href={`/${locale}/trade?direction=exports`}
        />
        <KpiCard
          tone="agree"
          icon={<ArrowDownToLine className="size-4" />}
          label={t("kpi.imports2025")}
          value={
            <>
              ${y2025.imports.toLocaleString("en-US")}
              <span className="ml-0.5 text-[20px] font-medium text-[var(--color-ink-muted)]">M</span>
            </>
          }
          sub={`Jan 2026: +${tradeJan2026.importsGrowthPct}%`}
          deltaPct={importsDelta}
          deltaLabel="vs 2024"
          href={`/${locale}/trade?direction=imports`}
        />
        <KpiCard
          tone="rose"
          icon={<Scale className="size-4" />}
          label={t("kpi.balance2025")}
          value={
            <>
              −${Math.abs(y2025.balance).toLocaleString("en-US")}
              <span className="ml-0.5 text-[20px] font-medium text-[var(--color-ink-muted)]">M</span>
            </>
          }
          sub="дефицит расширился"
          delta="neg"
          href={`/${locale}/trade`}
        />
      </div>

      {/* Secondary KPIs — agreements / projects / relations / delegations */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          tone="agree"
          icon={<FileText className="size-4" />}
          label={t("kpi.agreements")}
          value={agreementsAggregate.totalDocuments}
          sub={`+${agreementsAggregate.totalInvestAgreements} invest-agreements`}
          href={`/${locale}/agreements`}
        />
        <KpiCard
          tone="invest"
          icon={<Briefcase className="size-4" />}
          label={t("kpi.projects")}
          value={investments.length}
          sub={`$${(investmentsTotals.totalValueUsdM / 1000).toFixed(1)}B in pipeline`}
          is_demo
          source="MIIT + UzInvest"
          href={`/${locale}/investments`}
        />
        <KpiCard
          tone="visits"
          icon={<Calendar className="size-4" />}
          label={t("kpi.relations")}
          value="34"
          sub="years · since 1992-02-19"
          href={`/${locale}/visits`}
        />
        <KpiCard
          tone="people"
          icon={<Users2 className="size-4" />}
          label={t("kpi.delegations")}
          value={liveDelegations.length}
          sub={anchor ? `${t("kpi.nextVisit")}: ${anchor.date}` : undefined}
          is_demo
          source="Situational Center internal"
          href={`/${locale}/visits`}
        />
      </div>

      {/* Trade flow chart — big single card */}
      <Card tone="trade">
        <CardHeader icon={<TrendingUp className="size-3.5" />} tone="trade" title={t("flow")} sub="USD millions · 2017–2025 · UZ State Statistics" />
        <CardBody>
          <TradeFlowChart height={320} />
        </CardBody>
      </Card>

      {/* Risk radar — full width with rose accent */}
      <Card tone="rose">
        <CardHeader
          icon={<AlertTriangle className="size-3.5" />}
          tone="rose"
          title="Сигналы и риски"
          sub="Live-агрегатор: просроченные поручения · застрявшие соглашения · этапы Штаба · готовность визитов"
        />
        <CardBody>
          <RiskRadar limit={8} />
        </CardBody>
      </Card>

      {/* Bottom row — timeline + upcoming + alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card tone="visits" className="lg:col-span-2">
          <CardHeader icon={<Activity className="size-3.5" />} tone="visits" title={t("timeline")} sub="Свежие визиты, события и подписания" />
          <CardBody>
            <ActivityTimeline limit={6} />
          </CardBody>
        </Card>
        <div className="flex flex-col gap-6">
          <Card tone="invest">
            <CardHeader icon={<CalendarDays className="size-3.5" />} tone="invest" title={t("upcoming")} sub="ближайшие 30 дней" />
            <CardBody>
              <UpcomingEvents limit={3} />
            </CardBody>
          </Card>
          <Card tone="rose">
            <CardHeader icon={<Bell className="size-3.5" />} tone="rose" title={t("alerts")} sub="Только просрочки и наблюдение" />
            <CardBody>
              <AlertsPanel limit={4} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
