import { expect, test, type Page } from "@playwright/test";
import { enterLearningApp } from "@/../tests/e2e/helpers";

const matrixWidths = [375, 390, 430, 768, 1024, 1440] as const;
const matrixPages = [
  { name: "login", path: "/login", heading: /AI、算法、代码能力/ },
  { name: "home", path: "/", heading: "Roky Learn" },
  { name: "today", path: "/today", heading: "今日学习" },
  { name: "review", path: "/review", heading: /复习/ },
  { name: "coach", path: "/coach", heading: "思路评审" },
  { name: "voice", path: "/voice", heading: "语音学习捕获" },
  { name: "map", path: "/map", heading: "知识地图" },
  { name: "projects", path: "/projects", heading: "项目实践" },
  { name: "projects-portfolio", path: "/projects/portfolio", heading: "项目作品集" },
  { name: "path", path: "/path", heading: "学习路径" },
  { name: "weekly", path: "/weekly", heading: "每周复盘" },
  { name: "mistakes", path: "/mistakes", heading: "错题误区" },
  { name: "progress", path: "/progress", heading: "学习进度" },
  { name: "settings", path: "/settings", heading: "设置" },
  { name: "library", path: "/library", heading: "课程库" },
] as const;

test.describe("responsive width matrix @mobile-matrix", () => {
  for (const width of matrixWidths) {
    for (const target of matrixPages) {
      test(`${target.name} stays usable at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: width < 768 ? 900 : 1000 });
        await openMatrixPage(page, target.path);

        await expect(page.getByRole("heading", { name: target.heading }).first()).toBeVisible();
        await expect(page.locator("body")).toBeVisible();

        const overflow = await page.evaluate(() => {
          const documentElement = document.documentElement;
          const body = document.body;
          return Math.max(documentElement.scrollWidth, body.scrollWidth) - documentElement.clientWidth;
        });

        expect(overflow).toBeLessThanOrEqual(2);
      });
    }
  }
});

async function openMatrixPage(page: Page, pagePath: string) {
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
