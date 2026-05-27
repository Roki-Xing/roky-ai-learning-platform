import { Prisma } from "@prisma/client";

export type LibraryPlanFilters = {
  showTest: boolean;
  showArchived: boolean;
  source: string | null;
  schemaVersion: string | null;
  status: string | null;
  localDate: string | null;
};

type RawLibraryPlanFilters = {
  showTest?: unknown;
  showArchived?: unknown;
  source?: unknown;
  schemaVersion?: unknown;
  status?: unknown;
  localDate?: unknown;
};

function first(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

function booleanFlag(value: unknown) {
  const v = first(value);
  return v === "1" || v === "true" || v === true;
}

function cleanText(value: unknown) {
  const v = first(value);
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed ? trimmed : null;
}

function cleanLocalDate(value: unknown) {
  const v = cleanText(value);
  return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}

export function normalizeLibraryPlanFilters(input: RawLibraryPlanFilters): LibraryPlanFilters {
  return {
    showTest: booleanFlag(input.showTest),
    showArchived: booleanFlag(input.showArchived),
    source: cleanText(input.source),
    schemaVersion: cleanText(input.schemaVersion),
    status: cleanText(input.status),
    localDate: cleanLocalDate(input.localDate),
  };
}

export function buildLibraryPlanWhere(args: {
  userId: string;
  filters: LibraryPlanFilters;
}): Prisma.DailyPlanWhereInput {
  const where: Prisma.DailyPlanWhereInput = { userId: args.userId };
  if (!args.filters.showTest) where.isTest = false;
  if (!args.filters.showArchived) where.archivedAt = null;
  if (args.filters.source) where.source = args.filters.source;
  if (args.filters.schemaVersion) where.schemaVersion = args.filters.schemaVersion;
  if (args.filters.status) where.status = args.filters.status;
  if (args.filters.localDate) where.localDate = args.filters.localDate;
  return where;
}

export function buildLibraryPlanHref(args: {
  lessonId?: string | null;
  filters: LibraryPlanFilters;
}) {
  const params = new URLSearchParams();
  if (args.lessonId) params.set("lessonId", args.lessonId);
  if (args.filters.showTest) params.set("showTest", "1");
  if (args.filters.showArchived) params.set("showArchived", "1");
  if (args.filters.source) params.set("source", args.filters.source);
  if (args.filters.schemaVersion) params.set("schemaVersion", args.filters.schemaVersion);
  if (args.filters.status) params.set("status", args.filters.status);
  if (args.filters.localDate) params.set("localDate", args.filters.localDate);
  const query = params.toString();
  return query ? `/library?${query}` : "/library";
}
