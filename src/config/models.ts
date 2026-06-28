import type { ModelPricing } from "../types.js";

export const modelPricingTable: ModelPricing[] = [
  {
    modelName: "gpt-4.1-mini",
    inputCostPer1MTokens: 0.4,
    outputCostPer1MTokens: 1.6
  },
  {
    modelName: "gpt-4.1",
    inputCostPer1MTokens: 2,
    outputCostPer1MTokens: 8
  },
  {
    modelName: "gemini-2.5-flash",
    inputCostPer1MTokens: 0.3,
    outputCostPer1MTokens: 2.5
  },
  {
    modelName: "gemini-2.0-flash",
    inputCostPer1MTokens: 0.1,
    outputCostPer1MTokens: 0.4
  }
];

export const defaultModelName = "gpt-4.1-mini";
export const defaultGeminiModelName = "gemini-2.5-flash";

export function getModelPricing(modelName: string): ModelPricing {
  const modelPricing = modelPricingTable.find((model) => model.modelName === modelName);

  if (!modelPricing) {
    throw new Error(`Model pricing not configured for model: ${modelName}`);
  }

  return modelPricing;
}

export function findModelPricing(modelName: string): ModelPricing | undefined {
  return modelPricingTable.find((model) => model.modelName === modelName);
}
