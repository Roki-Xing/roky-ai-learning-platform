import { expect, type Page } from "@playwright/test";
import { DEMO_SESSION_COOKIE, DEMO_SESSION_TOKEN } from "@/server/auth/demo";

export const previewToken = process.env.E2E_PREVIEW_TOKEN;
const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

export async function enterLearningApp(
  page: Page,
  next = "/today",
  options: { directDemoSession?: boolean } = {},
) {
  if (previewToken) {
    const query = new URLSearchParams({ token: previewToken, next });
    await page.goto(`/preview?${query.toString()}`);
    await page.waitForLoadState("domcontentloaded");
    return;
  }

  if (options.directDemoSession) {
    await page.context().addCookies([
      {
        name: DEMO_SESSION_COOKIE,
        value: DEMO_SESSION_TOKEN,
        url: baseURL,
      },
    ]);
    await page.goto(next);
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
  await Promise.all([
    page.waitForURL((url) => url.pathname !== "/login", {
      timeout: 30_000,
      waitUntil: "domcontentloaded",
    }),
    demoButton.click(),
  ]);
  await page.waitForLoadState("domcontentloaded");
}
