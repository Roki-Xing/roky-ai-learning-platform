# Sprint 8: Cron 与提醒

## 目标

为每日学习生成增加可由外部调度器调用的 Cron 入口，并保证生产环境安全、幂等、可追踪。

## 范围

- 新增受 `CRON_SECRET` 保护的 `/api/cron/daily`。
- 按 `UserProfile.timeZone` 计算用户当天 `localDate`。
- 复用 `getOrCreateTodayPlan`，避免同一用户同一 localDate 重复生成 DailyPlan。
- 将每个用户的 cron 结果写入 `AiGenerationJob`，便于 `/admin` 排查。
- `/admin` 增加手动运行 daily cron 的按钮，并展示最近 cron job。

## 非目标

- 不实现浏览器推送、邮件、短信提醒。
- 不新增外部队列或 worker。
- 不执行用户提交的代码。
- 不泄露任何 secret 或 API key。

