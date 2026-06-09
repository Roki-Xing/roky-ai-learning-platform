import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/app/path/page.tsx",
  "src/app/weekly/page.tsx",
  "src/app/mistakes/page.tsx",
  "src/app/books/page.tsx",
  "src/app/books/[id]/page.tsx",
  "src/components/mobile/mobile-bottom-nav.tsx",
  "src/server/learning/daily-quests.ts",
  "src/server/learning/xp.ts",
  "src/server/learning/badges.ts",
  "src/components/learning/daily-quest-card.tsx",
  "src/components/learning/xp-level-card.tsx",
  "src/components/learning/badge-shelf.tsx",
  "src/server/voice/vocabulary.ts",
  "src/server/voice/reflection-template.ts",
  "src/server/knowledge/paths.ts",
  "src/server/books/base.ts",
  "src/app/manifest.ts",
  "docs/preview-review.md",
  "docs/deploy-checklist.md",
];

function fileExists(path: string) {
  return existsSync(join(root, path));
}

function readIfExists(path: string) {
  const fullPath = join(root, path);
  return existsSync(fullPath) ? readFileSync(fullPath, "utf8") : "";
}

function listManualMigrations() {
  const dir = join(root, "prisma", "manual-migrations");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .sort()
    .map((name) => relative(root, join(dir, name)));
}

const packageJson = JSON.parse(readIfExists("package.json") || "{}") as {
  scripts?: Record<string, string>;
};
const deployChecklist = readIfExists("docs/deploy-checklist.md");
const readme = readIfExists("README.md");
const migrationDocs = `${deployChecklist}\n${readme}`;
const manualMigrations = listManualMigrations();

const missingFiles = requiredFiles.filter((path) => !fileExists(path));
const migrationMissingFromDocs = manualMigrations.filter((path) => {
  const basename = path.split("/").at(-1) ?? path;
  return !migrationDocs.includes(basename);
});

const checks = {
  requiredFiles: requiredFiles.map((path) => ({ path, exists: fileExists(path) })),
  scripts: {
    auditRoutes: packageJson.scripts?.["audit:routes"] ?? null,
    auditLearning: packageJson.scripts?.["audit:learning"] ?? null,
    lint: packageJson.scripts?.lint ?? null,
    test: packageJson.scripts?.test ?? null,
    build: packageJson.scripts?.build ?? null,
    e2eVisual: packageJson.scripts?.["e2e:visual"] ?? null,
  },
  manualMigrations,
  migrationMissingFromDocs,
};

console.log("Roky Learn learning system audit");
console.log(`Required files missing: ${missingFiles.length || "none"}`);
console.log(`Manual migrations missing from docs: ${migrationMissingFromDocs.length || "none"}`);
console.log(JSON.stringify(checks, null, 2));

if (
  missingFiles.length ||
  !packageJson.scripts?.["audit:routes"] ||
  !packageJson.scripts?.["audit:learning"] ||
  migrationMissingFromDocs.length
) {
  process.exitCode = 1;
}
