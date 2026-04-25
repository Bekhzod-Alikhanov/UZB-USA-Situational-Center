import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { CommitmentsTable } from "@/components/commitments/CommitmentsTable";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { commitments } from "@/data/commitments";
import { PrintButton } from "@/components/exports/PrintButton";

export default async function CommitmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("commitments");

  const total = commitments.length;
  const done = commitments.filter((c) => c.status === "done").length;
  const progress = commitments.filter((c) => c.status === "progress").length;
  const watch = commitments.filter((c) => c.status === "watch").length;
  const overdue = commitments.filter((c) => c.status === "overdue").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden gap-4 text-right text-[11px] text-[var(--color-ink-muted)] md:flex">
            <Stat label="Total" value={total} />
            <Stat label="In progress" value={progress} tone="primary" />
            <Stat label="Completed" value={done} tone="pos" />
            <Stat label="On watch" value={watch} tone="warn" />
            <Stat label="Overdue" value={overdue} tone="neg" />
          </div>
          <PrintButton />
        </div>
      </div>

      <DemoBanner agency="MFA minutes · Presidential Administration tracker" />

      <Card>
        <CardHeader title="Registry" sub={`${total} commitments · linked to real visits and agreements`} />
        <CardBody>
          <CommitmentsTable />
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
  value: number;
  tone?: "ink" | "primary" | "pos" | "warn" | "neg";
}) {
  const color =
    tone === "primary"
      ? "text-[var(--color-primary)]"
      : tone === "pos"
        ? "text-[var(--color-pos)]"
        : tone === "warn"
          ? "text-[var(--color-warn)]"
          : tone === "neg"
            ? "text-[var(--color-neg)]"
            : "text-[var(--color-ink)]";
  return (
    <div className="flex flex-col items-end">
      <span className="mono text-[10px] uppercase tracking-wider opacity-70">{label}</span>
      <span className={`mono text-[15px] font-medium tabular ${color}`}>{value}</span>
    </div>
  );
}
