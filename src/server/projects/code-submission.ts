import { submitCodeForReview } from "@/server/coding/submit";
import { prisma } from "@/server/db";
import { localDateInTimeZone } from "@/server/time/day";

/**
 * Reviews saved milestone code through the existing CodeSubmission feedback path.
 *
 * Args:
 *   args: Current user, owned project milestone, and optional review metadata.
 *
 * Returns:
 *   The linked CodeSubmission id and generated feedback provider/result.
 */
export async function reviewProjectMilestoneCode(args: {
  userId: string;
  projectId: string;
  milestoneId: string;
  localDate?: string;
  language?: string;
}) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId: args.userId },
    select: { timeZone: true },
  });
  const milestone = await prisma.projectMilestone.findFirst({
    where: {
      id: args.milestoneId,
      projectId: args.projectId,
      userId: args.userId,
    },
    select: {
      id: true,
      lessonId: true,
      code: true,
    },
  });
  if (!milestone) throw new Error("Milestone not found");
  if (!milestone.lessonId) throw new Error("Missing lessonId");
  if (!milestone.code?.trim()) throw new Error("Missing code");

  const result = await submitCodeForReview({
    userId: args.userId,
    lessonId: milestone.lessonId,
    localDate:
      args.localDate ??
      localDateInTimeZone({
        date: new Date(),
        timeZone: profile?.timeZone ?? "Asia/Shanghai",
      }),
    language: args.language ?? "python",
    code: milestone.code,
  });

  await prisma.projectMilestone.update({
    where: { id: milestone.id },
    data: { codeSubmissionId: result.submissionId },
  });

  return result;
}
