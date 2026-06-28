import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { extractRunIdArg, resolveRunPaths, writeJsonArtifact } from "./runManager.js";
import { materializeGeneratedTests } from "../test-materialization/testMaterializer.js";
import type { LLMGeneration, LLMProvider, PromptVariant } from "../types.js";

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const GENERATED_TESTS_DIR = path.resolve(process.cwd(), "generated-tests");
const INPUT_FILE = path.join(RESULTS_DIR, "llm-generations.json");
const OUTPUT_FILE = path.join(RESULTS_DIR, "materialized-tests.json");

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const { runId, remainingArgs } = extractRunIdArg(process.argv.slice(2));

  if (remainingArgs.length > 0) {
    throw new Error(`Unknown argument for materialize:tests: ${remainingArgs[0]}`);
  }

  const inputRunPaths = runId ? await resolveRunPaths(RESULTS_DIR, runId) : undefined;
  const inputFile = inputRunPaths ? path.join(inputRunPaths.runDir, "llm-generations.json") : INPUT_FILE;
  const generations = await readLLMGenerations(inputFile);
  const runPaths = inputRunPaths ?? await resolveRunPaths(RESULTS_DIR, undefined, getRunContext(generations));
  const materializedTests = await materializeGeneratedTests(generations, GENERATED_TESTS_DIR);

  await writeJsonArtifact(OUTPUT_FILE, runPaths.runDir, "materialized-tests.json", materializedTests);

  console.log(`Read ${generations.length} LLM generations from ${inputFile}`);
  console.log(`Materialized ${materializedTests.length} tests into ${GENERATED_TESTS_DIR}`);
  console.log(`Saved materialized test index to ${OUTPUT_FILE}`);
  console.log(`Preserved run artifacts in ${runPaths.runDir}`);
  console.log(`Run ID: ${runPaths.runId}`);
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
  return value === "mock" || value === "openai" || value === "gemini" || value === "ollama";
}

function getRunContext(generations: LLMGeneration[]): {
  provider?: string;
  model?: string;
  packageName?: string;
  variant?: string;
} {
  return {
    provider: getSingleOrMixed(generations.map((generation) => generation.provider)),
    model: getSingleOrMixed(generations.map((generation) => generation.model)),
    packageName: getSingleOrMixed(generations.map((generation) => generation.packageName)),
    variant: getSingleOrMixed(generations.map((generation) => generation.promptVariant))
  };
}

function getSingleOrMixed(values: string[]): string | undefined {
  if (values.length === 0) {
    return undefined;
  }

  const uniqueValues = [...new Set(values)].sort();
  return uniqueValues.length === 1 ? uniqueValues[0] : "mixed";
}

main().catch((error: unknown) => {
  console.error("Failed to materialize generated tests.");
  console.error(error);
  process.exitCode = 1;
});
