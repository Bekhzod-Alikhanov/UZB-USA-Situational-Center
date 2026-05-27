import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { getRouteSeo } from "@/lib/seo";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getRouteSeo({ locale, routeKey: "assistant" });
}

export default async function AssistantPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("assistant");
  const privacyCopy =
    locale === "ru"
      ? {
          title: "Конфиденциальность и рамки",
          sub: "Используйте для интерпретации данных панели с источниками, не для чувствительных операций",
          body:
            "Не вводите паспортные данные, коды бронирования, личные контакты, конфиденциальные проекты соглашений или непубличные переговорные позиции. Ассистент должен отвечать только на основе контекста панели и сводок источников.",
        }
      : locale === "uz-latn"
        ? {
            title: "Maxfiylik va doira",
            sub: "Manbali panel talqini uchun foydalaning, nozik operatsiyalar uchun emas",
            body:
              "Pasport maâ€™lumotlari, bron kodlari, shaxsiy kontaktlar, maxfiy bitim loyihalari yoki ommaga ochiq boâ€˜lmagan muzokara pozitsiyalarini kiritmang. Yordamchi faqat panel konteksti va manba xulosalari asosida javob berishi kerak.",
          }
        : {
            title: "Privacy and scope",
            sub: "Use for sourced platform interpretation, not sensitive operations",
            body:
              "Do not enter passport details, reservation codes, personal contact details, confidential draft agreements, or non-public negotiation positions. The assistant should answer from the platform context and source summaries only.",
          };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="section-title">{t("title")}</h1>
        <p className="section-sub">{t("subtitle")}</p>
      </div>
      <Card tone="slate">
        <CardHeader
          title={privacyCopy.title}
          sub={privacyCopy.sub}
        />
        <CardBody>
          <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{privacyCopy.body}</p>
        </CardBody>
      </Card>
      <AssistantChat
        serverEnabled={process.env.ASSISTANT_ENABLED === "true" && Boolean(process.env.ANTHROPIC_API_KEY)}
      />
    </div>
  );
}

