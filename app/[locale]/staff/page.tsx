import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { DemoBanner } from "@/components/demo-markers/DemoBanner";
import { StaffTable } from "@/components/staff/StaffTable";
import { CenterMilestones } from "@/components/staff/CenterMilestones";
import { staff } from "@/data/staff-kpi";
import { centerMilestonesMeta } from "@/data/center-milestones";
import { PrintButton } from "@/components/exports/PrintButton";
import { SourceBadge } from "@/components/demo-markers/SourceBadge";

export default async function StaffPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("staff");

  const totalAssigned = staff.reduce((a, s) => a + s.tasksAssigned, 0);
  const totalCompleted = staff.reduce((a, s) => a + s.tasksCompleted, 0);
  const totalOverdue = staff.reduce((a, s) => a + s.overdueTasks, 0);
  const avgResponse =
    staff.reduce((a, s) => a + s.avgResponseHrs, 0) / Math.max(1, staff.length);
  const completionRate = totalAssigned ? (totalCompleted / totalAssigned) * 100 : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden gap-4 text-right text-[11px] text-[var(--color-ink-muted)] md:flex">
            <Stat label="Staff" value={staff.length.toString()} />
            <Stat label="Completion" value={`${completionRate.toFixed(0)}%`} tone="pos" />
            <Stat label="Avg response" value={`${avgResponse.toFixed(1)}h`} tone="primary" />
            <Stat label="Overdue" value={totalOverdue.toString()} tone={totalOverdue > 0 ? "neg" : "ink"} />
          </div>
          <PrintButton label="Export monthly report" />
        </div>
      </div>

      <Card>
        <CardHeader
          title="Center milestones — 12-month KPI schedule"
          sub={`${centerMilestonesMeta.total} contractual deliverables · ${centerMilestonesMeta.firstDeadline} → ${centerMilestonesMeta.finalDeadline}`}
          right={<SourceBadge sourceId={centerMilestonesMeta.sourceId} />}
        />
        <CardBody>
          <CenterMilestones />
        </CardBody>
      </Card>

      <DemoBanner agency="Internal — Situational Center HR dashboard" />

      <Card>
        <CardHeader title="April 2026 performance" sub="Ranked by composite completion + response + overdue score" />
        <CardBody>
          <StaffTable />
        </CardBody>
      </Card>
    </div>
  );
}
