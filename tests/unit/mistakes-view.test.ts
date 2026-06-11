import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildCoachDraftForMistake,
  buildMistakeRepairWorkflow,
  buildReviewCardForMistake,
  formatMistakeSourceLabel,
  formatMistakeStatusLabel,
  inferMistakeKind,
  mistakeMatchesKindFilter,
  parseMistakeKindFilter,
  parseMistakeSourceFilter,
  parseMistakeStatusFilter,
} from "@/server/mistakes/view";

test("mistakes filters default to open status and all sources", () => {
  assert.equal(parseMistakeStatusFilter(undefined), "open");
  assert.equal(parseMistakeStatusFilter("resolved"), "resolved");
  assert.equal(parseMistakeStatusFilter("bad"), "open");

  assert.equal(parseMistakeSourceFilter(undefined), "all");
  assert.equal(parseMistakeSourceFilter("project"), "project");
  assert.equal(parseMistakeSourceFilter("code"), "code");
  assert.equal(parseMistakeSourceFilter("bad"), "all");

  assert.equal(parseMistakeKindFilter(undefined), "all");
  assert.equal(parseMistakeKindFilter("algorithm"), "algorithm");
  assert.equal(parseMistakeKindFilter("term"), "term");
  assert.equal(parseMistakeKindFilter("bad"), "all");
});

test("mistake labels format status and source for UI", () => {
  assert.equal(formatMistakeStatusLabel("open"), "未解决");
  assert.equal(formatMistakeStatusLabel("resolved"), "已解决");
  assert.equal(formatMistakeSourceLabel("quiz"), "小测验");
  assert.equal(formatMistakeSourceLabel("coach"), "Coach");
  assert.equal(formatMistakeSourceLabel("project"), "项目实践");
});

test("mistake kind inference distinguishes boundary, code, term, and fact issues", () => {
  assert.equal(
    inferMistakeKind({ source: "quiz", summary: "二分搜索边界条件错了", prompt: "", explanation: "" }),
    "算法边界错误",
  );
  assert.equal(
    inferMistakeKind({ source: "code", summary: "返回值越界", prompt: "off-by-one", explanation: "" }),
    "算法边界错误",
  );
  assert.equal(
    inferMistakeKind({ source: "code", summary: "Python 实现有 bug", prompt: "变量覆盖", explanation: "" }),
    "代码错误",
  );
  assert.equal(
    inferMistakeKind({ source: "quiz", summary: "把 RAG 当成数据库", prompt: "", explanation: "" }),
    "术语混淆",
  );
  assert.equal(
    inferMistakeKind({ source: "quiz", summary: "搞混了 SWE-bench 和 HumanEval", prompt: "", explanation: "" }),
    "事实性错误",
  );
});

test("mistake kind filters match inferred repair categories", () => {
  assert.equal(
    mistakeMatchesKindFilter(
      { source: "quiz", summary: "二分搜索边界条件错了", prompt: "", explanation: "" },
      "algorithm",
    ),
    true,
  );
  assert.equal(
    mistakeMatchesKindFilter(
      { source: "code", summary: "Python 实现有 bug", prompt: "变量覆盖", explanation: "" },
      "code",
    ),
    true,
  );
  assert.equal(
    mistakeMatchesKindFilter(
      { source: "quiz", summary: "把 RAG 当成数据库", prompt: "", explanation: "" },
      "term",
    ),
    true,
  );
  assert.equal(
    mistakeMatchesKindFilter(
      { source: "quiz", summary: "把 RAG 当成数据库", prompt: "", explanation: "" },
      "fact",
    ),
    false,
  );
});

test("buildCoachDraftForMistake turns a misconception into coach-ready context", () => {
  const draft = buildCoachDraftForMistake({
    source: "quiz",
    summary: "把 attention 当成平均池化",
    prompt: "Self-Attention 的输出如何得到？",
    explanation: "它是基于 QK 相似度对 V 做加权和。",
    userAnswer: "所有 token 平均一下",
  });

  assert.match(draft, /请帮我解释这个误区/);
  assert.match(draft, /误区摘要：把 attention 当成平均池化/);
  assert.match(draft, /原问题\/提示：Self-Attention/);
  assert.match(draft, /我之前的回答：所有 token 平均一下/);
  assert.match(draft, /系统解释：它是基于 QK 相似度对 V 做加权和/);
});

test("buildReviewCardForMistake turns a misconception into an idempotent review card", () => {
  const card = buildReviewCardForMistake({
    id: "mistake-1",
    userId: "user-1",
    lessonId: "lesson-1",
    source: "project",
    summary: "把 RAG 评估指标写错",
    prompt: "项目里 recall@k 怎么算？",
    explanation: "先定义 relevant documents，再按 top-k 命中率计算。",
    userAnswer: "直接看回答像不像",
  });

  assert.equal(card.id, "mistake-card:mistake-1");
  assert.equal(card.userId, "user-1");
  assert.equal(card.lessonId, "lesson-1");
  assert.equal(card.type, "misconception");
  assert.match(card.front, /错题修复：把 RAG 评估指标写错/);
  assert.match(card.back, /原问题：项目里 recall@k 怎么算/);
  assert.match(card.back, /我之前的回答：直接看回答像不像/);
  assert.match(card.back, /正确解释：先定义 relevant documents/);
  assert.deepEqual(card.tags, ["mistake", "project", "术语混淆"]);
});

