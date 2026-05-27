import test from "node:test";
import assert from "node:assert/strict";
import { GeneratedDailyPlanSchema } from "@/server/ai/schemas";
import { pickDailyTemplate } from "@/server/content/templates";

test("daily plan template matches GeneratedDailyPlanSchema (Sprint 2.3)", () => {
  const tpl = pickDailyTemplate({ topicSlug: "transformer" });
  const parsed = GeneratedDailyPlanSchema.safeParse(tpl);
  assert.equal(parsed.success, true, parsed.success ? "" : parsed.error.message);
});
