import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  TrendingUp,
  ArrowUpFromLine,
  ArrowDownToLine,
  Scale,
  AlertTriangle,
  CalendarDays,
  Layers,
  Gift,
  Users2,
} from "lucide-react";
import { tradeAnnual, tradeJan2026 } from "@/data/trade";
import { agreementsAggregate } from "@/data/agreements";
import { investmentCredibilitySummary } from "@/data/investments";
import { liveDelegations } from "@/data/delegations";
import { nextAnchorVisit } from "@/data/visits";
import { grants } from "@/data/grants";
import { KpiCard } from "@/components/overview/KpiCard";
import { MicroKpi } from "@/components/overview/MicroKpi";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ChartNarration } from "@/components/ui/ChartNarration";
import { TradeFlowEditorial } from "@/components/overview/TradeFlowEditorial";
import { MonthlyBars } from "@/components/overview/MonthlyBars";
import { SectorsGrid } from "@/components/overview/SectorsGrid";
import { CounterpartsRank } from "@/components/overview/CounterpartsRank";
import { GrantsDonut } from "@/components/overview/GrantsDonut";
import { Horizon } from "@/components/overview/Horizon";
import { RiskRadar } from "@/components/overview/RiskRadar";
import { PrintButton } from "@/components/exports/PrintButton";
import { ExecutiveCommandCenter } from "@/components/overview/ExecutiveCommandCenter";
import { RelationshipPillars } from "@/components/overview/RelationshipPillars";
import { SourceQualityPanel } from "@/components/overview/SourceQualityPanel";
import { TodayDecisionStrip } from "@/components/overview/TodayDecisionStrip";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "overview" });
}

