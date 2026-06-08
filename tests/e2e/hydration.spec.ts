import { expect, test, type Page } from "@playwright/test";
import { enterLearningApp } from "@/../tests/e2e/helpers";
import { visualPages } from "@/../tests/e2e/visual-pages";

const hydrationPatterns = [
  /hydrated but some attributes/i,
  /hydration failed/i,
  /server rendered html didn't match/i,
  /text content does not match server-rendered html/i,
  /there was an error while hydrating/i,
];

test.describe("hydration console guard @hydration", () => {
  for (const target of visualPages) {
    test(`${target.name} has no hydration mismatch console errors`, async ({
      browserName,
      page,
    }, testInfo) => {
      test.skip(
        browserName !== "chromium" || testInfo.project.name !== "Desktop Chrome",
        "Hydration console guard runs on Desktop Chrome to keep diagnostics stable.",
      );

      const hydrationErrors: string[] = [];
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        const text = message.text();
        if (isHydrationMessage(text)) hydrationErrors.push(text);
      });
      page.on("pageerror", (error) => {
        const message = error.message;
        if (isHydrationMessage(message)) hydrationErrors.push(message);
      });

      await openHydrationPage(page, target.path);
      await expect(page.getByRole("heading", { name: target.heading }).first()).toBeVisible();
      await page.waitForTimeout(500);

      expect(hydrationErrors.map(summarizeHydrationMessage)).toEqual([]);
    });
  }
});

async function openHydrationPage(page: Page, pagePath: string) {
  if (pagePath === "/login") {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");
    return;
  }

  await enterLearningApp(page, pagePath, { directDemoSession: true });
  if (page.url().includes("/preview") || page.url().includes("/login")) {
    await page.goto(pagePath);
  }
  await page.waitForLoadState("domcontentloaded");
}

function isHydrationMessage(message: string) {
  return hydrationPatterns.some((pattern) => pattern.test(message));
}

function summarizeHydrationMessage(message: string) {
  return message
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8)
    .join("\n");
}
