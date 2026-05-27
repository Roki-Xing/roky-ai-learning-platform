import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";

import dotenv from "dotenv";

// Ensure server runtime has access to env vars from .env.production (and friends)
// when running `next start` inside Docker without `docker run -e ...`.
//
// Important:
// - This is server-only. It does not expose secrets to the client.
// - Next.js itself will load env files during server init, but we observed
//   server-only vars not being present at runtime in this deployment.
//
// This file is intentionally tiny and dependency-free besides dotenv.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

// Load env with precedence:
// - `.env.production` in repo root for production containers
// - fallback to `.env` for local/dev convenience
//
// Do NOT override existing process.env values.
const envPaths = [
  path.join(repoRoot, ".env.production"),
  path.join(repoRoot, ".env"),
];

for (const p of envPaths) {
  dotenv.config({ path: p, override: false, quiet: true });
}

// Start Next.js normally.
// Use spawn so we can pass the current env (after dotenv) to the Next CLI.
// Keep this file ESM-only (no require + top-level await ambiguity).
const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const child = spawn(process.execPath, [nextBin, "start", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
