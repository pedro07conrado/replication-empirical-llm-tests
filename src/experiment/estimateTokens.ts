import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { defaultModelName, getModelPricing } from "../config/models.js";
import { estimateTokensForPrompts } from "../metrics/tokenEstimator.js";
import type { GeneratedPrompt } from "../types.js";

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const INPUT_FILE = path.join(RESULTS_DIR, "generated-prompts.json");
const OUTPUT_FILE = path.join(RESULTS_DIR, "token-estimates.json");
const ESTIMATED_MAX_OUTPUT_TOKENS = 1_024;

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const prompts = await readGeneratedPrompts(INPUT_FILE);
  const modelPricing = getModelPricing(defaultModelName);
  const tokenEstimates = estimateTokensForPrompts(prompts, {
    modelPricing,
    estimatedMaxOutputTokens: ESTIMATED_MAX_OUTPUT_TOKENS
  });

  await writeFile(OUTPUT_FILE, `${JSON.stringify(tokenEstimates, null, 2)}\n`, "utf8");

  const totalEstimatedCost = tokenEstimates.reduce((total, estimate) => total + estimate.estimatedTotalCost, 0);

  console.log(`Read ${prompts.length} generated prompts from ${INPUT_FILE}`);
  console.log(`Estimated tokens using model ${modelPricing.modelName}.`);
  console.log(`Estimated max output tokens per prompt: ${ESTIMATED_MAX_OUTPUT_TOKENS}`);
  console.log(`Estimated total cost: $${totalEstimatedCost.toFixed(6)}`);
  console.log(`Saved token estimates to ${OUTPUT_FILE}`);
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

main().catch((error: unknown) => {
  console.error("Failed to estimate tokens.");
  console.error(error);
  process.exitCode = 1;
});
