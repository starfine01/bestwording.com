const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
const OPENAI_BASE_URL = (import.meta.env.VITE_OPENAI_BASE_URL as string | undefined) ?? "https://api.openai.com/v1";
const OPENAI_MODEL = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) ?? "gpt-4o-mini";
const AI_PROXY_PATH = "/api/ai";

export type CallAIOptions = {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  systemPrompt?: string;
};

type CallAIResponse = {
  success: true;
  data: {
    result: string;
    usage: Record<string, unknown>;
  };
};

export const callAI = async (prompt: string, options?: CallAIOptions): Promise<CallAIResponse> => {
  if (!OPENAI_API_KEY) {
    const response = await fetch(AI_PROXY_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, options }),
    });

    const payload = await response.json();
    if (!response.ok) {
      const detail = payload?.error ?? JSON.stringify(payload);
      throw new Error(`AI proxy error: ${detail}`);
    }

    return payload as CallAIResponse;
  }

  const body: Record<string, unknown> = {
    model: options?.model ?? OPENAI_MODEL,
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

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  if (!response.ok) {
    const detail = payload?.error?.message ?? JSON.stringify(payload);
    throw new Error(`OpenAI API error: ${detail}`);
  }

  const message = payload?.choices?.[0]?.message?.content ?? "";
  return {
    success: true,
    data: {
      result: String(message).trim(),
      usage: payload?.usage ?? {},
    },
  };
};

// 글 도우미 기능들
export const enhanceWriting = async (
  text: string,
  enhancementType: "expand" | "summarize" | "polish" | "analyze"
) => {
  let prompt = "";

  switch (enhancementType) {
    case "expand":
      prompt = `다음 텍스트를 더 풍부하게 확장해주세요: ${text}`;
      break;
    case "summarize":
      prompt = `다음 텍스트를 간결하게 요약해주세요: ${text}`;
      break;
    case "polish":
      prompt = `다음 텍스트를 더 자연스럽고 문법적으로 정확하게 다듬어주세요: ${text}`;
      break;
    case "analyze":
      prompt = `다음 텍스트의 주제, 톤, 스타일, 감정 등을 분석해주세요: ${text}`;
      break;
    default:
      prompt = `다음 텍스트를 개선해주세요: ${text}`;
  }

  return await callAI(prompt, { temperature: 0.7, maxTokens: 1024 });
};

// 텍스트 분석 기능
export const analyzeText = async (text: string) => {
  const prompt = `
    다음 텍스트를 분석해주세요:
    - 주제: 무엇에 관한 글인지
    - 톤: 글의 어조 (공식적, 캐주얼, 감정적 등)
    - 스타일: 글의 스타일 (서술형, 설득형, 설명형 등)
    - 감정: 전달되는 감정 (긍정, 부정, 중립 등)
    - 개선점: 개선할 수 있는 부분
    - 키워드: 핵심 키워드 5개

    텍스트: ${text}
  `;

  return await callAI(prompt, { temperature: 0.4, maxTokens: 700 });
};

// 창작 아이디어 생성
export const generateWritingIdeas = async (theme: string, count: number = 5) => {
  const prompt = `다음 주제에 대한 글쓰기 아이디어 ${count}개를 생성해주세요: ${theme}`;
  return await callAI(prompt, { temperature: 0.9, maxTokens: 400 });
};
