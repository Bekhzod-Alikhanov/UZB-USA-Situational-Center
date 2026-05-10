import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ExportCalculator } from "@/components/compliance/ExportCalculator";
import { complianceStatuses, eccnSamples } from "@/data/compliance";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { getRouteSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "compliance" });
}

export default async function CompliancePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("compliance");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="section-title">{t("title")}</h1>
        <p className="section-sub">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader
          title={t("sections.status")}
          sub="Sources verified against Treasury · BIS · USTR · FATF"
          right={<ShieldCheck className="size-4 text-[var(--color-pos)]" />}
        />
        <CardBody className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="w-[220px]">Instrument</th>
                <th className="w-[220px]">Status</th>
                <th>Note</th>
                <th className="w-[180px]">{t("source")}</th>
                <th className="w-[110px] text-right">{t("fetchedAt")}</th>
              </tr>
            </thead>
            <tbody>
              {complianceStatuses.map((row) => (
                <tr key={row.id}>
                  <td className="font-medium text-[var(--color-ink)]">{row.label}</td>
                  <td>
                    <span className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[11.5px] font-medium text-[var(--color-ink)]">
                      {row.value}
                    </span>
                  </td>
                  <td className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{row.note}</td>
                  <td className="text-[11.5px]">
                    <a
                      href={row.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      {row.source}
                    </a>
                  </td>
                  <td className="mono text-right tabular text-[11.5px] text-[var(--color-ink-muted)]">
                    {row.fetched_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title={t("sections.eccn")} sub="Frequently encountered classifications" />
          <CardBody className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-[90px]">Code</th>
                  <th>Category</th>
                  <th className="w-[200px]">Typical license</th>
                </tr>
              </thead>
              <tbody>
                {eccnSamples.map((e) => (
                  <tr key={e.code}>
                    <td className="mono font-semibold tabular text-[var(--color-ink)]">{e.code}</td>
                    <td className="text-[12px]">
                      <div className="text-[var(--color-ink)]">{e.category}</div>
                      <div className="text-[11px] text-[var(--color-ink-muted)]">e.g. {e.exampleItem}</div>
                    </td>
                    <td className="text-[11.5px] text-[var(--color-ink-muted)]">{e.typicalLicense}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t("sections.calculator")} sub="Simplified licensing pre-check" />
          <CardBody>
            <ExportCalculator />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title={t("sections.federal")} sub="Notable recent rulemaking" />
        <CardBody>
          <ul className="flex flex-col gap-2 text-[13px]">
            <li className="flex items-start gap-2 text-[var(--color-ink)]">
              <ExternalLink className="mt-0.5 size-3.5 text-[var(--color-ink-faint)]" />
              <a
                href="https://www.federalregister.gov/documents/search?conditions%5Bterm%5D=Uzbekistan"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Federal Register search — Uzbekistan
              </a>
            </li>
            <li className="flex items-start gap-2 text-[var(--color-ink)]">
              <ExternalLink className="mt-0.5 size-3.5 text-[var(--color-ink-faint)]" />
              <a
                href="https://www.bis.doc.gov/index.php/documents/federal-register-notices"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                BIS Federal Register notices
              </a>
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
