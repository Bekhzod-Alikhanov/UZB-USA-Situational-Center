import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export const runtime = "nodejs";

/**
 * Active Anthropic model — Sonnet 4.6 covers the assistant's Q&A workload
 * comfortably. Use the bare alias without a date suffix; per Anthropic's
 * migration guide, appending a dated variant returns 404.
 */
const MODEL_ID = "claude-sonnet-4-6";

interface ChatBody {
  /** UIMessage[] from `useChat` on the client. */
  messages: UIMessage[];
}

/**
 * Anthropic stream proxy for the /assistant page.
 *
 * - Returns 503 if `ANTHROPIC_API_KEY` is unset so the client can render
 *   the disabled-state UI gracefully.
 * - Converts UIMessage[] (client-side @ai-sdk/react representation) to
 *   ModelMessage[] via convertToModelMessages.
 * - Caches the system prompt ephemerally — the RAG context is ~5–10k
 *   tokens but rarely changes within a session.
 * - Returns the v6 UI message stream (SSE-based, structured chunks)
 *   compatible with the client-side useChat hook.
 *
 * No `temperature` / `top_p` / `top_k` — Sonnet 4.6 accepts them but we
 * let the model self-calibrate. Anthropic's migration guide notes that
 * `temperature: 0` never guaranteed identical outputs anyway; determinism
 * is best controlled via prompting.
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

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages must be a non-empty UIMessage array." }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  try {
    const modelMessages = await convertToModelMessages(body.messages);
    const result = streamText({
      model: anthropic(MODEL_ID),
      system: buildSystemPrompt(),
      messages: modelMessages,
      providerOptions: {
        anthropic: {
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
