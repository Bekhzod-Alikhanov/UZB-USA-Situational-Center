import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Table2,
  GitCompareArrows,
  TrendingUp,
  CalendarRange,
  ArrowUpFromLine,
  ArrowDownToLine,
  ListOrdered,
  ScrollText,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ChartNarration } from "@/components/ui/ChartNarration";
import { TradeTable } from "@/components/trade/TradeTable";
import { TradeAnnualSummary } from "@/components/trade/TradeAnnualSummary";
import { MethodologyNotesCard } from "@/components/trade/MethodologyNotesCard";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { TradeChartDisclosure } from "@/components/trade/TradeChartDisclosure";
import { AdvancedTradeAnalysis } from "@/components/trade/AdvancedTradeAnalysis";
import { TradeFlowChart } from "@/components/charts/TradeFlowChart";
// Below-the-fold charts are dynamic-loaded + IntersectionObserver-gated to
// drop the route's initial TBT/transfer. See components/trade/LazyCharts.tsx.
import { LazyMonthlyTrade, LazyExportStructure, LazyImportStructure } from "@/components/trade/LazyCharts";
import { topExportCategoriesUZ, topImportCategoriesUS, tradeMeta } from "@/data/trade";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "trade" });
}

export default async function TradePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("trade");
  const narrationLabels = {
    what: t("narrationLabels.what"),
    why: t("narrationLabels.why"),
    how: t("narrationLabels.how"),
    source: t("narrationLabels.source"),
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="text-right text-[11px] text-[var(--color-ink-muted)]">
          <div>{t("source")}</div>
          <div className="mono">
            {t("updated")} {tradeMeta.last_updated}
          </div>
        </div>
      </div>

      <Card tone="trade">
        <CardHeader
          icon={<TrendingUp className="size-3.5" />}
          tone="trade"
          title={t("sections.flowTitle")}
          sub={t("sections.flowSub")}
          right={<SourceBadge sourceId="input_trade_stat_docx" />}
        />
        <CardBody>
          <TradeFlowChart height={300} />
          <ChartNarration
            labels={narrationLabels}
            what={t("narration.flow.what")}
            why={t("narration.flow.why")}
            how={t("narration.flow.how")}
          />
        </CardBody>
      </Card>

      <Card tone="trade">
        <CardHeader
          icon={<Table2 className="size-3.5" />}
          tone="trade"
          title={t("sections.annualTitle")}
          sub={t("sections.annualSub")}
          right={<SourceBadge sourceId="input_trade_stat_docx" />}
        />
        <CardBody>
          <TradeAnnualSummary locale={locale} />
          <TradeTable />
          <ChartNarration
            labels={narrationLabels}
            what={t("narration.annual.what")}
            why={t("narration.annual.why")}
            how={t("narration.annual.how")}
            source={t("narration.annual.source")}
          />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card tone="slate" className="lg:col-span-2">
          <CardHeader
            icon={<GitCompareArrows className="size-3.5" />}
            tone="slate"
            title={t("sections.methodologyTitle")}
            sub={t("sections.methodologySub")}
          />
          <CardBody>
            <TradeChartDisclosure
              kind="methodology"
              buttonLabel={t("sections.methodologyButton")}
              summary={t("sections.methodologySummary")}
            />
            <ChartNarration
              labels={narrationLabels}
              what={t("narration.methodology.what")}
              why={t("narration.methodology.why")}
              how={t("narration.methodology.how")}
            />
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader
            icon={<ScrollText className="size-3.5" />}
            tone="agree"
            title={t("sections.notesTitle")}
            sub={t("sections.notesSub")}
          />
          <CardBody>
            <MethodologyNotesCard />
          </CardBody>
        </Card>
      </div>

      <Card tone="trade">
        <CardHeader
          icon={<CalendarRange className="size-3.5" />}
          tone="trade"
          title={t("sections.monthlyTitle")}
          sub={t("sections.monthlySub")}
          right={<SourceBadge sourceId="census_goods_uz" />}
        />
        <CardBody>
          <LazyMonthlyTrade />
          <ChartNarration
            labels={narrationLabels}
            what={t("narration.monthly.what")}
            why={t("narration.monthly.why")}
            how={t("narration.monthly.how")}
            source={t("narration.monthly.source")}
          />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card tone="invest">
          <CardHeader
            icon={<ArrowUpFromLine className="size-3.5" />}
            tone="invest"
            title={t("structure.export")}
            sub={t("sections.structureSub")}
          />
          <CardBody>
            <LazyExportStructure />
            <ChartNarration
              labels={narrationLabels}
              what={t("narration.structure.what")}
              why={t("narration.structure.why")}
              how={t("narration.structure.how")}
            />
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader
            icon={<ArrowDownToLine className="size-3.5" />}
            tone="agree"
            title={t("structure.import")}
            sub={t("sections.structureSub")}
          />
          <CardBody>
            <LazyImportStructure />
            <ChartNarration
              labels={narrationLabels}
              what={t("narration.structure.what")}
              why={t("narration.structure.why")}
              how={t("narration.structure.how")}
            />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card tone="invest">
          <CardHeader
            icon={<ListOrdered className="size-3.5" />}
            tone="invest"
            title={t("sections.topExportTitle")}
            sub={t("sections.topExportSub")}
            right={<SourceBadge sourceId="input_trade_stat_docx" />}
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10 text-right">{t("tableHeaders.rank")}</th>
                    <th>{t("tableHeaders.category")}</th>
                    <th>{t("tableHeaders.share")}</th>
                    <th className="text-right">{t("tableHeaders.value")}</th>
                  </tr>
                </thead>
                <tbody>
                  {topExportCategoriesUZ.map((r) => (
                    <tr key={r.rank}>
                      <td className="mono text-right text-[var(--color-ink-muted)]">{r.rank}</td>
                      <td className="font-medium">{r.name}</td>
                      <td className="text-[var(--color-ink-muted)]">{r.sector}</td>
                      <td className="mono text-right">{r.value.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ChartNarration
              className="mx-3 mb-3"
              labels={narrationLabels}
              what={t("narration.categories.what")}
              why={t("narration.categories.why")}
              how={t("narration.categories.how")}
            />
          </CardBody>
        </Card>

        <Card tone="agree">
          <CardHeader
            icon={<ListOrdered className="size-3.5" />}
            tone="agree"
            title={t("sections.topImportTitle")}
            sub={t("sections.topImportSub")}
            right={<SourceBadge sourceId="input_trade_stat_docx" />}
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10 text-right">{t("tableHeaders.rank")}</th>
                    <th>{t("tableHeaders.category")}</th>
                    <th>{t("tableHeaders.share")}</th>
                    <th className="text-right">{t("tableHeaders.value")}</th>
                  </tr>
                </thead>
                <tbody>
                  {topImportCategoriesUS.map((r) => (
                    <tr key={r.rank}>
                      <td className="mono text-right text-[var(--color-ink-muted)]">{r.rank}</td>
                      <td className="font-medium">{r.name}</td>
                      <td className="text-[var(--color-ink-muted)]">{r.sector}</td>
                      <td className="mono text-right">{r.value.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ChartNarration
              className="mx-3 mb-3"
              labels={narrationLabels}
              what={t("narration.categories.what")}
              why={t("narration.categories.why")}
              how={t("narration.categories.how")}
            />
          </CardBody>
        </Card>
      </div>

      <AdvancedTradeAnalysis />

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
          {t("sections.supplementarySources")}
        </span>
        <SourceBadge sourceId="census_intl_trade_api" />
        <SourceBadge sourceId="cbu_statistics" />
        <SourceBadge sourceId="bea_developers" />
        <SourceBadge sourceId="comtrade_hs6" />
      </div>
    </div>
  );
}
