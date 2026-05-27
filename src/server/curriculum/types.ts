export type CurriculumDifficulty = "easy" | "standard" | "challenge";

export type CurriculumBreadthFocus = {
  type: "term" | "person" | "company" | "paper" | "benchmark" | "tool";
  hint: string;
};

export type CurriculumDecision = {
  domain: string;
  domainSlug: string;
  topic: string;
  topicSlug: string;
  reason: string;
  codingFocus?: string;
  breadthFocus?: CurriculumBreadthFocus;
  difficulty: CurriculumDifficulty;
  estimatedMinutes: number;
  scoreBreakdown: Record<string, number | string | boolean>;
  signalSnapshot: CurriculumSignalSnapshot;
};

export type CurriculumCandidate = {
  domain: string;
  domainSlug: string;
  topic: string;
  topicSlug: string;
};

export type RecentStudySignal = {
  domainSlug: string;
  topicSlug: string;
  localDate: string;
};

export type CurriculumScoringInput = {
  localDate: string;
  preferredAreas: string[];
  candidates: CurriculumCandidate[];
  recentStudies: RecentStudySignal[];
  completedCountByDomain: Record<string, number>;
  dueCountByDomain: Record<string, number>;
  hardReviewCountByDomain: Record<string, number>;
  incorrectQuizCountByDomain: Record<string, number>;
  activeMisconceptionCountByDomain?: Record<string, number>;
  mapWeaknessByDomain?: Record<string, number>;
  codeSubmissionCountLast7: number;
};

export type CurriculumSignalSnapshot = {
  recentStudies: RecentStudySignal[];
  completedCountByDomain: Record<string, number>;
  dueCountByDomain: Record<string, number>;
  hardReviewCountByDomain: Record<string, number>;
  incorrectQuizCountByDomain: Record<string, number>;
  activeMisconceptionCountByDomain: Record<string, number>;
  mapWeaknessByDomain: Record<string, number>;
  codeSubmissionCountLast7: number;
};
