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
          title: "ÐšÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾ÑÑ‚ÑŒ Ð¸ Ñ€Ð°Ð¼ÐºÐ¸",
          sub: "Ð˜ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐ¹Ñ‚Ðµ Ð´Ð»Ñ Ð¸Ð½Ñ‚ÐµÑ€Ð¿Ñ€ÐµÑ‚Ð°Ñ†Ð¸Ð¸ Ð´Ð°Ð½Ð½Ñ‹Ñ… Ð¿Ð°Ð½ÐµÐ»Ð¸ Ñ Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ°Ð¼Ð¸, Ð½Ðµ Ð´Ð»Ñ Ñ‡ÑƒÐ²ÑÑ‚Ð²Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ñ‹Ñ… Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¹",
          body:
            "ÐÐµ Ð²Ð²Ð¾Ð´Ð¸Ñ‚Ðµ Ð¿Ð°ÑÐ¿Ð¾Ñ€Ñ‚Ð½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ, ÐºÐ¾Ð´Ñ‹ Ð±Ñ€Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ, Ð»Ð¸Ñ‡Ð½Ñ‹Ðµ ÐºÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ñ‹, ÐºÐ¾Ð½Ñ„Ð¸Ð´ÐµÐ½Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿Ñ€Ð¾ÐµÐºÑ‚Ñ‹ ÑÐ¾Ð³Ð»Ð°ÑˆÐµÐ½Ð¸Ð¹ Ð¸Ð»Ð¸ Ð½ÐµÐ¿ÑƒÐ±Ð»Ð¸Ñ‡Ð½Ñ‹Ðµ Ð¿ÐµÑ€ÐµÐ³Ð¾Ð²Ð¾Ñ€Ð½Ñ‹Ðµ Ð¿Ð¾Ð·Ð¸Ñ†Ð¸Ð¸. ÐÑÑÐ¸ÑÑ‚ÐµÐ½Ñ‚ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð¾Ñ‚Ð²ÐµÑ‡Ð°Ñ‚ÑŒ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ ÐºÐ¾Ð½Ñ‚ÐµÐºÑÑ‚Ð° Ð¿Ð°Ð½ÐµÐ»Ð¸ Ð¸ ÑÐ²Ð¾Ð´Ð¾Ðº Ð¸ÑÑ‚Ð¾Ñ‡Ð½Ð¸ÐºÐ¾Ð².",
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
            sub: "Use for sourced dashboard interpretation, not sensitive operations",
            body:
              "Do not enter passport details, reservation codes, personal contact details, confidential draft agreements, or non-public negotiation positions. The assistant should answer from the dashboard context and source summaries only.",
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

