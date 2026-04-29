import { setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { BenchmarkView } from "@/components/benchmark/BenchmarkView";
import { PrintButton } from "@/components/exports/PrintButton";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { benchmarkMeta } from "@/data/benchmark";

export default async function BenchmarkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Regional benchmark</h1>
          <p className="section-sub">
            Uzbekistan vs. Central Asia &amp; South Caucasus on US-relevant metrics
          </p>
        </div>
        <PrintButton label="Export benchmark report" />
      </div>

      <Card>
        <CardHeader
          title="Comparative posture"
          sub={`${benchmarkMeta.source} · refreshed ${benchmarkMeta.fetched_at}`}
          right={<SourceBadge sourceId="worldbank_data" />}
        />
        <CardBody>
          <BenchmarkView />
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">Supplementary sources:</span>
        <SourceBadge sourceId="worldbank_data" />
        <SourceBadge sourceId="oecd_data_api" />
        <SourceBadge sourceId="census_intl_trade_api" />
      </div>
    </div>
  );
}
