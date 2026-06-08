import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("admin page header badges are localized for maintainers", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  const badgeMatches = source.match(/badge="开发运维"/g) ?? [];
  assert.equal(badgeMatches.length, 2);
  assert.doesNotMatch(source, /badge="DEV"/);
});

test("admin page localizes plan governance labels while preserving technical ids", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /function adminPlanFilterLabel/);
  assert.match(source, /function adminPlanKindLabel/);
  assert.match(source, /function adminPlanActivationLabel/);
  assert.match(source, /function adminSchemaVersionLabel/);
  assert.match(source, /formatHomeDailyPlanStatusLabel/);
  assert.match(source, /formatTodayPlanSourceLabel/);
  assert.match(source, /正式计划状态/);
  assert.match(source, /来源 \/ Schema 版本/);
  assert.match(source, /adminPlanFilterLabel\(filter\)/);
  assert.match(source, /adminPlanFilterLabel\(planFilter\)/);
  assert.match(source, /adminPlanKindLabel\(p\.isTest\)/);
  assert.match(source, /adminPlanActivationLabel\(a\.status\)/);
  assert.match(source, /formatHomeDailyPlanStatusLabel\(g\.status\)/);
  assert.match(source, /formatTodayPlanSourceLabel\(g\.source\)/);
  assert.match(source, /formatHomeDailyPlanStatusLabel\(planAudit\.chain\.plan\.status\)/);
  assert.match(source, /formatTodayPlanSourceLabel\(planAudit\.chain\.plan\.source\)/);
  assert.match(source, /adminSchemaVersionLabel\(planAudit\.chain\.plan\.schemaVersion\)/);
  assert.match(source, /adminSchemaVersionLabel\(planAudit\.chain\.plannerSummary\.schemaVersion\)/);
  assert.match(source, /formatHomeDailyPlanStatusLabel\(item\.status\)/);
  assert.match(source, /formatTodayPlanSourceLabel\(item\.source\)/);
  assert.match(source, /adminSchemaVersionLabel\(item\.schemaVersion\)/);
  assert.match(source, /formatHomeDailyPlanStatusLabel\(p\.status\)/);
  assert.match(source, /formatTodayPlanSourceLabel\(p\.source\)/);
  assert.match(source, /adminSchemaVersionLabel\(p\.schemaVersion\)/);
  assert.match(source, /adminSchemaVersionLabel\(j\.plannerSummary\.schemaVersion\)/);
  assert.match(source, /设为正式/);
  assert.match(source, /激活历史/);
  assert.match(source, /暂无激活记录/);
  assert.match(source, /Schema 版本：\$\{schemaVersion \?\? "未标记"\}/);

  assert.doesNotMatch(source, /Official plan status/);
  assert.doesNotMatch(source, /Source \/ schema/);
  assert.doesNotMatch(source, /\/ schema \{/);
  assert.doesNotMatch(source, /schema \{planAudit\.chain\.plan\.schemaVersion \?\? "-"\}/);
  assert.doesNotMatch(source, /schema \{planAudit\.chain\.plannerSummary\.schemaVersion \?\? "-"\}/);
  assert.doesNotMatch(source, /schema \{item\.schemaVersion \?\? "-"\}/);
  assert.doesNotMatch(source, /schema \{p\.schemaVersion \?\? "-"\}/);
  assert.doesNotMatch(source, /schema \{j\.plannerSummary\.schemaVersion \?\? "-"\}/);
  assert.doesNotMatch(source, />active</);
  assert.doesNotMatch(source, />test</);
  assert.doesNotMatch(source, />archived</);
  assert.doesNotMatch(source, />all</);
  assert.doesNotMatch(source, /test 计划/);
  assert.doesNotMatch(source, /planned 计划/);
  assert.doesNotMatch(source, /<span>\{g\.status\}<\/span>/);
  assert.doesNotMatch(source, /<span>\{g\.source \?\? "unknown"\}<\/span>/);
  assert.doesNotMatch(source, /\{planAudit\.chain\.plan\.status\}/);
  assert.doesNotMatch(source, /\{planAudit\.chain\.plan\.source \?\? "unknown"\}/);
  assert.doesNotMatch(source, /\{item\.status\}/);
  assert.doesNotMatch(source, /\{item\.source \?\? "unknown"\}/);
  assert.doesNotMatch(source, /\{p\.status\}/);
  assert.doesNotMatch(source, /\{p\.source \?\? "unknown"\}/);
  assert.doesNotMatch(source, /设为 active/);
  assert.doesNotMatch(source, /Activation history/);
  assert.doesNotMatch(source, /暂无 activation history/);
});

