import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Gauge } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { BenchmarkView } from "@/components/benchmark/BenchmarkView";
import { PrintButton } from "@/components/exports/PrintButton";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { benchmarkMeta } from "@/data/benchmark";
import { getRouteSeo } from "@/lib/seo";
import { PublicPageIntro } from "@/components/layout/PublicPageIntro";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "benchmark" });
}

export default async function BenchmarkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "benchmarkPage" });
  const tPublic = await getTranslations({ locale, namespace: "publicPage" });

  return (
    <div className="flex flex-col gap-5">
      <PublicPageIntro
        eyebrow={tPublic("intelligenceBrief")}
        title={t("title")}
        subtitle={t("subtitle")}
        tone="slate"
        icon={<Gauge className="size-6 sm:size-7" />}
        actions={<PrintButton label={t("print")} />}
        meta={<SourceBadge sourceId="worldbank_data" />}
      />

      <Card>
        <CardHeader
          title={t("card.title")}
          sub={t("card.sub", { source: benchmarkMeta.source, fetchedAt: benchmarkMeta.fetched_at })}
          right={<SourceBadge sourceId="worldbank_data" />}
        />
        <CardBody>
          <BenchmarkView />
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">
          {t("supplementarySources")}
        </span>
        <SourceBadge sourceId="worldbank_data" />
        <SourceBadge sourceId="oecd_data_api" />
        <SourceBadge sourceId="census_intl_trade_api" />
      </div>
    </div>
  );
}
