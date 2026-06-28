"use client";
import { useTranslations } from "next-intl";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { investmentCredibilitySummary } from "@/data/investments";
import { useSettings } from "@/lib/store/settings";
import { cn } from "@/lib/utils";

/**
 * The verified / pending / illustrative-demo credibility split.
 *
 * In presentation mode the prominent "illustrative demo pipeline" card is
 * collapsed so the executive summary leads with verified + pending value
 * only; the underlying demo records stay reachable behind the board's
 * "show demo" toggle. Outside presentation mode all three cards show, which
 * is the platform's data-governance strength.
 */
export function CredibilityCards() {
  const t = useTranslations("investments.credibilityCards");
  const presentation = useSettings((s) => s.presentationMode);

  const billions = (musd: number) => `$${(musd / 1000).toFixed(2)}B`;

  return (
    <div className={cn("grid grid-cols-1 gap-3", presentation ? "lg:grid-cols-2" : "lg:grid-cols-3")}>
      <Card tone="invest">
        <CardHeader title={t("verifiedTitle")} sub={t("verifiedSub")} />
        <CardBody>
          <div className="mono text-[24px] font-semibold tabular text-[var(--color-ink)]">
            {billions(investmentCredibilitySummary.verified.totalValueUsdM)}
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{t("verifiedText")}</p>
        </CardBody>
      </Card>
      <Card tone="agree">
        <CardHeader title={t("pendingTitle")} sub={t("pendingSub")} />
        <CardBody>
          <div className="mono text-[24px] font-semibold tabular text-[var(--color-ink)]">
            {billions(investmentCredibilitySummary.pending.totalValueUsdM)}
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{t("pendingText")}</p>
        </CardBody>
      </Card>
      {!presentation ? (
        <Card tone="rose">
          <CardHeader title={t("demoTitle")} sub={t("demoSub")} />
          <CardBody>
            <div className="mono text-[24px] font-semibold tabular text-[var(--color-ink)]">
              {billions(investmentCredibilitySummary.illustrativeDemo.totalValueUsdM)}
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{t("demoText")}</p>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
