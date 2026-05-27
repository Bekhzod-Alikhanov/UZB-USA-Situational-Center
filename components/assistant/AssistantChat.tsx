"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AlertCircle, Sparkles } from "lucide-react";

/**
 * Deferred wrapper for the AI chat surface.
 *
 * Why: AssistantChatCore pulls in @ai-sdk/react + ai (~117 KB chunk, ~84 %
 * unused on first load per Lighthouse). Most users open /assistant just to
 * peek; only a fraction actually type. Loading the SDK eagerly on every
 * navigation is wasteful.
 *
 * How: render a static skeleton (header + sample suggestions + input shell)
 * server-side-friendly. The real AssistantChatCore is dynamically imported
 * on first user interaction with the page (pointerdown / keydown / focus on
 * the input) AND scheduled via requestIdleCallback as a background pre-warm
 * so the SDK is ready before the user finishes typing their first prompt.
 */
const HeavyCore = dynamic(() => import("./AssistantChatCore").then((m) => ({ default: m.AssistantChatCore })), {
  ssr: false,
  loading: () => <Skeleton armed />,
});

export function AssistantChat({ serverEnabled }: { serverEnabled: boolean }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // Arm strictly on first real user interaction with the document. The
    // earlier requestIdleCallback prewarm regressed /assistant Lighthouse
    // by 5 pts because the SDK chunk fetched mid-LCP-measurement window.
    // Cost of removing the prewarm: ~150 ms latency on the first user
    // interaction (chunk fetch starts when they hover/click).
    const arm = () => setArmed(true);
    const opts = { once: true } as AddEventListenerOptions;
    window.addEventListener("pointerdown", arm, opts);
    window.addEventListener("keydown", arm, opts);
    window.addEventListener("focusin", arm, opts);
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("focusin", arm);
    };
  }, []);

  if (!serverEnabled) return <UnavailableState />;
  if (armed) return <HeavyCore />;
  return <Skeleton />;
}

function UnavailableState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
      <AlertCircle className="size-8 text-[var(--color-warn)]" />
      <h2 className="serif text-[18px] font-medium text-[var(--color-ink)]">AI assistant is unavailable</h2>
      <p className="max-w-lg text-[13px] text-[var(--color-ink-muted)]">
        Set <code className="mono rounded bg-[var(--color-surface-2)] px-1">ASSISTANT_ENABLED=true</code> and{" "}
        <code className="mono rounded bg-[var(--color-surface-2)] px-1">ANTHROPIC_API_KEY</code> on the server to enable
        this page. The platform, exports, maps, charts, and data modules continue to work without AI.
      </p>
    </div>
  );
}

function Skeleton({ armed }: { armed?: boolean } = {}) {
  return (
    <div className="flex h-[640px] flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[var(--color-primary)]" />
          <span className="text-[13px] font-semibold text-[var(--color-ink)]">Claude — Center Assistant</span>
        </div>
        <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
          {armed ? "warming up…" : "ready"}
        </span>
      </div>
      <div className="flex-1 px-4 py-4">
        <p className="text-[13px] text-[var(--color-ink-muted)]">
          Ask me anything about the bilateral portfolio. I have up-to-date context on trade, investments, visits,
          agreements, commitments, grants, counterparts, compliance, and news.
        </p>
      </div>
      <div className="border-t border-[var(--color-border)] p-3">
        <div className="h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]" />
      </div>
    </div>
  );
}
