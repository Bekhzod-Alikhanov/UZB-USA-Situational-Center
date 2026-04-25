import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { NewsFeed } from "@/components/news/NewsFeed";
import { news } from "@/data/news";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  const positive = news.filter((n) => n.tonality === "positive").length;
  const critical = news.filter((n) => n.tonality === "critical").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="hidden gap-4 text-right text-[11px] text-[var(--color-ink-muted)] md:flex">
          <Stat label="Positive" value={positive.toString()} tone="pos" />
          <Stat label="Critical" value={critical.toString()} tone="neg" />
          <Stat label="Total" value={news.length.toString()} />
        </div>
      </div>

      <DemoBanner agency="Situational Center press monitoring" />

      <Card>
        <CardHeader title="Curated feed" sub="Manual tonality scoring · hyperlinked sources" />
        <CardBody>
          <NewsFeed />
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
  tone?: "ink" | "pos" | "neg";
}) {
  const color =
    tone === "pos"
      ? "text-[var(--color-pos)]"
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
