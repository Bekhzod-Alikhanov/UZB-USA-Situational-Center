import { getTranslations, setRequestLocale } from "next-intl/server";
import { Banknote, Gift, Landmark } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { GrantsView } from "@/components/grants/GrantsView";
import { ForeignAssistanceView } from "@/components/grants/ForeignAssistanceView";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { grants, grantsMeta } from "@/data/grants";

export default async function GrantsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("grants");

  const internalGrants = grants.filter((g) => g.sourceId === "input_grants_xlsx");
  const usAssistancePrograms = grants.filter((g) => g.sourceId !== "input_grants_xlsx");
  const donorCount = new Set(grants.map((g) => g.donor.split(",")[0].trim())).size;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="hidden gap-4 text-right text-[11px] text-[var(--color-ink-muted)] md:flex">
          <Stat label={t("stats.programs")} value={`${internalGrants.length} + ${usAssistancePrograms.length}`} />
          <Stat label={t("stats.value")} value={`$${grantsMeta.total.toFixed(2)}M`} tone="pos" />
          <Stat label={t("stats.donors")} value={donorCount.toString()} tone="primary" />
        </div>
      </div>

      <Card tone="invest">
        <CardHeader
          icon={<Gift className="size-3.5" />}
          tone="invest"
          title="UZ-side internal grant register"
          sub={`${internalGrants.length} workbook rows as of 07.01.2026; U.S. assistance programs are listed separately below`}
          right={<SourceBadge sourceId="input_grants_xlsx" />}
        />
        <CardBody>
          <GrantsView
            records={internalGrants}
            emptyTitle="No internal grants match these filters"
            emptyDescription="Clear the search field or choose another sector to return to the internal grant register."
          />
        </CardBody>
      </Card>

      <Card tone="primary">
        <CardHeader
          icon={<Banknote className="size-3.5" />}
          tone="primary"
          title="Major U.S. assistance program records"
          sub={`${usAssistancePrograms.length} source-backed multi-year program records; values use U.S.-side methodology and should not be added to the internal register without reconciliation`}
          right={<SourceBadge sourceId="foreign_assistance_gov" />}
        />
        <CardBody>
          <GrantsView
            records={usAssistancePrograms}
            emptyTitle="No assistance programs match these filters"
            emptyDescription="Clear the search field or choose another sector to return to the U.S.-side program records."
          />
        </CardBody>
      </Card>

      <Card tone="trade">
        <CardHeader
          icon={<Landmark className="size-3.5" />}
          tone="trade"
          title="U.S. foreign assistance - annual obligations"
          sub="ForeignAssistance.gov country-level accounting; separate from project-level grant/program cards above"
          right={<SourceBadge sourceId="foreign_assistance_gov" />}
        />
        <CardBody>
          <ForeignAssistanceView />
        </CardBody>
      </Card>
    </div>
  );
}
