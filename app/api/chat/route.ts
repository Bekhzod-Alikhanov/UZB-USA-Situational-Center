import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type CoreMessage } from "ai";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export const runtime = "nodejs";

const MODEL_MAP: Record<string, string> = {
  "claude-sonnet-4-6": "claude-sonnet-4-5-20250929",
  "claude-opus-4-7": "claude-opus-4-5-20250929",
};

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured on the server." }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  const { messages, model } = (await req.json()) as {
    messages: CoreMessage[];
    model?: string;
  };

  const modelId = MODEL_MAP[model ?? "claude-sonnet-4-6"] ?? MODEL_MAP["claude-sonnet-4-6"];

  const systemPrompt = buildSystemPrompt();

  try {
    const result = streamText({
      model: anthropic(modelId),
      system: systemPrompt,
      messages,
      temperature: 0.3,
      providerOptions: {
        anthropic: {
          cacheControl: { type: "ephemeral" },
        },
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
