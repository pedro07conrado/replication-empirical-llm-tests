import type { ApiFunctionRecord, GeneratedPrompt, PromptVariant } from "../types.js";

const PROMPT_VARIANTS: PromptVariant[] = ["signature-only", "signature-and-body", "full"];

export function generatePromptsForFunctions(
  apiFunctions: ApiFunctionRecord[],
  createdAt = new Date().toISOString()
): GeneratedPrompt[] {
  const prompts: GeneratedPrompt[] = [];

  for (const apiFunction of apiFunctions) {
    for (const promptVariant of PROMPT_VARIANTS) {
      prompts.push({
        promptId: createPromptId(apiFunction, promptVariant),
        packageName: apiFunction.packageName,
        functionPath: apiFunction.functionPath,
        promptVariant,
        promptText: buildPromptText(apiFunction, promptVariant),
        createdAt
      });
    }
  }

  return prompts;
}

function buildPromptText(apiFunction: ApiFunctionRecord, promptVariant: PromptVariant): string {
  const contextSections = buildContextSections(apiFunction, promptVariant);

  return [
    "Generate a unit test for the JavaScript API function described below.",
    "",
    "Use Mocha and Node.js native assert.",
    "Return only the test code. Do not include explanations or Markdown fences.",
    "",
    "The generated test must follow this style:",
    "",
    "let mocha = require('mocha');",
    "let assert = require('assert');",
    `let pkg = require('${apiFunction.packageName}');`,
    "",
    `describe('test ${apiFunction.packageName}', function() {`,
    `  it('test ${apiFunction.functionPath}', function(done) {`,
    "    // test code here",
    "    done();",
    "  });",
    "});",
    "",
    "Function under test:",
    ...contextSections
  ].join("\n");
}

function buildContextSections(apiFunction: ApiFunctionRecord, promptVariant: PromptVariant): string[] {
  const sections = [
    `- Package: ${apiFunction.packageName}`,
    `- Function path: ${apiFunction.functionPath}`,
    `- Approximate signature: ${apiFunction.functionSignature ?? "unknown"}`,
    `- Parameter count: ${apiFunction.parameterCount}`
  ];

  if (promptVariant === "signature-and-body" || promptVariant === "full") {
    sections.push("", "Function body:", "```javascript", apiFunction.functionBody ?? "unavailable", "```");
  }

  if (promptVariant === "full") {
    sections.push(
      "",
      "Documentation:",
      "No documentation has been collected yet.",
      "",
      "Usage examples:",
      "No usage examples have been collected yet."
    );
  }

  return sections;
}

function createPromptId(apiFunction: ApiFunctionRecord, promptVariant: PromptVariant): string {
  return [
    apiFunction.packageName,
    apiFunction.functionPath,
    promptVariant
  ]
    .join("::")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
