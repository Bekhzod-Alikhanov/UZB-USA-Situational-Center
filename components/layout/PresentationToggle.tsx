"use client";

import { Presentation } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/lib/store/settings";
import { cn } from "@/lib/utils";

/**
 * One-click presentation-mode toggle in the topbar. Presentation mode hides
 * every demo marker (DemoBanner / DemoBadge / DemoUnderline) so the platform
 * can be shown to an external audience without the synthetic-data flags, while
 * the underlying values stay visible. Distinct from the admin "hide demo"
 * control, which removes the values entirely.
 */
export function PresentationToggle() {
  const presentation = useSettings((s) => s.presentationMode);
  const setPresentationMode = useSettings((s) => s.setPresentationMode);
  const t = useTranslations("shell");
  const label = presentation ? t("presentationExit") : t("presentationEnter");

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={presentation}
      title={label}
      onClick={() => setPresentationMode(!presentation)}
      className={cn(
        "inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border transition",
        presentation
          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-contrast)] shadow-[var(--shadow-glow-primary)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]",
      )}
    >
      <Presentation className="size-4" aria-hidden />
    </button>
  );
}
