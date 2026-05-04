import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "No matching records",
  description = "Clear filters or adjust your search.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-md border border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-8 text-center",
        className,
      )}
      role="status"
    >
      <SearchX className="size-6 text-[var(--color-ink-faint)]" aria-hidden />
      <div className="mt-2 text-[13px] font-semibold text-[var(--color-ink)]">{title}</div>
      <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
        {description}
      </p>
    </div>
  );
}
