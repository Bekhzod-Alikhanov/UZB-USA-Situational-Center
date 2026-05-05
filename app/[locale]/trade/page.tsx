import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Table2,
  GitCompareArrows,
  TrendingUp,
  CalendarRange,
  ArrowUpFromLine,
  ArrowDownToLine,
  ListOrdered,
  Layers,
  GitFork,
  Rocket,
  Headphones,
  ImageIcon,
  Activity,
  ScrollText,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { TradeFlowChart } from "@/components/charts/TradeFlowChart";
import { TradeTable } from "@/components/trade/TradeTable";
import { DualMethodologyChart } from "@/components/trade/DualMethodologyChart";
import { MethodologyNotesCard } from "@/components/trade/MethodologyNotesCard";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
// Below-the-fold charts are dynamic-loaded + IntersectionObserver-gated to
// drop the route's initial TBT/transfer. See components/trade/LazyCharts.tsx.
import {
  LazyMonthlyTrade,
  LazyExportStructure,
  LazyImportStructure,
  LazyComtradeHs6,
  LazyComtradeMirror,
  LazyComtradeTrendSparklines,
  LazyHs2ChapterTreemap,
  LazyTrademapProducts,
  LazyServicesEbops,
  LazyTrademapExhibits,
} from "@/components/trade/LazyCharts";
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
            <DualMethodologyChart />
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
          <TradeFlowChart height={340} />
          <p className="mt-3 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            <span className="font-semibold text-[var(--color-ink)]">What this means: </span>
            this is the fastest view for senior users to understand direction, volatility, and whether UZ exports are
            keeping pace with imports from the United States.
          </p>
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

      <details className="group rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3">
          <div>
            <div className="text-[13.5px] font-semibold text-[var(--color-ink)]">Advanced Trade Analysis</div>
            <div className="mt-0.5 text-[11.5px] text-[var(--color-ink-muted)]">
              HS-6, mirror discrepancies, HS-2 treemap, ITC products, services, and export-potential exhibits
            </div>
          </div>
          <span className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
            Open
          </span>
        </summary>
        <div className="flex flex-col gap-6 border-t border-[var(--color-border)] p-4">
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            <span className="font-semibold text-[var(--color-ink)]">What this section preserves: </span>
            granular product analysis, reporter-side discrepancies, Trade Map prioritization views, and services data.
            These are essential for analysts but too technical for the first trade screen.
          </div>

          <Card tone="people">
            <CardHeader
              icon={<Layers className="size-3.5" />}
              tone="people"
              title="HS-6 commodity structure · UN Comtrade"
              sub="Top-25 product codes for UZ↔US bilateral trade — granular detail beyond StatCom HS-2"
              right={<SourceBadge sourceId="comtrade_hs6" />}
            />
            <CardBody>
              <LazyComtradeHs6 />
            </CardBody>
          </Card>

          <Card tone="rose">
            <CardHeader
              icon={<GitFork className="size-3.5" />}
              tone="rose"
              title="Mirror discrepancy · UZ-reporter vs US-reporter"
              sub="2024 · same flow seen from both sides at HS-6 level — top-20 by absolute gap"
              right={<SourceBadge sourceId="comtrade_hs6" />}
            />
            <CardBody>
              <LazyComtradeMirror />
            </CardBody>
          </Card>

          <Card tone="invest">
            <CardHeader
              icon={<Activity className="size-3.5" />}
              tone="invest"
              title="HS-6 5-year sparklines · Comtrade"
              sub={
                locale === "ru"
                  ? "Динамика топ-10 кодов 2021–2025 + CAGR — выявляет выскакивающие позиции"
                  : locale === "uz-latn"
                    ? "Top-10 kodlarning 2021–2025 dinamikasi + CAGR — o'sib chiqayotganlarni aniqlaydi"
                    : "Top-10 HS-6 codes 2021–2025 with CAGR — surfaces breakout positions"
              }
              right={<SourceBadge sourceId="comtrade_hs6" />}
            />
            <CardBody>
              <LazyComtradeTrendSparklines />
            </CardBody>
          </Card>

          <Card tone="visits">
            <CardHeader
              icon={<Layers className="size-3.5" />}
              tone="visits"
              title={
                locale === "ru"
                  ? "Структура по главам ТНВЭД · HS-2 treemap"
                  : locale === "uz-latn"
                    ? "HS-2 boblari bo'yicha tuzilma · treemap"
                    : "Trade structure by HS-2 chapters · treemap"
              }
              sub={
                locale === "ru"
                  ? "Главы Harmonized System — крупная разбивка торговли по укрупнённым категориям"
                  : locale === "uz-latn"
                    ? "Harmonized System boblari — savdoning yiriklashtirilgan kategoriyalar bo'yicha taqsimoti"
                    : "Harmonized System chapters — coarse trade decomposition by aggregated categories"
              }
              right={<SourceBadge sourceId="comtrade_hs6" />}
            />
            <CardBody>
              <LazyHs2ChapterTreemap />
            </CardBody>
          </Card>

          <Card tone="invest">
            <CardHeader
              icon={<Rocket className="size-3.5" />}
              tone="invest"
              title="ITC Trade Map · 2024 deep view with momentum"
              sub="HS-6 with pre-computed Share % and 5-year compound growth — sortable by value, share, or growth"
              right={<SourceBadge sourceId="trademap_itc" />}
            />
            <CardBody>
              <LazyTrademapProducts />
            </CardBody>
          </Card>

          <Card tone="people">
            <CardHeader
              icon={<Headphones className="size-3.5" />}
              tone="people"
              title="Services trade · EBOPS 2010 / BPM6"
              sub="UZ-reported services exports to the U.S. — what Comtrade cannot show"
              right={<SourceBadge sourceId="trademap_itc" />}
            />
            <CardBody>
              <LazyServicesEbops />
            </CardBody>
          </Card>

          <Card tone="agree">
            <CardHeader
              icon={<ImageIcon className="size-3.5" />}
              tone="agree"
              title="ITC analytical exhibits · export potential & diversification"
              sub="Trade Map's EPI and Diversification Indicator outputs — strategic prioritization views"
              right={<SourceBadge sourceId="trademap_itc" />}
            />
            <CardBody>
              <LazyTrademapExhibits />
            </CardBody>
          </Card>
        </div>
      </details>

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
