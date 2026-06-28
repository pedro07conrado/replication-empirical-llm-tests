const fs = require("fs");
const path = require("path");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function sanitize(content) {
  let s = content;

  const fencedBlocks = [...s.matchAll(/```(?:javascript|js)?\s*([\s\S]*?)```/gi)].map((match) => match[1]);

  if (fencedBlocks.length > 0) {
    s =
      fencedBlocks.find(
        (block) =>
          block.includes("describe(") ||
          block.includes("it(") ||
          block.includes("require(")
      ) || fencedBlocks[0];
  }

  s = s.replace(/```(?:javascript|js)?/gi, "");
  s = s.replace(/```/g, "");

  const firstCodeIndexCandidates = [
    s.indexOf("const "),
    s.indexOf("let "),
    s.indexOf("var "),
    s.indexOf("require("),
    s.indexOf("import "),
    s.indexOf("describe("),
  ].filter((index) => index >= 0);

  if (firstCodeIndexCandidates.length > 0) {
    const firstCodeIndex = Math.min(...firstCodeIndexCandidates);
    s = s.slice(firstCodeIndex);
  }

  return s.trim() + "\n";
}

let changed = 0;
const files = walk("generated-tests").filter((file) => file.endsWith(".test.js"));

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  const cleaned = sanitize(original);

  if (cleaned !== original) {
    fs.writeFileSync(file, cleaned);
    changed++;
  }
}

console.log("test files found:", files.length);
console.log("sanitized files:", changed);
