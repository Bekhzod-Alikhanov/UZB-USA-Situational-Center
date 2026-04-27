import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export const runtime = "nodejs";

/**
 * Friendly model IDs surfaced in the Admin UI ("Sonnet 4.6" / "Opus 4.7")
 * mapped to current Anthropic model aliases. The keys are stable so the
 * client-side selector doesn't need updating when Anthropic ships newer
 * releases — only swap the values.
 *
 * Use bare aliases without date suffixes (per the Anthropic migration
 * guide); appending a date string returns 404.
 */
const MODEL_MAP: Record<string, string> = {
  "claude-sonnet-4-6": "claude-sonnet-4-6",
  "claude-opus-4-7": "claude-opus-4-7",
};

const DEFAULT_MODEL = "claude-sonnet-4-6";

interface ChatBody {
  /** UIMessage[] from `useChat` on the client. */
  messages: UIMessage[];
  /** Friendly model ID — must match a key of MODEL_MAP. */
  model?: string;
}

/**
 * Anthropic stream proxy for the /assistant page.
 *
 * - Validates `ANTHROPIC_API_KEY`; returns 503 with a JSON error if unset
 *   so the client can render the disabled-state UI gracefully.
 * - Converts UIMessage[] (client-side @ai-sdk/react representation) to
 *   ModelMessage[] (LLM-facing representation) via convertToModelMessages.
 * - Uses ephemeral prompt caching on the system prompt — saves tokens on
 *   repeated turns since the RAG-style context is large but stable.
 * - Returns the new v6 UI message stream (SSE-based, structured chunks)
 *   compatible with the client-side useChat hook.
 *
 * Note on temperature: Opus 4.7 fully removes `temperature` / `top_p` /
 * `top_k` (any of them returns 400). Sonnet 4.6 still accepts them, but
 * for parity across both friendly models we omit them and let the model
 * self-calibrate. Anthropic's migration guide explicitly notes that
 * `temperature: 0` never guaranteed identical outputs even on prior
 * models — determinism is best controlled via prompting.
 */
export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured on the server." }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const { messages, model } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages must be a non-empty UIMessage array." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const modelId = MODEL_MAP[model ?? DEFAULT_MODEL] ?? MODEL_MAP[DEFAULT_MODEL];

  try {
    const modelMessages = await convertToModelMessages(messages);
    const result = streamText({
      model: anthropic(modelId),
      system: buildSystemPrompt(),
      messages: modelMessages,
      providerOptions: {
        anthropic: {
          // Cache the system prompt across turns — the RAG context is
          // ~5–10k tokens but rarely changes within a session.
          cacheControl: { type: "ephemeral" },
        },
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
