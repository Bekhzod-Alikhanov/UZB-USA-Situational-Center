"use client";
import { useState, useRef, useEffect } from "react";
import { useSettings } from "@/lib/store/settings";
import { Send, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What is the 2025 U.S.–Uzbekistan trade turnover?",
  "Which U.S. companies have investment projects in Navoi region?",
  "Summarize the upcoming visits in the next 90 days.",
  "What is Uzbekistan's OFAC status as of today?",
  "Who co-chairs the Uzbekistan Caucus in Congress?",
];

export function AssistantChat() {
  const aiEnabled = useSettings((s) => s.aiEnabled);
  const aiModel = useSettings((s) => s.aiModel);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          model: aiModel,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const assistantId = `a-${Date.now()}`;
      let assistantText = "";
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Vercel AI SDK data stream format: each line like `0:"text"` for text deltas.
        for (const line of chunk.split("\n")) {
          if (!line.trim()) continue;
          const colon = line.indexOf(":");
          if (colon === -1) continue;
          const type = line.slice(0, colon);
          const data = line.slice(colon + 1);
          if (type === "0") {
            try {
              const parsed = JSON.parse(data) as string;
              assistantText += parsed;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: assistantText } : m)),
              );
            } catch {
              /* ignore */
            }
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (!aiEnabled) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
        <Sparkles className="size-8 text-[var(--color-ink-faint)]" />
        <h3 className="serif text-[18px] font-medium text-[var(--color-ink)]">AI assistant is disabled</h3>
        <p className="max-w-md text-[13px] text-[var(--color-ink-muted)]">
          Enable it in Admin → AI assistant toggle. The Head of the Center can also pick between Sonnet 4.6 (default)
          and Opus 4.7.
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
          {aiModel === "claude-opus-4-7" ? "opus-4-7" : "sonnet-4-6"}
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
                  onClick={() => send(s)}
                  className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-left text-[12.5px] text-[var(--color-ink)] transition hover:border-[var(--color-border-strong)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-[var(--color-primary)] text-white"
                    : "mr-auto bg-[var(--color-bg)] text-[var(--color-ink)]",
                )}
              >
                <pre className="whitespace-pre-wrap font-sans">{m.content || (loading ? "…" : "")}</pre>
              </li>
            ))}
          </ul>
        )}
        {error ? (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-[var(--color-neg)]/30 bg-[var(--color-neg-soft)] px-3 py-2 text-[12px] text-[var(--color-neg)]">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-[var(--color-border)] p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a project, visit, commitment, partner…"
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[13px] outline-none focus:border-[var(--color-primary)]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-2 text-[12px] font-medium text-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
          {loading ? "Thinking…" : "Send"}
        </button>
      </form>
    </div>
  );
}
