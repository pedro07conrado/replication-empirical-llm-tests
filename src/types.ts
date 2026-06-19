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
  model: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
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
  modelName: string;
  estimatedInputTokens: number;
  estimatedMaxOutputTokens: number;
  estimatedTotalTokens: number;
  estimatedInputCost: number;
  estimatedOutputCost: number;
  estimatedTotalCost: number;
  createdAt: string;
}

export interface LLMGeneration {
  promptId: string;
  packageName: string;
  functionPath: string;
  promptVariant: PromptVariant;
  model: string;
  promptText: string;
  generatedText: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  latencyMs: number;
  createdAt: string;
}
