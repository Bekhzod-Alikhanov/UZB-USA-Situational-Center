import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { CommitmentsTable } from "@/components/commitments/CommitmentsTable";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { commitments } from "@/data/commitments";
import { PrintButton } from "@/components/exports/PrintButton";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "commitments" });
}

export default async function CommitmentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("commitments");
  const registryCopy =
    locale === "ru"
      ? { title: "Реестр", linked: "поручений · связано с реальными визитами и соглашениями" }
      : locale === "uz-latn"
        ? { title: "Reestr", linked: "topshiriq · real tashriflar va bitimlar bilan bog‘langan" }
        : { title: "Registry", linked: "commitments · linked to real visits and agreements" };

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
        <CardHeader title={registryCopy.title} sub={`${total} ${registryCopy.linked}`} />
        <CardBody>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-[var(--color-surface-2)]" />}>
            <CommitmentsTable />
          </Suspense>
        </CardBody>
      </Card>
    </div>
  );
}
