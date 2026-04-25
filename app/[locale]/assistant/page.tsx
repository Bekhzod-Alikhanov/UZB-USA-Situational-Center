import { getTranslations, setRequestLocale } from "next-intl/server";
import { AssistantChat } from "@/components/assistant/AssistantChat";

export default async function AssistantPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("assistant");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="section-title">{t("title")}</h1>
        <p className="section-sub">{t("subtitle")}</p>
      </div>
      <AssistantChat />
    </div>
  );
}
