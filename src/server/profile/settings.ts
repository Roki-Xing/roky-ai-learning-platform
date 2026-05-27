import { prisma } from "@/server/db";
import { normalizeSlug } from "@/server/knowledge/base";

function unique(values: string[]) {
  return [...new Set(values)];
}

function parseLines(input: string) {
  return input
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parsePreferenceSlugs(input: string) {
  return unique(parseLines(input).map(normalizeSlug).filter(Boolean));
}

export function parsePreferredAreas(input: string) {
  const values = unique(parseLines(input));
  return values.length ? values : null;
}

export function settingsSavedRedirectPath() {
  return "/settings?saved=1";
}

export function buildSettingsSavedNotice(saved: unknown) {
  if (saved !== "1") return null;

  return {
    title: "设置已保存",
    description: "新的学习偏好会用于后续选题和内容生成。",
  };
}

export async function updateUserProfileSettings(args: {
  userId: string;
  displayName?: string | null;
  goal: string;
  level: string;
  language: string;
  difficulty: string;
  dailyMinutes: number;
  timeZone: string;
  preferredAreasText?: string;
  preferredTermSlugsText?: string;
  preferredEntitySlugsText?: string;
  knowledgeAvoidDays?: number;
}) {
  const displayName = args.displayName?.trim() || null;
  const preferredAreas = parsePreferredAreas(args.preferredAreasText ?? "");
  const preferredTermSlugs = parsePreferenceSlugs(args.preferredTermSlugsText ?? "");
  const preferredEntitySlugs = parsePreferenceSlugs(args.preferredEntitySlugsText ?? "");
  const knowledgeAvoidDays = Number.isFinite(args.knowledgeAvoidDays)
    ? Math.max(0, Math.min(90, Math.trunc(args.knowledgeAvoidDays ?? 7)))
    : 7;

  return await prisma.userProfile.upsert({
    where: { userId: args.userId },
    update: {
      displayName,
      goal: args.goal,
      level: args.level,
      language: args.language,
      difficulty: args.difficulty,
      dailyMinutes: args.dailyMinutes,
      timeZone: args.timeZone,
      preferredAreas: preferredAreas ?? undefined,
      preferredTermSlugs,
      preferredEntitySlugs,
      knowledgeAvoidDays,
    },
    create: {
      userId: args.userId,
      displayName,
      goal: args.goal,
      level: args.level,
      language: args.language,
      difficulty: args.difficulty,
      dailyMinutes: args.dailyMinutes,
      timeZone: args.timeZone,
      preferredAreas: preferredAreas ?? undefined,
      preferredTermSlugs,
      preferredEntitySlugs,
      knowledgeAvoidDays,
    },
  });
}
