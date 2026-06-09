"use client";

import Link from "next/link";
import { Bot, MoreHorizontal, RotateCcw, Route as RouteIcon, Sparkles } from "lucide-react";
import { APP_ROUTE_GROUPS } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MOBILE_PRIMARY_ROUTES = [
  { href: "/today", label: "今日", icon: Sparkles },
  { href: "/review", label: "复习", icon: RotateCcw },
  { href: "/coach", label: "Coach", icon: Bot },
  { href: "/path", label: "路径", icon: RouteIcon },
] as const;

const MORE_ROUTE_ORDER = [
  "/",
  "/voice",
  "/books",
  "/map",
  "/library",
  "/notes",
  "/glossary",
  "/radar",
  "/projects",
  "/progress",
  "/path",
  "/weekly",
  "/mistakes",
  "/settings",
] as const;

const MORE_LABEL_BY_HREF = new Map(
  APP_ROUTE_GROUPS.flatMap((group) => group.routes).map((route) => [route.href, route.label]),
);
MORE_LABEL_BY_HREF.set("/", "首页");

function MoreSheetNav(props: { activePath: string }) {
  return (
    <Sheet>
      <SheetTrigger className="flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:text-foreground">
        <MoreHorizontal className="size-4" aria-hidden="true" />
        更多
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[82vh] overflow-y-auto p-0">
        <div className="border-b px-4 py-3">
          <SheetTitle className="text-sm font-semibold">更多学习入口</SheetTitle>
          <SheetDescription className="sr-only">
            打开表达、知识库、项目、进度、复盘和设置页面。
          </SheetDescription>
        </div>
        <nav className="grid grid-cols-2 gap-2 p-4" aria-label="更多学习入口">
          {MORE_ROUTE_ORDER.map((href) => {
            const isActive = props.activePath === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "min-h-11 rounded-md border px-3 py-3 text-sm transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {MORE_LABEL_BY_HREF.get(href) ?? href}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function MobileBottomNav(props: { activePath: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-1.5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur md:hidden" aria-label="移动端主导航">
      <div className="grid grid-cols-5 gap-1">
        {MOBILE_PRIMARY_ROUTES.map((route) => {
          const Icon = route.icon;
          const isActive = props.activePath === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center gap-1 rounded-md px-2 text-xs transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{route.label}</span>
            </Link>
          );
        })}
        <MoreSheetNav activePath={props.activePath} />
      </div>
    </nav>
  );
}
