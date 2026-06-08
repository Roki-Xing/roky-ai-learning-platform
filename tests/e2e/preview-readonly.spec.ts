import { expect, test, type Page } from "@playwright/test";
import { enterLearningApp, previewToken } from "@/../tests/e2e/helpers";

const previewRequired = Boolean(previewToken);

test.describe("Preview Mode write protection", () => {
  test.skip(!previewRequired, "Set E2E_PREVIEW_TOKEN and server PREVIEW_TOKEN to run Preview write-protection E2E.");

  test("settings mutations are rejected in Preview Mode @preview", async ({ page }) => {
    await enterPreview(page, "/settings");

    const marker = `Preview blocked ${Date.now()}`;
    await page.getByPlaceholder("例如：Xing").fill(marker);

    const response = await submitAndWaitForRejectedPost(
      page,
      "/settings",
      page.getByRole("button", { name: "保存设置" }).click(),
    );

    expect(response.status()).toBeGreaterThanOrEqual(400);
    await expect(page).not.toHaveURL(/saved=1/);
  });

  test("today quiz mutations are rejected in Preview Mode @preview", async ({ page }) => {
    await enterPreview(page, "/today");

    await page.getByLabel("切换到小测验").click();
    const quizQuestion = page.getByTestId("today-quiz-question").first();
    if (!(await quizQuestion.isVisible().catch(() => false))) {
      test.skip(true, "当前 Preview 数据没有 quiz question，跳过 quiz 写保护路径。");
    }

    const quizInput = quizQuestion.locator("input[name='userAnswer']").first();
    await quizInput.check();
    const quizResponse = await submitAndWaitForRejectedPost(
      page,
      "/today",
      quizQuestion.getByRole("button", { name: "提交答案" }).click(),
    );
    expect(quizResponse.status()).toBeGreaterThanOrEqual(400);
    await expect(page.getByText("Preview Mode：当前使用 demo-user")).toBeVisible();
  });

  test("today code mutations are rejected in Preview Mode @preview", async ({ page }) => {
    await enterPreview(page, "/today");

    await page.getByLabel("切换到代码练习").click();
    const codeExercise = page.getByTestId("today-code-exercise").first();
    if (!(await codeExercise.isVisible().catch(() => false))) {
      test.skip(true, "当前 Preview 数据没有 code exercise，跳过 code 写保护路径。");
    }

    const codeInput = codeExercise.getByLabel("我的提交（仅保存，不执行）");
    if (await codeInput.isDisabled()) {
      test.skip(true, "当前环境未启用 CodeSubmission，跳过 code 写保护路径。");
    }

    await codeInput.fill("def preview_write_guard():\n    return 'blocked'\n");
    const codeResponse = await submitAndWaitForRejectedPost(
      page,
      "/today",
      codeExercise.getByRole("button", { name: "保存提交" }).click(),
    );
    expect(codeResponse.status()).toBeGreaterThanOrEqual(400);
    await expect(page.getByText("Preview Mode：当前使用 demo-user")).toBeVisible();
  });

  test("admin is hidden from Preview Mode @preview", async ({ page }) => {
    await enterPreview(page, "/");
    const response = await page.goto("/admin", { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBeGreaterThanOrEqual(400);
    await expect(page.getByRole("heading", { name: /管理 \/ 调试/ })).toHaveCount(0);
  });
});

async function enterPreview(page: Page, next: string) {
  await enterLearningApp(page, next);
  await expect(page.getByText("Preview Mode：当前使用 demo-user")).toBeVisible();
}

async function submitAndWaitForRejectedPost(
  page: Page,
  pathname: string,
  submit: Promise<unknown>,
) {
  const responsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());
    return (
      response.request().method() === "POST" &&
      url.pathname === pathname &&
      response.status() >= 400
    );
  });

  await Promise.all([responsePromise, submit]);
  return await responsePromise;
}
