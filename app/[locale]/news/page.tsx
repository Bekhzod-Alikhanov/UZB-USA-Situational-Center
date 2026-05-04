import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { NewsFeed } from "@/components/news/NewsFeed";
import { news } from "@/data/news";

type NewsTonality = "positive" | "neutral" | "critical";
type NewsTag = "presidential" | "trade" | "investment" | "minerals" | "security" | "diplomatic" | "culture" | "economy";

const VALID_TONS = new Set<NewsTonality | "all">(["all", "positive", "neutral", "critical"]);
const VALID_TAGS = new Set<NewsTag | "all">([
  "all",
  "presidential",
  "trade",
  "investment",
  "minerals",
  "security",
  "diplomatic",
  "culture",
  "economy",
]);

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  const tonalityRaw = String(sp.tonality ?? "all");
  const tagRaw = String(sp.tag ?? "all");
  const q = String(sp.q ?? "");
  const tonality = (VALID_TONS.has(tonalityRaw as NewsTonality | "all") ? tonalityRaw : "all") as NewsTonality | "all";
  const tag = (VALID_TAGS.has(tagRaw as NewsTag | "all") ? tagRaw : "all") as NewsTag | "all";

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
          <NewsFeed locale={locale} tonality={tonality} tag={tag} q={q} />
        </CardBody>
      </Card>
    </div>
  );
}
