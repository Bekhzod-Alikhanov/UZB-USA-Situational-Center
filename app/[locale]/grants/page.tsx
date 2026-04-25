import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { GrantsView } from "@/components/grants/GrantsView";
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
        />
        <CardBody>
          <GrantsView />
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "primary" | "pos";
}) {
  const color =
    tone === "primary"
      ? "text-[var(--color-primary)]"
      : tone === "pos"
        ? "text-[var(--color-pos)]"
        : "text-[var(--color-ink)]";
  return (
    <div className="flex flex-col items-end">
      <span className="mono text-[10px] uppercase tracking-wider opacity-70">{label}</span>
      <span className={`mono text-[15px] font-medium tabular ${color}`}>{value}</span>
    </div>
  );
}
