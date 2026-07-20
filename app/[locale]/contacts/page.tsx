import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UsersRound } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ContactsView } from "@/components/contacts/ContactsView";
import { CounterpartsGrid } from "@/components/counterparts/CounterpartsGrid";
import { contacts } from "@/data/contacts";
import { counterparts } from "@/data/counterparts";
import { getRouteSeo } from "@/lib/seo";
import { PublicPageIntro } from "@/components/layout/PublicPageIntro";
import { Stat } from "@/components/ui/Stat";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "contacts" });
}

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
  const tPublic = await getTranslations("publicPage");

  return (
    <div className="flex flex-col gap-5">
      <PublicPageIntro
        eyebrow={tPublic("intelligenceBrief")}
        title={t("title")}
        subtitle={t("subtitle")}
        tone="people"
        icon={<UsersRound className="size-6 sm:size-7" />}
        stats={
          <>
            <Stat label={t("stats.organizations")} value={contacts.length} />
            <Stat
              label={t("stats.staff")}
              value={contacts.reduce((a, c) => a + (c.people?.length ?? 0), 0)}
              tone="primary"
            />
          </>
        }
      />

      <Card>
        <CardHeader title={t("card.title")} sub={t("card.sub")} />
        <CardBody>
          <ContactsView locale={locale} q={q} />
        </CardBody>
      </Card>

      {/* Key U.S. figures — merged from the retired /counterparts section. */}
      <Card>
        <CardHeader title={t("keyFigures.title")} sub={t("keyFigures.sub", { count: counterparts.length })} />
        <CardBody>
          <CounterpartsGrid />
        </CardBody>
      </Card>
    </div>
  );
}
