"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Maximize2, Minimize2 } from "lucide-react";

/**
 * Projector presentation mode for the brief landing panel: fullscreens the
 * stage element via the Fullscreen API (the stage already carries its own
 * dark surface and scroll, so no extra styling mode is needed).
 */
export function FullscreenButton({ targetId }: { targetId: string }) {
  const t = useTranslations("brief.header");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onChange = () => setActive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
    } else {
      void document.getElementById(targetId)?.requestFullscreen?.();
    }
  };

  const Icon = active ? Minimize2 : Maximize2;
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={active ? t("exitFullscreen") : t("fullscreen")}
      title={active ? t("exitFullscreen") : t("fullscreen")}
      className="inline-flex size-8 items-center justify-center rounded-md border border-[var(--brief-border)] bg-[var(--brief-surface)] text-[var(--brief-ink-muted)] transition hover:bg-[var(--brief-surface-2)] hover:text-[var(--brief-ink)]"
    >
      <Icon className="size-4" />
    </button>
  );
}
