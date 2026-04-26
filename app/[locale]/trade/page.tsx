import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { TradeFlowChart } from "@/components/charts/TradeFlowChart";
import { TradeTable } from "@/components/trade/TradeTable";
import { StructureTreemap } from "@/components/trade/StructureTreemap";
import { DualMethodologyChart } from "@/components/trade/DualMethodologyChart";
import { MethodologyNotesCard } from "@/components/trade/MethodologyNotesCard";
import { DemoBadge } from "@/components/demo-markers/DemoBadge";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { exportStructure2025, importStructure2025, topExportersUZ, topImportersUS, tradeMeta } from "@/data/trade";

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
            title={t("ranking.exporters")}
            sub="USD millions, 2025"
            right={<DemoBadge source="MIIT + State Customs Committee" />}
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10 text-right">#</th>
                    <th>Company</th>
                    <th>Sector</th>
                    <th className="text-right">Value, $M</th>
                  </tr>
                </thead>
                <tbody>
                  {topExportersUZ.map((r) => (
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
            title={t("ranking.importers")}
            sub="USD millions, 2025"
            right={<DemoBadge source="MIIT + State Customs Committee" />}
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="w-10 text-right">#</th>
                    <th>Company</th>
                    <th>Sector</th>
                    <th className="text-right">Value, $M</th>
                  </tr>
                </thead>
                <tbody>
                  {topImportersUS.map((r) => (
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
    </div>
  );
}
