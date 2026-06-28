import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { extractRunIdArg, resolveRunPaths, writeJsonArtifact, writeTextArtifact } from "./runManager.js";
import { runCoverageForPassingTests } from "../coverage/coverageRunner.js";
import type {
  CoverageResult,
  LLMProvider,
  MaterializedTest,
  PromptVariant,
  TestExecutionResult
} from "../types.js";

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const MATERIALIZED_TESTS_FILE = path.join(RESULTS_DIR, "materialized-tests.json");
const TEST_EXECUTION_RESULTS_FILE = path.join(RESULTS_DIR, "test-execution-results.json");
const COVERAGE_RESULTS_FILE = path.join(RESULTS_DIR, "coverage-results.json");
const COVERAGE_SUMMARY_FILE = path.join(RESULTS_DIR, "coverage-summary.csv");

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const { runId, remainingArgs } = extractRunIdArg(process.argv.slice(2));

  if (remainingArgs.length > 0) {
    throw new Error(`Unknown argument for run:coverage: ${remainingArgs[0]}`);
  }

  const inputRunPaths = runId ? await resolveRunPaths(RESULTS_DIR, runId) : undefined;
  const materializedTestsFile = inputRunPaths
    ? path.join(inputRunPaths.runDir, "materialized-tests.json")
    : MATERIALIZED_TESTS_FILE;
  const testExecutionResultsFile = inputRunPaths
    ? path.join(inputRunPaths.runDir, "test-execution-results.json")
    : TEST_EXECUTION_RESULTS_FILE;
  const materializedTests = await readMaterializedTests(materializedTestsFile);
  const testExecutionResults = await readTestExecutionResults(testExecutionResultsFile);
  const runPaths = inputRunPaths ?? await resolveRunPaths(RESULTS_DIR, undefined, getRunContext(materializedTests));
  const coverageResults = await runCoverageForPassingTests(materializedTests, testExecutionResults);
  const summaryCsv = toCsv(coverageResults);

  await writeJsonArtifact(COVERAGE_RESULTS_FILE, runPaths.runDir, "coverage-results.json", coverageResults);
  await writeTextArtifact(COVERAGE_SUMMARY_FILE, runPaths.runDir, "coverage-summary.csv", summaryCsv);

  const packagesWithPassingTests = coverageResults.filter((result) => result.passingTestsUsed > 0).length;

  console.log(`Read ${materializedTests.length} materialized tests from ${materializedTestsFile}`);
  console.log(`Read ${testExecutionResults.length} test execution results from ${testExecutionResultsFile}`);
  console.log(`Calculated coverage for ${packagesWithPassingTests} package groups with passing tests.`);
  console.log(`Saved coverage results to ${COVERAGE_RESULTS_FILE}`);
  console.log(`Saved coverage summary to ${COVERAGE_SUMMARY_FILE}`);
  console.log(`Preserved run artifacts in ${runPaths.runDir}`);
  console.log(`Run ID: ${runPaths.runId}`);
}

async function readMaterializedTests(filePath: string): Promise<MaterializedTest[]> {
  const fileContents = await readFile(filePath, "utf8");
  const parsedContents: unknown = JSON.parse(fileContents);

  if (!Array.isArray(parsedContents)) {
    throw new Error(`Expected ${filePath} to contain an array of materialized tests.`);
  }

  return parsedContents.map(validateMaterializedTest);
}

async function readTestExecutionResults(filePath: string): Promise<TestExecutionResult[]> {
  const fileContents = await readFile(filePath, "utf8");
  const parsedContents: unknown = JSON.parse(fileContents);

  if (!Array.isArray(parsedContents)) {
    throw new Error(`Expected ${filePath} to contain an array of test execution results.`);
  }

  return parsedContents.map(validateTestExecutionResult);
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

function validateTestExecutionResult(record: unknown, index: number): TestExecutionResult {
  if (!record || typeof record !== "object") {
    throw new Error(`Invalid test execution result at index ${index}.`);
  }

  const testExecutionResult = record as Partial<TestExecutionResult>;

  if (
    typeof testExecutionResult.promptId !== "string" ||
    typeof testExecutionResult.packageName !== "string" ||
    typeof testExecutionResult.functionPath !== "string" ||
    !isPromptVariant(testExecutionResult.promptVariant) ||
    !isProvider(testExecutionResult.provider) ||
    typeof testExecutionResult.model !== "string" ||
    typeof testExecutionResult.testFilePath !== "string" ||
    typeof testExecutionResult.passed !== "boolean"
  ) {
    throw new Error(`Invalid test execution result fields at index ${index}.`);
  }

  return testExecutionResult as TestExecutionResult;
}

function toCsv(results: CoverageResult[]): string {
  const header = [
    "packageName",
    "provider",
    "model",
    "promptVariant",
    "totalTests",
    "passingTestsUsed",
    "statementCoverage",
    "branchCoverage",
    "functionCoverage",
    "lineCoverage",
    "coverageReportPath"
  ].join(",");
  const rows = results.map((result) => [
    csvEscape(result.packageName),
    csvEscape(result.provider),
    csvEscape(result.model),
    csvEscape(result.promptVariant),
    result.totalTests.toString(),
    result.passingTestsUsed.toString(),
    formatNullableNumber(result.statementCoverage),
    formatNullableNumber(result.branchCoverage),
    formatNullableNumber(result.functionCoverage),
    formatNullableNumber(result.lineCoverage),
    csvEscape(result.coverageReportPath)
  ].join(","));

  return `${[header, ...rows].join("\n")}\n`;
}

function formatNullableNumber(value: number | null): string {
  return value === null ? "" : value.toString();
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
  return value === "mock" || value === "openai" || value === "gemini" || value === "ollama";
}

function getRunContext(materializedTests: MaterializedTest[]): {
  provider?: string;
  model?: string;
  packageName?: string;
  variant?: string;
} {
  return {
    provider: getSingleOrMixed(materializedTests.map((test) => test.provider)),
    model: getSingleOrMixed(materializedTests.map((test) => test.model)),
    packageName: getSingleOrMixed(materializedTests.map((test) => test.packageName)),
    variant: getSingleOrMixed(materializedTests.map((test) => test.promptVariant))
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
  console.error("Failed to run coverage.");
  console.error(error);
  process.exitCode = 1;
});
