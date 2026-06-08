import { expect, test } from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import { execFileSync } from "node:child_process";
import { enterLearningApp, previewToken } from "@/../tests/e2e/helpers";

loadEnvConfig(process.cwd());

function createDueReviewCard(marker: string) {
  const script = String.raw`
    import { PrismaClient } from "@prisma/client";

    const marker = process.env.E2E_REVIEW_CARD_ID;
    if (!marker) throw new Error("Missing E2E_REVIEW_CARD_ID");
    const userId = "demo-user";
    const prisma = new PrismaClient();

    const dueAt = new Date("2000-01-01T00:00:00.000Z");
    await prisma.userProfile.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    await prisma.flashcard.upsert({
      where: { id: marker },
      update: {
        front: "E2E review queue prompt " + marker,
        back: "E2E review queue answer " + marker,
        dueAt,
        reviewCount: 0,
        correctCount: 0,
        tags: ["thought-review"],
      },
      create: {
        id: marker,
        userId,
        lessonId: null,
        front: "E2E review queue prompt " + marker,
        back: "E2E review queue answer " + marker,
        type: "concept",
        tags: ["thought-review"],
        dueAt,
      },
    });

    await prisma.$disconnect();
  `;

  execFileSync(process.execPath, ["--import", "tsx", "--eval", script], {
    cwd: process.cwd(),
    env: { ...process.env, E2E_REVIEW_CARD_ID: marker },
    stdio: "pipe",
  });
}

function deleteReviewCard(marker: string) {
  const script = String.raw`
    import { PrismaClient } from "@prisma/client";

    const marker = process.env.E2E_REVIEW_CARD_ID;
    if (!marker) throw new Error("Missing E2E_REVIEW_CARD_ID");
    const prisma = new PrismaClient();

    await prisma.reviewLog.deleteMany({ where: { flashcardId: marker } });
    await prisma.flashcard.deleteMany({ where: { id: marker } });
    await prisma.$disconnect();
  `;

  execFileSync(process.execPath, ["--import", "tsx", "--eval", script], {
    cwd: process.cwd(),
    env: { ...process.env, E2E_REVIEW_CARD_ID: marker },
    stdio: "pipe",
  });
}

test("review flow reveals an answer, rates it, and advances the queue @interaction", async ({ page }) => {
  test.skip(Boolean(previewToken), "Preview Mode is read-only; mutation flow runs only in local Demo mode.");

  const marker = `e2e-review-${Date.now()}`;
  createDueReviewCard(marker);

  try {
    await enterLearningApp(page, "/review?source=thought-review");
    await expect(page.getByRole("heading", { name: /复习/ })).toBeVisible();
    await expect(page.getByText(`E2E review queue prompt ${marker}`)).toBeVisible();
    await expect(page.getByText("先在脑中回答，再显示答案。")).toBeVisible();
    await expect(page.getByText(`E2E review queue answer ${marker}`)).not.toBeVisible();

    await page.getByRole("button", { name: "显示答案" }).click();
    await expect(page.getByText(`E2E review queue answer ${marker}`)).toBeVisible();

    await Promise.all([
      page.waitForLoadState("networkidle"),
      page.getByRole("button", { name: /很熟 \+14d/ }).click(),
    ]);

    await expect(page.getByText(`E2E review queue prompt ${marker}`)).not.toBeVisible();
    await expect(
      page.getByText("复习完成").or(page.getByText(/队列：\d+ 张/)),
    ).toBeVisible();
  } finally {
    deleteReviewCard(marker);
  }
});
