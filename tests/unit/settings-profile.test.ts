import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

test("settings save action keeps a mobile-friendly touch target", () => {
  const source = readFileSync("src/app/settings/page.tsx", "utf8");

  assert.match(source, /const settingsPrimaryCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(source, /<div className="grid gap-2 sm:flex sm:items-center sm:gap-2">/);

  const saveButtonIndex = source.indexOf("保存设置");
  assert.notEqual(saveButtonIndex, -1);
  const saveButtonBlock = source.slice(saveButtonIndex - 180, saveButtonIndex + 80);
  assert.match(saveButtonBlock, /className=\{settingsPrimaryCtaClassName\}/);
});

test("settings text and numeric inputs keep mobile-friendly touch targets", () => {
  const source = readFileSync("src/app/settings/page.tsx", "utf8");

  assert.match(source, /const settingsInputClassName = "min-h-11";/);

  const inputNames = [
    "displayName",
    "goal",
    "dailyMinutes",
    "timeZone",
    "knowledgeAvoidDays",
  ];

  for (const name of inputNames) {
    const inputIndex = source.indexOf(`name="${name}"`);
    assert.notEqual(inputIndex, -1, `${name} input should exist`);
    const inputBlock = source.slice(inputIndex - 120, inputIndex + 340);
    assert.match(
      inputBlock,
      /className=\{settingsInputClassName\}/,
      `${name} input should use the mobile touch target class`,
    );
  }
});

test("settings goal input uses learner-friendly default copy", () => {
  const source = readFileSync("src/app/settings/page.tsx", "utf8");

  assert.match(source, /const defaultSettingsGoalText = "系统化学习 AI 和工程实践";/);
  assert.match(source, /function formatSettingsGoalInputValue/);

  const goalInputIndex = source.indexOf('name="goal"');
  assert.notEqual(goalInputIndex, -1);
  const goalInputBlock = source.slice(goalInputIndex - 180, goalInputIndex + 340);

  assert.match(goalInputBlock, /placeholder="例如：系统化学习 AI 和工程实践"/);
  assert.match(goalInputBlock, /defaultValue=\{formatSettingsGoalInputValue\(profile\.goal\)\}/);
  assert.doesNotMatch(goalInputBlock, /placeholder="例如：ai_general"/);
  assert.doesNotMatch(goalInputBlock, /defaultValue=\{profile\.goal \?\? "ai_general"\}/);
});

test("settings profile choices show localized labels while preserving submitted values", () => {
  const source = readFileSync("src/app/settings/page.tsx", "utf8");

  assert.match(source, /const settingsChoiceSelectClassName = /);
  assert.match(source, /const settingsLevelOptions[:=]/);
  assert.match(source, /const settingsDifficultyOptions[:=]/);
  assert.match(source, /const settingsLanguageOptions[:=]/);
  assert.match(source, /function settingsChoiceValue/);
  assert.match(source, /function settingsChoiceOptions/);

  const choiceFields = [
    {
      name: "level",
      fallback: "beginner",
      oldPlaceholder: /placeholder="beginner \/ intermediate \/ advanced"/,
      values: ["beginner", "intermediate", "advanced"],
      labels: ["入门", "进阶", "高阶"],
    },
    {
      name: "difficulty",
      fallback: "standard",
      oldPlaceholder: /placeholder="easy \/ standard \/ hard"/,
      values: ["easy", "standard", "hard"],
      labels: ["轻松", "标准", "挑战"],
    },
    {
      name: "language",
      fallback: "zh",
      oldPlaceholder: /placeholder="zh \/ en"/,
      values: ["zh", "en"],
      labels: ["中文", "英文"],
    },
  ];

  for (const field of choiceFields) {
    const fieldIndex = source.indexOf(`name="${field.name}"`);
    assert.notEqual(fieldIndex, -1, `${field.name} choice should exist`);
    const fieldBlock = source.slice(fieldIndex - 220, fieldIndex + 760);

    assert.match(fieldBlock, /<select/);
    assert.match(fieldBlock, /className=\{settingsChoiceSelectClassName\}/);
    assert.match(
      fieldBlock,
      new RegExp(`defaultValue=\\{settingsChoiceValue\\(profile\\.${field.name}, "${field.fallback}"\\)\\}`),
    );
    assert.doesNotMatch(fieldBlock, field.oldPlaceholder);
    assert.doesNotMatch(
      fieldBlock,
      new RegExp(`defaultValue=\\{profile\\.${field.name} \\?\\? "${field.fallback}"\\}`),
    );

    for (const label of field.labels) {
      assert.match(source, new RegExp(label), `${field.name} should show ${label}`);
    }
    for (const value of field.values) {
      assert.match(source, new RegExp(`value: "${value}"`), `${field.name} should submit ${value}`);
    }
  }
});

test("settings system card localizes missing runtime environment fallback", () => {
  const source = readFileSync("src/app/settings/page.tsx", "utf8");

  assert.match(source, /function formatSettingsRuntimeEnvLabel/);
  assert.match(source, /return normalized \? normalized : "未标记环境";/);
  assert.match(source, /formatSettingsRuntimeEnvLabel\(process\.env\.NODE_ENV\)/);
  assert.doesNotMatch(source, /process\.env\.NODE_ENV \?\? "unknown"/);
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
