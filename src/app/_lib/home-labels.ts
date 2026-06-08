export function formatHomeDailyPlanStatusLabel(status: string | null | undefined) {
  if (!status) return "未生成";
  if (status === "completed") return "已完成";
  return "待完成";
}

export function formatTodayPlanSourceLabel(source: string | null | undefined) {
  if (source === "deepseek") return "AI 生成";
  if (source === "template") return "模板兜底";
  if (source === "test") return "测试计划";
  if (source === "admin") return "后台重建";
  return "系统生成";
}

export function formatKnowledgeEntityTypeLabel(type: string | null | undefined) {
  if (type === "person") return "人物";
  if (type === "company") return "公司";
  if (type === "lab") return "实验室";
  if (type === "paper") return "论文";
  if (type === "benchmark") return "Benchmark";
  if (type === "tool") return "工具";
  if (type === "open_source_project") return "开源项目";
  return "知识实体";
}

export function formatGlossaryCategoryLabel(category: string | null | undefined) {
  const key = category?.trim().toLowerCase();
  if (key === "prompting") return "提示工程";
  if (key === "agent") return "Agent";
  if (key === "reasoning") return "推理";
  if (key === "retrieval") return "检索增强";
  if (key === "alignment") return "对齐";
  if (key === "training") return "预训练";
  if (key === "fine-tuning") return "微调";
  if (key === "architecture") return "模型架构";
  if (key === "benchmark") return "Benchmark";
  return "术语分类";
}

export function formatGlossaryDifficultyLabel(difficulty: string | null | undefined) {
  const key = difficulty?.trim().toLowerCase();
  if (key === "beginner") return "入门";
  if (key === "intermediate") return "进阶";
  if (key === "advanced") return "高阶";
  return "难度未标记";
}

export function formatFlashcardTypeLabel(type: string | null | undefined) {
  if (type === "algorithm") return "算法卡";
  if (type === "benchmark") return "Radar 卡";
  if (type === "code") return "代码思路卡";
  if (type === "code_bug") return "代码反馈卡";
  if (type === "concept") return "概念卡";
  if (type === "misconception") return "误区卡";
  if (type === "mistake") return "错题卡";
  if (type === "project") return "项目卡";
  if (type === "quiz_error") return "错题卡";
  if (type === "term") return "术语卡";
  return "复习卡";
}

export function formatMapMisconceptionStatusLabel(status: string | null | undefined) {
  if (status === "resolved") return "已解决";
  if (status === "ignored") return "已忽略";
  return "未解决";
}

export function formatRadarConfidenceLabel(confidence: string | null | undefined) {
  if (confidence === "high") return "可信度：高";
  if (confidence === "medium") return "可信度：中";
  if (confidence === "low") return "可信度：低";
  return "可信度：待确认";
}

export function formatRadarVerificationLabel(status: string | null | undefined) {
  if (status === "verified") return "已核验";
  return "待核验";
}

export function formatHomeCodeFeedbackOverallLabel(overall: string | null | undefined) {
  if (overall === "likely_correct") return "大概率正确";
  if (overall === "partially_correct") return "部分正确";
  if (overall === "incorrect") return "需要重写";
  if (overall === "cannot_judge") return "需要更多信息";
  return null;
}

export function formatCodeFeedbackIssueSeverityLabel(severity: string | null | undefined) {
  if (severity === "high") return "高优先级";
  if (severity === "low") return "低优先级";
  if (severity === "medium") return "中优先级";
  return "待判断";
}

export function formatCodeFeedbackIssueTypeLabel(type: string | null | undefined) {
  if (type === "logic") return "逻辑问题";
  if (type === "edge_case") return "边界条件";
  if (type === "complexity") return "复杂度问题";
  if (type === "style") return "代码风格";
  if (type === "syntax") return "语法问题";
  if (type === "concept") return "概念问题";
  return "一般问题";
}

export function formatCoachModeLabel(mode: string | null | undefined) {
  if (mode === "today_lesson") return "今日课程";
  if (mode === "concept_question") return "概念疑问";
  if (mode === "code_debug") return "代码调试";
  if (mode === "code_reasoning") return "代码思路";
  if (mode === "algorithm_design") return "算法设计";
  if (mode === "paper_reading") return "论文阅读";
  if (mode === "industry_radar") return "行业广度";
  if (mode === "glossary_question" || mode === "glossary_term") return "术语理解";
  if (mode === "free_thought") return "自由想法";
  return "思路评审";
}

export function formatQuizQuestionTypeLabel(type: string | null | undefined) {
  if (type === "single_choice") return "单选题";
  if (type === "multi_choice") return "多选题";
  if (type === "true_false") return "判断题";
  return "小测验";
}

export function formatCodeSubmissionStatusLabel(status: string | null | undefined) {
  if (status === "feedback_ready") return "反馈已生成";
  if (status === "submitted") return "已提交";
  if (status === "saved") return "已保存";
  return status ? "已保存" : "未保存";
}

export function formatHomeMistakeSourceLabel(source: string | null | undefined) {
  if (source === "code") return "代码反馈";
  if (source === "coach") return "Coach";
  if (source === "project") return "项目实践";
  return "小测验";
}

export function buildHomeCodeFeedbackMeta(input: {
  overall?: string | null;
  localDate?: string | null;
}) {
  return [
    input.overall ? `状态：${formatHomeCodeFeedbackOverallLabel(input.overall) ?? "待检查"}` : null,
    input.localDate ? `日期：${input.localDate}` : null,
  ].filter(Boolean).join(" · ");
}

export function buildHomeMistakeMeta(input: {
  source?: string | null;
  occurrenceCount?: number | null;
}) {
  return [
    `来源：${formatHomeMistakeSourceLabel(input.source)}`,
    typeof input.occurrenceCount === "number" ? `出现 ${input.occurrenceCount} 次` : null,
  ].filter(Boolean).join(" · ");
}
