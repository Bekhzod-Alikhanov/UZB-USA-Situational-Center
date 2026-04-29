import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { InvestmentsView } from "@/components/investments/InvestmentsView";
import { investments, investmentsTotals } from "@/data/investments";

export default async function InvestmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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
          <Stat label={t("stats.projects")} value={investmentsTotals.totalProjects.toString()} />
          <Stat
            label={t("stats.value")}
            value={`$${(investmentsTotals.totalValueUsdM / 1000).toFixed(2)}B`}
          />
          <Stat label={t("stats.jobs")} value={investmentsTotals.totalJobs.toLocaleString("en-US")} />
          <Stat label={t("stats.operating")} value={operating.toString()} tone="pos" />
          <Stat label={t("stats.construction")} value={construction.toString()} tone="warn" />
          <Stat label={t("stats.pipeline")} value={negotiating.toString()} tone="primary" />
        </div>
      </div>

      <DemoBanner agency="MIIT · UzInvest · Agency for Investments" />

      <Card>
        <CardHeader
          title={t("portfolio")}
          sub={`${investmentsTotals.totalProjects} projects · $${(investmentsTotals.totalValueUsdM / 1000).toFixed(2)}B aggregate value`}
        />
        <CardBody>
          <InvestmentsView />
        </CardBody>
      </Card>
    </div>
  );
}
