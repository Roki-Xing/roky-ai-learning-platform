# Daily Cron

## 当前行为

- `/api/cron/daily` 是每日计划生成的调度入口。
- route handler 先校验 `CRON_SECRET`，未通过返回 401。
- route handler 放在 auth proxy 公共路径中，避免被登录重定向拦截；业务安全由 Cron secret 负责。
- `runDailyCronForUsers()` 读取 `UserProfile`，按每个用户的 `timeZone` 计算 `localDate`。
- 每个用户调用 `getOrCreateTodayPlan()`，复用既有幂等逻辑。
- 每次用户级 cron 结果写入 `AiGenerationJob`：
  - `type`: `cron_daily_plan`
  - `status`: `success` 或 `failed`
  - `model`: `internal`
  - `input`: userId、localDate、timeZone、now
  - `output`: planId、lessonId、planStatus、source
- 失败的 `cron_daily_plan` job 可以通过 `retryFailedDailyCronJob()` 定向重试。
- retry 会读取失败 job input 里的 `now`，并只对同一个 `userId` 重新运行 `runDailyCronForUsers()`。

## Admin

- `/admin` 提供“运行 daily cron”按钮。
- `/admin` 单独显示最近 10 条 `cron_daily_plan` job。
- `/admin` 对失败 cron 记录显示“重试此用户 cron”按钮。
- admin action 仍受 `ADMIN_SECRET` cookie 保护。

## 安全约束

- 不在页面或日志输出 `CRON_SECRET`。
- Cron route 不依赖登录态，必须依赖 secret。
- 不执行用户代码。

## 验证

- 单元测试覆盖 secret 校验、auth policy 放行、幂等生成、失败写入 `AiGenerationJob`。
- 单元测试覆盖失败 job retry、成功 job 不可 retry、跨用户 job 不可 retry。
- 生产验证应检查：
  - 无 secret 调用返回 401。
  - 带 secret 调用返回 JSON summary。
  - 重复调用不重复创建同一天 active DailyPlan。
  - `/admin` 可看到 `cron_daily_plan` 记录。
  - `/admin` 失败 cron 记录可定向重试。
