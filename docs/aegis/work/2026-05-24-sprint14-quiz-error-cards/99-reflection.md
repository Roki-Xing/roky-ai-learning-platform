# Sprint 14 Reflection

## 结果

Sprint 14 补齐了长期文档 Sprint 2.4 的错题卡沉淀：答错 quiz 后会产生 Misconception 和 `quiz_error` Flashcard，重复答错同一题保持幂等。

## 保持边界

- 未新增数据库迁移。
- 未改变选题公式。
- 未执行用户代码。
- 未调用外部 AI。
- 未暴露密钥。

## 后续

- 可以在 `/today` 的测验反馈里增加“已生成错题卡”提示。
- 可以在 `/review` 里为 `quiz_error` 类型增加更清楚的 badge 和筛选。
