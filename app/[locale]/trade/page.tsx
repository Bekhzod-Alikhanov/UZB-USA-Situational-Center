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
import { TradeTable } from "@/components/trade/TradeTable";
import { MethodologyNotesCard } from "@/components/trade/MethodologyNotesCard";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { TradeChartDisclosure } from "@/components/trade/TradeChartDisclosure";
import { AdvancedTradeAnalysis } from "@/components/trade/AdvancedTradeAnalysis";
// Below-the-fold charts are dynamic-loaded + IntersectionObserver-gated to
// drop the route's initial TBT/transfer. See components/trade/LazyCharts.tsx.
import { LazyMonthlyTrade, LazyExportStructure, LazyImportStructure } from "@/components/trade/LazyCharts";
import { topExportCategoriesUZ, topImportCategoriesUS, tradeMeta } from "@/data/trade";

export default async function TradePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("trade");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="text-right text-[11px] text-[var(--color-ink-muted)]">
          <div>{tradeMeta.source}</div>
          <div className="mono">Updated {tradeMeta.last_updated}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card tone="trade">
          <CardHeader title="Quote-ready series" sub="Use UZ Stat for the official Uzbekistan-side annual story" />
          <CardBody>
            <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              The annual table and flow chart give the clearest executive view of turnover, exports, imports, and the
              bilateral balance. Keep methodology notes visible when comparing against U.S. Census or Comtrade.
            </p>
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader title="What changed" sub="The balance question is more important than the headline total" />
          <CardBody>
            <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              Growth in flows is useful, but the priority conversation is export diversification, market access, and
              converting forums into product-level opportunities.
            </p>
          </CardBody>
        </Card>
        <Card tone="slate">
          <CardHeader title="Advanced analysis remains" sub="HS, mirror, ITC, and services exhibits are below" />
          <CardBody>
            <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              Technical charts are preserved for analysts and researchers in the Advanced Trade Analysis section rather
              than removed from the dashboard.
            </p>
          </CardBody>
        </Card>
      </div>

      <Card tone="trade">
        <CardHeader
          icon={<Table2 className="size-3.5" />}
          tone="trade"
          title="Annual summary"
          sub="All figures USD millions · State Statistics Committee of Uzbekistan"
          right={<SourceBadge sourceId="input_trade_stat_docx" />}
        />
        <CardBody>
          <TradeTable />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card tone="slate" className="lg:col-span-2">
          <CardHeader
            icon={<GitCompareArrows className="size-3.5" />}
            tone="slate"
            title="Dual methodology · UZ Stat ↔ U.S. Census"
            sub="Same flow, different rules — mirror discrepancy is real and useful"
          />
          <CardBody>
            <TradeChartDisclosure
              kind="methodology"
              buttonLabel="Load methodology chart"
              summary="The methodology comparison is preserved, but deferred so the executive trade page can render before Recharts hydrates. Open it when you need the UZ Stat and U.S. Census series side by side."
            />
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader
            icon={<ScrollText className="size-3.5" />}
            tone="agree"
            title="Methodology notes"
            sub="Which series to quote when"
          />
          <CardBody>
            <MethodologyNotesCard />
          </CardBody>
        </Card>
      </div>

      <Card tone="trade">
        <CardHeader
          icon={<TrendingUp className="size-3.5" />}
          tone="trade"
          title="Trade flow 2017–2025"
          sub="Turnover, exports, imports — UZ-side methodology"
          right={<SourceBadge sourceId="input_trade_stat_docx" />}
        />
        <CardBody>
          <TradeChartDisclosure
            kind="flow"
            buttonLabel="Load trade flow chart"
            height={340}
            summary="What this means: this chart is the fastest visual view of direction, volatility, and whether UZ exports are keeping pace with imports from the United States. It is loaded on demand to keep the first mobile paint light."
          />
        </CardBody>
      </Card>

      <Card tone="trade">
        <CardHeader
          icon={<CalendarRange className="size-3.5" />}
          tone="trade"
          title="Monthly merchandise trade · U.S. Census"
          sub="Bars: U.S. exports / imports · Line: net balance — last 26 months"
          right={<SourceBadge sourceId="census_goods_uz" />}
        />
        <CardBody>
          <LazyMonthlyTrade />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card tone="invest">
          <CardHeader
            icon={<ArrowUpFromLine className="size-3.5" />}
            tone="invest"
            title={t("structure.export")}
            sub="USD millions, 2025"
          />
          <CardBody>
            <LazyExportStructure />
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader
            icon={<ArrowDownToLine className="size-3.5" />}
            tone="agree"
            title={t("structure.import")}
            sub="USD millions, 2025"
          />
          <CardBody>
            <LazyImportStructure />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card tone="invest">
          <CardHeader
            icon={<ListOrdered className="size-3.5" />}
            tone="invest"
            title="Top UZ export categories to U.S."
            sub="USD millions · 2025 · State Statistics Committee structure"
            right={<SourceBadge sourceId="input_trade_stat_docx" />}
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10 text-right">#</th>
                    <th>Category</th>
                    <th>Share</th>
                    <th className="text-right">Value, $M</th>
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
          </CardBody>
        </Card>

        <Card tone="agree">
          <CardHeader
            icon={<ListOrdered className="size-3.5" />}
            tone="agree"
            title="Top UZ import categories from U.S."
            sub="USD millions · 2025 · State Statistics Committee structure"
            right={<SourceBadge sourceId="input_trade_stat_docx" />}
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10 text-right">#</th>
                    <th>Category</th>
                    <th>Share</th>
                    <th className="text-right">Value, $M</th>
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
          </CardBody>
        </Card>
      </div>

      <AdvancedTradeAnalysis locale={locale} />

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
          Supplementary sources:
        </span>
        <SourceBadge sourceId="census_intl_trade_api" />
        <SourceBadge sourceId="cbu_statistics" />
        <SourceBadge sourceId="bea_developers" />
        <SourceBadge sourceId="comtrade_hs6" />
      </div>
    </div>
  );
}
