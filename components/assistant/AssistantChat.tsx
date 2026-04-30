"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useSettings } from "@/lib/store/settings";
import { AlertCircle, Loader2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What is the 2025 U.S.–Uzbekistan trade turnover?",
  "Which U.S. companies have investment projects in Navoi region?",
  "Summarize the upcoming visits in the next 90 days.",
  "What is Uzbekistan's OFAC status as of today?",
  "Who co-chairs the Uzbekistan Caucus in Congress?",
];

/**
 * AI assistant chat surface.
 *
 * Uses @ai-sdk/react v3 useChat hook with the Vercel AI SDK v6 UI message
 * stream protocol. Manages input state locally; useChat handles the
 * messages, status, and streaming automatically.
 *
 * Gated by `useSettings.aiEnabled` — when disabled, renders a friendly
 * empty-state instead of the chat surface. The /api/chat route additionally
 * gates on `ANTHROPIC_API_KEY` server-side and returns 503 if unset.
 */
export function AssistantChat() {
  const aiEnabled = useSettings((s) => s.aiEnabled);

  // useChat owns the messages array and streaming lifecycle.
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages or while streaming
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const isStreaming = status === "submitted" || status === "streaming";

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    void sendMessage({ text: trimmed });
    setInput("");
  }

  if (!aiEnabled) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
        <Sparkles className="size-8 text-[var(--color-ink-faint)]" />
        <h3 className="serif text-[18px] font-medium text-[var(--color-ink)]">AI assistant is disabled</h3>
        <p className="max-w-md text-[13px] text-[var(--color-ink-muted)]">
          Enable it in Admin → AI assistant toggle.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[640px] flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[var(--color-primary)]" />
          <span className="text-[13px] font-semibold text-[var(--color-ink)]">Claude — Center Assistant</span>
        </div>
        <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
          sonnet-4-6
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-[13px] text-[var(--color-ink-muted)]">
              Ask me anything about the bilateral portfolio. I have up-to-date context on trade, investments, visits,
              agreements, commitments, grants, counterparts, compliance, and news.
            </p>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                Suggestions
              </span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSend(s)}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-left text-[12.5px] text-[var(--color-ink)] transition hover:border-[var(--color-border-strong)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((m) => {
              // UIMessage stores content in `parts` (text, tool calls, etc.).
              // For a plain chat we only render the concatenated text parts.
              const text = m.parts
                .filter((p): p is { type: "text"; text: string } => p.type === "text")
                .map((p) => p.text)
                .join("");
              return (
                <li
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-[var(--color-primary)] text-white"
                      : "mr-auto bg-[var(--color-bg)] text-[var(--color-ink)]",
                  )}
                >
                  <pre className="whitespace-pre-wrap font-sans">
                    {text || (isStreaming && m.role === "assistant" ? "…" : "")}
                  </pre>
                </li>
              );
            })}
          </ul>
        )}
        {error ? (
          (() => {
            const raw = error.message ?? "";
            // Detect the server-side 503 "key missing" signal so we can show
            // a friendly explanation instead of a raw stack message.
            const isKeyMissing = /ANTHROPIC_API_KEY/i.test(raw) || /\b503\b/.test(raw);
            return (
              <div className="mt-3 flex items-start gap-2 rounded-md border border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] px-3 py-2 text-[12px] text-[var(--color-ink)]">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-[var(--color-warn)]" />
                {isKeyMissing ? (
                  <span>
                    AI assistant unavailable — server key not configured. Set{" "}
                    <code className="mono rounded bg-[var(--color-surface-2)] px-1">ANTHROPIC_API_KEY</code> in
                    Vercel → Project Settings → Environment Variables, then redeploy. Demo and analytics modules
                    work without the assistant.
                  </span>
                ) : (
                  <span>{raw || "Request failed."}</span>
                )}
              </div>
            );
          })()
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2 border-t border-[var(--color-border)] p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a project, visit, commitment, partner…"
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[13px] outline-none focus:border-[var(--color-primary)]"
          disabled={isStreaming}
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={() => stop()}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[12px] font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-2)]"
          >
            <Loader2 className="size-3.5 animate-spin" />
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-2 text-[12px] font-medium text-white disabled:opacity-50"
          >
            <Send className="size-3.5" />
            Send
          </button>
        )}
      </form>
    </div>
  );
}
