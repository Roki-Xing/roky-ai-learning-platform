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
import { getBuildInfo } from "@/lib/build-info";

const settingsPrimaryCtaClassName = "min-h-11 w-full sm:w-auto";
const settingsInputClassName = "min-h-11";
const settingsChoiceSelectClassName = "min-h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const defaultSettingsGoalText = "系统化学习 AI 和工程实践";

type SettingsChoiceOption = {
  value: string;
  label: string;
};

const settingsLevelOptions: SettingsChoiceOption[] = [
  { value: "beginner", label: "入门：补齐基础概念" },
  { value: "intermediate", label: "进阶：强化项目实践" },
  { value: "advanced", label: "高阶：挑战系统设计" },
];

const settingsDifficultyOptions: SettingsChoiceOption[] = [
  { value: "easy", label: "轻松：降低新内容密度" },
  { value: "standard", label: "标准：保持正常节奏" },
  { value: "hard", label: "挑战：提高输出要求" },
];

const settingsLanguageOptions: SettingsChoiceOption[] = [
  { value: "zh", label: "中文：优先中文讲解" },
  { value: "en", label: "英文：优先英文讲解" },
];

function formatSettingsGoalInputValue(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized || normalized === "ai_general") return defaultSettingsGoalText;
  return normalized;
}

function settingsChoiceValue(value: string | null | undefined, fallback: string) {
  const normalized = value?.trim();
  return normalized || fallback;
}

function settingsChoiceOptions(options: SettingsChoiceOption[], currentValue: string) {
  if (options.some((option) => option.value === currentValue)) return options;
  return [{ value: currentValue, label: `当前自定义：${currentValue}` }, ...options];
}

function formatSettingsRuntimeEnvLabel(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : "未标记环境";
}

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
  const buildInfo = getBuildInfo();

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
                  className={settingsInputClassName}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="text-sm font-medium">目标</div>
                  <Input
                    name="goal"
                    placeholder="例如：系统化学习 AI 和工程实践"
                    defaultValue={formatSettingsGoalInputValue(profile.goal)}
                    className={settingsInputClassName}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">水平</div>
                  <select
                    name="level"
                    defaultValue={settingsChoiceValue(profile.level, "beginner")}
                    className={settingsChoiceSelectClassName}
                  >
                    {settingsChoiceOptions(settingsLevelOptions, settingsChoiceValue(profile.level, "beginner")).map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="text-sm font-medium">每日时长（分钟）</div>
                  <Input
                    name="dailyMinutes"
                    aria-label="每日时长（分钟）"
                    type="number"
                    min={5}
                    max={240}
                    defaultValue={profile.dailyMinutes ?? 30}
                    className={settingsInputClassName}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">难度</div>
                  <select
                    name="difficulty"
                    defaultValue={settingsChoiceValue(profile.difficulty, "standard")}
                    className={settingsChoiceSelectClassName}
                  >
                    {settingsChoiceOptions(settingsDifficultyOptions, settingsChoiceValue(profile.difficulty, "standard")).map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="text-sm font-medium">语言</div>
                  <select
                    name="language"
                    defaultValue={settingsChoiceValue(profile.language, "zh")}
                    className={settingsChoiceSelectClassName}
                  >
                    {settingsChoiceOptions(settingsLanguageOptions, settingsChoiceValue(profile.language, "zh")).map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <div className="text-sm font-medium">时区</div>
                  <Input
                    name="timeZone"
                    placeholder="例如：Asia/Shanghai"
                    defaultValue={profile.timeZone ?? "Asia/Shanghai"}
                    className={settingsInputClassName}
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
                  aria-label="知识卡去重天数"
                  type="number"
                  min={0}
                  max={90}
                  defaultValue={profile.knowledgeAvoidDays ?? 7}
                  className={settingsInputClassName}
                />
              </div>

              <div className="grid gap-2 sm:flex sm:items-center sm:gap-2">
                <Button type="submit" className={settingsPrimaryCtaClassName}>
                  保存设置
                </Button>
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
                <div className="text-muted-foreground">APP_VERSION</div>
                <div className="font-mono text-xs">{buildInfo.appVersion}</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-muted-foreground">GIT_COMMIT_SHA</div>
                <div className="font-mono text-xs">{buildInfo.gitCommitSha.slice(0, 12)}</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-muted-foreground">BUILD_TIME</div>
                <div className="font-mono text-xs">{buildInfo.buildTime}</div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="text-muted-foreground">NODE_ENV</div>
                <div className="font-mono text-xs">{formatSettingsRuntimeEnvLabel(process.env.NODE_ENV)}</div>
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
