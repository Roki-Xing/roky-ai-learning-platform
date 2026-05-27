import test from "node:test";
import assert from "node:assert/strict";
import { buildReviewEmptyState } from "@/server/review/empty-state";

test("buildReviewEmptyState gives next actions for the default queue", () => {
  const state = buildReviewEmptyState({ source: null, projectId: null });

  assert.equal(state.title, "暂无到期卡片");
  assert.equal(state.description, "当前复习队列已清空，可以继续今日学习或回到课程库补充笔记。");
  assert.deepEqual(state.actions, [
    { label: "去今日学习", href: "/today" },
    { label: "查看课程库", href: "/library" },
    { label: "查看进度", href: "/progress" },
  ]);
});

test("buildReviewEmptyState keeps focused project review users in project context", () => {
  const state = buildReviewEmptyState({
    source: "project",
    projectId: "project-123",
  });

  assert.equal(state.title, "当前项目暂无到期卡片");
  assert.equal(state.actions[0]?.label, "回到项目");
  assert.equal(state.actions[0]?.href, "/projects?projectId=project-123");
  assert.equal(state.actions[1]?.href, "/projects");
});

test("buildReviewEmptyState handles focused code feedback queue", () => {
  const state = buildReviewEmptyState({
    source: "code-feedback",
    projectId: "project-123",
  });

  assert.equal(state.title, "当前代码反馈暂无到期卡片");
  assert.equal(state.description, "可以回到项目继续提交代码，或查看全部复习队列。");
  assert.equal(state.actions[0]?.href, "/projects?projectId=project-123");
  assert.equal(state.actions[1]?.href, "/review");
});
