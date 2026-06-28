import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { materializeGeneratedTests } from "../test-materialization/testMaterializer.js";
import type { LLMGeneration, LLMProvider, PromptVariant } from "../types.js";

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const GENERATED_TESTS_DIR = path.resolve(process.cwd(), "generated-tests");
const INPUT_FILE = path.join(RESULTS_DIR, "llm-generations.json");
const OUTPUT_FILE = path.join(RESULTS_DIR, "materialized-tests.json");

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const generations = await readLLMGenerations(INPUT_FILE);
  const materializedTests = await materializeGeneratedTests(generations, GENERATED_TESTS_DIR);

  await writeFile(OUTPUT_FILE, `${JSON.stringify(materializedTests, null, 2)}\n`, "utf8");

  console.log(`Read ${generations.length} LLM generations from ${INPUT_FILE}`);
  console.log(`Materialized ${materializedTests.length} tests into ${GENERATED_TESTS_DIR}`);
  console.log(`Saved materialized test index to ${OUTPUT_FILE}`);
}

async function readLLMGenerations(filePath: string): Promise<LLMGeneration[]> {
  const fileContents = await readFile(filePath, "utf8");
  const parsedContents: unknown = JSON.parse(fileContents);

  if (!Array.isArray(parsedContents)) {
    throw new Error(`Expected ${filePath} to contain an array of LLM generations.`);
  }

  return parsedContents.map(validateLLMGeneration);
}

function validateLLMGeneration(record: unknown, index: number): LLMGeneration {
  if (!record || typeof record !== "object") {
    throw new Error(`Invalid LLM generation at index ${index}.`);
  }

  const generation = record as Partial<LLMGeneration>;

  if (
    typeof generation.promptId !== "string" ||
    typeof generation.packageName !== "string" ||
    typeof generation.functionPath !== "string" ||
    !isPromptVariant(generation.promptVariant) ||
    !isProvider(generation.provider) ||
    typeof generation.model !== "string" ||
    typeof generation.generatedText !== "string"
  ) {
    throw new Error(`Invalid LLM generation fields at index ${index}.`);
  }

  return generation as LLMGeneration;
}

function isPromptVariant(value: unknown): value is PromptVariant {
  return value === "signature-only" || value === "signature-and-body" || value === "full";
}

function isProvider(value: unknown): value is LLMProvider {
  return value === "mock" || value === "openai" || value === "gemini";
}

main().catch((error: unknown) => {
  console.error("Failed to materialize generated tests.");
  console.error(error);
  process.exitCode = 1;
});
