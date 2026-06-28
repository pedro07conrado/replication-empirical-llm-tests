import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LLMGeneration, MaterializedTest } from "../types.js";

const COMMONJS_PACKAGE_JSON = JSON.stringify({ type: "commonjs" }, null, 2);

export async function materializeGeneratedTests(
  generations: LLMGeneration[],
  outputDir: string,
  cwd = process.cwd()
): Promise<MaterializedTest[]> {
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "package.json"), `${COMMONJS_PACKAGE_JSON}\n`, "utf8");

  const materializedTests: MaterializedTest[] = [];

  for (const generation of generations) {
    const packageDir = path.join(outputDir, sanitizePathSegment(generation.packageName));
    await mkdir(packageDir, { recursive: true });

    const testFileName = `${sanitizePathSegment(generation.promptId)}.test.js`;
    const absoluteTestFilePath = path.join(packageDir, testFileName);
    const relativeTestFilePath = toPortableRelativePath(cwd, absoluteTestFilePath);

    await writeFile(absoluteTestFilePath, generation.generatedText, "utf8");

    materializedTests.push({
      promptId: generation.promptId,
      packageName: generation.packageName,
      functionPath: generation.functionPath,
      promptVariant: generation.promptVariant,
      provider: generation.provider,
      model: generation.model,
      testFilePath: relativeTestFilePath,
      finishReason: generation.finishReason ?? extractFinishReason(generation.rawResponse)
    });
  }

  return materializedTests;
}

export function extractFinishReason(rawResponse: unknown): string | undefined {
  if (!isRecord(rawResponse)) {
    return undefined;
  }

  if (typeof rawResponse.finishReason === "string") {
    return rawResponse.finishReason;
  }

  if (typeof rawResponse.finish_reason === "string") {
    return rawResponse.finish_reason;
  }

  if (Array.isArray(rawResponse.candidates)) {
    for (const candidate of rawResponse.candidates) {
      if (isRecord(candidate) && typeof candidate.finishReason === "string") {
        return candidate.finishReason;
      }
    }
  }

  if (Array.isArray(rawResponse.choices)) {
    for (const choice of rawResponse.choices) {
      if (isRecord(choice) && typeof choice.finish_reason === "string") {
        return choice.finish_reason;
      }
    }
  }

  return undefined;
}

function sanitizePathSegment(value: string): string {
  const sanitizedValue = value
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "-")
    .replace(/^\.+/g, "")
    .replace(/[.\s]+$/g, "")
    .trim();

  return sanitizedValue || "unknown";
}

function toPortableRelativePath(cwd: string, filePath: string): string {
  return path.relative(cwd, filePath).split(path.sep).join("/");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}
