export interface TargetPackage {
  name: string;
}

export interface ApiFunctionRecord {
  packageName: string;
  functionPath: string;
  parameterCount: number;
  functionSignature?: string;
  functionBody?: string;
}

export interface SampleSummaryRecord {
  packageName: string;
  totalFunctions: number;
  sampledFunctions: number;
  samplePercentage: number;
}

export type PromptVariant = "signature-only" | "signature-and-body" | "full";

export type LLMProvider = "mock" | "openai" | "gemini";

export interface GeneratedPrompt {
  promptId: string;
  packageName: string;
  functionPath: string;
  promptVariant: PromptVariant;
  promptText: string;
  createdAt: string;
}

export interface ModelPricing {
  modelName: string;
  inputCostPer1MTokens: number;
  outputCostPer1MTokens: number;
}

export interface LLMResponse {
  text: string;
  provider: LLMProvider;
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  equivalentPaidCost?: number;
  latencyMs: number;
  rawResponse?: unknown;
}

export interface LLMClient {
  generate(prompt: string): Promise<LLMResponse>;
}

export interface TokenEstimate {
  promptId: string;
  packageName: string;
  functionPath: string;
  promptVariant: PromptVariant;
  provider: LLMProvider;
  modelName: string;
  estimatedInputTokens: number;
  estimatedMaxOutputTokens: number;
  estimatedTotalTokens: number;
  estimatedInputCost: number;
  estimatedOutputCost: number;
  estimatedTotalCost: number;
  equivalentPaidCost?: number;
  createdAt: string;
}

export interface LLMGeneration {
  promptId: string;
  packageName: string;
  functionPath: string;
  promptVariant: PromptVariant;
  provider: LLMProvider;
  model: string;
  promptText: string;
  generatedText: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  equivalentPaidCost?: number;
  latencyMs: number;
  rawResponse?: unknown;
  createdAt: string;
}
