import { expect, test } from "@playwright/test";
import { enterLearningApp, previewToken } from "@/../tests/e2e/helpers";

test("coach flow submits a thought and shows structured review @interaction", async ({ page }) => {
  test.skip(Boolean(previewToken), "Preview Mode is read-only; mutation flow runs only in local Demo mode.");

  await enterLearningApp(page, "/coach?mode=concept_question");
  await expect(page.getByRole("heading", { name: "思路评审" })).toBeVisible();

  const form = page.getByTestId("coach-thought-form");
  await expect(form).toBeVisible();
  await expect(form.locator('select[name="mode"]')).toHaveValue("concept_question");

  const marker = `e2e-coach-${Date.now()}`;
  await form.getByLabel("输入内容").fill(
    `我觉得 Self-Attention 就是把所有 token 做平均。${marker}`,
  );

  await Promise.all([
    page.waitForURL((url) => url.pathname === "/coach" && url.searchParams.has("reviewId"), {
      timeout: 20_000,
    }),
    form.getByRole("button", { name: "提交给 Coach" }).click(),
  ]);

  const result = page.getByTestId("coach-review-result");
  await expect(result).toBeVisible();
  await expect(result.getByText(new RegExp(`你的观点[\\s\\S]*${marker}`))).toBeVisible();
  await expect(result.getByText("卡片沉淀")).toBeVisible();
});
