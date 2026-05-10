import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { CounterpartsGrid } from "@/components/counterparts/CounterpartsGrid";
import { counterparts } from "@/data/counterparts";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "counterparts" });
}

export default async function CounterpartsPage({ params }: { params: Promise<{ locale: string }> }) {
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
          <Stat label={t("stats.executive")} value={execCount.toString()} tone="primary" />
          <Stat label={t("stats.congress")} value={congressCount.toString()} />
          <Stat label={t("stats.total")} value={counterparts.length.toString()} />
        </div>
      </div>

      <Card>
        <CardHeader title={t("card.title")} sub={t("card.sub")} />
        <CardBody>
          <CounterpartsGrid locale={locale} />
        </CardBody>
      </Card>
    </div>
  );
}
