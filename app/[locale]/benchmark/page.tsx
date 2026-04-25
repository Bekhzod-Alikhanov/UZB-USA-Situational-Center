import { setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { BenchmarkView } from "@/components/benchmark/BenchmarkView";
import { PrintButton } from "@/components/exports/PrintButton";
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

      <DemoBanner
        agency="World Bank · UN Comtrade · OECD"
        note={`${benchmarkMeta.note} · last refreshed ${benchmarkMeta.fetched_at}`}
      />

      <Card>
        <CardHeader
          title="Comparative posture"
          sub={`Source: ${benchmarkMeta.source}`}
        />
        <CardBody>
          <BenchmarkView />
        </CardBody>
      </Card>
    </div>
  );
}
