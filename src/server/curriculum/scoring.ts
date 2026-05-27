import { CODING_DOMAINS, REMEDIATION_DOMAINS, weeklyRotationDomains } from "@/server/curriculum/domains";
import type { CurriculumCandidate, CurriculumDecision, CurriculumScoringInput } from "@/server/curriculum/types";

function normalizeCount(v: number, max = 5) {
  return Math.min(1, Math.max(0, v / max));
}

function preferenceMatch(candidate: CurriculumCandidate, preferredAreas: string[]) {
  const haystack = `${candidate.domain} ${candidate.domainSlug} ${candidate.topic} ${candidate.topicSlug}`.toLowerCase();
  return preferredAreas.some((p) => p && haystack.includes(p.toLowerCase())) ? 1 : 0;
}

function domainCount(map: Record<string, number>, domainSlug: string) {
  return map[domainSlug] ?? 0;
}

export function scoreTopicCandidates(input: CurriculumScoringInput): CurriculumDecision[] {
  const rotation = weeklyRotationDomains(input.localDate);
  const recent7Topics = new Set(input.recentStudies.slice(0, 7).map((s) => s.topicSlug));
  const recent3Domains = new Set(input.recentStudies.slice(0, 3).map((s) => s.domainSlug));
  const maxCompleted = Math.max(1, ...Object.values(input.completedCountByDomain), 1);

  return input.candidates
    .map((candidate) => {
      const weeklyRotationScore = rotation.includes(candidate.domainSlug) ? 1 : 0.25;
      const underCoverageScore =
        1 - Math.min(1, domainCount(input.completedCountByDomain, candidate.domainSlug) / maxCompleted);
      const weaknessScore = Math.min(
        1,
        normalizeCount(domainCount(input.dueCountByDomain, candidate.domainSlug), 8) * 0.35 +
          normalizeCount(domainCount(input.hardReviewCountByDomain, candidate.domainSlug), 4) * 0.35 +
          normalizeCount(domainCount(input.incorrectQuizCountByDomain, candidate.domainSlug), 4) * 0.3,
      );
      const mapWeaknessScore = Math.min(
        1,
        Math.max(0, input.mapWeaknessByDomain?.[candidate.domainSlug] ?? 0),
      );
      const misconceptionScore = normalizeCount(
        domainCount(input.activeMisconceptionCountByDomain ?? {}, candidate.domainSlug),
        4,
      );
      const combinedWeaknessScore = Math.max(
        weaknessScore,
        mapWeaknessScore,
        misconceptionScore,
      );
      const codingNeedScore =
        input.codeSubmissionCountLast7 < 2 && CODING_DOMAINS.has(candidate.domainSlug) ? 1 : 0.15;
      const userPreferenceScore = preferenceMatch(candidate, input.preferredAreas);
      const noveltyScore = recent7Topics.has(candidate.topicSlug)
        ? 0
        : recent3Domains.has(candidate.domainSlug)
          ? 0.25
          : 1;
      const remediationBoost =
        Object.values(input.incorrectQuizCountByDomain).some((v) => v > 0) &&
        REMEDIATION_DOMAINS.has(candidate.domainSlug)
          ? 0.35
          : 0;

      let score =
        weeklyRotationScore * 0.25 +
        underCoverageScore * 0.2 +
        weaknessScore * 0.2 +
        mapWeaknessScore * 0.25 +
        misconceptionScore * 0.25 +
        codingNeedScore * 0.15 +
        userPreferenceScore * 0.1 +
        noveltyScore * 0.1 +
        remediationBoost;

      if (recent7Topics.has(candidate.topicSlug) && !REMEDIATION_DOMAINS.has(candidate.domainSlug)) {
        score -= 0.6;
      }
      if (recent3Domains.has(candidate.domainSlug) && combinedWeaknessScore < 0.35) {
        score -= 0.15;
      }

      const difficulty = combinedWeaknessScore > 0.65 ? "easy" : score > 0.75 ? "challenge" : "standard";
      const codingFocus = CODING_DOMAINS.has(candidate.domainSlug)
        ? "Python implementation fluency"
        : undefined;
      const breadthFocus =
        candidate.domainSlug === "people-companies-tools" || candidate.domainSlug === "papers-benchmarks"
          ? { type: "benchmark" as const, hint: candidate.topic }
          : undefined;

      return {
        domain: candidate.domain,
        domainSlug: candidate.domainSlug,
        topic: candidate.topic,
        topicSlug: candidate.topicSlug,
        reason: [
          `weekly=${weeklyRotationScore.toFixed(2)}`,
          `coverage=${underCoverageScore.toFixed(2)}`,
          `weakness=${weaknessScore.toFixed(2)}`,
          `mapWeakness=${mapWeaknessScore.toFixed(2)}`,
          `misconception=${misconceptionScore.toFixed(2)}`,
          `coding=${codingNeedScore.toFixed(2)}`,
          `preference=${userPreferenceScore.toFixed(2)}`,
          `novelty=${noveltyScore.toFixed(2)}`,
        ].join(", "),
        codingFocus,
        breadthFocus,
        difficulty,
        estimatedMinutes: 30,
        scoreBreakdown: {
          score: Number(score.toFixed(4)),
          weeklyRotationScore,
          underCoverageScore,
          weaknessScore,
          mapWeaknessScore,
          misconceptionScore,
          combinedWeaknessScore,
          codingNeedScore,
          userPreferenceScore,
          noveltyScore,
          remediationBoost,
          recentTopicPenalty: recent7Topics.has(candidate.topicSlug),
          recentDomainPenalty: recent3Domains.has(candidate.domainSlug),
        },
        signalSnapshot: {
          recentStudies: input.recentStudies,
          completedCountByDomain: input.completedCountByDomain,
          dueCountByDomain: input.dueCountByDomain,
          hardReviewCountByDomain: input.hardReviewCountByDomain,
          incorrectQuizCountByDomain: input.incorrectQuizCountByDomain,
          activeMisconceptionCountByDomain: input.activeMisconceptionCountByDomain ?? {},
          mapWeaknessByDomain: input.mapWeaknessByDomain ?? {},
          codeSubmissionCountLast7: input.codeSubmissionCountLast7,
        },
      } satisfies CurriculumDecision;
    })
    .sort((a, b) => Number(b.scoreBreakdown.score) - Number(a.scoreBreakdown.score));
}
