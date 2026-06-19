import type { GeneratedPrompt, ModelPricing, TokenEstimate } from "../types.js";

const CHARACTERS_PER_TOKEN = 4;

interface TokenEstimateOptions {
  modelPricing: ModelPricing;
  estimatedMaxOutputTokens: number;
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
    const estimatedInputCost = calculateInputCost(estimatedInputTokens, options.modelPricing);
    const estimatedOutputCost = calculateOutputCost(estimatedMaxOutputTokens, options.modelPricing);

    return {
      promptId: prompt.promptId,
      packageName: prompt.packageName,
      functionPath: prompt.functionPath,
      promptVariant: prompt.promptVariant,
      modelName: options.modelPricing.modelName,
      estimatedInputTokens,
      estimatedMaxOutputTokens,
      estimatedTotalTokens: estimatedInputTokens + estimatedMaxOutputTokens,
      estimatedInputCost,
      estimatedOutputCost,
      estimatedTotalCost: roundCost(estimatedInputCost + estimatedOutputCost),
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
