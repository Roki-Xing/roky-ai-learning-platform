import type { LearningTimelineItemStatus } from "@/components/learning/learning-timeline";

export function getQuizStageStatus(input: {
  totalCount: number;
  attemptedCount: number;
}): LearningTimelineItemStatus {
  if (input.totalCount <= 0) return "done";
  if (input.attemptedCount <= 0) return "todo";
  if (input.attemptedCount >= input.totalCount) return "done";
  return "active";
}

export function getKnowledgeStageStatus(input: {
  hasGlossaryConnection: boolean;
  hasBreadthConnection: boolean;
  hasGlossaryDetail: boolean;
  hasBreadthDetail: boolean;
}): LearningTimelineItemStatus {
  const expected = Number(input.hasGlossaryConnection) + Number(input.hasBreadthConnection);
  if (expected === 0) return "done";

  const found = Number(input.hasGlossaryDetail) + Number(input.hasBreadthDetail);
  if (found === 0) return "todo";
  if (found >= expected) return "done";
  return "active";
}
