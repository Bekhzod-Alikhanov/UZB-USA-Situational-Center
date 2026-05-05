import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { InvestmentsView } from "@/components/investments/InvestmentsView";
import { investmentCredibilitySummary, investments, investmentsTotals } from "@/data/investments";

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
          <Stat label="Verified projects" value={investmentCredibilitySummary.verified.totalProjects.toString()} />
          <Stat
            label="Verified value"
            value={`$${(investmentCredibilitySummary.verified.totalValueUsdM / 1000).toFixed(2)}B`}
          />
          <Stat
            label="Pending/demo"
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
          <CardHeader title="Verified official pipeline" sub="Publicly source-backed records only" />
          <CardBody>
            <div className="mono text-[24px] font-semibold tabular text-[var(--color-ink)]">
              ${(investmentCredibilitySummary.verified.totalValueUsdM / 1000).toFixed(2)}B
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              Safest externally quotable investment figure. Internal and illustrative rows are excluded.
            </p>
          </CardBody>
        </Card>
        <Card tone="agree">
          <CardHeader title="Source-backed, pending review" sub="Internal or source-needed records" />
          <CardBody>
            <div className="mono text-[24px] font-semibold tabular text-[var(--color-ink)]">
              ${(investmentCredibilitySummary.pending.totalValueUsdM / 1000).toFixed(2)}B
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              Useful for coordination, but requires owner sign-off before executive publication.
            </p>
          </CardBody>
        </Card>
        <Card tone="rose">
          <CardHeader title="Illustrative demo pipeline" sub="Retained for scenario walkthroughs" />
          <CardBody>
            <div className="mono text-[24px] font-semibold tabular text-[var(--color-ink)]">
              ${(investmentCredibilitySummary.illustrativeDemo.totalValueUsdM / 1000).toFixed(2)}B
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              Do not quote as a real pipeline. These rows remain marked, searchable, and filterable.
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={`${t("portfolio")} and privatization readiness`}
          sub={`${investmentsTotals.totalProjects} total rows preserved · verified, pending, and demo values are separated below`}
        />
        <CardBody>
          <InvestmentsView />
        </CardBody>
      </Card>
    </div>
  );
}
