import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { RegionCards } from "@/components/roadmaps/RegionCards";
import { RoadmapsExplorer } from "@/components/roadmaps/RoadmapsExplorer";
import { PrintButton } from "@/components/exports/PrintButton";
import { roadmapProjects } from "@/data/roadmaps";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "roadmaps" });
}

export default async function RoadmapsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("roadmaps");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <PrintButton />
      </div>

      <RegionCards />

      <Card>
        <CardHeader title={t("explorer.title")} sub={t("explorer.sub", { count: roadmapProjects.length })} />
        <CardBody>
          <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-[var(--color-surface-2)]" />}>
            <RoadmapsExplorer />
          </Suspense>
        </CardBody>
      </Card>
    </div>
  );
}
