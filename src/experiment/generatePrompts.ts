import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { generatePromptsForFunctions } from "../prompt-generation/promptGenerator.js";
import type { ApiFunctionRecord } from "../types.js";

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const INPUT_FILE = path.join(RESULTS_DIR, "sample-functions.json");
const OUTPUT_FILE = path.join(RESULTS_DIR, "generated-prompts.json");

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const sampledFunctions = await readSampledFunctions(INPUT_FILE);
  const generatedPrompts = generatePromptsForFunctions(sampledFunctions);

  await writeFile(OUTPUT_FILE, `${JSON.stringify(generatedPrompts, null, 2)}\n`, "utf8");

  console.log(`Read ${sampledFunctions.length} sampled API functions from ${INPUT_FILE}`);
  console.log(`Generated ${generatedPrompts.length} prompts.`);
  console.log(`Saved prompts to ${OUTPUT_FILE}`);
}

async function readSampledFunctions(filePath: string): Promise<ApiFunctionRecord[]> {
  const fileContents = await readFile(filePath, "utf8");
  const parsedContents: unknown = JSON.parse(fileContents);

  if (!Array.isArray(parsedContents)) {
    throw new Error(`Expected ${filePath} to contain an array of sampled API functions.`);
  }

  return parsedContents.map(validateApiFunctionRecord);
}

function validateApiFunctionRecord(record: unknown, index: number): ApiFunctionRecord {
  if (!record || typeof record !== "object") {
    throw new Error(`Invalid sampled API function at index ${index}.`);
  }

  const apiFunction = record as Partial<ApiFunctionRecord>;

  if (
    typeof apiFunction.packageName !== "string" ||
    typeof apiFunction.functionPath !== "string" ||
    typeof apiFunction.parameterCount !== "number"
  ) {
    throw new Error(`Invalid sampled API function fields at index ${index}.`);
  }

  return apiFunction as ApiFunctionRecord;
}

main().catch((error: unknown) => {
  console.error("Failed to generate prompts.");
  console.error(error);
  process.exitCode = 1;
});
