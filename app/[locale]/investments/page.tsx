import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { InvestmentsView } from "@/components/investments/InvestmentsView";
import { CredibilityCards } from "@/components/investments/CredibilityCards";
import { SectorsView } from "@/components/sectors/SectorsView";
import { investmentCredibilitySummary, investments, investmentsTotals } from "@/data/investments";
import { sectorsMeta } from "@/data/sectors";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "investments" });
}

export default async function InvestmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("investments");

  const operating = investments.filter((i) => i.status === "operating").length;
  const construction = investments.filter((i) => i.status === "construction").length;
  const negotiating = investments.filter((i) => ["mou", "negotiation", "agreed"].includes(i.status)).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="hidden gap-4 text-right text-[11px] text-[var(--color-ink-muted)] md:flex">
          <Stat
            label={t("stats.verifiedProjects")}
            value={investmentCredibilitySummary.verified.totalProjects.toString()}
          />
          <Stat
            label={t("stats.verifiedValue")}
            value={`$${(investmentCredibilitySummary.verified.totalValueUsdM / 1000).toFixed(2)}B`}
          />
          <Stat
            label={t("stats.pendingDemo")}
            value={`${investmentCredibilitySummary.pending.totalProjects}/${investmentCredibilitySummary.illustrativeDemo.totalProjects}`}
          />
          <Stat label={t("stats.operating")} value={operating.toString()} tone="pos" />
          <Stat label={t("stats.construction")} value={construction.toString()} tone="warn" />
          <Stat label={t("stats.pipeline")} value={negotiating.toString()} tone="primary" />
        </div>
      </div>

      <DemoBanner agency="MIIT · UzInvest · Agency for Investments" />

      <CredibilityCards />

      <Card>
        <CardHeader
          title={t("credibilityCards.portfolioTitle")}
          sub={t("credibilityCards.portfolioSub", { count: investmentsTotals.totalProjects })}
        />
        <CardBody>
          <InvestmentsView />
        </CardBody>
      </Card>

      {/* Sector opportunity briefings — merged from the retired /sectors page. */}
      <Card>
        <CardHeader title={t("sectorsCard.title")} sub={t("sectorsCard.sub", { count: sectorsMeta.total })} />
        <CardBody>
          <SectorsView locale={locale} />
        </CardBody>
      </Card>
    </div>
  );
}
