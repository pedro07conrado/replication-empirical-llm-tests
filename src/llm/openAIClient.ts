import { defaultModelName, findModelPricing } from "../config/models.js";
import { calculateEstimatedCost, estimateTokensFromText } from "../metrics/tokenEstimator.js";
import type { LLMClient, LLMResponse, ModelPricing } from "../types.js";

interface OpenAIClientOptions {
  apiKey: string;
  model?: string;
  maxOutputTokens?: number;
}

interface OpenAIUsage {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  prompt_tokens?: number;
  completion_tokens?: number;
}

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MAX_OUTPUT_TOKENS = 1_024;

export class OpenAIClient implements LLMClient {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly maxOutputTokens: number;
  private readonly modelPricing?: ModelPricing;

  constructor(options: OpenAIClientOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? defaultModelName;
    this.maxOutputTokens = options.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS;
    this.modelPricing = findModelPricing(this.model);
  }

  async generate(prompt: string): Promise<LLMResponse> {
    const startedAt = Date.now();
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: this.model,
        input: prompt,
        max_output_tokens: this.maxOutputTokens,
        store: false
      })
    });
    const latencyMs = Date.now() - startedAt;
    const rawResponse: unknown = await response.json();

    if (!response.ok) {
      throw new Error(`OpenAI API request failed with status ${response.status}: ${JSON.stringify(rawResponse)}`);
    }

    const text = extractResponseText(rawResponse);
    const usage = extractUsage(rawResponse);
    const inputTokens = usage.input_tokens ?? usage.prompt_tokens ?? estimateTokensFromText(prompt);
    const outputTokens = usage.output_tokens ?? usage.completion_tokens ?? estimateTokensFromText(text);
    const totalTokens = usage.total_tokens ?? inputTokens + outputTokens;
    const estimatedCost = this.modelPricing
      ? calculateEstimatedCost(inputTokens, outputTokens, this.modelPricing)
      : 0;

    return {
      text,
      provider: "openai",
      model: extractModel(rawResponse) ?? this.model,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCost,
      latencyMs,
      rawResponse
    };
  }
}

function extractUsage(rawResponse: unknown): OpenAIUsage {
  if (!isRecord(rawResponse) || !isRecord(rawResponse.usage)) {
    return {};
  }

  return rawResponse.usage as OpenAIUsage;
}

function extractModel(rawResponse: unknown): string | undefined {
  if (!isRecord(rawResponse) || typeof rawResponse.model !== "string") {
    return undefined;
  }

  return rawResponse.model;
}

function extractResponseText(rawResponse: unknown): string {
  if (isRecord(rawResponse) && typeof rawResponse.output_text === "string") {
    return rawResponse.output_text;
  }

  if (!isRecord(rawResponse) || !Array.isArray(rawResponse.output)) {
    return "";
  }

  const textParts: string[] = [];

  for (const outputItem of rawResponse.output) {
    if (!isRecord(outputItem) || !Array.isArray(outputItem.content)) {
      continue;
    }

    for (const contentItem of outputItem.content) {
      if (!isRecord(contentItem)) {
        continue;
      }

      if (typeof contentItem.text === "string") {
        textParts.push(contentItem.text);
      } else if (typeof contentItem.refusal === "string") {
        textParts.push(contentItem.refusal);
      }
    }
  }

  return textParts.join("\n");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}
