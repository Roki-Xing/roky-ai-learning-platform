import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import {
  buildSettingsSavedNotice,
  settingsSavedRedirectPath,
  parsePreferenceSlugs,
  updateUserProfileSettings,
} from "@/server/profile/settings";

test("parsePreferenceSlugs normalizes comma and newline separated knowledge preferences", () => {
  assert.deepEqual(parsePreferenceSlugs("RAG\nSWE-bench, Self Attention"), [
    "rag",
    "swe-bench",
    "self-attention",
  ]);
  assert.deepEqual(parsePreferenceSlugs(" rag, RAG ,, "), ["rag"]);
});

test("buildSettingsSavedNotice only shows success after a saved redirect", () => {
  assert.deepEqual(buildSettingsSavedNotice("1"), {
    title: "设置已保存",
    description: "新的学习偏好会用于后续选题和内容生成。",
  });
  assert.equal(buildSettingsSavedNotice(undefined), null);
  assert.equal(buildSettingsSavedNotice("0"), null);
  assert.equal(settingsSavedRedirectPath(), "/settings?saved=1");
});

test("updateUserProfileSettings stores daily knowledge preferences", async () => {
  const userId = `settings-knowledge-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const profile = await updateUserProfileSettings({
    userId,
    displayName: "Knowledge User",
    goal: "ai_general",
    level: "intermediate",
    language: "zh",
    difficulty: "standard",
    dailyMinutes: 45,
    timeZone: "Asia/Shanghai",
    preferredAreasText: "LLM\n算法",
    preferredTermSlugsText: "RAG\nSelf Attention",
    preferredEntitySlugsText: "SWE-bench, Shunyu Yao",
    knowledgeAvoidDays: 10,
  });

  assert.deepEqual(profile.preferredTermSlugs, ["rag", "self-attention"]);
  assert.deepEqual(profile.preferredEntitySlugs, ["swe-bench", "shunyu-yao"]);
  assert.equal(profile.knowledgeAvoidDays, 10);

  const saved = await prisma.userProfile.findUniqueOrThrow({ where: { userId } });
  assert.deepEqual(saved.preferredTermSlugs, ["rag", "self-attention"]);
  assert.deepEqual(saved.preferredEntitySlugs, ["swe-bench", "shunyu-yao"]);
  assert.equal(saved.knowledgeAvoidDays, 10);
});
