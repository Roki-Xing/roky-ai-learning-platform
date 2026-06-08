import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PromptStudioCard } from "@/app/admin/ui/prompt-studio-card";
import { buildAdminPromptStudioSummary } from "@/server/admin/prompt-studio";

test("buildAdminPromptStudioSummary summarizes prompt versions, failures, and repair samples", () => {
  const now = new Date("2026-06-03T08:00:00.000Z");

  const summary = buildAdminPromptStudioSummary({
    jobs: [
      {
        id: "job-success",
        type: "daily_plan",
        status: "success",
        createdAt: now,
        model: "deepseek-chat",
        error: null,
        input: {
          localDate: "2026-06-03",
          schemaVersion: "2.3",
          promptVersion: "daily-plan-v2.3-learning-desire",
        },
        output: {
          schemaVersion: "2.3",
          qualityScore: 92,
          qualityWarnings: [],
          qualityChecks: { invalidJsonFallback: false },
          qualityMetrics: {},
        },
      },
      {
        id: "job-repaired",
        type: "daily_plan",
        status: "success",
        createdAt: new Date("2026-06-02T08:00:00.000Z"),
        model: "deepseek-chat",
        error: null,
        input: {
          localDate: "2026-06-02",
          schemaVersion: "2.3",
        },
        output: {
          schemaVersion: "2.3",
          rawPrimary: "{broken json",
          qualityScore: 61,
          qualityWarnings: ["触发 JSON repair 或 fallback"],
          qualityChecks: { invalidJsonFallback: true },
          qualityMetrics: {},
          meta: { repaired: true, repairReason: "json_parse" },
        },
      },
      {
        id: "job-fallback",
        type: "daily_plan",
        status: "error",
        createdAt: new Date("2026-06-01T08:00:00.000Z"),
        model: null,
        error: "DeepSeek timeout",
        input: {
          localDate: "2026-06-01",
          schemaVersion: "2.2",
        },
        output: {
          schemaVersion: "2.3",
          qualityScore: 54,
          qualityWarnings: ["触发 JSON repair 或 fallback"],
          qualityChecks: { invalidJsonFallback: true },
          qualityMetrics: {},
          meta: { fallback: true, repairAttempted: true },
        },
      },
      {
        id: "job-failed",
        type: "cron_daily_plan",
        status: "failed",
        createdAt: new Date("2026-05-31T08:00:00.000Z"),
        model: "deepseek-chat",
        error: "schema validation failed",
        input: {
          localDate: "2026-05-31",
          schemaVersion: "2.3",
        },
        output: null,
      },
    ],
    plans: [
      {
        id: "plan-1",
        localDate: "2026-06-03",
        status: "planned",
        source: "deepseek",
        schemaVersion: "2.3",
        isTest: false,
        archivedAt: null,
      },
      {
        id: "plan-2",
        localDate: "2026-06-01",
        status: "planned",
        source: "template",
        schemaVersion: "2.2",
        isTest: true,
        archivedAt: null,
      },
    ],
  });

  assert.equal(summary.promptVersion, "daily-plan-v2.3-learning-desire");
  assert.equal(summary.currentSchemaVersion, "2.3");
  assert.equal(summary.latestJobSchemaVersion, "2.3");
  assert.equal(summary.schemaDriftCount, 2);
  assert.deepEqual(summary.schemaVersionCounts, [
    { schemaVersion: "2.3", count: 5 },
    { schemaVersion: "2.2", count: 2 },
  ]);

  assert.deepEqual(
    summary.failedExamples.map((item) => item.id),
    ["job-fallback", "job-failed"],
  );
  assert.match(summary.failedExamples[0]?.error ?? "", /DeepSeek timeout/);

  assert.deepEqual(
    summary.fallbackExamples.map((item) => [item.id, item.reasons]),
    [
      ["job-repaired", ["repair", "rawPrimary", "quality-warning"]],
      ["job-fallback", ["fallback", "quality-warning"]],
    ],
  );

  assert.equal(summary.manualRepair.status, "ready");
  assert.equal(summary.manualRepair.sampleJobId, "job-repaired");
  assert.match(summary.manualRepair.note, /原始输出/);
  assert.doesNotMatch(summary.manualRepair.note, /rawPrimary|repair prompt/);
});

test("buildAdminPromptStudioSummary reports a waiting repair state without samples", () => {
  const summary = buildAdminPromptStudioSummary({
    jobs: [
      {
        id: "job-success",
        type: "daily_plan",
        status: "success",
        createdAt: new Date("2026-06-03T08:00:00.000Z"),
        model: "deepseek-chat",
        error: null,
        input: { localDate: "2026-06-03", schemaVersion: "2.3" },
        output: { schemaVersion: "2.3" },
      },
    ],
    plans: [],
  });

  assert.equal(summary.failedExamples.length, 0);
  assert.equal(summary.fallbackExamples.length, 0);
  assert.equal(summary.manualRepair.status, "waiting-for-sample");
  assert.equal(summary.manualRepair.sampleJobId, null);
  assert.match(summary.manualRepair.note, /兜底或修复样例/);
  assert.doesNotMatch(summary.manualRepair.note, /fallback|repair/);
});

