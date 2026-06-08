export type LearningXpInput = {
  completedLessons: number;
  reviewedCards: number;
  correctQuizAttempts: number;
  codeSubmissions: number;
  resolvedMisconceptions: number;
  notes: number;
  voiceNotes: number;
  completedProjectMilestones: number;
};

export type LearningXpBreakdown = {
  completedLessons: number;
  reviewedCards: number;
  correctQuizAttempts: number;
  codeSubmissions: number;
  resolvedMisconceptions: number;
  notes: number;
  voiceNotes: number;
  completedProjectMilestones: number;
};

export type LearningXp = {
  totalXp: number;
  breakdown: LearningXpBreakdown;
  input: LearningXpInput;
};

export type LearningLevel = {
  level: number;
  label: string;
  minXp: number;
  nextMinXp: number | null;
  nextLabel: string | null;
  progressRatio: number;
};

const LEVELS = [
  { level: 1, label: "AI Explorer", minXp: 0 },
  { level: 2, label: "Code Builder", minXp: 300 },
  { level: 3, label: "Algorithm Thinker", minXp: 900 },
  { level: 4, label: "LLM Practitioner", minXp: 1800 },
  { level: 5, label: "AI Systems Learner", minXp: 3200 },
] as const;

/**
 * Calculates MVP XP from already persisted activity counts.
 *
 * Args:
 *   input: Aggregated learning activity counts.
 *
 * Returns:
 *   Total XP plus per-signal breakdown.
 */
export function calculateLearningXp(input: LearningXpInput): LearningXp {
  const breakdown = {
    completedLessons: input.completedLessons * 50,
    reviewedCards: input.reviewedCards * 5,
    correctQuizAttempts: input.correctQuizAttempts * 10,
    codeSubmissions: input.codeSubmissions * 30,
    resolvedMisconceptions: input.resolvedMisconceptions * 40,
    notes: input.notes * 20,
    voiceNotes: input.voiceNotes * 20,
    completedProjectMilestones: input.completedProjectMilestones * 80,
  };
  return {
    input,
    breakdown,
    totalXp: Object.values(breakdown).reduce((sum, value) => sum + value, 0),
  };
}

export function getLearningLevel(totalXp: number): LearningLevel {
  const current = [...LEVELS].reverse().find((level) => totalXp >= level.minXp) ?? LEVELS[0]!;
  const next = LEVELS.find((level) => level.minXp > current.minXp) ?? null;
  const progressRatio = next
    ? (totalXp - current.minXp) / Math.max(1, next.minXp - current.minXp)
    : 1;

  return {
    level: current.level,
    label: current.label,
    minXp: current.minXp,
    nextMinXp: next?.minXp ?? null,
    nextLabel: next?.label ?? null,
    progressRatio: Math.min(1, Math.max(0, progressRatio)),
  };
}
