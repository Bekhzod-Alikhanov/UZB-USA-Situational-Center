"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useTranslations } from "next-intl";
import { useSettings } from "@/lib/store/settings";
import { AlertCircle, Loader2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTION_KEYS = ["trade", "navoi", "visits", "ofac", "caucus"] as const;

export function AssistantChatCore() {
  const aiEnabled = useSettings((s) => s.aiEnabled);
  const t = useTranslations("assistant");
  const tChat = useTranslations("assistant.chat");

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
        <h3 className="serif text-[18px] font-medium text-[var(--color-ink)]">{tChat("disabledTitle")}</h3>
        <p className="max-w-md text-[13px] text-[var(--color-ink-muted)]">{tChat("disabledDescription")}</p>
      </div>
    );
  }

  return (
    <div className="flex h-[640px] flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[var(--color-primary)]" />
          <span className="text-[13px] font-semibold text-[var(--color-ink)]">{tChat("title")}</span>
        </div>
        <span className="mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">sonnet-4-6</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-[13px] text-[var(--color-ink-muted)]">{tChat("intro")}</p>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                {tChat("suggestionsLabel")}
              </span>
              {SUGGESTION_KEYS.map((key) => {
                const suggestion = tChat(`suggestions.${key}`);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSend(suggestion)}
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-left text-[12.5px] text-[var(--color-ink)] transition hover:border-[var(--color-border-strong)]"
                  >
                    {suggestion}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((message) => {
              const text = message.parts
                .filter((part): part is { type: "text"; text: string } => part.type === "text")
                .map((part) => part.text)
                .join("");
              return (
                <li
                  key={message.id}
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed",
                    message.role === "user"
                      ? "ml-auto bg-[var(--color-primary)] text-white"
                      : "mr-auto bg-[var(--color-bg)] text-[var(--color-ink)]",
                  )}
                >
                  <pre className="whitespace-pre-wrap font-sans">
                    {text || (isStreaming && message.role === "assistant" ? "..." : "")}
                  </pre>
                </li>
              );
            })}
          </ul>
        )}
        {error
          ? (() => {
              const raw = error.message ?? "";
              const isKeyMissing = /ANTHROPIC_API_KEY|ASSISTANT_ENABLED|disabled/i.test(raw) || /\b503\b/.test(raw);
              return (
                <div className="mt-3 flex items-start gap-2 rounded-md border border-[var(--color-warn)]/30 bg-[var(--color-warn-soft)] px-3 py-2 text-[12px] text-[var(--color-ink)]">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-[var(--color-warn)]" />
                  {isKeyMissing ? (
                    <span>
                      {tChat("unavailable", {
                        assistantEnabled: "ASSISTANT_ENABLED=true",
                        anthropicKey: "ANTHROPIC_API_KEY",
                      })}
                    </span>
                  ) : (
                    <span>{raw || tChat("requestFailed")}</span>
                  )}
                </div>
              );
            })()
          : null}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2 border-t border-[var(--color-border)] p-3"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t("placeholder")}
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
            {tChat("stop")}
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-2 text-[12px] font-medium text-white disabled:opacity-50"
          >
            <Send className="size-3.5" />
            {t("send")}
          </button>
        )}
      </form>
    </div>
  );
}
