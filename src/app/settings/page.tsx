import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requireUser } from "@/server/auth/require-user";
import { getOrCreateUserProfile } from "@/server/profile/get-or-create";
import { buildSettingsSavedNotice } from "@/server/profile/settings";
import { updateSettingsAction } from "@/app/settings/actions";
import { env } from "@/lib/env";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const sp = await searchParams;
  const user = await requireUser();
  const profile = await getOrCreateUserProfile({ userId: user.id });
  const savedNotice = buildSettingsSavedNotice(sp.saved);

  const deepseekConfigured = Boolean(env.DEEPSEEK_API_KEY);
  const deepseekModel = env.DEEPSEEK_MODEL ?? "deepseek-v4-flash";
  const deepseekBaseUrl = env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";

  return (
    <AppShell activePath="/settings" title="设置">
      <PageHeader
        title="设置"
        subtitle="学习偏好"
        badge="偏好"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-lg lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">学习偏好</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateSettingsAction} className="grid gap-4">
              {savedNotice ? (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                  <div className="font-medium">{savedNotice.title}</div>
                  <div className="mt-1 text-xs">{savedNotice.description}</div>
                </div>
              ) : null}

              <div className="grid gap-2">
                <div className="text-sm font-medium">显示名称（可选）</div>
                <Input
                  name="displayName"
                  placeholder="例如：Xing"
                  defaultValue={profile.displayName ?? ""}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="text-sm font-medium">目标</div>
                  <Input
                    name="goal"
                    placeholder="例如：ai_general"
                    defaultValue={profile.goal ?? "ai_general"}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">水平</div>
                  <Input
                    name="level"
                    placeholder="beginner / intermediate / advanced"
                    defaultValue={profile.level ?? "beginner"}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="text-sm font-medium">每日时长（分钟）</div>
                  <Input
                    name="dailyMinutes"
                    type="number"
                    min={5}
                    max={240}
                    defaultValue={profile.dailyMinutes ?? 30}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">难度</div>
                  <Input
                    name="difficulty"
                    placeholder="easy / standard / hard"
                    defaultValue={profile.difficulty ?? "standard"}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="text-sm font-medium">语言</div>
                  <Input
                    name="language"
                    placeholder="zh / en"
                    defaultValue={profile.language ?? "zh"}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">时区</div>
                  <Input
                    name="timeZone"
                    placeholder="例如：Asia/Shanghai"
                    defaultValue={profile.timeZone ?? "Asia/Shanghai"}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="text-sm font-medium">偏好领域（可选）</div>
                <Textarea
                  name="preferredAreas"
                  className="min-h-24"
                  placeholder={"例如：\nLLM\n算法\n工程实践\n（支持逗号或换行分隔）"}
                  defaultValue={
                    Array.isArray(profile.preferredAreas)
                      ? profile.preferredAreas.join("\n")
                      : ""
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="text-sm font-medium">每日术语偏好</div>
                  <Textarea
                    name="preferredTermSlugs"
                    className="min-h-24"
                    placeholder={"例如：\nRAG\nSelf Attention\nEmbedding"}
                    defaultValue={
                      Array.isArray(profile.preferredTermSlugs)
                        ? profile.preferredTermSlugs.join("\n")
                        : ""
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">每日 Radar 偏好</div>
                  <Textarea
                    name="preferredEntitySlugs"
                    className="min-h-24"
                    placeholder={"例如：\nSWE-bench\nShunyu Yao\nOpenAI"}
                    defaultValue={
                      Array.isArray(profile.preferredEntitySlugs)
                        ? profile.preferredEntitySlugs.join("\n")
                        : ""
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2 sm:max-w-xs">
                <div className="text-sm font-medium">知识卡去重天数</div>
                <Input
                  name="knowledgeAvoidDays"
                  type="number"
                  min={0}
                  max={90}
                  defaultValue={profile.knowledgeAvoidDays ?? 7}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit">保存设置</Button>
                <div className="text-xs text-muted-foreground">
                  userId：<span className="font-mono">{user.id}</span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Provider 状态</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="text-muted-foreground">DeepSeek</div>
                <div className={deepseekConfigured ? "font-medium" : "text-muted-foreground"}>
                  {deepseekConfigured ? "已配置" : "未配置"}
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-muted-foreground">Model</div>
                <div className="font-mono text-xs">{deepseekModel}</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-muted-foreground">Base URL</div>
                <div className="font-mono text-xs">{deepseekBaseUrl}</div>
              </div>
              <div className="pt-2 text-xs text-muted-foreground">
                API Key 永不在前端保存/展示；只通过服务端环境变量注入。
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">系统</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="text-muted-foreground">NODE_ENV</div>
                <div className="font-mono text-xs">{process.env.NODE_ENV ?? "unknown"}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Cron/运维相关 secret 只在服务端管理。
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
