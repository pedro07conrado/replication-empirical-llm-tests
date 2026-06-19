import { defaultModelName } from "../config/models.js";
import type { LLMClient } from "../types.js";
import { MockLLMClient } from "./mockLLMClient.js";
import { OpenAIClient } from "./openAIClient.js";

const DEFAULT_MAX_OUTPUT_TOKENS = 1_024;

export function createLLMClientFromEnv(): LLMClient {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.LLM_MODEL ?? defaultModelName;
  const maxOutputTokens = parseInteger(process.env.LLM_MAX_OUTPUT_TOKENS) ?? DEFAULT_MAX_OUTPUT_TOKENS;

  if (!apiKey) {
    return new MockLLMClient();
  }

  return new OpenAIClient({
    apiKey,
    model,
    maxOutputTokens
  });
}

function parseInteger(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}
