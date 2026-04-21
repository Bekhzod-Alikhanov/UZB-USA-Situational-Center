import { getTranslations, setRequestLocale } from "next-intl/server";
import { VisitsTabs } from "@/components/visits/VisitsTabs";

export default async function VisitsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("visits");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="section-title">{t("title")}</h1>
        <p className="section-sub">{t("subtitle")}</p>
      </div>

      <div className="card p-0">
        <div className="px-4 pt-3">
          <VisitsTabs />
        </div>
      </div>
    </div>
  );
}
