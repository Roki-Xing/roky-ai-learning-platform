export type AppRoute = {
  href: string;
  label: string;
};

export type AppRouteGroup = {
  label: string;
  routes: AppRoute[];
};

export const APP_ROUTE_GROUPS: AppRouteGroup[] = [
  {
    label: "学习主线",
    routes: [
      { href: "/today", label: "今日学习" },
      { href: "/review", label: "复习中心" },
      { href: "/path", label: "学习路径" },
      { href: "/progress", label: "学习进度" },
      { href: "/weekly", label: "每周复盘" },
    ],
  },
  {
    label: "补弱与表达",
    routes: [
      { href: "/coach", label: "思路评审" },
      { href: "/mistakes", label: "错题误区" },
      { href: "/voice", label: "说出理解" },
      { href: "/projects", label: "项目任务" },
    ],
  },
  {
    label: "知识与探索",
    routes: [
      { href: "/library", label: "课程库" },
      { href: "/notes", label: "我的笔记" },
      { href: "/map", label: "知识地图" },
      { href: "/glossary", label: "术语路径" },
      { href: "/radar", label: "AI Radar" },
    ],
  },
  {
    label: "系统",
    routes: [{ href: "/settings", label: "设置" }],
  },
];

// Backward compatible: some pages still use a flat route list.
export const APP_ROUTES: AppRoute[] = APP_ROUTE_GROUPS.flatMap((g) => g.routes);
