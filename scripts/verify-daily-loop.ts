import { prisma } from "@/server/db";
import { runDailyLoopVerification } from "@/server/verification/daily-loop";

function summarize(value: unknown) {
  return JSON.stringify(value, null, 2);
}

async function main() {
  const now = process.env.DAILY_LOOP_NOW
    ? new Date(process.env.DAILY_LOOP_NOW)
    : new Date();
  if (Number.isNaN(now.getTime())) {
    throw new Error(`Invalid DAILY_LOOP_NOW: ${process.env.DAILY_LOOP_NOW}`);
  }

  const userId =
    process.env.DAILY_LOOP_USER_ID ??
    `loop-verifier-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const result = await runDailyLoopVerification({ userId, now });

  console.log(
    summarize({
      ok: true,
      userId: result.userId,
      localDate: result.localDate,
      plan: result.plan,
      guidedProgress: result.guidedProgress,
      quizAttemptCount: result.quizAttemptCount,
      codeSubmissionStatus: result.codeSubmission.status,
      codeFeedbackCount: result.codeFeedbackCount,
      completedPlanCount: result.completedPlanCount,
      flashcardCount: result.flashcardCount,
      dueCardsBeforeRating: result.reviewQueueBeforeRating.length,
      reviewRating: result.reviewRating,
      reviewLogCount: result.reviewLogCount,
      progressSignals: result.progressSignals,
    }),
  );
}

main()
  .catch((error) => {
    console.error(summarize({ ok: false, error: error instanceof Error ? error.message : String(error) }));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
