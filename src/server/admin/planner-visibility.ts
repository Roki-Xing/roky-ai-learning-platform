import { explainCurriculumDecision } from "@/server/curriculum/explain-decision";
import {
  extractCurriculumSignalSnapshot,
  summarizeCurriculumSignalSnapshot,
  type CurriculumSignalSnapshotSummary,
} from "@/server/curriculum/signal-snapshot";

export type AdminPlannerJobSummary = {
  localDate: string | null;
  schemaVersion: string | null;
  selectedDomain: string;
  selectedDomainSlug: string | null;
  selectedTopic: string;
  selectedTopicSlug: string | null;
  difficulty: string | null;
  estimatedMinutes: number | null;
  rawReason: string;
  mainReason: string;
  activeSignals: ReturnType<typeof explainCurriculumDecision>["signals"];
  notes: string[];
  signalSummary: CurriculumSignalSnapshotSummary | null;
};

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function buildAdminPlannerJobSummary(input: unknown): AdminPlannerJobSummary | null {
  const root = asRecord(input);
  const curriculum = asRecord(root.curriculum);
  if (!Object.keys(curriculum).length) return null;

  const selectedDomain = stringValue(curriculum.domain) ?? "unknown";
  const selectedTopic = stringValue(curriculum.topic) ?? "unknown";
  const selectedDomainSlug = stringValue(curriculum.domainSlug);
  const selectedTopicSlug = stringValue(curriculum.topicSlug);
  const rawReason = stringValue(curriculum.reason) ?? "";
  const explanation = explainCurriculumDecision({
    domain: selectedDomain,
    topic: selectedTopic,
    reason: rawReason,
    scoreBreakdown: curriculum.scoreBreakdown,
  });
  const signalSummary = summarizeCurriculumSignalSnapshot(
    extractCurriculumSignalSnapshot({ decision: { signalSnapshot: curriculum.signalSnapshot } }),
    selectedDomainSlug,
  );

  return {
    localDate: stringValue(root.localDate),
    schemaVersion: stringValue(root.schemaVersion),
    selectedDomain,
    selectedDomainSlug,
    selectedTopic,
    selectedTopicSlug,
    difficulty: stringValue(curriculum.difficulty),
    estimatedMinutes: numberValue(curriculum.estimatedMinutes),
    rawReason,
    mainReason: explanation.mainReason,
    activeSignals: explanation.signals.filter((signal) => signal.active),
    notes: explanation.notes,
    signalSummary,
  };
}
