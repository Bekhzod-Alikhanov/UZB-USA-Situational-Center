import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { InvestmentsView } from "@/components/investments/InvestmentsView";
import { investmentCredibilitySummary, investments, investmentsTotals } from "@/data/investments";
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

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card tone="invest">
          <CardHeader title={t("credibilityCards.verifiedTitle")} sub={t("credibilityCards.verifiedSub")} />
          <CardBody>
            <div className="mono text-[24px] font-semibold tabular text-[var(--color-ink)]">
              ${(investmentCredibilitySummary.verified.totalValueUsdM / 1000).toFixed(2)}B
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              {t("credibilityCards.verifiedText")}
            </p>
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader title={t("credibilityCards.pendingTitle")} sub={t("credibilityCards.pendingSub")} />
          <CardBody>
            <div className="mono text-[24px] font-semibold tabular text-[var(--color-ink)]">
              ${(investmentCredibilitySummary.pending.totalValueUsdM / 1000).toFixed(2)}B
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              {t("credibilityCards.pendingText")}
            </p>
          </CardBody>
        </Card>
        <Card tone="rose">
          <CardHeader title={t("credibilityCards.demoTitle")} sub={t("credibilityCards.demoSub")} />
          <CardBody>
            <div className="mono text-[24px] font-semibold tabular text-[var(--color-ink)]">
              ${(investmentCredibilitySummary.illustrativeDemo.totalValueUsdM / 1000).toFixed(2)}B
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              {t("credibilityCards.demoText")}
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={t("credibilityCards.portfolioTitle")}
          sub={t("credibilityCards.portfolioSub", { count: investmentsTotals.totalProjects })}
        />
        <CardBody>
          <InvestmentsView />
        </CardBody>
      </Card>
    </div>
  );
}
