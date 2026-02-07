import type { VercelRequest, VercelResponse } from "@vercel/node";

// Env:
// - OPENAI_API_KEY (required)
// - OPENAI_MODEL (optional, default: gpt-4o-mini)
// - OPENAI_BASE_URL (optional, default: https://api.openai.com/v1)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    return;
  }

  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const { prompt, options } = (req.body ?? {}) as {
    prompt?: string;
    options?: {
      temperature?: number;
      maxTokens?: number;
      model?: string;
      systemPrompt?: string;
    };
  };

  if (!prompt) {
    res.status(400).json({ error: "Missing prompt" });
    return;
  }

  const body: Record<string, unknown> = {
    model: options?.model ?? model,
    messages: [
      ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
      { role: "user", content: prompt.trim() },
    ],
    temperature: options?.temperature ?? 0.65,
    max_tokens: options?.maxTokens,
  };

  Object.keys(body).forEach((key) => {
    if (body[key] === undefined) {
      delete body[key];
    }
  });

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const payload = await response.json();
    if (!response.ok) {
      const detail = payload?.error?.message ?? JSON.stringify(payload);
      res.status(500).json({ error: `OpenAI API error: ${detail}` });
      return;
    }

    const message = payload?.choices?.[0]?.message?.content ?? "";
    res.status(200).json({
      success: true,
      data: {
        result: String(message).trim(),
        usage: payload?.usage ?? {},
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? String(err) });
  }
}
