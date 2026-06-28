import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { executeMaterializedTests } from "../test-execution/testExecutor.js";
import type { LLMProvider, MaterializedTest, PromptVariant, TestExecutionResult } from "../types.js";

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const INPUT_FILE = path.join(RESULTS_DIR, "materialized-tests.json");
const RESULTS_OUTPUT_FILE = path.join(RESULTS_DIR, "test-execution-results.json");
const SUMMARY_OUTPUT_FILE = path.join(RESULTS_DIR, "test-execution-summary.csv");

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const materializedTests = await readMaterializedTests(INPUT_FILE);
  const executionResults = await executeMaterializedTests(materializedTests);

  await writeFile(RESULTS_OUTPUT_FILE, `${JSON.stringify(executionResults, null, 2)}\n`, "utf8");
  await writeFile(SUMMARY_OUTPUT_FILE, toSummaryCsv(executionResults), "utf8");

  const passedCount = executionResults.filter((result) => result.passed).length;
  const failedCount = executionResults.length - passedCount;

  console.log(`Read ${materializedTests.length} materialized tests from ${INPUT_FILE}`);
  console.log(`Executed ${executionResults.length} tests: ${passedCount} passed, ${failedCount} failed.`);
  console.log(`Saved execution results to ${RESULTS_OUTPUT_FILE}`);
  console.log(`Saved execution summary to ${SUMMARY_OUTPUT_FILE}`);
}

async function readMaterializedTests(filePath: string): Promise<MaterializedTest[]> {
  const fileContents = await readFile(filePath, "utf8");
  const parsedContents: unknown = JSON.parse(fileContents);

  if (!Array.isArray(parsedContents)) {
    throw new Error(`Expected ${filePath} to contain an array of materialized tests.`);
  }

  return parsedContents.map(validateMaterializedTest);
}

function validateMaterializedTest(record: unknown, index: number): MaterializedTest {
  if (!record || typeof record !== "object") {
    throw new Error(`Invalid materialized test at index ${index}.`);
  }

  const materializedTest = record as Partial<MaterializedTest>;

  if (
    typeof materializedTest.promptId !== "string" ||
    typeof materializedTest.packageName !== "string" ||
    typeof materializedTest.functionPath !== "string" ||
    !isPromptVariant(materializedTest.promptVariant) ||
    !isProvider(materializedTest.provider) ||
    typeof materializedTest.model !== "string" ||
    typeof materializedTest.testFilePath !== "string"
  ) {
    throw new Error(`Invalid materialized test fields at index ${index}.`);
  }

  return materializedTest as MaterializedTest;
}

function toSummaryCsv(results: TestExecutionResult[]): string {
  const groupedResults = new Map<string, TestExecutionResult[]>();

  for (const result of results) {
    const key = result.failureCategory ?? "passed";
    groupedResults.set(key, [...(groupedResults.get(key) ?? []), result]);
  }

  const rows = [...groupedResults.entries()]
    .sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB))
    .map(([category, categoryResults]) => {
      const passedCount = categoryResults.filter((result) => result.passed).length;
      const failedCount = categoryResults.length - passedCount;

      return [
        csvEscape(category),
        categoryResults.length.toString(),
        passedCount.toString(),
        failedCount.toString()
      ].join(",");
    });

  return `${["category,total,passed,failed", ...rows].join("\n")}\n`;
}

function csvEscape(value: string): string {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
}

function isPromptVariant(value: unknown): value is PromptVariant {
  return value === "signature-only" || value === "signature-and-body" || value === "full";
}

function isProvider(value: unknown): value is LLMProvider {
  return value === "mock" || value === "openai" || value === "gemini";
}

main().catch((error: unknown) => {
  console.error("Failed to run generated tests.");
  console.error(error);
  process.exitCode = 1;
});
