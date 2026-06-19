import type { ApiFunctionRecord, TargetPackage } from "../types.js";

interface ExploreOptions {
  maxDepth?: number;
}

const DEFAULT_MAX_DEPTH = 6;
const IGNORED_KEYS = new Set(["caller", "callee", "arguments", "constructor"]);

export async function explorePackages(
  packages: TargetPackage[],
  options: ExploreOptions = {}
): Promise<ApiFunctionRecord[]> {
  const records: ApiFunctionRecord[] = [];

  for (const targetPackage of packages) {
    const packageRecords = await explorePackage(targetPackage, options);
    records.push(...packageRecords);
  }

  return sortRecords(records);
}

export async function explorePackage(
  targetPackage: TargetPackage,
  options: ExploreOptions = {}
): Promise<ApiFunctionRecord[]> {
  const packageModule = await import(targetPackage.name);
  const records: ApiFunctionRecord[] = [];
  const seen = new WeakSet<object>();
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;

  visitValue(packageModule, targetPackage.name, targetPackage.name, records, seen, 0, maxDepth);

  return sortRecords(records);
}

function visitValue(
  value: unknown,
  packageName: string,
  path: string,
  records: ApiFunctionRecord[],
  seen: WeakSet<object>,
  depth: number,
  maxDepth: number
): void {
  if (value === null || value === undefined || depth > maxDepth) {
    return;
  }

  const valueType = typeof value;

  if (valueType === "function") {
    const fn = value as Function;
    records.push(createFunctionRecord(packageName, path, fn));
    visitObjectProperties(fn, packageName, path, records, seen, depth, maxDepth);
    visitPrototype(fn, packageName, path, records, seen, depth, maxDepth);
    return;
  }

  if (valueType === "object") {
    visitObjectProperties(value as object, packageName, path, records, seen, depth, maxDepth);
  }
}

function visitObjectProperties(
  value: object,
  packageName: string,
  path: string,
  records: ApiFunctionRecord[],
  seen: WeakSet<object>,
  depth: number,
  maxDepth: number
): void {
  if (seen.has(value) || depth >= maxDepth) {
    return;
  }

  seen.add(value);

  for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(value))) {
    if (shouldSkipKey(key)) {
      continue;
    }

    const childValue = getDescriptorValue(value, descriptor);

    if (childValue === undefined) {
      continue;
    }

    const childPath = `${path}.${key}`;
    visitValue(childValue, packageName, childPath, records, seen, depth + 1, maxDepth);
  }
}

function visitPrototype(
  fn: Function,
  packageName: string,
  path: string,
  records: ApiFunctionRecord[],
  seen: WeakSet<object>,
  depth: number,
  maxDepth: number
): void {
  if (!fn.prototype || typeof fn.prototype !== "object") {
    return;
  }

  visitObjectProperties(fn.prototype, packageName, `${path}.prototype`, records, seen, depth + 1, maxDepth);
}

function createFunctionRecord(
  packageName: string,
  functionPath: string,
  fn: Function
): ApiFunctionRecord {
  const functionBody = safeFunctionToString(fn);

  return {
    packageName,
    functionPath,
    parameterCount: fn.length,
    functionSignature: getFunctionSignature(functionBody),
    functionBody
  };
}

function safeFunctionToString(fn: Function): string | undefined {
  try {
    return Function.prototype.toString.call(fn);
  } catch {
    return undefined;
  }
}

function getFunctionSignature(functionBody: string | undefined): string | undefined {
  if (!functionBody) {
    return undefined;
  }

  const singleLineBody = functionBody.replace(/\s+/g, " ").trim();
  const braceIndex = singleLineBody.indexOf("{");

  if (braceIndex > -1) {
    return singleLineBody.slice(0, braceIndex).trim();
  }

  const arrowIndex = singleLineBody.indexOf("=>");

  if (arrowIndex > -1) {
    return singleLineBody.slice(0, arrowIndex + 2).trim();
  }

  return singleLineBody.slice(0, 200);
}

function shouldSkipKey(key: string): boolean {
  return key.startsWith("_") || IGNORED_KEYS.has(key);
}

function getDescriptorValue(owner: object, descriptor: PropertyDescriptor): unknown {
  if ("value" in descriptor) {
    return descriptor.value;
  }

  if (typeof descriptor.get !== "function") {
    return undefined;
  }

  try {
    return descriptor.get.call(owner);
  } catch {
    return undefined;
  }
}

function sortRecords(records: ApiFunctionRecord[]): ApiFunctionRecord[] {
  return records.sort((a, b) => {
    const packageCompare = a.packageName.localeCompare(b.packageName);
    return packageCompare === 0 ? a.functionPath.localeCompare(b.functionPath) : packageCompare;
  });
}
