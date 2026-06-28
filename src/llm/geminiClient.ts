import { GoogleGenAI } from "@google/genai";
import { defaultGeminiModelName, findModelPricing } from "../config/models.js";
import { calculateEstimatedCost, estimateTokensFromText } from "../metrics/tokenEstimator.js";
import type { LLMClient, LLMResponse, ModelPricing } from "../types.js";

interface GeminiClientOptions {
  apiKey: string;
  model?: string;
  maxOutputTokens?: number;
  freeTier?: boolean;
}

interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

const DEFAULT_MAX_OUTPUT_TOKENS = 1_024;

export class GeminiClient implements LLMClient {
  private readonly ai: GoogleGenAI;
  private readonly model: string;
  private readonly maxOutputTokens: number;
  private readonly freeTier: boolean;
  private readonly modelPricing?: ModelPricing;

  constructor(options: GeminiClientOptions) {
    this.ai = new GoogleGenAI({ apiKey: options.apiKey });
    this.model = options.model ?? defaultGeminiModelName;
    this.maxOutputTokens = options.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS;
    this.freeTier = options.freeTier ?? true;
    this.modelPricing = findModelPricing(this.model);
  }

  async generate(prompt: string): Promise<LLMResponse> {
    const startedAt = Date.now();
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        maxOutputTokens: this.maxOutputTokens,
        temperature: 0
      }
    });
    const latencyMs = Date.now() - startedAt;
    const text = response.text ?? "";
    const usageMetadata = response.usageMetadata as GeminiUsageMetadata | undefined;
    const inputTokens = usageMetadata?.promptTokenCount ?? estimateTokensFromText(prompt);
    const outputTokens = usageMetadata?.candidatesTokenCount ?? estimateTokensFromText(text);
    const totalTokens = usageMetadata?.totalTokenCount ?? inputTokens + outputTokens;
    const equivalentPaidCost = this.modelPricing
      ? calculateEstimatedCost(inputTokens, outputTokens, this.modelPricing)
      : undefined;

    return {
      text,
      provider: "gemini",
      model: response.modelVersion ?? this.model,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCost: this.freeTier ? 0 : equivalentPaidCost ?? 0,
      equivalentPaidCost,
      latencyMs,
      rawResponse: toRawResponse(response, text)
    };
  }
}

function toRawResponse(response: unknown, text: string): unknown {
  if (!isRecord(response)) {
    return response;
  }

  return {
    text,
    candidates: response.candidates,
    createTime: response.createTime,
    modelVersion: response.modelVersion,
    promptFeedback: response.promptFeedback,
    responseId: response.responseId,
    usageMetadata: response.usageMetadata
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}
