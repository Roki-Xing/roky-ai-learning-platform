import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { enterLearningApp } from "@/../tests/e2e/helpers";
import { visualPages } from "@/../tests/e2e/visual-pages";

test.describe("visual regression smoke @visual", () => {
  for (const target of visualPages) {
    test(`${target.name} renders stable screenshot`, async ({ page }, testInfo) => {
      await openVisualPage(page, target.path);
      await expect(page.getByRole("heading", { name: target.heading }).first()).toBeVisible();

      const image = await page.screenshot({
        animations: "disabled",
        fullPage: false,
        path: await visualPath(`${target.name}-${slug(testInfo.project.name)}.png`),
      });

      expect(image.length).toBeGreaterThan(10_000);
    });
  }
});

async function openVisualPage(page: Page, pagePath: string) {
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

async function visualPath(fileName: string) {
  const dir = path.join(process.cwd(), "test-results", "visual-smoke");
  await mkdir(dir, { recursive: true });
  return path.join(dir, fileName);
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
