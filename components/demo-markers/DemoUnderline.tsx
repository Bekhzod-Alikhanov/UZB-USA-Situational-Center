"use client";
import { useSettings } from "@/lib/store/settings";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface DemoUnderlineProps {
  children: ReactNode;
  source?: string;
  className?: string;
}

export function DemoUnderline({ children, source, className }: DemoUnderlineProps) {
  const t = useTranslations("demo");
  const hideDemo = useSettings((s) => s.hideDemo);
  const presentation = useSettings((s) => s.presentationMode);
  if (hideDemo) return null;
  if (presentation) return <>{children}</>;
  return (
    <span className={cn("demo-underline", className)} title={source ? t("tooltip", { source }) : t("badge")}>
      {children}
    </span>
  );
}
