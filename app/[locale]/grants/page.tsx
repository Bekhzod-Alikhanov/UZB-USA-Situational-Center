import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Banknote, Gift, Landmark } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { GrantsView } from "@/components/grants/GrantsView";
import { ForeignAssistanceView } from "@/components/grants/ForeignAssistanceView";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";
import { grants, grantsMeta } from "@/data/grants";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "grants" });
}

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
          title={t("cards.internalTitle")}
          sub={t("cards.internalSub", { count: internalGrants.length })}
          right={<SourceBadge sourceId="input_grants_xlsx" />}
        />
        <CardBody>
          <GrantsView
            records={internalGrants}
            emptyTitle={t("cards.internalEmptyTitle")}
            emptyDescription={t("cards.internalEmptyDescription")}
          />
        </CardBody>
      </Card>

      <Card tone="primary">
        <CardHeader
          icon={<Banknote className="size-3.5" />}
          tone="primary"
          title={t("cards.assistanceTitle")}
          sub={t("cards.assistanceSub", { count: usAssistancePrograms.length })}
          right={<SourceBadge sourceId="foreign_assistance_gov" />}
        />
        <CardBody>
          <GrantsView
            records={usAssistancePrograms}
            emptyTitle={t("cards.assistanceEmptyTitle")}
            emptyDescription={t("cards.assistanceEmptyDescription")}
          />
        </CardBody>
      </Card>

      <Card tone="trade">
        <CardHeader
          icon={<Landmark className="size-3.5" />}
          tone="trade"
          title={t("cards.foreignTitle")}
          sub={t("cards.foreignSub")}
          right={<SourceBadge sourceId="foreign_assistance_gov" />}
        />
        <CardBody>
          <ForeignAssistanceView />
        </CardBody>
      </Card>
    </div>
  );
}
