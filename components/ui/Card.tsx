import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card", className)}>{children}</div>;
}

export function CardHeader({
  title,
  sub,
  right,
  className,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card-header", className)}>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-[var(--color-ink)]">{title}</div>
        {sub ? <div className="mt-0.5 text-[11px] text-[var(--color-ink-muted)]">{sub}</div> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card-body", className)}>{children}</div>;
}
