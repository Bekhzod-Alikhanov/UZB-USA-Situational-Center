import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "pos" | "warn" | "neg" | "primary" | "demo";

export function Pill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pill",
        tone === "pos" && "pill-pos",
        tone === "warn" && "pill-warn",
        tone === "neg" && "pill-neg",
        tone === "primary" && "pill-primary",
        tone === "demo" && "pill-demo",
        className,
      )}
    >
      {children}
    </span>
  );
}
