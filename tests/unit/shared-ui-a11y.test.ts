import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Breadcrumb, BreadcrumbEllipsis } from "@/components/ui/breadcrumb";
import { APP_ROUTE_GROUPS } from "@/lib/routes";

test("shared dialog and sheet controls use Chinese screen-reader close text", () => {
  const dialogSource = readFileSync("src/components/ui/dialog.tsx", "utf8");
  const sheetSource = readFileSync("src/components/ui/sheet.tsx", "utf8");

  assert.doesNotMatch(dialogSource, />Close</);
  assert.doesNotMatch(sheetSource, />Close</);
  assert.match(dialogSource, />关闭</);
  assert.match(sheetSource, />关闭</);
});

test("breadcrumb uses Chinese navigation and ellipsis labels", () => {
  const breadcrumbMarkup = renderToStaticMarkup(
    React.createElement(Breadcrumb, null, "当前位置"),
  );
  const ellipsisMarkup = renderToStaticMarkup(
    React.createElement(BreadcrumbEllipsis),
  );

  assert.match(breadcrumbMarkup, /aria-label="面包屑导航"/);
  assert.match(ellipsisMarkup, /更多层级/);
  assert.doesNotMatch(ellipsisMarkup, /data-slot="breadcrumb-ellipsis"[^>]*aria-hidden="true"/);
  assert.doesNotMatch(ellipsisMarkup, />More</);
});

test("app route groups organize navigation around the daily learning flow", () => {
  assert.deepEqual(
    APP_ROUTE_GROUPS.map((group) => group.label),
    ["学习主线", "补弱与表达", "知识与探索", "系统"],
  );

  assert.deepEqual(
    APP_ROUTE_GROUPS[0]?.routes.map((route) => route.href),
    ["/today", "/review", "/path", "/progress", "/weekly"],
  );
  assert.deepEqual(
    APP_ROUTE_GROUPS[1]?.routes.map((route) => route.href),
    ["/coach", "/mistakes", "/voice", "/books", "/projects"],
  );
  assert.deepEqual(
    APP_ROUTE_GROUPS[2]?.routes.map((route) => route.href),
    ["/library", "/notes", "/map", "/glossary", "/radar"],
  );

  assert.equal(APP_ROUTE_GROUPS[1]?.routes.find((route) => route.href === "/voice")?.label, "说出理解");
  assert.equal(APP_ROUTE_GROUPS[1]?.routes.find((route) => route.href === "/books")?.label, "同读书籍");
  assert.equal(APP_ROUTE_GROUPS[1]?.routes.find((route) => route.href === "/projects")?.label, "项目任务");
  assert.equal(APP_ROUTE_GROUPS[2]?.routes.find((route) => route.href === "/glossary")?.label, "术语路径");
});

test("mobile bottom nav prioritizes the learning path and keeps More sheet routes touch friendly", () => {
  const source = readFileSync("src/components/mobile/mobile-bottom-nav.tsx", "utf8");

  assert.match(source, /aria-label="移动端主导航"/);
  assert.match(source, /const MOBILE_PRIMARY_ROUTES = \[/);
  for (const label of ["今日", "复习", "Coach", "路径"]) {
    assert.match(source, new RegExp(`label: "${label}"`));
  }
  assert.doesNotMatch(source, /\{ href: "\/voice", label: "语音"/);
  assert.match(source, /\{ href: "\/path", label: "路径"/);

  for (const href of ["/voice", "/books", "/map", "/library", "/notes", "/glossary", "/radar", "/projects", "/progress", "/settings"]) {
    assert.match(source, new RegExp(`"${href}"`));
  }

  assert.match(source, /<SheetTitle className="text-sm font-semibold">更多学习入口<\/SheetTitle>/);
  assert.match(source, /<nav className="grid grid-cols-2 gap-2 p-4" aria-label="更多学习入口">/);
  assert.match(source, /className=\{cn\(\s*"min-h-11 rounded-md border px-3 py-3 text-sm transition-colors"/);
  assert.doesNotMatch(source, /className=\{cn\(\s*"rounded-md border px-3 py-3 text-sm transition-colors"/);
});

test("app shell header actions wrap into a mobile full-width row", () => {
  const source = readFileSync("src/components/app-shell.tsx", "utf8");

  assert.match(source, /<header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-2 sm:h-14 sm:flex-nowrap sm:py-0">/);
  assert.match(source, /<div className="grid w-full gap-2 sm:flex sm:w-auto sm:shrink-0 sm:items-center">\{actions\}<\/div>/);
  assert.doesNotMatch(source, /<header className="flex h-14 items-center justify-between gap-3 border-b bg-background px-4">/);
  assert.doesNotMatch(source, /<div className="flex shrink-0 items-center gap-2">\{actions\}<\/div>/);
});
