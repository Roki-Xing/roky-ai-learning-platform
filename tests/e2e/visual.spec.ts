import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { enterLearningApp } from "@/../tests/e2e/helpers";

const visualPages = [
  { name: "homepage", path: "/", heading: "Roky Learn" },
  { name: "today", path: "/today", heading: "今日学习" },
  { name: "review", path: "/review", heading: /复习/ },
  { name: "coach", path: "/coach", heading: "思路评审" },
  { name: "voice", path: "/voice", heading: "语音学习捕获" },
  { name: "map", path: "/map", heading: "知识地图" },
  { name: "projects", path: "/projects", heading: "项目实践" },
] as const;

const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "mobile", width: 390, height: 900 },
] as const;

test.describe("visual regression smoke @visual", () => {
  for (const viewport of viewports) {
    for (const target of visualPages) {
      test(`${target.name} renders stable ${viewport.name} screenshot`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await openVisualPage(page, target.path);
        await expect(page.getByRole("heading", { name: target.heading }).first()).toBeVisible();

        const image = await page.screenshot({
          animations: "disabled",
          fullPage: false,
          path: await visualPath(`${target.name}-${viewport.name}.png`),
        });

        expect(image.length).toBeGreaterThan(10_000);
      });
    }
  }
});

async function openVisualPage(page: Page, pagePath: string) {
  await enterLearningApp(page, pagePath);
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
