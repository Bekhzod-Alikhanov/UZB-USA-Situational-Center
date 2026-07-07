import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { DemoRegistryTable } from "@/components/admin/DemoRegistryTable";
import { AuditLogPreview } from "@/components/admin/AuditLogPreview";
import { LogOut, Upload, Users as UsersIcon } from "lucide-react";
import { logout } from "./login/actions";
import { ProductionReadinessPanel } from "@/components/admin/ProductionReadinessPanel";
import { DataOperationsPanel } from "@/components/admin/DataOperationsPanel";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">Toggles, data registry, audit log</p>
        </div>
        <form action={logout}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
        </form>
      </div>

      <Card>
        <CardHeader title={t("toggles")} sub="Applied immediately across the whole portal" />
        <CardBody>
          <SettingsPanel />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Production readiness and data operations"
          sub="Security, live-data, database, CI, and deployment gates for full operational use"
        />
        <CardBody>
          <ProductionReadinessPanel />
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Official data ingestion"
          sub="Dry-run official connectors, review relevance, and protect approved metrics from older source pulls"
        />
        <CardBody>
          <DataOperationsPanel />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title={t("registry")} sub={t("registryDesc")} />
        <CardBody>
          <DemoRegistryTable />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title={t("audit")} sub="Recent actions across the portal" />
          <CardBody>
            <AuditLogPreview />
          </CardBody>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title={t("import")} sub="Bulk upload updated data" />
            <CardBody>
              <div
                title="Backend pending — public platform reads bundled data/*.ts; live ingest requires the operational system"
                aria-disabled
                className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center opacity-60"
              >
                <Upload className="size-5 text-[var(--color-ink-faint)]" />
                <span className="text-[12.5px] font-medium text-[var(--color-ink-muted)]">Drop CSV or XLSX</span>
                <span className="rounded-full border border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-warn)]">
                  Backend pending
                </span>
              </div>
              <div className="mt-2 text-[10.5px] text-[var(--color-ink-muted)]">
                Public platform reads bundled <code className="mono">data/*.ts</code> at build time. Live data ingest
                will live in the operational system with auth + audit, not this repo.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={t("users")} sub="Situational Center staff roster" />
            <CardBody>
              <ul className="flex flex-col gap-1.5 text-[12.5px]">
                <UserRow name="E. Umurzakov" role="Head, Situational Center" active />
                <UserRow name="A. Abdukodirov" role="Deputy" active />
                <UserRow name="Analyst 1" role="Trade + investments" active />
                <UserRow name="Analyst 2" role="Visits + roadmaps" active />
                <UserRow name="Analyst 3" role="Compliance + counterparts" />
                <UserRow name="Press liaison" role="Comms" />
              </ul>
              <button
                type="button"
                disabled
                title="Backend pending — user management will live in the operational system, not the public platform"
                className="mt-3 flex items-center gap-1.5 rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-2.5 py-1 text-[11.5px] text-[var(--color-ink-faint)] cursor-not-allowed"
              >
                <UsersIcon className="size-3" />
                Manage users · backend pending
              </button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function UserRow({ name, role, active }: { name: string; role: string; active?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5">
      <div className="min-w-0">
        <div className="truncate font-medium text-[var(--color-ink)]">{name}</div>
        <div className="text-[10.5px] text-[var(--color-ink-muted)]">{role}</div>
      </div>
      <span
        className={
          active
            ? "rounded-full border border-[var(--color-pos)]/30 bg-[var(--color-pos-soft)] px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-[var(--color-pos)]"
            : "rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]"
        }
      >
        {active ? "active" : "pending"}
      </span>
    </li>
  );
}
