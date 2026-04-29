import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { GrantsView } from "@/components/grants/GrantsView";
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

      <Card>
        <CardHeader
          title="Active grants"
          sub="Source: Internal report — Grants to the Republic of Uzbekistan as of 07.01.2026"
          right={<SourceBadge sourceId="input_grants_xlsx" />}
        />
        <CardBody>
          <GrantsView />
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
        <span className="font-medium uppercase tracking-wider text-[var(--color-ink-faint)]">Supplementary sources:</span>
        <SourceBadge sourceId="foreign_assistance_gov" />
      </div>
    </div>
  );
}
