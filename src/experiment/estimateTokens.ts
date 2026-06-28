import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultGeminiModelName, defaultModelName, findModelPricing } from "../config/models.js";
import { estimateTokensForPrompts } from "../metrics/tokenEstimator.js";
import type { GeneratedPrompt, LLMProvider } from "../types.js";

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const INPUT_FILE = path.join(RESULTS_DIR, "generated-prompts.json");
const OUTPUT_FILE = path.join(RESULTS_DIR, "token-estimates.json");
const DEFAULT_ESTIMATED_MAX_OUTPUT_TOKENS = 1_024;

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const prompts = await readGeneratedPrompts(INPUT_FILE);
  const estimateConfig = readEstimateConfigFromEnv();
  const modelPricing = findModelPricing(estimateConfig.modelName);
  const tokenEstimates = estimateTokensForPrompts(prompts, {
    provider: estimateConfig.provider,
    modelName: estimateConfig.modelName,
    modelPricing,
    estimatedMaxOutputTokens: estimateConfig.estimatedMaxOutputTokens,
    freeTier: estimateConfig.freeTier
  });

  await writeFile(OUTPUT_FILE, `${JSON.stringify(tokenEstimates, null, 2)}\n`, "utf8");

  const totalEstimatedRealCost = tokenEstimates.reduce((total, estimate) => total + estimate.estimatedTotalCost, 0);
  const totalEquivalentPaidCost = tokenEstimates.reduce(
    (total, estimate) => total + (estimate.equivalentPaidCost ?? 0),
    0
  );

  console.log(`Read ${prompts.length} generated prompts from ${INPUT_FILE}`);
  console.log(`Provider: ${estimateConfig.provider}`);
  console.log(`Model: ${estimateConfig.modelName}`);
  console.log(`Max output tokens per prompt: ${estimateConfig.estimatedMaxOutputTokens}`);
  console.log(`Estimated real cost: $${totalEstimatedRealCost.toFixed(6)}`);
  console.log(`Estimated equivalent paid cost: $${totalEquivalentPaidCost.toFixed(6)}`);
  if (!modelPricing) {
    console.log("No pricing table entry was found for this model; cost estimates defaulted to $0.");
  }
  console.log(`Saved token estimates to ${OUTPUT_FILE}`);
}

function readEstimateConfigFromEnv(): {
  provider: LLMProvider;
  modelName: string;
  estimatedMaxOutputTokens: number;
  freeTier: boolean;
} {
  const provider = parseProvider(process.env.LLM_PROVIDER) ?? "openai";
  const modelName = process.env.LLM_MODEL ?? getDefaultModelForProvider(provider);
  const estimatedMaxOutputTokens = parsePositiveInteger(process.env.LLM_MAX_OUTPUT_TOKENS)
    ?? DEFAULT_ESTIMATED_MAX_OUTPUT_TOKENS;
  const freeTier = provider === "gemini" && (parseBoolean(process.env.GEMINI_FREE_TIER) ?? false);

  return {
    provider,
    modelName,
    estimatedMaxOutputTokens,
    freeTier
  };
}

function getDefaultModelForProvider(provider: LLMProvider): string {
  if (provider === "gemini") {
    return defaultGeminiModelName;
  }

  return defaultModelName;
}

async function readGeneratedPrompts(filePath: string): Promise<GeneratedPrompt[]> {
  const fileContents = await readFile(filePath, "utf8");
  const parsedContents: unknown = JSON.parse(fileContents);

  if (!Array.isArray(parsedContents)) {
    throw new Error(`Expected ${filePath} to contain an array of generated prompts.`);
  }

  return parsedContents.map(validateGeneratedPrompt);
}

function validateGeneratedPrompt(record: unknown, index: number): GeneratedPrompt {
  if (!record || typeof record !== "object") {
    throw new Error(`Invalid generated prompt at index ${index}.`);
  }

  const generatedPrompt = record as Partial<GeneratedPrompt>;

  if (
    typeof generatedPrompt.promptId !== "string" ||
    typeof generatedPrompt.packageName !== "string" ||
    typeof generatedPrompt.functionPath !== "string" ||
    typeof generatedPrompt.promptText !== "string" ||
    typeof generatedPrompt.createdAt !== "string" ||
    !isPromptVariant(generatedPrompt.promptVariant)
  ) {
    throw new Error(`Invalid generated prompt fields at index ${index}.`);
  }

  return generatedPrompt as GeneratedPrompt;
}

function isPromptVariant(value: unknown): value is GeneratedPrompt["promptVariant"] {
  return value === "signature-only" || value === "signature-and-body" || value === "full";
}

function parseProvider(value: string | undefined): LLMProvider | undefined {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.toLowerCase();

  if (normalizedValue === "mock" || normalizedValue === "openai" || normalizedValue === "gemini") {
    return normalizedValue;
  }

  throw new Error("LLM_PROVIDER must be one of: mock, openai, gemini.");
}

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    throw new Error("LLM_MAX_OUTPUT_TOKENS must be a positive integer.");
  }

  return parsedValue;
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

main().catch((error: unknown) => {
  console.error("Failed to estimate tokens.");
  console.error(error);
  process.exitCode = 1;
});
