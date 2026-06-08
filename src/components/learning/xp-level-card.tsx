import { LearningProgressBar } from "@/components/learning/learning-progress-bar";
import { LearningStatusBadge } from "@/components/learning/learning-status-badge";
import { getLearningLevel, type LearningXp } from "@/server/learning/xp";

const BREAKDOWN_LABELS: Array<[keyof LearningXp["breakdown"], string]> = [
  ["completedLessons", "课程"],
  ["reviewedCards", "复习"],
  ["correctQuizAttempts", "测验"],
  ["codeSubmissions", "代码"],
  ["resolvedMisconceptions", "误区"],
  ["notes", "笔记"],
  ["voiceNotes", "语音"],
  ["completedProjectMilestones", "项目"],
];

const LEVEL_LABELS = new Map<string, string>([
  ["AI Explorer", "AI 探索者"],
  ["Code Builder", "代码建造者"],
  ["Algorithm Thinker", "算法思考者"],
  ["LLM Practitioner", "LLM 实践者"],
  ["AI Systems Learner", "AI 系统学习者"],
]);

function formatLearningLevelLabel(label: string) {
  return LEVEL_LABELS.get(label) ?? "学习成长者";
}

export function XpLevelCard(props: { xp: LearningXp }) {
  const level = getLearningLevel(props.xp.totalXp);
  const levelLabel = formatLearningLevelLabel(level.label);
  const nextLevelLabel = level.nextLabel ? formatLearningLevelLabel(level.nextLabel) : null;
  const nextText = level.nextLabel && level.nextMinXp
    ? `距离 ${nextLevelLabel}还差 ${Math.max(0, level.nextMinXp - props.xp.totalXp)} XP`
    : "已达到当前 MVP 最高等级";

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm" aria-label="XP 等级">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">XP 等级</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">
            {props.xp.totalXp} XP
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{nextText}</div>
        </div>
        <LearningStatusBadge tone="info">
          第 {level.level} 级 {levelLabel}
        </LearningStatusBadge>
      </div>

      <div className="mt-3">
        <LearningProgressBar value={level.progressRatio} label="XP 等级进度" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {BREAKDOWN_LABELS.map(([key, label]) => (
          <div key={key} className="rounded-md border bg-muted/10 px-3 py-2">
            <div className="text-muted-foreground">{label}</div>
            <div className="mt-1 font-semibold tabular-nums">{props.xp.breakdown[key]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
