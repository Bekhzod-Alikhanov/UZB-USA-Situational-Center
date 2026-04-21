"use client";
import { useSettings } from "@/lib/store/settings";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoBannerProps {
  agency?: string;
  note?: string;
  className?: string;
}

export function DemoBanner({ agency, note, className }: DemoBannerProps) {
  const t = useTranslations("demo");
  const hideDemo = useSettings((s) => s.hideDemo);
  const presentation = useSettings((s) => s.presentationMode);
  if (hideDemo || presentation) return null;
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-[color-mix(in_oklab,var(--color-demo)_40%,transparent)] bg-[var(--color-demo-bg)] px-4 py-3 text-sm text-[var(--color-demo-ink)]",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0" />
      <div className="flex-1 leading-relaxed">
        <span className="font-semibold">{t("badge")}.</span> {note ?? t("banner")}
        {agency ? <span className="ml-1 italic">({agency})</span> : null}
      </div>
    </div>
  );
}
