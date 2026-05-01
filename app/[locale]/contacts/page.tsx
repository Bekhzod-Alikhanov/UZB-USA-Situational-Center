import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ContactsView } from "@/components/contacts/ContactsView";
import { contacts } from "@/data/contacts";

export default async function ContactsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const q = String(sp.q ?? "");
  setRequestLocale(locale);
  const t = await getTranslations("contacts");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{t("title")}</h1>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="hidden items-center gap-4 text-right text-[11px] text-[var(--color-ink-muted)] md:flex">
          <div className="flex flex-col items-end">
            <span className="mono text-[10px] uppercase tracking-wider opacity-70">Organizations</span>
            <span className="mono text-[15px] font-medium tabular text-[var(--color-ink)]">{contacts.length}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="mono text-[10px] uppercase tracking-wider opacity-70">Staff</span>
            <span className="mono text-[15px] font-medium tabular text-[var(--color-primary)]">
              {contacts.reduce((a, c) => a + (c.people?.length ?? 0), 0)}
            </span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader title="Directory" sub="Situational Center · embassies · AUCC · coordination bodies" />
        <CardBody>
          <ContactsView locale={locale} q={q} />
        </CardBody>
      </Card>
    </div>
  );
}
