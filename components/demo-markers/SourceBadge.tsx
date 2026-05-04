import { ExternalLink, FileText } from "lucide-react";
import { findSource } from "@/data/sources";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  /** Source ID from data/sources.ts */
  sourceId: string;
  /** Render mode: "chip" full label, "compact" small inline */
  variant?: "chip" | "compact";
  className?: string;
}

/**
 * Source provenance chip. Resolves a sourceId from the central registry
 * and renders a clickable link (Level B, external) or a file marker
 * (Level A, attached input). Use everywhere a value is shown so each
 * datum traces back to its origin.
 */
export function SourceBadge({ sourceId, variant = "compact", className }: SourceBadgeProps) {
  const src = findSource(sourceId);
  if (!src) {
    return (
      <span
        className={cn(
          "mono inline-flex items-center gap-1 rounded bg-[var(--color-warn-soft)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-warn)]",
          className,
        )}
        title={`Unknown source: ${sourceId}`}
      >
        ?{sourceId}
      </span>
    );
  }

  const isExternal = src.level === "B" && Boolean(src.url);
  const Icon = isExternal ? ExternalLink : FileText;
  const tone =
    src.level === "B"
      ? "border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
      : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-ink-muted)]";

  const inner = (
    <>
      <Icon className={variant === "chip" ? "size-3" : "size-2.5"} />
      <span className={variant === "chip" ? "font-medium" : ""}>
        {variant === "chip" ? src.name : `[${src.level}] ${src.id}`}
      </span>
    </>
  );

  const baseClass = cn(
    "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 transition",
    variant === "chip" ? "text-[11px]" : "text-[9.5px] uppercase tracking-wider",
    tone,
    isExternal && "hover:bg-[var(--color-primary)] hover:text-white",
    className,
  );

  if (isExternal) {
    return (
      <a
        href={src.url}
        target="_blank"
        rel="noreferrer"
        className={baseClass}
        title={`${src.name} · fetched ${src.fetched_at}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <span className={baseClass} title={`${src.name} · ${src.sourceFile ?? "internal"} · fetched ${src.fetched_at}`}>
      {inner}
    </span>
  );
}
