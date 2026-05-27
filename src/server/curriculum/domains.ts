export const CURRICULUM_DOMAIN_ORDER = [
  "ai-fundamentals",
  "python-coding",
  "data-structures",
  "algorithm-design",
  "ml",
  "dl",
  "llm-rag-agent",
  "ai-engineering",
  "papers-benchmarks",
  "people-companies-tools",
  "review-remediation",
  "projects",
] as const;

export const WEEKLY_ROTATION_BY_DAY: Record<number, string[]> = {
  1: ["ai-fundamentals", "math"],
  2: ["python-coding", "algorithm-design"],
  3: ["data-structures", "algorithm-design"],
  4: ["llm-rag-agent", "llm-engineering"],
  5: ["papers-benchmarks", "people-companies-tools", "papers"],
  6: ["projects", "ai-engineering"],
  0: ["review-remediation", "safety"],
};

export const CODING_DOMAINS = new Set([
  "python-coding",
  "data-structures",
  "algorithm-design",
  "projects",
]);

export const REMEDIATION_DOMAINS = new Set(["review-remediation"]);

export function weekdayFromLocalDate(localDate: string) {
  const [y, m, d] = localDate.split("-").map((x) => Number.parseInt(x, 10));
  return new Date(Date.UTC(y!, (m ?? 1) - 1, d ?? 1)).getUTCDay();
}

export function weeklyRotationDomains(localDate: string) {
  return WEEKLY_ROTATION_BY_DAY[weekdayFromLocalDate(localDate)] ?? ["ai-fundamentals"];
}
