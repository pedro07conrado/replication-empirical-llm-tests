import { estimateTokensFromText } from "../metrics/tokenEstimator.js";
import type { LLMClient, LLMResponse } from "../types.js";

interface OllamaClientOptions {
  baseUrl?: string;
  model?: string;
  maxOutputTokens?: number;
}

interface OllamaGenerateResponse {
  model?: string;
  response?: string;
  done?: boolean;
  total_duration?: number;
  prompt_eval_count?: number;
  eval_count?: number;
  error?: string;
}

const DEFAULT_BASE_URL = "http://localhost:11434";
const DEFAULT_MODEL = "qwen2.5-coder:3b";
const DEFAULT_MAX_OUTPUT_TOKENS = 2_048;

export class OllamaClient implements LLMClient {
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly maxOutputTokens: number;

  constructor(options: OllamaClientOptions = {}) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl ?? DEFAULT_BASE_URL);
    this.model = options.model ?? DEFAULT_MODEL;
    this.maxOutputTokens = options.maxOutputTokens ?? DEFAULT_MAX_OUTPUT_TOKENS;
  }

  async generate(prompt: string): Promise<LLMResponse> {
    const startedAt = Date.now();
    const response = await this.callGenerate(prompt);
    const text = response.response ?? "";
    const inputTokens = response.prompt_eval_count ?? estimateTokensFromText(prompt);
    const outputTokens = response.eval_count ?? estimateTokensFromText(text);
    const totalTokens = inputTokens + outputTokens;
    const latencyMs = response.total_duration
      ? Math.round(response.total_duration / 1_000_000)
      : Date.now() - startedAt;

    return {
      text,
      provider: "ollama",
      model: response.model ?? this.model,
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCost: 0,
      equivalentPaidCost: 0,
      latencyMs,
      rawResponse: response
    };
  }

  private async callGenerate(prompt: string): Promise<OllamaGenerateResponse> {
    let httpResponse: Response;

    try {
      httpResponse = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: 0,
            num_predict: this.maxOutputTokens
          }
        })
      });
    } catch (error) {
      throw new Error(
        `Could not connect to Ollama at ${this.baseUrl}. Start the Ollama app or run "ollama serve", then retry. Original error: ${getErrorMessage(error)}`
      );
    }

    const rawResponse: unknown = await httpResponse.json().catch(() => ({}));

    if (!httpResponse.ok) {
      const responseError = getOllamaErrorMessage(rawResponse);

      if (/model.*not found|not found|pull/i.test(responseError)) {
        throw new Error(
          `Ollama model "${this.model}" is not available. Run "ollama pull ${this.model}" and retry. Original response: ${responseError}`
        );
      }

      throw new Error(`Ollama API request failed with status ${httpResponse.status}: ${responseError}`);
    }

    return rawResponse as OllamaGenerateResponse;
  }
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/g, "");
}

function getOllamaErrorMessage(rawResponse: unknown): string {
  if (isRecord(rawResponse) && typeof rawResponse.error === "string") {
    return rawResponse.error;
  }

  return JSON.stringify(rawResponse);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}
