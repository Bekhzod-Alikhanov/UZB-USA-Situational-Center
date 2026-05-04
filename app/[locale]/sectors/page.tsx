import { setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { SectorsView } from "@/components/sectors/SectorsView";
import { PrintButton } from "@/components/exports/PrintButton";
import { sectorsMeta } from "@/data/sectors";

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Sector opportunities</h1>
          <p className="section-sub">
            Briefing-quality reads on the {sectorsMeta.total} cooperation lanes with the strongest US–UZ leverage
          </p>
        </div>
        <PrintButton label="Export sector brief" />
      </div>

      <Card>
        <CardHeader
          title="Where bilateral cooperation has the most leverage"
          sub="Each card carries a signal, a why-it-matters, and a next-question to push the conversation forward in a meeting"
        />
        <CardBody>
          <SectorsView />
        </CardBody>
      </Card>
    </div>
  );
}
