import { stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import type { MaterializedTest, TestExecutionResult, TestFailureCategory } from "../types.js";

interface RunProcessResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
  errorMessage?: string;
  timedOut: boolean;
  durationMs: number;
}

const DEFAULT_TIMEOUT_MS = 10_000;

export async function executeMaterializedTests(
  materializedTests: MaterializedTest[],
  cwd = process.cwd()
): Promise<TestExecutionResult[]> {
  const results: TestExecutionResult[] = [];

  for (const materializedTest of materializedTests) {
    const absoluteTestFilePath = path.resolve(cwd, materializedTest.testFilePath);
    const startedAt = Date.now();

    try {
      await stat(absoluteTestFilePath);
    } catch (error) {
      results.push({
        ...toBaseResult(materializedTest),
        passed: false,
        exitCode: null,
        stdout: "",
        stderr: "",
        errorMessage: getErrorMessage(error),
        failureCategory: "filesystem-error",
        durationMs: Date.now() - startedAt
      });
      continue;
    }

    const processResult = await runMocha(absoluteTestFilePath, cwd);
    const hasIncompleteFinishReason = materializedTest.finishReason === "MAX_TOKENS";
    const passed = processResult.exitCode === 0 && !processResult.timedOut && !hasIncompleteFinishReason;
    const failureCategory = passed
      ? undefined
      : classifyFailure({
        stdout: processResult.stdout,
        stderr: processResult.stderr,
        errorMessage: processResult.errorMessage,
        timedOut: processResult.timedOut,
        finishReason: materializedTest.finishReason
      });

    results.push({
      ...toBaseResult(materializedTest),
      passed,
      exitCode: processResult.exitCode,
      stdout: processResult.stdout,
      stderr: processResult.stderr,
      errorMessage: passed
        ? undefined
        : processResult.errorMessage ?? getFailureMessage(processResult, materializedTest.finishReason),
      failureCategory,
      durationMs: processResult.durationMs
    });
  }

  return results;
}

function runMocha(testFilePath: string, cwd: string): Promise<RunProcessResult> {
  const mochaBinPath = path.resolve(cwd, "node_modules", "mocha", "bin", "mocha.js");
  const startedAt = Date.now();

  return new Promise((resolve) => {
    const childProcess = spawn(process.execPath, [
      mochaBinPath,
      testFilePath,
      "--timeout",
      DEFAULT_TIMEOUT_MS.toString(),
      "--reporter",
      "spec"
    ], {
      cwd,
      windowsHide: true
    });

    let stdout = "";
    let stderr = "";
    let errorMessage: string | undefined;
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      childProcess.kill();
    }, DEFAULT_TIMEOUT_MS + 1_000);

    childProcess.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });

    childProcess.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    childProcess.on("error", (error) => {
      errorMessage = error.message;
    });

    childProcess.on("close", (exitCode) => {
      clearTimeout(timeout);
      resolve({
        exitCode,
        stdout,
        stderr,
        errorMessage,
        timedOut,
        durationMs: Date.now() - startedAt
      });
    });
  });
}

function classifyFailure(details: {
  stdout: string;
  stderr: string;
  errorMessage?: string;
  timedOut: boolean;
  finishReason?: string;
}): TestFailureCategory {
  if (details.finishReason === "MAX_TOKENS") {
    return "incomplete-generation";
  }

  if (details.timedOut) {
    return "timeout";
  }

  const output = `${details.stdout}\n${details.stderr}\n${details.errorMessage ?? ""}`;

  if (/SyntaxError|Unexpected token|Unexpected end of input|missing \)/i.test(output)) {
    return "syntax-error";
  }

  if (/Cannot find module|MODULE_NOT_FOUND|ERR_MODULE_NOT_FOUND|ERR_REQUIRE_ESM|require is not defined/i.test(output)) {
    return "import-error";
  }

  if (/TypeError/i.test(output)) {
    return "type-error";
  }

  if (/AssertionError|ERR_ASSERTION/i.test(output)) {
    return "assertion-error";
  }

  if (/ENOENT|EACCES|EPERM|no such file|permission denied/i.test(output)) {
    return "filesystem-error";
  }

  return "unknown-error";
}

function getFailureMessage(processResult: RunProcessResult, finishReason: string | undefined): string | undefined {
  if (finishReason === "MAX_TOKENS") {
    return "Generation finished with MAX_TOKENS and may be incomplete.";
  }

  if (processResult.timedOut) {
    return "Mocha execution timed out.";
  }

  const output = `${processResult.stderr}\n${processResult.stdout}`.trim();
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim());
  const errorLine = lines.find((line) =>
    /AssertionError|SyntaxError|TypeError|ReferenceError|Error \[|Error:/i.test(line)
  );
  const firstUsefulLine = errorLine ?? lines.find((line) =>
    line.length > 0 &&
    !/^\d+\s+(passing|failing)/i.test(line) &&
    !/^[-+✓✔]?\s*$/.test(line) &&
    !/^\d+\)/.test(line)
  );

  return firstUsefulLine;
}

function toBaseResult(materializedTest: MaterializedTest): Pick<
  TestExecutionResult,
  "promptId" | "packageName" | "functionPath" | "promptVariant" | "provider" | "model" | "testFilePath"
> {
  return {
    promptId: materializedTest.promptId,
    packageName: materializedTest.packageName,
    functionPath: materializedTest.functionPath,
    promptVariant: materializedTest.promptVariant,
    provider: materializedTest.provider,
    model: materializedTest.model,
    testFilePath: materializedTest.testFilePath
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
