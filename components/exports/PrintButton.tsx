"use client";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export function PrintButton({ label = "Print / Save as PDF", className }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn(
        "no-print inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]",
        className,
      )}
    >
      <Printer className="size-3.5" />
      {label}
    </button>
  );
}
