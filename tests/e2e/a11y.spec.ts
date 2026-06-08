import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";
import { enterLearningApp } from "@/../tests/e2e/helpers";
import { visualPages } from "@/../tests/e2e/visual-pages";

const a11yPages = visualPages.filter((target) =>
  [
    "login",
    "homepage",
    "today",
    "review",
    "coach",
    "voice",
    "map",
    "projects",
    "projects-portfolio",
    "path",
    "weekly",
    "mistakes",
    "progress",
    "settings",
    "library",
  ].includes(target.name),
);

test.describe("accessibility smoke @a11y", () => {
  for (const target of a11yPages) {
    test(`${target.name} has no critical axe violations`, async ({ browserName, page }, testInfo) => {
      test.skip(
        browserName !== "chromium" || !["Desktop Chrome", "Mobile Chrome"].includes(testInfo.project.name),
        "a11y smoke runs on desktop and mobile Chromium to keep the suite focused.",
      );
      await openA11yPage(page, target.path);
      await expect(page.getByRole("heading", { name: target.heading }).first()).toBeVisible();

      await page.addScriptTag({ content: axe.source });
      const results = await page.evaluate(async () => {
        return await window.axe.run(document, {
          resultTypes: ["violations"],
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
          },
        });
      });

      const blockingViolations = results.violations.filter((violation) =>
        ["critical", "serious"].includes(violation.impact ?? ""),
      );

      expect(formatViolations(blockingViolations)).toEqual([]);
    });
  }
});

async function openA11yPage(page: Page, pagePath: string) {
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

function formatViolations(
  violations: Array<{
    id: string;
    impact?: string | null;
    help: string;
    nodes: Array<{ target: string[] }>;
  }>,
) {
  return violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    targets: violation.nodes.slice(0, 3).map((node) => node.target.join(" ")),
  }));
}

declare global {
  interface Window {
    axe: typeof axe;
  }
}
