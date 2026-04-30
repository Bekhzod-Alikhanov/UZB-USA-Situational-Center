import { getTranslations, setRequestLocale } from "next-intl/server";
import { Gift, Banknote } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { GrantsView } from "@/components/grants/GrantsView";
import { ForeignAssistanceView } from "@/components/grants/ForeignAssistanceView";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { grants, grantsMeta } from "@/data/grants";

export default async function GrantsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("grants");

  const donorCount = new Set(grants.map((g) => g.donor.split(",")[0].trim())).size;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="hidden gap-4 text-right text-[11px] text-[var(--color-ink-muted)] md:flex">
          <Stat label={t("stats.programs")} value={grants.length.toString()} />
          <Stat label={t("stats.value")} value={`$${grantsMeta.total.toFixed(2)}M`} tone="pos" />
          <Stat label={t("stats.donors")} value={donorCount.toString()} tone="primary" />
        </div>
      </div>

      <Card tone="invest">
        <CardHeader
          icon={<Gift className="size-3.5" />}
          tone="invest"
          title="Active grants"
          sub="Source: Internal report — Grants to the Republic of Uzbekistan as of 07.01.2026"
          right={<SourceBadge sourceId="input_grants_xlsx" />}
        />
        <CardBody>
          <GrantsView />
        </CardBody>
      </Card>

      <Card tone="trade">
        <CardHeader
          icon={<Banknote className="size-3.5" />}
          tone="trade"
          title="U.S. foreign assistance · ForeignAssistance.gov accounting"
          sub="Country-level obligations by fiscal year, agency, and category — independent of the UZ-side internal grants register"
          right={<SourceBadge sourceId="foreign_assistance_gov" />}
        />
        <CardBody>
          <ForeignAssistanceView />
        </CardBody>
      </Card>
    </div>
  );
}
