import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { SectorsView } from "@/components/sectors/SectorsView";
import { PrintButton } from "@/components/exports/PrintButton";
import { sectorsMeta } from "@/data/sectors";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "sectors" });
}

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "sectorsPage" });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle", { count: sectorsMeta.total })}</p>
        </div>
        <PrintButton label={t("print")} />
      </div>

      <Card>
        <CardHeader title={t("card.title")} sub={t("card.sub")} />
        <CardBody>
          <SectorsView locale={locale} />
        </CardBody>
      </Card>
    </div>
  );
}
