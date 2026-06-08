import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("global css respects reduced motion preferences", () => {
  const source = readFileSync("src/app/globals.css", "utf8");

  assert.match(source, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(source, /animation-duration:\s*0\.01ms\s*!important/);
  assert.match(source, /animation-iteration-count:\s*1\s*!important/);
  assert.match(source, /transition-duration:\s*0\.01ms\s*!important/);
  assert.match(source, /scroll-behavior:\s*auto\s*!important/);
});
