import { defaultGeminiModelName, defaultModelName } from "../config/models.js";
import type { LLMClient, LLMProvider } from "../types.js";
import { GeminiClient } from "./geminiClient.js";
import { MockLLMClient } from "./mockLLMClient.js";
import { OpenAIClient } from "./openAIClient.js";

const DEFAULT_MAX_OUTPUT_TOKENS = 1_024;

export function createLLMClientFromEnv(): LLMClient {
  const provider = parseProvider(process.env.LLM_PROVIDER);
  const openAIApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const maxOutputTokens = parseInteger(process.env.LLM_MAX_OUTPUT_TOKENS) ?? DEFAULT_MAX_OUTPUT_TOKENS;

  if (provider === "gemini") {
    return geminiApiKey
      ? new GeminiClient({
        apiKey: geminiApiKey,
        model: process.env.LLM_MODEL ?? defaultGeminiModelName,
        maxOutputTokens,
        freeTier: parseBoolean(process.env.GEMINI_FREE_TIER) ?? true
      })
      : new MockLLMClient();
  }

  if (provider === "openai") {
    return openAIApiKey
      ? new OpenAIClient({
        apiKey: openAIApiKey,
        model: process.env.LLM_MODEL ?? defaultModelName,
        maxOutputTokens
      })
      : new MockLLMClient();
  }

  if (provider === "mock") {
    return new MockLLMClient();
  }

  if (geminiApiKey) {
    return new GeminiClient({
      apiKey: geminiApiKey,
      model: process.env.LLM_MODEL ?? defaultGeminiModelName,
      maxOutputTokens,
      freeTier: parseBoolean(process.env.GEMINI_FREE_TIER) ?? true
    });
  }

  if (openAIApiKey) {
    return new OpenAIClient({
      apiKey: openAIApiKey,
      model: process.env.LLM_MODEL ?? defaultModelName,
      maxOutputTokens
    });
  }

  return new MockLLMClient();
}

function parseProvider(value: string | undefined): LLMProvider | undefined {
  if (!value) {
    return undefined;
  }

  const normalizedProvider = value.toLowerCase();

  if (normalizedProvider === "gemini" || normalizedProvider === "openai" || normalizedProvider === "mock") {
    return normalizedProvider;
  }

  throw new Error("LLM_PROVIDER must be one of: gemini, openai, mock.");
}

function parseInteger(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.toLowerCase();

  if (normalizedValue === "true" || normalizedValue === "1" || normalizedValue === "yes") {
    return true;
  }

  if (normalizedValue === "false" || normalizedValue === "0" || normalizedValue === "no") {
    return false;
  }

  throw new Error("GEMINI_FREE_TIER must be true or false.");
}
