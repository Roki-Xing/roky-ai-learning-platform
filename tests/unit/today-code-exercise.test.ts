import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

process.env.DATABASE_URL ??= "postgresql://user:pass@localhost:5432/test";
process.env.CRON_SECRET ??= "test-cron-secret";

test("today code exercise localizes submission and feedback enum labels", async () => {
  const { CodeExercise } = await import("@/app/today/ui/code-exercise");
  const markup = renderToStaticMarkup(
    React.createElement(CodeExercise, {
      lessonId: "lesson-1",
      localDate: "2026-06-06",
      supported: true,
      exercise: {
        language: "python",
        title: "实现 softmax",
        prompt: "补全 softmax。",
        starterCode: "def softmax(scores):\n    return scores\n",
      },
      submission: {
        code: "def softmax(scores):\n    return scores\n",
        language: "python",
        status: "feedback_ready",
        updatedAt: "2026-06-06T09:30:00.000Z",
      },
      feedback: {
        provider: "fallback",
        overall: "partially_correct",
        summary: "缺少归一化。",
        strengths: ["保留了函数结构。"],
        issues: [
          {
            type: "logic",
            severity: "high",
            message: "直接返回 scores，没有除以 exp 总和。",
          },
        ],
        suggestions: [],
        hints: [],
        suggestedTests: [],
        flashcards: [],
        nextSteps: ["补一个全零输入测试。"],
        updatedAt: "2026-06-06T09:31:00.000Z",
      },
    }),
  );

  assert.match(markup, /反馈已生成/);
  assert.match(markup, /系统生成/);
  assert.match(markup, /部分正确/);
  assert.match(markup, /代码语言：/);
  assert.match(markup, /Python/);
  assert.match(markup, /name="language" value="python"/);
  assert.match(markup, /高优先级/);
  assert.match(markup, /逻辑问题/);
  assert.doesNotMatch(markup, /fallback/);
  assert.doesNotMatch(markup, /language：/);
  assert.doesNotMatch(markup, /feedback_ready/);
  assert.doesNotMatch(markup, /partially_correct/);
  assert.doesNotMatch(markup, /\[high\/logic\]/);
});

test("today code exercise offers a mobile-friendly thinking and voice path", async () => {
  const { CodeExercise } = await import("@/app/today/ui/code-exercise");
  const markup = renderToStaticMarkup(
    React.createElement(CodeExercise, {
      lessonId: "lesson-voice-1",
      localDate: "2026-06-06",
      supported: true,
      exercise: {
        language: "python",
        title: "实现 binary search",
        prompt: "先说明思路，再写出二分查找。",
        starterCode: "",
      },
      submission: null,
      feedback: null,
    }),
  );

  assert.match(markup, /代码思路模式/);
  assert.match(markup, /先说清思路/);
  assert.match(markup, /伪代码草稿/);
  assert.match(markup, /语音解释入口/);
  assert.match(markup, /手机端可以先写思路或伪代码/);
  assert.match(markup, /href="\/voice\?lessonId=lesson-voice-1&amp;mode=code_debug"/);
  assert.match(markup, /grid gap-3 sm:flex sm:items-center sm:justify-between/);
  assert.match(markup, /grid gap-2 sm:flex sm:flex-wrap sm:items-center/);
  const mobileCodeActionMatches = markup.match(/min-h-11 w-full sm:w-auto/g) ?? [];
  assert.equal(mobileCodeActionMatches.length, 2);
  assert.match(markup, /我的提交（仅保存，不执行）/);
  assert.doesNotMatch(markup, /code_walkthrough/);
});
