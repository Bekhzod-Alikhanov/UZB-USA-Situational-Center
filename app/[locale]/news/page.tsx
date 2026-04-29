import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
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
  const neutral = news.filter((n) => n.tonality === "neutral").length;
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
          <Stat label="Neutral" value={neutral.toString()} />
          <Stat label="Critical" value={critical.toString()} tone="neg" />
          <Stat label="Total" value={news.length.toString()} />
        </div>
      </div>

      <Card>
        <CardHeader
          title="Curated press feed"
          sub="Every entry links to an officially published page · USTR · EXIM · DFC · GOV.UZ · State · ITA · USAID"
        />
        <CardBody>
          <NewsFeed />
        </CardBody>
      </Card>
    </div>
  );
}
