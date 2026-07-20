import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BriefcaseBusiness } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { InvestmentsView } from "@/components/investments/InvestmentsView";
import { CredibilityCards } from "@/components/investments/CredibilityCards";
import { SectorsView } from "@/components/sectors/SectorsView";
import { investmentCredibilitySummary, investments, investmentsTotals } from "@/data/investments";
import { sectorsMeta } from "@/data/sectors";
import { getRouteSeo } from "@/lib/seo";
import { PublicPageIntro } from "@/components/layout/PublicPageIntro";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "investments" });
}

export default async function InvestmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("investments");
  const tPublic = await getTranslations("publicPage");

  const operating = investments.filter((i) => i.status === "operating").length;
  const construction = investments.filter((i) => i.status === "construction").length;
  const negotiating = investments.filter((i) => ["mou", "negotiation", "agreed"].includes(i.status)).length;

  return (
    <div className="flex flex-col gap-5">
      <PublicPageIntro
        eyebrow={tPublic("intelligenceBrief")}
        title={t("title")}
        subtitle={t("subtitle")}
        tone="invest"
        icon={<BriefcaseBusiness className="size-6 sm:size-7" />}
        stats={
          <>
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
          </>
        }
      />

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
