CREATE TABLE IF NOT EXISTS "ThoughtReview" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "lessonId" TEXT,
  "mode" TEXT NOT NULL,
  "rawText" TEXT NOT NULL,
  "normalizedText" TEXT,
  "mainClaim" TEXT,
  "reviewJson" JSONB NOT NULL,
  "generatedCards" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ThoughtReview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ThoughtReview_userId_idx" ON "ThoughtReview"("userId");
CREATE INDEX IF NOT EXISTS "ThoughtReview_lessonId_idx" ON "ThoughtReview"("lessonId");
CREATE INDEX IF NOT EXISTS "ThoughtReview_mode_idx" ON "ThoughtReview"("mode");
CREATE INDEX IF NOT EXISTS "ThoughtReview_createdAt_idx" ON "ThoughtReview"("createdAt");
