import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "./ui/login-form";
import { isDemoUserAllowed } from "@/server/auth/demo";
import { startDemoSessionAction } from "@/app/login/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next ?? "/today";

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect(next);
  }
  const demoAllowed = isDemoUserAllowed();

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-base">登录</CardTitle>
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
      <div className="text-xs text-muted-foreground">
        本页使用 Supabase Auth（邮箱魔法链接）。生产环境只有配置
        Supabase 或显式开启 Demo 模式后才能访问学习数据。
      </div>
    </div>
  );
}
