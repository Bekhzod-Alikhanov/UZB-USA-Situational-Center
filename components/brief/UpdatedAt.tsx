"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Live relative "updated N min ago" for the /brief footer strip — counts from
 * the moment the screen was opened and re-renders once a minute without a
 * reload. No date library: one setInterval, cleaned up on unmount.
 */
export function UpdatedAt({ className }: { className?: string }) {
  const t = useTranslations("brief.footer");
  const openedAt = useRef<number | null>(null);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    openedAt.current = Date.now();
    const id = setInterval(() => {
      if (openedAt.current !== null) {
        setMinutes(Math.floor((Date.now() - openedAt.current) / 60_000));
      }
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  return <span className={className}>{minutes < 1 ? t("updatedJustNow") : t("updatedMinutes", { minutes })}</span>;
}