test("PromptStudioCard localizes creator-facing labels without changing technical terms", () => {
  const markup = renderToStaticMarkup(
    React.createElement(PromptStudioCard, {
      authed: true,
      defaultLocalDate: "2026-06-03",
      regenerateAction: async () => {},
      summary: {
        promptVersion: "daily-plan-v2.3-learning-desire",
        currentSchemaVersion: "2.3",
        latestJobSchemaVersion: "2.2",
        schemaDriftCount: 2,
        schemaVersionCounts: [
          { schemaVersion: "2.3", count: 5 },
          { schemaVersion: "2.2", count: 2 },
        ],
        failedExamples: [
          {
            id: "job-failed",
            type: "cron_daily_plan",
            status: "failed",
            createdAt: new Date("2026-06-03T00:00:00.000Z"),
            model: "deepseek-chat",
            localDate: "2026-06-03",
            schemaVersion: null,
            error: "schema validation failed",
          },
        ],
        fallbackExamples: [
          {
            id: "job-repaired",
            type: "daily_plan",
            status: "success",
            createdAt: new Date("2026-06-02T00:00:00.000Z"),
            model: "deepseek-chat",
            localDate: "2026-06-02",
            schemaVersion: "2.3",
            error: null,
            reasons: ["fallback", "repair", "rawPrimary", "quality-warning"],
          },
        ],
        manualRepair: {
          status: "ready",
          sampleJobId: "job-repaired",
          note: "最近已有 rawPrimary/失败样例，可用当前 repair prompt 做手动验证；此面板不自动调用模型。",
        },
      },
    }),
  );

  assert.match(markup, /Prompt Studio/);
  assert.match(markup, /Prompt 版本/);
  assert.match(markup, /Schema 版本/);
  assert.match(markup, /最新生成 schema/);
  assert.match(markup, /漂移数量/);
  assert.match(markup, /样例/);
  assert.match(markup, /重新生成某日期计划（测试）/);
  assert.match(markup, /失败/);
  assert.match(markup, /成功/);
  assert.match(markup, /Cron 计划/);
  assert.match(markup, /每日计划/);
  assert.match(markup, /可测试/);
  assert.match(markup, /最近兜底 \/ 修复样例/);
  assert.match(markup, /兜底生成/);
  assert.match(markup, /JSON 修复/);
  assert.match(markup, /原始输出/);
  assert.match(markup, /修复提示/);
  assert.match(markup, /质量警告/);
  assert.match(markup, /Schema 版本：2\.3/);
  assert.match(markup, /Schema 版本：2\.2/);
  assert.match(markup, /Schema 版本：未标记/);
  assert.doesNotMatch(markup, /Prompt version:/);
  assert.doesNotMatch(markup, /Schema version:/);
  assert.doesNotMatch(markup, /最新 job schema:/);
  assert.doesNotMatch(markup, /schema 2\.3/);
  assert.doesNotMatch(markup, /schema 2\.2/);
  assert.doesNotMatch(markup, /schema -/);
  assert.doesNotMatch(markup, /drift:/);
  assert.doesNotMatch(markup, /sample:/);
  assert.doesNotMatch(markup, /（test）/);
  assert.doesNotMatch(markup, />failed</);
  assert.doesNotMatch(markup, />success</);
  assert.doesNotMatch(markup, />ready</);
  assert.doesNotMatch(markup, />fallback</);
  assert.doesNotMatch(markup, />repair</);
  assert.doesNotMatch(markup, />rawPrimary</);
  assert.doesNotMatch(markup, />quality-warning</);
  assert.doesNotMatch(markup, /最近 fallback \/ repair 样例/);
  assert.doesNotMatch(markup, /rawPrimary\/失败样例|repair prompt/);
});

test("PromptStudioCard regenerate action keeps a mobile touch target", () => {
  const source = readFileSync("src/app/admin/ui/prompt-studio-card.tsx", "utf8");

  assert.match(source, /const promptStudioCtaClassName = "min-h-11 w-full sm:w-auto";/);

  const regenerateIndex = source.indexOf("重新生成某日期计划（测试）");
  assert.notEqual(regenerateIndex, -1);
  const regenerateBlock = source.slice(Math.max(0, regenerateIndex - 260), regenerateIndex + 120);
  assert.match(regenerateBlock, /className=\{promptStudioCtaClassName\}/);
  assert.doesNotMatch(
    regenerateBlock,
    /<Button type="submit" size="sm" variant="secondary" disabled=\{!authed\}>/,
  );
});

test("PromptStudioCard regenerate date input keeps a mobile touch target", () => {
  const source = readFileSync("src/app/admin/ui/prompt-studio-card.tsx", "utf8");

  assert.match(
    source,
    /const promptStudioInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none";/,
  );

  const inputIndex = source.indexOf('name="localDate"');
  assert.notEqual(inputIndex, -1);
  const inputBlock = source.slice(inputIndex, inputIndex + 260);
  assert.match(inputBlock, /className=\{promptStudioInputClassName\}/);
  assert.doesNotMatch(
    inputBlock,
    /className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"/,
  );
});
