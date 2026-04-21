import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { DemoRegistryTable } from "@/components/admin/DemoRegistryTable";
import { DelegationLocationForm } from "@/components/admin/DelegationLocationForm";
import { AuditLogPreview } from "@/components/admin/AuditLogPreview";
import { Upload, Users as UsersIcon } from "lucide-react";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="section-title">{t("title")}</h1>
        <p className="section-sub">Toggles, data registry, delegation location, audit log</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title={t("toggles")} sub="Applied immediately across the whole portal" />
          <CardBody>
            <SettingsPanel />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t("delegationLocation")} sub="Updates Map → Layer 3 live delegations" />
          <CardBody>
            <DelegationLocationForm />
          </CardBody>
        </Card>
      </div>

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
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-6 text-center transition hover:bg-[var(--color-surface-2)]">
                <Upload className="size-5 text-[var(--color-ink-muted)]" />
                <span className="text-[12.5px] font-medium text-[var(--color-ink)]">Drop CSV or XLSX</span>
                <span className="text-[11px] text-[var(--color-ink-muted)]">or click to select</span>
                <input type="file" accept=".csv,.xlsx" className="hidden" />
              </label>
              <div className="mt-2 text-[10.5px] text-[var(--color-ink-muted)]">
                Validates against the target schema · preview before applying
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={t("users")} sub="Situational Center staff roster" />
            <CardBody>
              <ul className="flex flex-col gap-1.5 text-[12.5px]">
                <UserRow name="B. Umurzakov" role="Head, Situational Center" active />
                <UserRow name="K. Abdukodirov" role="Deputy" active />
                <UserRow name="Analyst 1" role="Trade + investments" active />
                <UserRow name="Analyst 2" role="Visits + commitments" active />
                <UserRow name="Analyst 3" role="Compliance + counterparts" />
                <UserRow name="Press liaison" role="Comms" />
              </ul>
              <button
                type="button"
                className="mt-3 flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11.5px] text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]"
              >
                <UsersIcon className="size-3" />
                Manage users
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
