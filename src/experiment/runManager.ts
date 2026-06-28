import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

interface RunIdContext {
  provider?: string;
  model?: string;
  packageName?: string;
  variant?: string;
}

export interface RunPaths {
  runId: string;
  runDir: string;
}

export function extractRunIdArg(args: string[]): { runId?: string; remainingArgs: string[] } {
  const remainingArgs: string[] = [];
  let runId: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const nextArg = args[index + 1];

    if (arg === "--run-id" && nextArg) {
      runId = sanitizeRunId(nextArg);
      index += 1;
      continue;
    }

    if (arg === "--run-id") {
      throw new Error("--run-id requires a value.");
    }

    remainingArgs.push(arg);
  }

  return { runId, remainingArgs };
}

export async function resolveRunPaths(
  resultsDir: string,
  runId: string | undefined,
  context: RunIdContext = {}
): Promise<RunPaths> {
  const resolvedRunId = runId ?? createRunId(context);
  const runDir = path.join(resultsDir, "runs", resolvedRunId);

  await mkdir(runDir, { recursive: true });

  return {
    runId: resolvedRunId,
    runDir
  };
}

export async function writeJsonArtifact(
  latestPath: string,
  runDir: string,
  fileName: string,
  value: unknown
): Promise<void> {
  const contents = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(latestPath, contents, "utf8");
  await writeFile(path.join(runDir, fileName), contents, "utf8");
}

export async function writeTextArtifact(
  latestPath: string,
  runDir: string,
  fileName: string,
  value: string
): Promise<void> {
  await writeFile(latestPath, value, "utf8");
  await writeFile(path.join(runDir, fileName), value, "utf8");
}

function createRunId(context: RunIdContext): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const provider = context.provider ?? process.env.LLM_PROVIDER ?? "auto";
  const model = context.model ?? process.env.LLM_MODEL ?? "auto-model";
  const packageName = context.packageName ?? "all-packages";
  const variant = context.variant ?? "all-variants";

  return sanitizeRunId([timestamp, provider, model, packageName, variant].join("__"));
}

function sanitizeRunId(value: string): string {
  const sanitizedValue = value
    .replace(/[<>:"/\\|?*\u0000-\u001F]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/^\.+/g, "")
    .replace(/[.\s]+$/g, "")
    .trim();

  if (!sanitizedValue) {
    throw new Error("runId cannot be empty after sanitization.");
  }

  return sanitizedValue;
}
