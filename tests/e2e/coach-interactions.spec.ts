import { expect, test } from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import { execFileSync } from "node:child_process";
import { enterLearningApp, previewToken } from "@/../tests/e2e/helpers";

loadEnvConfig(process.cwd());

function deleteThoughtReview(reviewId: string) {
  const script = String.raw`
    import { PrismaClient } from "@prisma/client";

    const reviewId = process.env.E2E_THOUGHT_REVIEW_ID;
    if (!reviewId) throw new Error("Missing E2E_THOUGHT_REVIEW_ID");
    const prisma = new PrismaClient();

    await prisma.reviewLog.deleteMany({
      where: { flashcard: { id: { startsWith: "thought:" + reviewId + ":" } } },
    });
    await prisma.flashcard.deleteMany({
      where: { id: { startsWith: "thought:" + reviewId + ":" } },
    });
    await prisma.misconception.deleteMany({
      where: { sourceKey: { startsWith: "coach:" + reviewId + ":" } },
    });
    await prisma.thoughtReview.deleteMany({ where: { id: reviewId } });
    await prisma.$disconnect();
  `;

  execFileSync(process.execPath, ["--import", "tsx", "--eval", script], {
    cwd: process.cwd(),
    env: { ...process.env, E2E_THOUGHT_REVIEW_ID: reviewId },
    stdio: "pipe",
  });
}

test("coach flow submits a thought and shows structured review @interaction", async ({ page }) => {
  test.skip(Boolean(previewToken), "Preview Mode is read-only; mutation flow runs only in local Demo mode.");

  const marker = `e2e-coach-${Date.now()}`;
  let reviewId: string | null = null;

  try {
    await enterLearningApp(page, "/coach?mode=concept_question");
    await expect(page.getByRole("heading", { name: "思路评审" })).toBeVisible();

    const form = page.getByTestId("coach-thought-form");
    await expect(form).toBeVisible();
    await expect(form.locator('select[name="mode"]')).toHaveValue("concept_question");

    await form.getByLabel("输入内容").fill(
      `我觉得 Self-Attention 就是把所有 token 做平均。${marker}`,
    );

    await Promise.all([
      page.waitForURL((url) => url.pathname === "/coach" && url.searchParams.has("reviewId"), {
        timeout: 20_000,
      }),
      form.getByRole("button", { name: "提交给 Coach" }).click(),
    ]);

    reviewId = new URL(page.url()).searchParams.get("reviewId");
    expect(reviewId).toBeTruthy();

    const result = page.getByTestId("coach-review-result");
    await expect(result).toBeVisible();
    await expect(result.getByText(new RegExp(`你的观点[\\s\\S]*${marker}`))).toBeVisible();
    await expect(result.getByText("卡片沉淀")).toBeVisible();
  } finally {
    if (reviewId) deleteThoughtReview(reviewId);
  }
});

test("coach flow generates flashcards and opens focused review @interaction", async ({ page }) => {
  test.skip(Boolean(previewToken), "Preview Mode is read-only; mutation flow runs only in local Demo mode.");

  const marker = `e2e-coach-review-${Date.now()}`;
  let reviewId: string | null = null;

  try {
    await enterLearningApp(page, "/coach?mode=concept_question");
    await expect(page.getByRole("heading", { name: "思路评审" })).toBeVisible();

    const form = page.getByTestId("coach-thought-form");
    await expect(form).toBeVisible();
    await form.getByLabel("输入内容").fill(
      `我觉得 attention 就是把所有 token 平均一下。${marker}`,
    );

    await Promise.all([
      page.waitForURL((url) => url.pathname === "/coach" && url.searchParams.has("reviewId"), {
        timeout: 20_000,
      }),
      form.getByRole("button", { name: "提交给 Coach" }).click(),
    ]);

    reviewId = new URL(page.url()).searchParams.get("reviewId");
    expect(reviewId).toBeTruthy();

    await expect(page.getByTestId("coach-review-result")).toBeVisible();
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/review" && url.searchParams.get("source") === "thought-review", {
        timeout: 20_000,
      }),
      page.getByRole("button", { name: "生成卡片" }).click(),
    ]);

    await expect(page.getByRole("heading", { name: /复习/ })).toBeVisible();
    await expect(page.getByText("思路评审复习")).toBeVisible();
    await expect(page.getByText(marker).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "显示答案" })).toBeVisible();
  } finally {
    if (reviewId) deleteThoughtReview(reviewId);
  }
});
