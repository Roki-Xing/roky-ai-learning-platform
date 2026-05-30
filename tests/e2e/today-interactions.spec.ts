import { expect, test } from "@playwright/test";
import { enterLearningApp, previewToken } from "@/../tests/e2e/helpers";

test("today learning flow submits quiz answer and saves code draft @interaction", async ({ page }) => {
  test.skip(Boolean(previewToken), "Preview Mode is read-only; mutation flow runs only in local Demo mode.");

  await enterLearningApp(page, "/today");
  await expect(page.getByRole("heading", { name: "今日学习" })).toBeVisible();

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
