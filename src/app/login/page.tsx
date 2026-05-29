import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./ui/login-form";
import { isDemoUserAllowed } from "@/server/auth/demo";
import { startDemoSessionAction } from "@/app/login/actions";
import { Badge } from "@/components/ui/badge";
import { BookOpenCheck, BrainCircuit, Code2, Mic2, Network } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const nextRaw = sp.next ?? "/today";
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/today";

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect(next);
  }
  const demoAllowed = isDemoUserAllowed();

  const features = [
    { icon: BookOpenCheck, title: "每日学习闭环", text: "主课、引导步骤、测验、反思和复习卡片连在一起。" },
    { icon: BrainCircuit, title: "Coach 思路评审", text: "把自己的理解写出来，系统帮你找出误区和缺口。" },
    { icon: Code2, title: "代码与项目实践", text: "保存代码草稿、请求反馈，再沉淀成长期复习卡。" },
    { icon: Mic2, title: "语音笔记", text: "把口语想法转写成笔记、Coach 输入和复习材料。" },
  ] as const;

  return (
    <div className="flex min-h-screen w-full bg-muted/20 px-4 py-8 md:items-center md:py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.15fr)_420px] lg:items-center">
        <section className="rounded-lg border bg-card p-5 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Roky Learn</Badge>
            <Badge variant="outline">Daily AI Learning</Badge>
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            AI、算法、代码能力和行业广度的每日学习工作台
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            每天只做一条清晰学习路径：生成今日课程，完成主动练习，把理解交给 Coach 检查，再通过复习卡片长期保留。
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-lg border bg-background/70 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-md border bg-indigo-50 text-indigo-700">
                      <Icon className="size-4" />
                    </div>
                    <div className="text-sm font-medium">{feature.title}</div>
                  </div>
                  <div className="mt-2 text-xs leading-5 text-muted-foreground">{feature.text}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Network className="size-4" />
              长期积累
            </div>
            <div className="mt-2 leading-6">
              术语库、AI Radar、知识地图和项目实践会把每天的学习连接起来，避免内容只停留在一次性聊天里。
            </div>
          </div>
        </section>

        <div className="grid gap-4">
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">登录 Roky Learn</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <LoginForm next={next} />
              {demoAllowed ? (
                <form action={startDemoSessionAction} className="grid gap-2 border-t pt-4">
                  <input type="hidden" name="next" value={next} />
                  <Button type="submit" variant="secondary">
                    进入 Demo 模式
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Demo 模式使用 <span className="font-mono">demo-user</span>，仅适合开发或临时演示。
                  </div>
                </form>
              ) : null}
            </CardContent>
          </Card>
          <div className="rounded-lg border bg-background/70 p-3 text-xs leading-5 text-muted-foreground">
            本页使用 Supabase Auth（邮箱魔法链接）。Preview 入口和 Demo 入口不会展示任何 API Key。
          </div>
        </div>
      </div>
    </div>
  );
}
