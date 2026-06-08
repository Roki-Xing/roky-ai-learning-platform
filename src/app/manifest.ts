import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Roky Learn",
    short_name: "Roky Learn",
    description: "每日 AI 学习、复习、语音反思和项目实践工作台",
    start_url: "/today",
    scope: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#4f46e5",
    shortcuts: [
      {
        name: "今日学习",
        short_name: "今日",
        description: "打开今日专注模式，继续当前学习阶段。",
        url: "/today",
      },
      {
        name: "复习中心",
        short_name: "复习",
        description: "清空到期卡片，保持记忆节奏。",
        url: "/review",
      },
      {
        name: "语音反思",
        short_name: "语音",
        description: "用 60 秒说出今天的理解并交给 Coach 检查。",
        url: "/voice",
      },
      {
        name: "每周复盘",
        short_name: "周报",
        description: "查看 7 天学习总结和下周建议。",
        url: "/weekly",
      },
    ],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
