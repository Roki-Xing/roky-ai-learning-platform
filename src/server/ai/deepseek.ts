import { env } from "@/lib/env";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type DeepSeekChatCompletionResponse = {
  id?: string;
  model?: string;
  choices?: Array<{
    index?: number;
    message?: { role?: string; content?: string | null };
    finish_reason?: string | null;
  }>;
  usage?: unknown;
};

export async function deepseekChatJsonObject(args: {
  messages: ChatMessage[];
  model?: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxTokens?: number;
}) {
  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured.");
  }

  const baseUrl = (args.baseUrl ?? env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com").replace(
    /\/$/,
    "",
  );
  const model = args.model ?? env.DEEPSEEK_MODEL ?? "deepseek-v4-flash";
  // v4-pro can be meaningfully slower than v4-flash. Use a safer default timeout
  // to avoid silently falling back to templates due to local abort timeouts.
  const timeoutMs = args.timeoutMs ?? (model.includes("v4-pro") ? 180_000 : 60_000);

  // DeepSeek JSON mode may occasionally return empty content; treat it as transient and retry once.
  // See: DeepSeek JSON Output docs (empty-content caveat).
  const maxAttempts = 2;

  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: args.messages,
          stream: false,
          // DeepSeek is OpenAI-compatible; JSON mode keeps parsing predictable.
          response_format: { type: "json_object" },
          temperature: 0.2,
          ...(args.maxTokens ? { max_tokens: args.maxTokens } : {}),
        }),
        signal: controller.signal,
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`DeepSeek API error (${res.status}): ${text.slice(0, 500)}`);
      }

      const data = JSON.parse(text) as DeepSeekChatCompletionResponse;
      const choice0 = data.choices?.[0] ?? null;
      const content = choice0?.message?.content ?? null;
      if (typeof content !== "string" || !content.trim()) {
        const finish = choice0?.finish_reason ?? null;
        throw new Error(
          `DeepSeek API returned empty message content (finish_reason=${finish ?? "unknown"}).`,
        );
      }

      return {
        model: data.model ?? model,
        usage: data.usage,
        content,
        raw: data,
      };
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      const shouldRetry =
        attempt < maxAttempts &&
        msg.includes("empty message content");
      if (!shouldRetry) throw e;
      // Small backoff to avoid immediate repeat under transient load.
      await new Promise((r) => setTimeout(r, 300 * attempt));
    } finally {
      clearTimeout(t);
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
