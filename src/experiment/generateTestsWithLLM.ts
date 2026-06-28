import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createLLMClientFromEnv } from "../llm/clientFactory.js";
import type { GeneratedPrompt, LLMGeneration, PromptVariant } from "../types.js";

interface CliOptions {
  all?: boolean;
  limit?: number;
  packageName?: string;
  variant?: PromptVariant;
}

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const INPUT_FILE = path.join(RESULTS_DIR, "generated-prompts.json");
const OUTPUT_FILE = path.join(RESULTS_DIR, "llm-generations.json");

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const cliOptions = parseCliOptions(process.argv.slice(2));
  const prompts = await readGeneratedPrompts(INPUT_FILE);
  validateSafetyOptions(cliOptions);
  const selectedPrompts = applyFilters(prompts, cliOptions);
  const llmClient = createLLMClientFromEnv();
  const generations: LLMGeneration[] = [];

  for (const prompt of selectedPrompts) {
    const response = await llmClient.generate(prompt.promptText);

    generations.push({
      promptId: prompt.promptId,
      packageName: prompt.packageName,
      functionPath: prompt.functionPath,
      promptVariant: prompt.promptVariant,
      provider: response.provider,
      model: response.model,
      promptText: prompt.promptText,
      generatedText: response.text,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens,
      totalTokens: response.totalTokens,
      estimatedCost: response.estimatedCost,
      equivalentPaidCost: response.equivalentPaidCost,
      latencyMs: response.latencyMs,
      rawResponse: response.rawResponse,
      createdAt: new Date().toISOString()
    });
  }

  await writeFile(OUTPUT_FILE, `${JSON.stringify(generations, null, 2)}\n`, "utf8");

  console.log(`Read ${prompts.length} generated prompts from ${INPUT_FILE}`);
  console.log(`Selected ${selectedPrompts.length} prompts for generation.`);
  console.log(`Saved ${generations.length} LLM generations to ${OUTPUT_FILE}`);
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

function parseCliOptions(args: string[]): CliOptions {
  const options: CliOptions = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const nextArg = args[index + 1];

    if (arg === "--all") {
      options.all = true;
      continue;
    }

    if (arg === "--limit" && nextArg) {
      const limit = Number.parseInt(nextArg, 10);

      if (!Number.isFinite(limit) || limit < 1) {
        throw new Error("--limit must be a positive integer.");
      }

      options.limit = limit;
      index += 1;
      continue;
    }

    if (arg === "--package" && nextArg) {
      options.packageName = nextArg;
      index += 1;
      continue;
    }

    if (arg === "--variant" && nextArg) {
      if (!isPromptVariant(nextArg)) {
        throw new Error("--variant must be one of: signature-only, signature-and-body, full.");
      }

      options.variant = nextArg;
      index += 1;
      continue;
    }

    throw new Error(`Unknown or incomplete argument: ${arg}`);
  }

  return options;
}

function validateSafetyOptions(options: CliOptions): void {
  if (options.limit === undefined && !options.all) {
    throw new Error("Refusing to run all prompts without an explicit --limit or --all.");
  }

  if (options.limit !== undefined && options.all) {
    throw new Error("Use either --limit or --all, not both.");
  }
}

function applyFilters(prompts: GeneratedPrompt[], options: CliOptions): GeneratedPrompt[] {
  let selectedPrompts = prompts;

  if (options.packageName) {
    selectedPrompts = selectedPrompts.filter((prompt) => prompt.packageName === options.packageName);
  }

  if (options.variant) {
    selectedPrompts = selectedPrompts.filter((prompt) => prompt.promptVariant === options.variant);
  }

  if (options.limit !== undefined) {
    selectedPrompts = selectedPrompts.slice(0, options.limit);
  }

  return selectedPrompts;
}

function isPromptVariant(value: unknown): value is PromptVariant {
  return value === "signature-only" || value === "signature-and-body" || value === "full";
}

main().catch((error: unknown) => {
  console.error("Failed to generate tests with LLM.");
  console.error(error);
  process.exitCode = 1;
});
