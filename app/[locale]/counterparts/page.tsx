import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { CounterpartsGrid } from "@/components/counterparts/CounterpartsGrid";
import { counterparts } from "@/data/counterparts";

export default async function CounterpartsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("counterparts");

  const execCount = counterparts.filter((c) => c.role === "executive").length;
  const congressCount = counterparts.filter((c) => c.role.startsWith("congress")).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="hidden gap-4 text-right text-[11px] text-[var(--color-ink-muted)] md:flex">
          <Stat label="Executive" value={execCount.toString()} tone="primary" />
          <Stat label="Congress" value={congressCount.toString()} />
          <Stat label="Total" value={counterparts.length.toString()} />
        </div>
      </div>

      <Card>
        <CardHeader title="Briefing registry" sub="Click any card to open the briefing profile" />
        <CardBody>
          <CounterpartsGrid locale={locale} />
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({ label, value, tone = "ink" }: { label: string; value: string; tone?: "ink" | "primary" }) {
  const color = tone === "primary" ? "text-[var(--color-primary)]" : "text-[var(--color-ink)]";
  return (
    <div className="flex flex-col items-end">
      <span className="mono text-[10px] uppercase tracking-wider opacity-70">{label}</span>
      <span className={`mono text-[15px] font-medium tabular ${color}`}>{value}</span>
    </div>
  );
}
