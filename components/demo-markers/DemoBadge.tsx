"use client";
import { useSettings } from "@/lib/store/settings";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DemoBadgeProps {
  source?: string;
  className?: string;
}

export function DemoBadge({ source, className }: DemoBadgeProps) {
  const t = useTranslations("demo");
  const hideDemo = useSettings((s) => s.hideDemo);
  const presentation = useSettings((s) => s.presentationMode);
  if (hideDemo || presentation) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-[color-mix(in_oklab,var(--color-demo)_50%,transparent)] bg-[var(--color-demo-bg)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-demo-ink)]",
        className,
      )}
      title={source ? t("tooltip", { source }) : t("badge")}
    >
      {t("badge")}
    </span>
  );
}
