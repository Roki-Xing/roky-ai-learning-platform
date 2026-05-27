-- Manual migration: CodeSubmission table (Sprint 2.1)
--
-- Why manual?
-- - This repo's Prisma migration history has a known mismatch, so using `prisma migrate dev`
--   may require a destructive reset.
-- - This SQL is written to be re-runnable and safe on both:
--   1) an existing DB that already has the table/indexes, and
--   2) a fresh DB migrated from prisma/migrations/*

BEGIN;

CREATE TABLE IF NOT EXISTS "CodeSubmission" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "localDate" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'ts',
  "code" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CodeSubmission_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "CodeSubmission_userId_idx" ON "CodeSubmission"("userId");
CREATE INDEX IF NOT EXISTS "CodeSubmission_lessonId_idx" ON "CodeSubmission"("lessonId");
CREATE INDEX IF NOT EXISTS "CodeSubmission_localDate_idx" ON "CodeSubmission"("localDate");

CREATE UNIQUE INDEX IF NOT EXISTS "CodeSubmission_userId_lessonId_localDate_key"
  ON "CodeSubmission"("userId", "lessonId", "localDate");

COMMIT;

