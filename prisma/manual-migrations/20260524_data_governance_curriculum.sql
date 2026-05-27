ALTER TABLE "DailyPlan" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "DailyPlan" ADD COLUMN IF NOT EXISTS "source" TEXT;
ALTER TABLE "DailyPlan" ADD COLUMN IF NOT EXISTS "schemaVersion" TEXT;
ALTER TABLE "DailyPlan" ADD COLUMN IF NOT EXISTS "isTest" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DailyPlan" ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);
ALTER TABLE "DailyPlan" ADD COLUMN IF NOT EXISTS "selectedTopic" TEXT;
ALTER TABLE "DailyPlan" ADD COLUMN IF NOT EXISTS "selectedDomain" TEXT;
ALTER TABLE "DailyPlan" ADD COLUMN IF NOT EXISTS "selectionReason" TEXT;
ALTER TABLE "DailyPlan" ADD COLUMN IF NOT EXISTS "generationJobId" TEXT;
DO $$
BEGIN
  IF to_regclass('"CodeSubmission"') IS NOT NULL THEN
    ALTER TABLE "CodeSubmission" ALTER COLUMN "language" SET DEFAULT 'python';
  END IF;
END $$;

UPDATE "DailyPlan" dp
SET
  "source" = COALESCE(dp."source", l."createdBy"),
  "schemaVersion" = COALESCE(dp."schemaVersion", '2.2'),
  "selectedTopic" = COALESCE(dp."selectedTopic", t."slug"),
  "selectedDomain" = COALESCE(dp."selectedDomain", d."slug")
FROM "Lesson" l
JOIN "Topic" t ON t."id" = l."topicId"
JOIN "Domain" d ON d."id" = t."domainId"
WHERE dp."lessonId" = l."id";

ALTER TABLE "DailyPlan" DROP CONSTRAINT IF EXISTS "DailyPlan_userId_localDate_key";
DROP INDEX IF EXISTS "DailyPlan_userId_localDate_key";

CREATE UNIQUE INDEX IF NOT EXISTS "DailyPlan_active_user_localDate_key"
  ON "DailyPlan"("userId", "localDate")
  WHERE "archivedAt" IS NULL AND "isTest" = false;

CREATE UNIQUE INDEX IF NOT EXISTS "DailyPlan_active_test_user_localDate_key"
  ON "DailyPlan"("userId", "localDate")
  WHERE "archivedAt" IS NULL AND "isTest" = true;

CREATE INDEX IF NOT EXISTS "DailyPlan_userId_localDate_isTest_archivedAt_idx"
  ON "DailyPlan"("userId", "localDate", "isTest", "archivedAt");

CREATE INDEX IF NOT EXISTS "DailyPlan_source_idx" ON "DailyPlan"("source");
CREATE INDEX IF NOT EXISTS "DailyPlan_schemaVersion_idx" ON "DailyPlan"("schemaVersion");

CREATE TABLE IF NOT EXISTS "CurriculumDecisionLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "localDate" TEXT NOT NULL,
  "isTest" BOOLEAN NOT NULL DEFAULT false,
  "domain" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "inputSnapshot" JSONB NOT NULL,
  "scoreBreakdown" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CurriculumDecisionLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CurriculumDecisionLog_userId_localDate_isTest_key"
  ON "CurriculumDecisionLog"("userId", "localDate", "isTest");

CREATE INDEX IF NOT EXISTS "CurriculumDecisionLog_userId_idx" ON "CurriculumDecisionLog"("userId");
CREATE INDEX IF NOT EXISTS "CurriculumDecisionLog_localDate_idx" ON "CurriculumDecisionLog"("localDate");
CREATE INDEX IF NOT EXISTS "CurriculumDecisionLog_domain_idx" ON "CurriculumDecisionLog"("domain");
CREATE INDEX IF NOT EXISTS "CurriculumDecisionLog_topic_idx" ON "CurriculumDecisionLog"("topic");
