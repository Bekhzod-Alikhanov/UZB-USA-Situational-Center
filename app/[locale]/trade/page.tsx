import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { TradeFlowChart } from "@/components/charts/TradeFlowChart";
import { TradeTable } from "@/components/trade/TradeTable";
import { StructureTreemap } from "@/components/trade/StructureTreemap";
import { DualMethodologyChart } from "@/components/trade/DualMethodologyChart";
import { MonthlyTradeChart } from "@/components/trade/MonthlyTradeChart";
import { ComtradeHs6Top } from "@/components/trade/ComtradeHs6";
import { ComtradeMirror } from "@/components/trade/ComtradeMirror";
import { TrademapProducts } from "@/components/trade/TrademapProducts";
import { ServicesEbops } from "@/components/trade/ServicesEbops";
import { TrademapExhibits } from "@/components/trade/TrademapExhibits";
import { MethodologyNotesCard } from "@/components/trade/MethodologyNotesCard";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import {
  exportStructure2025,
  importStructure2025,
  topExportCategoriesUZ,
  topImportCategoriesUS,
  tradeMeta,
} from "@/data/trade";

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

      <Card>
        <CardHeader
          title="Annual summary"
          sub="All figures USD millions · State Statistics Committee of Uzbekistan"
          right={<SourceBadge sourceId="input_trade_stat_docx" />}
        />
        <CardBody>
          <TradeTable />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Dual methodology · UZ Stat ↔ U.S. Census"
            sub="Same flow, different rules — mirror discrepancy is real and useful"
          />
          <CardBody>
            <DualMethodologyChart />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Methodology notes" sub="Which series to quote when" />
          <CardBody>
            <MethodologyNotesCard />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Trade flow 2017–2025"
          sub="Turnover, exports, imports — UZ-side methodology"
          right={<SourceBadge sourceId="input_trade_stat_docx" />}
        />
        <CardBody>
          <TradeFlowChart height={340} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Monthly merchandise trade · U.S. Census"
          sub="Bars: U.S. exports / imports · Line: net balance — last 26 months"
          right={<SourceBadge sourceId="census_goods_uz" />}
        />
        <CardBody>
          <MonthlyTradeChart />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t("structure.export")} sub="USD millions, 2025" />
          <CardBody>
            <StructureTreemap items={exportStructure2025} height={300} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title={t("structure.import")} sub="USD millions, 2025" />
          <CardBody>
            <StructureTreemap items={importStructure2025} height={300} />
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
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

        <Card>
          <CardHeader
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

      <Card>
        <CardHeader
          title="HS-6 commodity structure · UN Comtrade"
          sub="Top-25 product codes for UZ↔US bilateral trade — granular detail beyond StatCom HS-2"
          right={<SourceBadge sourceId="comtrade_hs6" />}
        />
        <CardBody>
          <ComtradeHs6Top />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Mirror discrepancy · UZ-reporter vs US-reporter"
          sub="2024 · same flow seen from both sides at HS-6 level — top-20 by absolute gap"
          right={<SourceBadge sourceId="comtrade_hs6" />}
        />
        <CardBody>
          <ComtradeMirror />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="ITC Trade Map · 2024 deep view with momentum"
          sub="HS-6 with pre-computed Share % and 5-year compound growth — sortable by value, share, or growth"
          right={<SourceBadge sourceId="trademap_itc" />}
        />
        <CardBody>
          <TrademapProducts />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Services trade · EBOPS 2010 / BPM6"
          sub="UZ-reported services exports to the U.S. — what Comtrade cannot show"
          right={<SourceBadge sourceId="trademap_itc" />}
        />
        <CardBody>
          <ServicesEbops />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="ITC analytical exhibits · export potential & diversification"
          sub="Trade Map's EPI and Diversification Indicator outputs — strategic prioritization views"
          right={<SourceBadge sourceId="trademap_itc" />}
        />
        <CardBody>
          <TrademapExhibits />
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">Supplementary sources:</span>
        <SourceBadge sourceId="census_intl_trade_api" />
        <SourceBadge sourceId="cbu_statistics" />
        <SourceBadge sourceId="bea_developers" />
        <SourceBadge sourceId="comtrade_hs6" />
      </div>
    </div>
  );
}
