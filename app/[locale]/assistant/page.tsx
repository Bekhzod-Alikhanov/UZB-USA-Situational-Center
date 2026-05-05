import { getTranslations, setRequestLocale } from "next-intl/server";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export default async function AssistantPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("assistant");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="section-title">{t("title")}</h1>
        <p className="section-sub">{t("subtitle")}</p>
      </div>
      <Card tone="slate">
        <CardHeader
          title="Privacy and scope"
          sub="Use for sourced dashboard interpretation, not sensitive operations"
        />
        <CardBody>
          <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            Do not enter passport details, reservation codes, personal contact details, confidential draft agreements,
            or non-public negotiation positions. The assistant should answer from the dashboard context and source
            summaries only.
          </p>
        </CardBody>
      </Card>
      <AssistantChat
        serverEnabled={process.env.ASSISTANT_ENABLED === "true" && Boolean(process.env.ANTHROPIC_API_KEY)}
      />
    </div>
  );
}
