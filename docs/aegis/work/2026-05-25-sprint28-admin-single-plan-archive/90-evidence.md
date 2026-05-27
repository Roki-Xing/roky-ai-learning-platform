# Sprint 28 Evidence

## 本地验证

- RED：`npm test -- tests/unit/admin-plan-governance.test.ts` 初次失败于 `markPlanArchived is not a function`。
- GREEN：`npm test -- tests/unit/admin-plan-governance.test.ts` 6 项通过。
- GREEN：`npm test -- tests/unit/admin-plan-governance.test.ts tests/unit/library-plan-filter.test.ts tests/unit/daily-plan-idempotency.test.ts` 13 项通过。
- 本地：`npm run lint` 通过。
- 本地：`npm test` 96 项通过。
- 本地：`npm run build` 通过。

## 生产验证

- 待补：`118.89.119.107` 恢复 SSH/HTTP 后执行生产备份、rsync、远端目标测试、build、service health 和 `/admin` Host-header 验收。
- 当前阻塞：网关机 TCP 22/80/443 可连接，但 SSH 卡在 banner exchange，HTTP/HTTPS 不返回内容；从 `118.25.15.72` 旁路复核也一致。
