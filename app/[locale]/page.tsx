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
import { investments, investmentsTotals } from "@/data/investments";
import { liveDelegations } from "@/data/delegations";
import { nextAnchorVisit } from "@/data/visits";
import { grants } from "@/data/grants";
import { KpiCard } from "@/components/overview/KpiCard";
import { MicroKpi } from "@/components/overview/MicroKpi";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { TradeFlowEditorial } from "@/components/overview/TradeFlowEditorial";
import { MonthlyBars } from "@/components/overview/MonthlyBars";
import { SectorsGrid } from "@/components/overview/SectorsGrid";
import { CounterpartsRank } from "@/components/overview/CounterpartsRank";
import { GrantsDonut } from "@/components/overview/GrantsDonut";
import { Horizon } from "@/components/overview/Horizon";
import { RiskRadar } from "@/components/overview/RiskRadar";
import { PrintButton } from "@/components/exports/PrintButton";

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
  const grantsTotal = grants.reduce((a, g) => a + g.valueMusd, 0);

  const dateLabel = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
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
              {locale === "ru" ? "Ежедневная сводка · " : "Daily brief · "}
              {dateLabel}
            </span>
          </div>
          <h1 className="serif text-[24px] font-medium leading-[1.05] tracking-tight text-[var(--color-ink)] sm:text-[32px] lg:text-[40px]">
            {locale === "ru" ? (
              <>
                Сотрудничество <span className="text-[var(--color-ink-muted)]">Узбекистан · США</span>
              </>
            ) : (
              <>
                Cooperation brief · <span className="text-[var(--color-ink-muted)]">UZ · US</span>
              </>
            )}
          </h1>
          <p className="mt-1.5 max-w-2xl text-[12px] leading-relaxed text-[var(--color-ink-muted)] sm:text-[13px]">
            {locale === "ru"
              ? "Утверждено постановлением Президента Ф-4 (17.02.2026). Источники свежие; помеченные значения подлежат уточнению."
              : "Authorized by Presidential Ordinance Ф-4 (17.02.2026). Sources fresh; flagged values pending replacement."}
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-end">
          <PrintButton label={locale === "ru" ? "Экспорт PDF" : "Export PDF"} />
        </div>
      </header>

      {/* HERO KPI ROW — 4 large tone-coded KPIs */}
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
          sub="UZ Stat · 2025"
          deltaPct={turnoverDelta}
          deltaLabel="vs '24"
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
          sub="Jan '26: $32K"
          deltaPct={exportsDelta}
          deltaLabel="vs '24"
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
          sub={`Jan '26: +${tradeJan2026.importsGrowthPct}%`}
          deltaPct={importsDelta}
          deltaLabel="vs '24"
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
          sub={locale === "ru" ? "дефицит расширился" : "deficit widened"}
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
          sub={`+${agreementsAggregate.totalInvestAgreements} invest-agreements`}
          href={`/${locale}/agreements`}
        />
        <MicroKpi
          tone="invest"
          label={t("kpi.projects")}
          value={investments.length}
          sub={`$${(investmentsTotals.totalValueUsdM / 1000).toFixed(1)}B pipeline`}
          href={`/${locale}/investments`}
        />
        <MicroKpi
          tone="visits"
          label={t("kpi.relations")}
          value="34 yrs"
          sub="since 1992-02-19"
          href={`/${locale}/visits`}
        />
        <MicroKpi
          tone="people"
          label={t("kpi.delegations")}
          value={liveDelegations.length}
          sub={anchor ? `next: ${anchor.date}` : undefined}
          href={`/${locale}/visits`}
        />
        <MicroKpi
          tone="rose"
          label={locale === "ru" ? "Гранты" : "Grants"}
          value={`$${grantsTotal.toFixed(1)}M`}
          sub={`${grants.length} programs`}
          href={`/${locale}/grants`}
        />
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
              sub="USD M · 2017–2025 · UZ Stat (turnover dashed)"
            />
            <CardBody>
              <TradeFlowEditorial height={250} />
            </CardBody>
          </Card>

          <Card tone="invest">
            <CardHeader
              icon={<Layers className="size-3.5" />}
              tone="invest"
              title={locale === "ru" ? "Сектора" : "Sectors"}
              sub={
                locale === "ru"
                  ? "8 направлений · агрегировано из investments.ts"
                  : "8 lanes · aggregated from investments.ts"
              }
            />
            <CardBody>
              <SectorsGrid />
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card tone="trade">
              <CardHeader
                icon={<CalendarDays className="size-3.5" />}
                tone="trade"
                title={locale === "ru" ? "Месячные" : "Monthly"}
                sub={locale === "ru" ? "последние 6 мес. · Census" : "last 6 mo · Census"}
              />
              <CardBody>
                <MonthlyBars height={180} />
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-md bg-[var(--color-surface-2)] px-2.5 py-1.5">
                    <div className="text-[9.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                      Exp Jan &apos;26
                    </div>
                    <div className="mono mt-0.5 flex items-baseline gap-1.5 text-[13.5px] font-semibold tabular text-[var(--color-ink)]">
                      $19.0M
                      <span className="mono text-[10px] text-[var(--color-pos)]">+19%</span>
                    </div>
                  </div>
                  <div className="rounded-md bg-[var(--color-surface-2)] px-2.5 py-1.5">
                    <div className="text-[9.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                      Imp Jan &apos;26
                    </div>
                    <div className="mono mt-0.5 flex items-baseline gap-1.5 text-[13.5px] font-semibold tabular text-[var(--color-ink)]">
                      $7.1M
                      <span className="mono text-[10px] text-[var(--color-pos)]">+21%</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card tone="people">
              <CardHeader
                icon={<Users2 className="size-3.5" />}
                tone="people"
                title={locale === "ru" ? "Топ-партнёры США" : "Top US partners"}
                sub={locale === "ru" ? "по объёму инвестиций" : "by invested volume"}
              />
              <CardBody>
                <CounterpartsRank />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex min-w-0 flex-col gap-4">
          <Card tone="rose">
            <CardHeader
              icon={<AlertTriangle className="size-3.5" />}
              tone="rose"
              title={locale === "ru" ? "Сигналы и риски" : "Signals & risks"}
              sub={
                locale === "ru"
                  ? "live-агрегатор по 4 реестрам"
                  : "live aggregator across 4 registries"
              }
            />
            <CardBody>
              <RiskRadar limit={6} />
            </CardBody>
          </Card>

          <Card tone="visits">
            <CardHeader
              icon={<CalendarDays className="size-3.5" />}
              tone="visits"
              title={locale === "ru" ? "Горизонт 90 дней" : "90-day horizon"}
              sub={locale === "ru" ? "визиты, события, дедлайны" : "visits, events, deadlines"}
            />
            <CardBody>
              <Horizon />
            </CardBody>
          </Card>

          <Card tone="invest">
            <CardHeader
              icon={<Gift className="size-3.5" />}
              tone="invest"
              title={locale === "ru" ? "Гранты" : "Grants"}
              sub={`$${grantsTotal.toFixed(2)}M · ${grants.length} programs`}
            />
            <CardBody>
              <GrantsDonut size={132} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
