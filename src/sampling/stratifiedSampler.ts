import type { ApiFunctionRecord, SampleSummaryRecord } from "../types.js";

interface StratifiedSampleOptions {
  sampleSize: number;
  seed: number;
}

interface PackageAllocation {
  packageName: string;
  totalFunctions: number;
  target: number;
  remainder: number;
}

export interface StratifiedSampleResult {
  sampledFunctions: ApiFunctionRecord[];
  summary: SampleSummaryRecord[];
}

export function stratifiedSampleApiFunctions(
  apiFunctions: ApiFunctionRecord[],
  options: StratifiedSampleOptions
): StratifiedSampleResult {
  const groupedFunctions = groupByPackage(apiFunctions);
  const totalFunctions = apiFunctions.length;
  const sampleSize = Math.min(options.sampleSize, totalFunctions);
  const allocations = allocateSamples(groupedFunctions, sampleSize, totalFunctions);
  const random = createSeededRandom(options.seed);
  const sampledFunctions: ApiFunctionRecord[] = [];

  for (const allocation of allocations) {
    const packageFunctions = groupedFunctions.get(allocation.packageName) ?? [];
    const shuffledPackageFunctions = shuffle(packageFunctions, random);
    sampledFunctions.push(...shuffledPackageFunctions.slice(0, allocation.target));
  }

  sampledFunctions.sort((a, b) => {
    const packageCompare = a.packageName.localeCompare(b.packageName);
    return packageCompare === 0 ? a.functionPath.localeCompare(b.functionPath) : packageCompare;
  });

  const summary = allocations.map((allocation) => ({
    packageName: allocation.packageName,
    totalFunctions: allocation.totalFunctions,
    sampledFunctions: allocation.target,
    samplePercentage: roundPercentage(allocation.target, allocation.totalFunctions)
  }));

  return { sampledFunctions, summary };
}

function groupByPackage(apiFunctions: ApiFunctionRecord[]): Map<string, ApiFunctionRecord[]> {
  const groupedFunctions = new Map<string, ApiFunctionRecord[]>();

  for (const apiFunction of apiFunctions) {
    const packageFunctions = groupedFunctions.get(apiFunction.packageName) ?? [];
    packageFunctions.push(apiFunction);
    groupedFunctions.set(apiFunction.packageName, packageFunctions);
  }

  return groupedFunctions;
}

function allocateSamples(
  groupedFunctions: Map<string, ApiFunctionRecord[]>,
  sampleSize: number,
  totalFunctions: number
): PackageAllocation[] {
  const allocations = [...groupedFunctions.entries()]
    .sort(([packageA], [packageB]) => packageA.localeCompare(packageB))
    .map(([packageName, packageFunctions]) => {
      const exactTarget = totalFunctions === 0 ? 0 : (packageFunctions.length / totalFunctions) * sampleSize;
      const minimumTarget = packageFunctions.length > 0 && sampleSize > 0 ? 1 : 0;
      const flooredTarget = Math.floor(exactTarget);

      return {
        packageName,
        totalFunctions: packageFunctions.length,
        target: Math.min(packageFunctions.length, Math.max(minimumTarget, flooredTarget)),
        remainder: exactTarget - flooredTarget
      };
    });

  rebalanceAllocations(allocations, sampleSize);

  return allocations;
}

function rebalanceAllocations(allocations: PackageAllocation[], sampleSize: number): void {
  let allocated = sumAllocated(allocations);

  while (allocated < sampleSize) {
    const nextAllocation = allocations
      .filter((allocation) => allocation.target < allocation.totalFunctions)
      .sort((a, b) => b.remainder - a.remainder || b.totalFunctions - a.totalFunctions || a.packageName.localeCompare(b.packageName))[0];

    if (!nextAllocation) {
      break;
    }

    nextAllocation.target += 1;
    allocated += 1;
  }

  while (allocated > sampleSize) {
    const nextAllocation = allocations
      .filter((allocation) => allocation.target > 1)
      .sort((a, b) => a.remainder - b.remainder || a.totalFunctions - b.totalFunctions || a.packageName.localeCompare(b.packageName))[0];

    if (!nextAllocation) {
      break;
    }

    nextAllocation.target -= 1;
    allocated -= 1;
  }
}

function sumAllocated(allocations: PackageAllocation[]): number {
  return allocations.reduce((total, allocation) => total + allocation.target, 0);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
  }

  return shuffledItems;
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function roundPercentage(sampledFunctions: number, totalFunctions: number): number {
  if (totalFunctions === 0) {
    return 0;
  }

  return Number(((sampledFunctions / totalFunctions) * 100).toFixed(2));
}