export default async function OverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("overview");

  const y2025 = tradeAnnual.find((y) => y.year === 2025)!;
  const y2024 = tradeAnnual.find((y) => y.year === 2024)!;
  const turnoverDelta = ((y2025.turnover - y2024.turnover) / y2024.turnover) * 100;
  const exportsDelta = ((y2025.exports - y2024.exports) / y2024.exports) * 100;
  const importsDelta = ((y2025.imports - y2024.imports) / y2024.imports) * 100;

  const anchor = nextAnchorVisit();
  const grantsTotal = grants.reduce((a, g) => a + g.valueMusd, 0);
  const verifiedInvestmentValue = investmentCredibilitySummary.verified.totalValueUsdM;
  const pendingInvestmentRows = investmentCredibilitySummary.pending.totalProjects;
  const narrationLabels = {
    what: t("narrationLabels.what"),
    why: t("narrationLabels.why"),
    how: t("narrationLabels.how"),
    source: t("narrationLabels.source"),
  };

  const dateLocale = locale === "ru" ? "ru-RU" : locale === "uz-latn" ? "uz-Latn-UZ" : "en-GB";
  const dateLabel = new Intl.DateTimeFormat(dateLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-6">
      {/* HERO HEADER — daily brief chip + serif title + actions */}
      <header className="flex flex-col gap-3 pb-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
              <span className="size-1 rounded-full bg-[var(--color-primary)]" />
              {t("hero.dailyBrief")} ·
              {dateLabel}
            </span>
          </div>
          <h1 className="serif text-[24px] font-medium leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-[32px] lg:text-[40px]">
            {t("hero.titleLead")} · <span className="text-[var(--color-ink-muted)]">{t("hero.titleAccent")}</span>
          </h1>
          <p className="mt-1.5 max-w-2xl text-[12px] leading-relaxed text-[var(--color-ink-muted)] sm:text-[13px]">
            {t("hero.subtitle")}
          </p>
          <p className="mt-1 max-w-2xl text-[11.5px] leading-relaxed text-[var(--color-ink-faint)]">
            {t("hero.mandate")}
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-end">
          <PrintButton label={t("hero.print")} />
        </div>
      </header>

      {/* HERO KPI ROW — 4 large tone-coded KPIs */}
      <TodayDecisionStrip locale={locale} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
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
          sub={t("kpi.uzStat2025")}
          deltaPct={turnoverDelta}
          deltaLabel={t("kpi.versus2024")}
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
          sub={t("kpi.jan2026Exports")}
          deltaPct={exportsDelta}
          deltaLabel={t("kpi.versus2024")}
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
          sub={t("kpi.jan2026Imports", { growth: tradeJan2026.importsGrowthPct })}
          deltaPct={importsDelta}
          deltaLabel={t("kpi.versus2024")}
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
          sub={t("kpi.deficitWidened")}
          delta="neg"
          href={`/${locale}/trade`}
        />
      </div>

      {/* MICRO KPI STRIP — 5 secondary metrics */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
        <MicroKpi
          tone="agree"
          label={t("kpi.agreements")}
          value={agreementsAggregate.totalDocuments}
          sub={t("kpi.investAgreements", { count: agreementsAggregate.totalInvestAgreements })}
          href={`/${locale}/agreements`}
        />
        <MicroKpi
          tone="invest"
          label={t("kpi.projects")}
          value={investmentCredibilitySummary.verified.totalProjects}
          sub={t("kpi.verifiedPending", {
            value: (verifiedInvestmentValue / 1000).toFixed(2),
            pending: pendingInvestmentRows,
          })}
          href={`/${locale}/investments`}
        />
        <MicroKpi
          tone="visits"
          label={t("kpi.relations")}
          value={t("kpi.relationsValue")}
          sub={t("kpi.sinceDate")}
          href={`/${locale}/visits`}
        />
        <MicroKpi
          tone="people"
          label={t("kpi.delegations")}
          value={liveDelegations.length}
          sub={anchor ? t("kpi.nextDate", { date: anchor.date }) : undefined}
          href={`/${locale}/visits`}
        />
        <MicroKpi
          tone="rose"
          label={t("kpi.grants")}
          value={`$${grantsTotal.toFixed(1)}M`}
          sub={t("kpi.grantPrograms", { count: grants.length })}
          href={`/${locale}/grants`}
        />
      </div>

      <ExecutiveCommandCenter locale={locale} />

      <Card tone="primary" variant="panel">
        <CardHeader
          icon={<Layers className="size-3.5" />}
          tone="primary"
          title={t("cards.relationshipPillars.title")}
          sub={t("cards.relationshipPillars.sub")}
        />
        <CardBody>
          <RelationshipPillars locale={locale} />
        </CardBody>
      </Card>

      <SourceQualityPanel />

      {/* SECTION DIVIDER — separates the 60-second executive answer above from
          the detailed analytical drill-down below, for faster executive scan. */}
      <div className="mt-2 flex items-start gap-4">
        <div className="shrink-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            {t("detailedAnalysis")}
          </div>
          <p className="mt-0.5 text-[11px] text-[var(--color-ink-faint)]">{t("detailedAnalysisSub")}</p>
        </div>
        <div className="mt-1.5 h-px flex-1 bg-gradient-to-r from-[var(--color-border-strong)] to-transparent" />
      </div>

      {/* MAIN GRID — left 1.55fr, right 1fr */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.55fr_1fr]">
        {/* LEFT COLUMN */}
        <div className="flex min-w-0 flex-col gap-4">
          <Card tone="trade">
            <CardHeader
              icon={<TrendingUp className="size-3.5" />}
              tone="trade"
              title={t("flow")}
              sub={t("cards.flowSub")}
            />
            <CardBody>
              <TradeFlowEditorial height={250} />
              <ChartNarration
                labels={narrationLabels}
                what={t("narration.flow.what")}
                why={t("narration.flow.why")}
                how={t("narration.flow.how")}
                source={t("narration.flow.source")}
              />
            </CardBody>
          </Card>

          <Card tone="invest">
            <CardHeader
              icon={<Layers className="size-3.5" />}
              tone="invest"
              title={t("cards.sectorsTitle")}
              sub={t("cards.sectorsSub")}
            />
            <CardBody>
              <SectorsGrid />
              <ChartNarration
                labels={narrationLabels}
                what={t("narration.sectors.what")}
                why={t("narration.sectors.why")}
                how={t("narration.sectors.how")}
              />
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card tone="trade">
              <CardHeader
                icon={<CalendarDays className="size-3.5" />}
                tone="trade"
                title={t("cards.monthlyTitle")}
                sub={t("cards.monthlySub")}
              />
              <CardBody>
                <MonthlyBars height={180} />
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-md bg-[var(--color-surface-2)] px-2.5 py-1.5">
                    <div className="text-[9.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                      {t("cards.monthlyExportKpi")}
                    </div>
                    <div className="mono mt-0.5 flex items-baseline gap-1.5 text-[13.5px] font-semibold tabular text-[var(--color-ink)]">
                      $19.0M
                      <span className="mono text-[10px] text-[var(--color-pos)]">+19%</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-[var(--color-surface-2)] px-2.5 py-1.5">
                    <div className="text-[9.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                      {t("cards.monthlyImportKpi")}
                    </div>
                    <div className="mono mt-0.5 flex items-baseline gap-1.5 text-[13.5px] font-semibold tabular text-[var(--color-ink)]">
                      $7.1M
                      <span className="mono text-[10px] text-[var(--color-pos)]">+21%</span>
                    </div>
                  </div>
                </div>
                <ChartNarration
                  labels={narrationLabels}
                  what={t("narration.monthly.what")}
                  why={t("narration.monthly.why")}
                  how={t("narration.monthly.how")}
                />
              </CardBody>
            </Card>

            <Card tone="people">
              <CardHeader
                icon={<Users2 className="size-3.5" />}
                tone="people"
                title={t("cards.partnersTitle")}
                sub={t("cards.partnersSub")}
              />
              <CardBody>
                <CounterpartsRank />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex min-w-0 flex-col gap-4">
          <Card tone="rose" variant="danger">
            <CardHeader
              icon={<AlertTriangle className="size-3.5" />}
              tone="rose"
              title={t("cards.riskTitle")}
              sub={t("cards.riskSub")}
            />
            <CardBody>
              <RiskRadar limit={6} />
              <ChartNarration
                labels={narrationLabels}
                what={t("narration.risk.what")}
                why={t("narration.risk.why")}
                how={t("narration.risk.how")}
              />
            </CardBody>
          </Card>

          <Card tone="visits" variant="panelMuted">
            <CardHeader
              icon={<CalendarDays className="size-3.5" />}
              tone="visits"
              title={t("cards.horizonTitle")}
              sub={t("cards.horizonSub")}
            />
            <CardBody>
              <Horizon />
            </CardBody>
          </Card>

          <Card tone="invest">
            <CardHeader
              icon={<Gift className="size-3.5" />}
              tone="invest"
              title={t("kpi.grants")}
              sub={`$${grantsTotal.toFixed(2)}M · ${t("kpi.grantPrograms", { count: grants.length })}`}
            />
            <CardBody>
              <GrantsDonut size={132} />
              <ChartNarration
                labels={narrationLabels}
                what={t("narration.grants.what")}
                why={t("narration.grants.why")}
                how={t("narration.grants.how")}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
