"use client";
import { useSettings } from "@/lib/store/settings";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DemoBadgeProps {
  source?: string;
  className?: string;
  /**
   * "chip" — the classic text badge; "dot" — a compact colored dot with the
   * same tooltip, for dense layouts where a text chip would visually compete
   * with the data it marks. Gating semantics are identical for both.
   */
  variant?: "chip" | "dot";
}

export function DemoBadge({ source, className, variant = "chip" }: DemoBadgeProps) {
  const t = useTranslations("demo");
  const hideDemo = useSettings((s) => s.hideDemo);
  const presentation = useSettings((s) => s.presentationMode);
  if (hideDemo || presentation) return null;

  const tooltip = source ? t("tooltip", { source }) : t("badge");

  if (variant === "dot") {
    return (
      <span
        className={cn("inline-block size-2 rounded-full bg-[var(--color-demo)] align-middle", className)}
        title={tooltip}
        role="img"
        aria-label={t("badge")}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-[color-mix(in_oklab,var(--color-demo)_50%,transparent)] bg-[var(--color-demo-bg)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[var(--color-demo-ink)]",
        className,
      )}
      title={tooltip}
    >
      {t("badge")}
    </span>
  );
}
