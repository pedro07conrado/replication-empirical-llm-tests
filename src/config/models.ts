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
  }
];

export const defaultModelName = "gpt-4.1-mini";

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
