import { mkdir, readFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import type { CoverageResult, MaterializedTest, TestExecutionResult } from "../types.js";

interface CoverageProcessResult {
  exitCode: number | null;
  stdout: string;
  stderr: string;
}

interface CoverageSummaryMetric {
  pct?: number | string;
}

interface CoverageSummary {
  total?: {
    statements?: CoverageSummaryMetric;
    branches?: CoverageSummaryMetric;
    functions?: CoverageSummaryMetric;
    lines?: CoverageSummaryMetric;
  };
}

interface PackageCoverageGroup {
  packageName: string;
  materializedTests: MaterializedTest[];
  passingTests: TestExecutionResult[];
}

export async function runCoverageForPassingTests(
  materializedTests: MaterializedTest[],
  testExecutionResults: TestExecutionResult[],
  cwd = process.cwd()
): Promise<CoverageResult[]> {
  const groups = groupByPackage(materializedTests, testExecutionResults);
  const coverageResults: CoverageResult[] = [];

  for (const group of groups) {
    coverageResults.push(await runPackageCoverage(group, cwd));
  }

  return coverageResults;
}

async function runPackageCoverage(group: PackageCoverageGroup, cwd: string): Promise<CoverageResult> {
  const coverageReportPath = toPortableRelativePath(cwd, getCoverageReportDir(cwd, group.packageName));
  const baseResult = createBaseCoverageResult(group, coverageReportPath);

  if (group.passingTests.length === 0) {
    return baseResult;
  }

  const reportDir = getCoverageReportDir(cwd, group.packageName);
  const tempDir = path.resolve(cwd, ".nyc_output", sanitizePathSegment(group.packageName));
  await mkdir(reportDir, { recursive: true });
  await rm(tempDir, { recursive: true, force: true });
  await mkdir(tempDir, { recursive: true });

  const processResult = await runNyc({
    packageName: group.packageName,
    testFilePaths: group.passingTests.map((test) => path.resolve(cwd, test.testFilePath)),
    reportDir,
    tempDir,
    cwd
  });

  if (processResult.exitCode !== 0) {
    return baseResult;
  }

  const summary = await readCoverageSummary(path.join(reportDir, "coverage-summary.json"));

  return {
    ...baseResult,
    statementCoverage: normalizeCoveragePct(summary.total?.statements?.pct),
    branchCoverage: normalizeCoveragePct(summary.total?.branches?.pct),
    functionCoverage: normalizeCoveragePct(summary.total?.functions?.pct),
    lineCoverage: normalizeCoveragePct(summary.total?.lines?.pct)
  };
}

function groupByPackage(
  materializedTests: MaterializedTest[],
  testExecutionResults: TestExecutionResult[]
): PackageCoverageGroup[] {
  const testExecutionByPromptId = new Map(
    testExecutionResults.map((result) => [result.promptId, result])
  );
  const groups = new Map<string, PackageCoverageGroup>();

  for (const materializedTest of materializedTests) {
    const group = groups.get(materializedTest.packageName) ?? {
      packageName: materializedTest.packageName,
      materializedTests: [],
      passingTests: []
    };
    const executionResult = testExecutionByPromptId.get(materializedTest.promptId);

    group.materializedTests.push(materializedTest);

    if (executionResult?.passed) {
      group.passingTests.push(executionResult);
    }

    groups.set(materializedTest.packageName, group);
  }

  return [...groups.values()].sort((a, b) => a.packageName.localeCompare(b.packageName));
}

function runNyc(options: {
  packageName: string;
  testFilePaths: string[];
  reportDir: string;
  tempDir: string;
  cwd: string;
}): Promise<CoverageProcessResult> {
  const nycBinPath = path.resolve(options.cwd, "node_modules", "nyc", "bin", "nyc.js");
  const mochaBinPath = path.resolve(options.cwd, "node_modules", "mocha", "bin", "mocha.js");
  const includePattern = `node_modules/${options.packageName}/**/*.js`;

  return new Promise((resolve) => {
    const childProcess = spawn(process.execPath, [
      nycBinPath,
      "--report-dir",
      options.reportDir,
      "--temp-dir",
      options.tempDir,
      "--reporter",
      "json-summary",
      "--reporter",
      "text",
      "--exclude-node-modules=false",
      "--exclude-after-remap=false",
      "--include",
      includePattern,
      mochaBinPath,
      ...options.testFilePaths,
      "--timeout",
      "10000",
      "--reporter",
      "spec"
    ], {
      cwd: options.cwd,
      windowsHide: true
    });

    let stdout = "";
    let stderr = "";

    childProcess.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });

    childProcess.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    childProcess.on("error", (error) => {
      stderr += `${error.message}\n`;
    });

    childProcess.on("close", (exitCode) => {
      resolve({ exitCode, stdout, stderr });
    });
  });
}

async function readCoverageSummary(summaryFilePath: string): Promise<CoverageSummary> {
  const fileContents = await readFile(summaryFilePath, "utf8");
  return JSON.parse(fileContents) as CoverageSummary;
}

function normalizeCoveragePct(value: number | string | undefined): number | null {
  return typeof value === "number" ? value : null;
}

function createBaseCoverageResult(group: PackageCoverageGroup, coverageReportPath: string): CoverageResult {
  const provider = getSingleOrMixed(group.passingTests.map((test) => test.provider));
  const model = getSingleOrMixed(group.passingTests.map((test) => test.model));
  const promptVariant = getSingleOrMixed(group.passingTests.map((test) => test.promptVariant));

  return {
    packageName: group.packageName,
    provider,
    model,
    promptVariant,
    totalTests: group.materializedTests.length,
    passingTestsUsed: group.passingTests.length,
    statementCoverage: null,
    branchCoverage: null,
    functionCoverage: null,
    lineCoverage: null,
    coverageReportPath
  };
}

function getCoverageReportDir(cwd: string, packageName: string): string {
  return path.resolve(cwd, "coverage", sanitizePathSegment(packageName));
}

function getSingleOrMixed(values: string[]): string {
  if (values.length === 0) {
    return "none";
  }

  const uniqueValues = [...new Set(values)].sort();
  return uniqueValues.length === 1 ? uniqueValues[0] : "mixed";
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
