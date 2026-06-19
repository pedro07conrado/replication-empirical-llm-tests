import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { stratifiedSampleApiFunctions } from "../sampling/stratifiedSampler.js";
import type { ApiFunctionRecord, SampleSummaryRecord } from "../types.js";

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const INPUT_FILE = path.join(RESULTS_DIR, "api-functions.json");
const SAMPLE_OUTPUT_FILE = path.join(RESULTS_DIR, "sample-functions.json");
const SUMMARY_OUTPUT_FILE = path.join(RESULTS_DIR, "sample-summary.csv");
const SAMPLE_SIZE = 157;
const SEED = 42;

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const apiFunctions = await readApiFunctions(INPUT_FILE);
  const { sampledFunctions, summary } = stratifiedSampleApiFunctions(apiFunctions, {
    sampleSize: SAMPLE_SIZE,
    seed: SEED
  });

  await writeFile(SAMPLE_OUTPUT_FILE, `${JSON.stringify(sampledFunctions, null, 2)}\n`, "utf8");
  await writeFile(SUMMARY_OUTPUT_FILE, toCsv(summary), "utf8");

  console.log(`Read ${apiFunctions.length} API functions from ${INPUT_FILE}`);
  console.log(`Sampled ${sampledFunctions.length} API functions using seed ${SEED}.`);
  console.log(`Saved sample to ${SAMPLE_OUTPUT_FILE}`);
  console.log(`Saved summary to ${SUMMARY_OUTPUT_FILE}`);
}

async function readApiFunctions(filePath: string): Promise<ApiFunctionRecord[]> {
  const fileContents = await readFile(filePath, "utf8");
  const parsedContents: unknown = JSON.parse(fileContents);

  if (!Array.isArray(parsedContents)) {
    throw new Error(`Expected ${filePath} to contain an array of API functions.`);
  }

  return parsedContents.map(validateApiFunctionRecord);
}

function validateApiFunctionRecord(record: unknown, index: number): ApiFunctionRecord {
  if (!record || typeof record !== "object") {
    throw new Error(`Invalid API function at index ${index}.`);
  }

  const apiFunction = record as Partial<ApiFunctionRecord>;

  if (
    typeof apiFunction.packageName !== "string" ||
    typeof apiFunction.functionPath !== "string" ||
    typeof apiFunction.parameterCount !== "number"
  ) {
    throw new Error(`Invalid API function fields at index ${index}.`);
  }

  return apiFunction as ApiFunctionRecord;
}

function toCsv(summary: SampleSummaryRecord[]): string {
  const header = "packageName,totalFunctions,sampledFunctions,samplePercentage";
  const rows = summary.map((record) =>
    [
      csvEscape(record.packageName),
      record.totalFunctions.toString(),
      record.sampledFunctions.toString(),
      record.samplePercentage.toFixed(2)
    ].join(",")
  );

  return `${[header, ...rows].join("\n")}\n`;
}

function csvEscape(value: string): string {
  if (!/[",\n\r]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
}

main().catch((error: unknown) => {
  console.error("Failed to sample API functions.");
  console.error(error);
  process.exitCode = 1;
});
