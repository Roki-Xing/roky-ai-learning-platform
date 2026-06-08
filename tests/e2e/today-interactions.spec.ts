import { expect, test, type Page } from "@playwright/test";
import { enterLearningApp, previewToken } from "@/../tests/e2e/helpers";

async function openFocusStage(page: Page, title: string) {
  await page.getByRole("button", { name: new RegExp(`切换到${title}`) }).click();
}

test("today learning flow submits quiz answer and saves code draft @interaction", async ({ page }) => {
  test.skip(Boolean(previewToken), "Preview Mode is read-only; mutation flow runs only in local Demo mode.");

  await enterLearningApp(page, "/today");
  await expect(page.getByRole("heading", { name: "今日学习" })).toBeVisible();

  await openFocusStage(page, "小测验");
  const quiz = page.getByTestId("today-quiz").first();
  await expect(quiz).toBeVisible();

  const firstQuestion = quiz.getByTestId("today-quiz-question").first();
  await expect(firstQuestion).toBeVisible();
  await firstQuestion.locator('input[name="userAnswer"]').first().check();
  await Promise.all([
    page.waitForLoadState("networkidle"),
    firstQuestion.getByRole("button", { name: "提交答案" }).click(),
  ]);
  await expect(firstQuestion.getByText(/已提交：/)).toBeVisible();
  await expect(firstQuestion.getByText("提交后显示解析")).not.toBeVisible();

  await openFocusStage(page, "代码练习");
  const code = page.getByTestId("today-code-exercise").first();
  await expect(code).toBeVisible();
  const marker = `# e2e saved code ${Date.now()}`;
  await code.getByLabel("我的提交（仅保存，不执行）").fill(`def solve():\n    return 42\n${marker}\n`);
  await Promise.all([
    page.waitForLoadState("networkidle"),
    code.getByRole("button", { name: "保存提交" }).click(),
  ]);
  await expect(code.getByText("上次保存：")).toBeVisible();
  await expect(code.getByLabel("我的提交（仅保存，不执行）")).toHaveValue(new RegExp(marker));
});

test("today completion next actions carry lesson context into voice and coach @interaction", async ({ page }) => {
  test.skip(Boolean(previewToken), "Preview Mode is read-only; completion setup runs only in local Demo mode.");

  await enterLearningApp(page, "/today");
  await expect(page.getByRole("heading", { name: "今日学习" })).toBeVisible();
  await openFocusStage(page, "反思与完成");

  let completion = page.getByTestId("learning-completion-card").filter({ hasText: "今日已完成" }).first();
  if (!(await completion.isVisible().catch(() => false))) {
    const completeButton = page.getByRole("button", { name: "标记完成并生成卡片" }).first();
    await expect(completeButton).toBeVisible();
    await Promise.all([
      page.waitForLoadState("networkidle"),
      completeButton.click(),
    ]);
    completion = page.getByTestId("learning-completion-card").filter({ hasText: "今日已完成" }).first();
    await expect(completion).toBeVisible();
  }

  await completion.getByRole("link", { name: /说出今天的理解|继续语音复盘/ }).click();
  await expect(page).toHaveURL(/\/voice\?lessonId=.+&mode=today_lesson/);
  await expect(page.getByRole("heading", { name: "语音学习捕获" })).toBeVisible();
  await expect(page.locator('select[name="mode"]')).toHaveValue("today_lesson");
  expect(new URL(page.url()).searchParams.get("lessonId")).toBeTruthy();

  await enterLearningApp(page, "/today");
  await expect(page.getByRole("heading", { name: "今日学习" })).toBeVisible();
  await openFocusStage(page, "反思与完成");
  const refreshedCompletion = page.getByTestId("learning-completion-card").filter({
    hasText: "今日已完成",
  }).first();
  await expect(refreshedCompletion).toBeVisible();

  await refreshedCompletion.getByRole("link", { name: /让 Coach 检查|继续 Coach 检查/ }).click();
  await expect(page).toHaveURL(/\/coach\?lessonId=.+&mode=today_lesson/);
  await expect(page.getByRole("heading", { name: "思路评审" })).toBeVisible();
  await expect(page.locator('select[name="mode"]')).toHaveValue("today_lesson");
  expect(new URL(page.url()).searchParams.get("lessonId")).toBeTruthy();
});
