import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { APP_ROUTE_GROUPS } from "../src/lib/routes";

const appDir = join(process.cwd(), "src", "app");

function collectPageRoutes(dir: string, routePrefix = ""): string[] {
  if (!existsSync(dir)) return [];
  const routes: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  if (entries.some((entry) => entry.isFile() && entry.name === "page.tsx")) {
    routes.push(routePrefix || "/");
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("(") || entry.name.startsWith("_")) continue;
    const childDir = join(dir, entry.name);
    if (!statSync(childDir).isDirectory()) continue;
    routes.push(...collectPageRoutes(childDir, `${routePrefix}/${entry.name}`));
  }

  return routes;
}

function collectRouteHandlers(dir: string, routePrefix = ""): string[] {
  if (!existsSync(dir)) return [];
  const routes: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  if (entries.some((entry) => entry.isFile() && entry.name === "route.ts")) {
    routes.push(routePrefix || "/");
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("(") || entry.name.startsWith("_")) continue;
    routes.push(...collectRouteHandlers(join(dir, entry.name), `${routePrefix}/${entry.name}`));
  }

  return routes;
}

const pageRoutes = collectPageRoutes(appDir).sort();
const routeHandlers = collectRouteHandlers(appDir).sort();
const navigationRoutes = APP_ROUTE_GROUPS.flatMap((group) =>
  group.routes.map((route) => ({ group: group.label, ...route })),
);
const navHrefs = new Set(navigationRoutes.map((route) => route.href));
const pageRouteSet = new Set(pageRoutes);

const expectedCoreRoutes = [
  "/",
  "/today",
  "/review",
  "/coach",
  "/voice",
  "/map",
  "/library",
  "/notes",
  "/glossary",
  "/radar",
  "/projects",
  "/path",
  "/weekly",
  "/mistakes",
  "/progress",
  "/settings",
  "/admin",
  "/login",
];
const intentionalSubpages = ["/projects/portfolio"];

const audit = {
  appDir: relative(process.cwd(), appDir),
  existingPages: pageRoutes,
  routeHandlers,
  appRouteGroups: APP_ROUTE_GROUPS,
  missingCorePages: expectedCoreRoutes.filter((route) => !pageRouteSet.has(route)),
  pagesWithoutNavigation: pageRoutes.filter(
    (route) =>
      !navHrefs.has(route) &&
      !["/", "/admin", "/login"].includes(route) &&
      !intentionalSubpages.includes(route),
  ),
  navigationWithoutPage: navigationRoutes
    .filter((route) => !pageRouteSet.has(route.href))
    .map((route) => ({ href: route.href, label: route.label, group: route.group })),
};

console.log("Roky Learn route audit");
console.log(`Pages: ${audit.existingPages.length}`);
console.log(`Navigation entries: ${navigationRoutes.length}`);
console.log(`Missing core pages: ${audit.missingCorePages.length || "none"}`);
console.log(`Pages without navigation: ${audit.pagesWithoutNavigation.length || "none"}`);
console.log(`Navigation without page: ${audit.navigationWithoutPage.length || "none"}`);
console.log(JSON.stringify(audit, null, 2));

if (audit.missingCorePages.length || audit.navigationWithoutPage.length) {
  process.exitCode = 1;
}