test("admin audit section headings are localized for maintainers", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /每日计划/);
  assert.match(source, /课程/);
  assert.match(source, /生成任务/);
  assert.match(source, /一致性检查/);
  assert.match(source, /选题决策记录/);
  assert.match(source, /选题输入摘要/);
  assert.match(source, /最近每日计划（10）/);
  assert.match(source, /最近生成任务（10）/);
  assert.match(source, /选题输入/);

  assert.doesNotMatch(source, />DailyPlan</);
  assert.doesNotMatch(source, />Lesson</);
  assert.doesNotMatch(source, />Generation</);
  assert.doesNotMatch(source, />Consistency checks</);
  assert.doesNotMatch(source, />CurriculumDecisionLog</);
  assert.doesNotMatch(source, />Planner input summary</);
  assert.doesNotMatch(source, /最近 DailyPlan（10）/);
  assert.doesNotMatch(source, /最近 AiGenerationJob（10）/);
  assert.doesNotMatch(source, />Planner input</);
});

test("admin audit empty states and detail copy are localized for maintainers", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /function adminAuditCheckStatusLabel/);
  assert.match(source, /function adminAuditSeverityLabel/);
  assert.match(source, /function adminJobStatusLabel/);
  assert.match(source, /暂无关联生成任务/);
  assert.match(source, /adminAuditCheckStatusLabel\(check\.status\)/);
  assert.match(source, /暂无匹配的选题决策记录/);
  assert.match(source, /暂无选题输入摘要/);
  assert.match(source, /`\$\{planAuditExceptions\.failCount\} 项失败`/);
  assert.match(source, /"正常"/);
  assert.match(source, /失败 <span className="font-mono">\{planAuditExceptions\.failCount\}/);
  assert.match(source, /警告 <span className="font-mono">\{planAuditExceptions\.warnCount\}/);
  assert.match(source, /adminAuditSeverityLabel\(item\.severity\)/);
  assert.match(source, /最近选题决策（10）/);
  assert.match(source, /选题信号快照/);
  assert.match(source, /查看输入快照 \/ 分数明细/);
  assert.match(source, /查看生成输入 \/ 输出/);
  assert.match(source, /查看决策原因、分数明细和输入快照/);
  assert.match(source, /adminJobStatusLabel\(j\.status\)/);
  assert.match(source, /查看生成输出 JSON/);
  assert.match(source, /最近每日定时任务（10）/);
  assert.match(source, /重试此用户定时任务/);
  assert.match(source, /查看定时任务输出 JSON/);
  assert.match(source, /暂无定时任务记录/);

  assert.doesNotMatch(source, /无 linked job/);
  assert.doesNotMatch(source, />\s*\{check\.status\}\s*</);
  assert.doesNotMatch(source, /暂无 matching decision log/);
  assert.doesNotMatch(source, /暂无 planner input summary/);
  assert.doesNotMatch(source, /\$\{planAuditExceptions\.failCount\} fail/);
  assert.doesNotMatch(source, /fail <span className="font-mono">\{planAuditExceptions\.failCount\}/);
  assert.doesNotMatch(source, /warn <span className="font-mono">\{planAuditExceptions\.warnCount\}/);
  assert.doesNotMatch(source, />\s*\{item\.severity\}\s*</);
  assert.doesNotMatch(source, /最近 CurriculumDecision/);
  assert.doesNotMatch(source, /Planner signal snapshot/);
  assert.doesNotMatch(source, /查看 inputSnapshot \/ scoreBreakdown/);
  assert.doesNotMatch(source, /查看 generation input \/ output/);
  assert.doesNotMatch(source, /查看 reason \/ scoreBreakdown \/ inputSnapshot/);
  assert.doesNotMatch(source, /\{j\.status\}\{j\.model \? `/);
  assert.doesNotMatch(source, /查看 output JSON/);
  assert.doesNotMatch(source, /最近 Daily Cron/);
  assert.doesNotMatch(source, /重试此用户 cron/);
  assert.doesNotMatch(source, /查看 cron output JSON/);
  assert.doesNotMatch(source, /暂无 cron 记录/);
});

test("admin environment card localizes auth status labels", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /Admin 认证/);
  assert.match(source, /\{authed \? "已登录" : "需要登录"\}/);
  assert.doesNotMatch(source, /Admin Auth/);
  assert.doesNotMatch(source, /\{authed \? "ok" : "required"\}/);
});

test("admin login shell localizes the unauthenticated card title", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /管理员登录/);
  assert.doesNotMatch(source, /Admin Login/);
});

test("admin auth controls keep mobile touch targets", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminAuthInputClassName = "min-h-11 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none";/,
  );
  assert.match(source, /const adminAuthCtaClassName = "min-h-11 w-full sm:w-auto";/);

  const authInputMatches = source.match(/className=\{adminAuthInputClassName\}/g) ?? [];
  assert.equal(authInputMatches.length, 2);

  const authButtonMatches = source.match(/className=\{adminAuthCtaClassName\}/g) ?? [];
  assert.equal(authButtonMatches.length, 3);

  assert.doesNotMatch(
    source,
    /className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none"/,
  );
  assert.doesNotMatch(source, /<Button type="submit" size="sm">\s*登录\s*<\/Button>/);
  assert.doesNotMatch(source, /<Button type="submit" size="sm">登录（写入 httpOnly cookie）<\/Button>/);
  assert.doesNotMatch(source, /<Button type="submit" size="sm" variant="secondary">退出 admin<\/Button>/);
});

test("admin flashcard labels are localized for maintainers", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /复习卡片/);
  assert.match(source, /到期复习卡片/);
  assert.match(source, /最近复习卡片（10）/);
  assert.match(source, /到期：\{c\.dueAt\.toISOString\(\)\}/);
  assert.match(source, /复习次数：\{c\.reviewCount\}/);

  assert.doesNotMatch(source, />Flashcard:/);
  assert.doesNotMatch(source, />Due Flashcard:/);
  assert.doesNotMatch(source, /最近 Flashcard/);
  assert.doesNotMatch(source, /due: \{c\.dueAt\.toISOString\(\)\}/);
  assert.doesNotMatch(source, /reviews: \{c\.reviewCount\}/);
});

test("admin data overview entity labels are localized for maintainers", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /数据概览（当前用户）/);
  assert.match(source, /用户档案: <span className="font-mono">\{userProfileCount\}/);
  assert.match(source, /每日计划: <span className="font-mono">\{dailyPlanCount\}/);
  assert.match(source, /复习记录: <span className="font-mono">\{reviewLogCount\}/);
  assert.match(source, /笔记: <span className="font-mono">\{noteCount\}/);

  assert.doesNotMatch(source, /数据概览（当前 user）/);
  assert.doesNotMatch(source, />UserProfile:/);
  assert.doesNotMatch(source, />DailyPlan:/);
  assert.doesNotMatch(source, />ReviewLog:/);
  assert.doesNotMatch(source, />Note:/);
});

test("admin data overview metadata labels are localized for maintainers", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /暂无正式计划状态/);
  assert.match(source, /来源 \/ Schema 版本/);
  assert.match(source, /Schema 版本：\{g\.schemaVersion \?\? "未标记"\}/);
  assert.match(source, /全局课程总数：\{lessonCount\}/);

  assert.doesNotMatch(source, />none</);
  assert.doesNotMatch(source, /schema \{g\.schemaVersion \?\? "unknown"\}/);
  assert.doesNotMatch(source, /全局 Lesson 总数/);
});

test("admin today loop plan status is localized for maintainers", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /今日闭环/);
  assert.match(
    source,
    /今日计划: <span className="font-mono">\{formatHomeDailyPlanStatusLabel\(plan\?\.status\)\}/,
  );

  assert.doesNotMatch(source, /plan \? plan\.status : "none"/);
});

test("admin today loop action copy is localized for maintainers", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /确保用户档案/);
  assert.match(source, /初始化领域\/主题/);
  assert.match(source, /placeholder="今日反思（可选）"/);
  assert.match(source, /一键闭环检查（生成 → 完成 → 验证）/);
  assert.match(source, /运行每日定时任务/);
  assert.match(source, /指定日期闭环检查（生成 → 完成 → 验证）/);

  assert.doesNotMatch(source, />ensure profile</);
  assert.doesNotMatch(source, />seed domains\/topics</);
  assert.doesNotMatch(source, /placeholder="reflection（可选）"/);
  assert.doesNotMatch(source, /一键 loop check/);
  assert.doesNotMatch(source, /运行 daily cron/);
  assert.doesNotMatch(source, /指定日期 loop check/);
});

test("admin today loop action buttons keep mobile touch targets", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(source, /const adminTodayLoopCtaClassName = "min-h-11 w-full sm:w-auto";/);

  const todayLoopIndex = source.indexOf("<CardTitle className=\"text-base\">今日闭环</CardTitle>");
  const duplicateTopicIndex = source.indexOf("<CardTitle className=\"text-base\">重复主题检测</CardTitle>");
  assert.notEqual(todayLoopIndex, -1);
  assert.notEqual(duplicateTopicIndex, -1);
  const todayLoopBlock = source.slice(todayLoopIndex, duplicateTopicIndex);

  const ctaMatches = todayLoopBlock.match(/className=\{adminTodayLoopCtaClassName\}/g) ?? [];
  assert.equal(ctaMatches.length, 11);

  assert.doesNotMatch(
    todayLoopBlock,
    /<Button type="submit" size="sm"(?: variant="secondary")? disabled=\{!authed\}>/,
  );
});

test("admin knowledge verification links keep mobile touch targets", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminKnowledgeVerificationLinkClassName = "inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-2";/,
  );

  const reviewItemsIndex = source.indexOf("knowledgeVerificationSummary.reviewItems.slice(0, 4).map");
  assert.notEqual(reviewItemsIndex, -1);
  const reviewItemsBlock = source.slice(reviewItemsIndex, reviewItemsIndex + 520);
  assert.match(reviewItemsBlock, /className=\{adminKnowledgeVerificationLinkClassName\}/);
  assert.doesNotMatch(
    reviewItemsBlock,
    /className="font-medium text-primary underline underline-offset-2"/,
  );
});

test("admin recent plan links keep mobile touch targets", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminRecentPlanLinkClassName = "inline-flex min-h-11 items-center text-xs text-primary underline underline-offset-2";/,
  );

  const recentPlansIndex = source.indexOf("recentPlans.map((p) => {");
  assert.notEqual(recentPlansIndex, -1);
  const recentPlansBlock = source.slice(recentPlansIndex, recentPlansIndex + 1900);
  const classMatches = recentPlansBlock.match(/className=\{adminRecentPlanLinkClassName\}/g) ?? [];
  assert.equal(classMatches.length, 2);
  assert.doesNotMatch(
    recentPlansBlock,
    /className="text-xs text-primary underline underline-offset-2"/,
  );
});

test("admin recent plan governance buttons keep mobile touch targets", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminRecentPlanGovernanceCtaClassName = "min-h-11 w-full sm:w-auto";/,
  );

  const recentPlansIndex = source.indexOf("recentPlans.map((p) => {");
  assert.notEqual(recentPlansIndex, -1);
  const flashcardsIndex = source.indexOf("<CardTitle className=\"text-base\">最近复习卡片（10）</CardTitle>", recentPlansIndex);
  assert.notEqual(flashcardsIndex, -1);
  const recentPlansBlock = source.slice(recentPlansIndex, flashcardsIndex);
  const classMatches = recentPlansBlock.match(/className=\{adminRecentPlanGovernanceCtaClassName\}/g) ?? [];
  assert.equal(classMatches.length, 2);
  assert.doesNotMatch(
    recentPlansBlock,
    /<Button\s+type="submit"\s+size="sm"\s+variant="secondary"\s+disabled=\{!authed \|\| \(!p\.isTest && !p\.archivedAt\)\}/,
  );
  assert.doesNotMatch(
    recentPlansBlock,
    /<Button\s+type="submit"\s+size="sm"\s+variant="secondary"\s+disabled=\{!authed \|\| Boolean\(p\.archivedAt\)\}/,
  );
});

test("admin recent plan action row stacks on mobile", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminRecentPlanActionRowClassName = "flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0 sm:justify-end";/,
  );

  const recentPlansIndex = source.indexOf("recentPlans.map((p) => {");
  assert.notEqual(recentPlansIndex, -1);
  const flashcardsIndex = source.indexOf("<CardTitle className=\"text-base\">最近复习卡片（10）</CardTitle>", recentPlansIndex);
  assert.notEqual(flashcardsIndex, -1);
  const recentPlansBlock = source.slice(recentPlansIndex, flashcardsIndex);
  assert.match(recentPlansBlock, /className=\{adminRecentPlanActionRowClassName\}/);
  assert.doesNotMatch(
    recentPlansBlock,
    /className="flex shrink-0 flex-wrap justify-end gap-2"/,
  );
});

test("admin recent plan filter buttons keep mobile touch targets", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminPlanFilterCtaClassName = "min-h-11 px-3";/,
  );

  const filterIndex = source.indexOf('(["active", "test", "archived", "all"] as const).map');
  assert.notEqual(filterIndex, -1);
  const filterBlock = source.slice(filterIndex, filterIndex + 520);
  assert.match(filterBlock, /className=\{adminPlanFilterCtaClassName\}/);
  assert.doesNotMatch(
    filterBlock,
    /<Button key=\{filter\} asChild size="xs" variant=\{planFilter === filter \? "default" : "secondary"\}>/,
  );
});

test("admin plan audit close button keeps mobile touch target", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminPlanAuditCloseCtaClassName = "min-h-11 px-3";/,
  );

  const planAuditIndex = source.indexOf("<CardTitle className=\"text-base\">单条计划审计链路</CardTitle>");
  assert.notEqual(planAuditIndex, -1);
  const planAuditHeaderBlock = source.slice(planAuditIndex, planAuditIndex + 360);
  assert.match(planAuditHeaderBlock, /className=\{adminPlanAuditCloseCtaClassName\}/);
  assert.doesNotMatch(
    planAuditHeaderBlock,
    /<Button asChild size="xs" variant="secondary">/,
  );
});

test("admin plan audit lesson link keeps mobile touch target", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminPlanAuditLessonLinkClassName = "mt-1 inline-flex min-h-11 items-center text-primary underline underline-offset-2";/,
  );

  const planAuditIndex = source.indexOf("<CardTitle className=\"text-base\">单条计划审计链路</CardTitle>");
  assert.notEqual(planAuditIndex, -1);
  const auditExceptionsIndex = source.indexOf("<CardTitle className=\"text-base\">计划审计异常</CardTitle>", planAuditIndex);
  assert.notEqual(auditExceptionsIndex, -1);
  const planAuditBlock = source.slice(planAuditIndex, auditExceptionsIndex);
  assert.match(planAuditBlock, /className=\{adminPlanAuditLessonLinkClassName\}/);
  assert.doesNotMatch(
    planAuditBlock,
    /className="mt-1 inline-flex text-primary underline underline-offset-2"/,
  );
});

test("admin audit exception links keep mobile touch targets", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminAuditExceptionLinkClassName = "min-h-11 px-3 shrink-0";/,
  );

  const exceptionIndex = source.indexOf("planAuditExceptions.items.map((item) => (");
  assert.notEqual(exceptionIndex, -1);
  const exceptionBlock = source.slice(exceptionIndex, exceptionIndex + 1800);
  assert.match(exceptionBlock, /className=\{adminAuditExceptionLinkClassName\}/);
  assert.doesNotMatch(
    exceptionBlock,
    /<Button asChild size="xs" variant="secondary" className="shrink-0">/,
  );
});

test("admin failed job retry button keeps mobile touch target", () => {
  const source = readFileSync("src/app/admin/page.tsx", "utf8");

  assert.match(
    source,
    /const adminFailedJobRetryCtaClassName = "min-h-11 w-full sm:w-auto";/,
  );

  const recentJobsIndex = source.indexOf("recentJobSummaries.map((j) => (");
  assert.notEqual(recentJobsIndex, -1);
  const failedJobRetryIndex = source.indexOf('{j.status === "failed" ? (', recentJobsIndex);
  assert.notEqual(failedJobRetryIndex, -1);
  const failedJobRetryBlock = source.slice(failedJobRetryIndex, failedJobRetryIndex + 900);
  assert.match(failedJobRetryBlock, /className=\{adminFailedJobRetryCtaClassName\}/);
  assert.doesNotMatch(
    failedJobRetryBlock,
    /<Button type="submit" size="sm" variant="secondary" disabled=\{!authed\}>/,
  );
});