test("buildMistakeRepairWorkflow shows the five-step repair state machine", () => {
  const openWorkflow = buildMistakeRepairWorkflow({
    status: "open",
    reviewCardCount: 0,
    reviewedCardCount: 0,
  });

  assert.deepEqual(openWorkflow.map((step) => step.label), [
    "发现误区",
    "让 Coach 解释",
    "生成复习卡",
    "完成一次复习",
    "标记已解决",
  ]);
  assert.deepEqual(openWorkflow.map((step) => step.state), [
    "current",
    "todo",
    "todo",
    "todo",
    "todo",
  ]);
  assert.match(openWorkflow[0]?.description ?? "", /已进入修复队列/);

  const reviewedWorkflow = buildMistakeRepairWorkflow({
    status: "active",
    reviewCardCount: 2,
    reviewedCardCount: 1,
  });

  assert.deepEqual(reviewedWorkflow.map((step) => step.state), [
    "done",
    "done",
    "done",
    "done",
    "current",
  ]);
  assert.match(reviewedWorkflow[3]?.description ?? "", /已复习 1\/2 张/);

  const resolvedWorkflow = buildMistakeRepairWorkflow({
    status: "resolved",
    reviewCardCount: 1,
    reviewedCardCount: 1,
  });

  assert.equal(resolvedWorkflow.every((step) => step.state === "done"), true);
});

test("mistakes page exposes type filters and repair actions", () => {
  const source = readFileSync("src/app/mistakes/page.tsx", "utf8");

  assert.match(source, /parseMistakeKindFilter/);
  assert.match(source, /focusMistakeId/);
  assert.match(source, /当前先修这一条/);
  assert.match(source, /buildMistakeRepairWorkflow/);
  assert.match(source, /修复流程/);
  assert.match(source, /发现误区/);
  assert.match(source, /完成一次复习/);
  assert.match(source, /reviewCount: true/);
  assert.match(source, /项目实践/);
  assert.match(source, /生成复习卡/);
  assert.match(source, /标记已解决/);
});

test("mistakes page keeps the focused repair action sticky on mobile", () => {
  const source = readFileSync("src/app/mistakes/page.tsx", "utf8");

  assert.match(source, /aria-label="错题修复移动操作"/);
  assert.match(source, /sticky bottom-16 z-20/);
  assert.match(source, /bg-background\/95/);
  assert.match(source, /backdrop-blur/);
  assert.match(source, /sm:static/);
  assert.match(source, /sm:border-0/);
  assert.match(source, /让 Coach 解释/);
  assert.match(source, /生成复习卡/);
});

test("mistakes header badge is localized for learners", () => {
  const source = readFileSync("src/app/mistakes/page.tsx", "utf8");

  assert.match(source, /badge="错题修复"/);
  assert.doesNotMatch(source, /badge="Mistakes"/);
});

test("mistakes repair actions keep mobile touch targets", () => {
  const source = readFileSync("src/app/mistakes/page.tsx", "utf8");

  assert.match(source, /const mistakeRepairActionCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(source, /<div className="grid gap-2 sm:flex sm:flex-wrap">/);

  const listIndex = source.indexOf('title="误区清单"');
  assert.notEqual(listIndex, -1);
  for (const label of ["让 Coach 解释", "生成复习卡", "标记已解决"]) {
    const labelIndex = source.indexOf(label, listIndex);
    assert.notEqual(labelIndex, -1);
    const ctaWindow = source.slice(Math.max(0, labelIndex - 260), labelIndex + label.length);
    assert.match(ctaWindow, /className=\{mistakeRepairActionCtaClassName\}/);
  }

  const lessonCta = ">回到课程</Link>";
  const lessonCtaIndex = source.indexOf(lessonCta);
  assert.notEqual(lessonCtaIndex, -1);
  const lessonCtaWindow = source.slice(Math.max(0, lessonCtaIndex - 260), lessonCtaIndex + lessonCta.length);
  assert.match(lessonCtaWindow, /className=\{mistakeRepairActionCtaClassName\}/);
});

test("mistakes page-level actions keep mobile touch targets", () => {
  const source = readFileSync("src/app/mistakes/page.tsx", "utf8");

  assert.match(source, /const mistakePageCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(
    source,
    /<Button asChild size="sm" variant="secondary" className=\{mistakePageCtaClassName\}>\s*<Link href="\/coach">打开 Coach<\/Link>/,
  );
  assert.match(
    source,
    /<Button asChild size="sm" variant="outline" className=\{mistakePageCtaClassName\}>\s*<Link href="\/review">去复习<\/Link>/,
  );
  assert.match(
    source,
    /<Button type="submit" size="sm" className=\{mistakePageCtaClassName\}>搜索错题<\/Button>/,
  );
});

test("mistakes filter chips keep mobile touch targets", () => {
  const source = readFileSync("src/app/mistakes/page.tsx", "utf8");

  assert.match(source, /const mistakeFilterCtaClassName = "min-h-11 w-full sm:w-auto";/);
  assert.match(source, /const mistakeFilterRowClassName = "grid gap-2 sm:flex sm:flex-wrap";/);

  for (const optionsName of ["statusOptions", "sourceOptions", "kindOptions"]) {
    assert.match(
      source,
      new RegExp(`${optionsName}\\.map\\(\\(option\\) =>[\\s\\S]{0,260}className=\\{mistakeFilterCtaClassName\\}`),
    );
  }
  assert.equal((source.match(/className=\{mistakeFilterRowClassName\}/g) ?? []).length, 3);
});

test("mistakes search input keeps a mobile touch target", () => {
  const source = readFileSync("src/app/mistakes/page.tsx", "utf8");

  assert.match(source, /const mistakeSearchInputClassName = "min-h-11";/);
  assert.match(
    source,
    /<Input\s+name="q"\s+defaultValue=\{q\}\s+placeholder="搜索 RAG \/ 二分 \/ SWE-bench \/ 术语混淆"\s+className=\{mistakeSearchInputClassName\}\s+\/>/,
  );
});
