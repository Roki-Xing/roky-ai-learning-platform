import { expect, test, type Page } from "@playwright/test";

const previewToken = process.env.E2E_PREVIEW_TOKEN;

async function enterLearningApp(page: Page, next = "/today") {
  if (previewToken) {
    const query = new URLSearchParams({ token: previewToken, next });
    await page.goto(`/preview?${query.toString()}`);
    await page.waitForLoadState("domcontentloaded");
    return;
  }

  const query = new URLSearchParams({ next });
  await page.goto(`/login?${query.toString()}`);
  await expect(page.getByRole("heading", { name: /AI、算法、代码能力/ })).toBeVisible();
  const demoButton = page.getByRole("button", { name: "进入 Demo 模式" });
  await expect(
    demoButton,
    "本地 e2e 需要非 production Demo 模式；生产 smoke 请设置 E2E_PREVIEW_TOKEN。",
  ).toBeVisible();
  await demoButton.click();
  await page.waitForLoadState("domcontentloaded");
}

test("login or preview flow reaches homepage and core learning pages @smoke", async ({ page }) => {
  if (!previewToken) {
    await page.goto("/login?next=/today");
    await expect(page.getByRole("heading", { name: /AI、算法、代码能力/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "进入 Demo 模式" })).toBeVisible();
  }

  await enterLearningApp(page, "/");
  await expect(page.getByRole("heading", { name: "Roky Learn" })).toBeVisible();
  await expect(page.getByText("现在最值得做")).toBeVisible();
  await expect(page.getByText("当前项目进度")).toBeVisible();

  await page.goto("/today");
  await expect(page.getByText("专注学习模式").first()).toBeVisible();
  await expect(page.getByText("今日概览").first()).toBeVisible();

  await page.goto("/projects");
  await expect(page.getByRole("heading", { name: "项目实践" })).toBeVisible();
  await expect(page.getByText("Mission Mode").first()).toBeVisible();
  await expect(page.getByText("今日项目任务").first()).toBeVisible();

  await page.goto("/glossary");
  await expect(page.getByRole("heading", { name: "术语库" })).toBeVisible();
  await expect(page.getByText("路径化学习").first()).toBeVisible();
  await expect(page.getByText(/已看过/).first()).toBeVisible();

  await page.goto("/radar");
  await expect(page.getByRole("heading", { name: "AI Radar" })).toBeVisible();
  await expect(page.getByText("路径化学习").first()).toBeVisible();
  await expect(page.getByText(/未掌握/).first()).toBeVisible();

  await page.goto("/coach");
  await expect(page.getByRole("heading", { name: "思路评审" })).toBeVisible();
  await expect(page.getByText("我的理解")).toBeVisible();

  await page.goto("/voice");
  await expect(page.getByRole("heading", { name: "语音学习捕获" })).toBeVisible();
  await expect(page.getByText("说出你的理解", { exact: true })).toBeVisible();
  await expect(page.getByText("语音学习流水线")).toBeVisible();
  await expect(page.getByRole("button", { name: "送 Coach 检查" })).toBeVisible();
  await expect(page.getByRole("button", { name: "整理成笔记" })).toBeVisible();
});

test("review trainer hides answers until reveal @smoke", async ({ page }) => {
  await enterLearningApp(page, "/review");
  await expect(page.getByRole("heading", { name: /复习/ })).toBeVisible();

  const revealButton = page.getByRole("button", { name: "显示答案" });
  if (!(await revealButton.isVisible().catch(() => false))) {
    test.skip(true, "当前 demo 数据没有到期卡片，跳过主动回忆 reveal smoke。");
  }

  await expect(page.getByText("先在脑中回答，再显示答案。")).toBeVisible();
  await revealButton.click();
  await expect(page.getByRole("button", { name: /1 忘了/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /4 很熟/ })).toBeVisible();
});
