import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { explorePackages } from "../api-explorer/apiExplorer.js";
import { targetPackages } from "../config/packages.js";

const RESULTS_DIR = path.resolve(process.cwd(), "results");
const OUTPUT_FILE = path.join(RESULTS_DIR, "api-functions.json");

async function main(): Promise<void> {
  await mkdir(RESULTS_DIR, { recursive: true });

  const apiFunctions = await explorePackages(targetPackages);

  await writeFile(OUTPUT_FILE, `${JSON.stringify(apiFunctions, null, 2)}\n`, "utf8");

  console.log(`Collected ${apiFunctions.length} API functions.`);
  console.log(`Saved results to ${OUTPUT_FILE}`);
}

main().catch((error: unknown) => {
  console.error("Failed to collect API functions.");
  console.error(error);
  process.exitCode = 1;
});
