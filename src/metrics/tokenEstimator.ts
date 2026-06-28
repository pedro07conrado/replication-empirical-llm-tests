import type { GeneratedPrompt, LLMProvider, ModelPricing, TokenEstimate } from "../types.js";

const CHARACTERS_PER_TOKEN = 4;

interface TokenEstimateOptions {
  provider: LLMProvider;
  modelName: string;
  modelPricing?: ModelPricing;
  estimatedMaxOutputTokens: number;
  freeTier?: boolean;
  createdAt?: string;
}

export function estimateTokensForPrompts(
  prompts: GeneratedPrompt[],
  options: TokenEstimateOptions
): TokenEstimate[] {
  const createdAt = options.createdAt ?? new Date().toISOString();

  return prompts.map((prompt) => {
    const estimatedInputTokens = estimateTokensFromText(prompt.promptText);
    const estimatedMaxOutputTokens = options.estimatedMaxOutputTokens;
    const estimatedInputCost = options.modelPricing
      ? calculateInputCost(estimatedInputTokens, options.modelPricing)
      : 0;
    const estimatedOutputCost = options.modelPricing
      ? calculateOutputCost(estimatedMaxOutputTokens, options.modelPricing)
      : 0;
    const equivalentPaidCost = options.modelPricing
      ? roundCost(estimatedInputCost + estimatedOutputCost)
      : undefined;
    const estimatedTotalCost = options.freeTier ? 0 : equivalentPaidCost ?? 0;

    return {
      promptId: prompt.promptId,
      packageName: prompt.packageName,
      functionPath: prompt.functionPath,
      promptVariant: prompt.promptVariant,
      provider: options.provider,
      modelName: options.modelName,
      estimatedInputTokens,
      estimatedMaxOutputTokens,
      estimatedTotalTokens: estimatedInputTokens + estimatedMaxOutputTokens,
      estimatedInputCost,
      estimatedOutputCost,
      estimatedTotalCost,
      equivalentPaidCost,
      createdAt
    };
  });
}

export function estimateTokensFromText(text: string): number {
  return Math.ceil(text.length / CHARACTERS_PER_TOKEN);
}

export function calculateEstimatedCost(
  inputTokens: number,
  outputTokens: number,
  modelPricing: ModelPricing
): number {
  const inputCost = calculateInputCost(inputTokens, modelPricing);
  const outputCost = calculateOutputCost(outputTokens, modelPricing);

  return roundCost(inputCost + outputCost);
}

function calculateInputCost(inputTokens: number, modelPricing: ModelPricing): number {
  return roundCost((inputTokens / 1_000_000) * modelPricing.inputCostPer1MTokens);
}

function calculateOutputCost(outputTokens: number, modelPricing: ModelPricing): number {
  return roundCost((outputTokens / 1_000_000) * modelPricing.outputCostPer1MTokens);
}

function roundCost(cost: number): number {
  return Number(cost.toFixed(8));
}
