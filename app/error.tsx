"use client";
import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex size-10 items-center justify-center rounded-full bg-[var(--color-neg-soft)]">
          <AlertTriangle className="size-5 text-[var(--color-neg)]" />
        </div>
        <div>
          <div className="serif text-[20px] font-medium tracking-tight text-[var(--color-ink)]">
            Something went wrong
          </div>
          <div className="mt-1 text-[13px] text-[var(--color-ink-muted)]">
            The page hit an unexpected error. You can retry without losing the rest of the session.
          </div>
        </div>
        {error.digest ? (
          <div className="mono rounded bg-[var(--color-surface-2)] px-2 py-1 text-[10.5px] text-[var(--color-ink-faint)]">
            digest: {error.digest}
          </div>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-[12.5px] font-medium text-white transition hover:bg-[var(--color-primary-2)]"
        >
          <RotateCw className="size-3.5" />
          Retry
        </button>
      </div>
    </div>
  );
}
