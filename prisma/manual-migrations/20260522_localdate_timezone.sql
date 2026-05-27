-- Manual migration: localDate + timeZone (Sprint 1.1)
--
-- Why manual?
-- - This repo's Prisma migration history has a known mismatch (an applied migration is missing locally),
--   so using `prisma migrate dev` may require a destructive reset.
-- - This SQL is written to be re-runnable and safe on both:
--   1) an existing DB that already has these columns/indexes, and
--   2) a fresh DB migrated from prisma/migrations/*
--
-- Target schema:
-- - UserProfile.timeZone: TEXT NOT NULL DEFAULT 'Asia/Shanghai'
-- - DailyPlan.localDate: TEXT NOT NULL, and @@unique([userId, localDate])

BEGIN;

-- 1) UserProfile.timeZone
ALTER TABLE "UserProfile"
  ADD COLUMN IF NOT EXISTS "timeZone" TEXT;

UPDATE "UserProfile"
SET "timeZone" = 'Asia/Shanghai'
WHERE "timeZone" IS NULL OR "timeZone" = '';

ALTER TABLE "UserProfile"
  ALTER COLUMN "timeZone" SET DEFAULT 'Asia/Shanghai';

ALTER TABLE "UserProfile"
  ALTER COLUMN "timeZone" SET NOT NULL;

-- 2) DailyPlan.localDate
ALTER TABLE "DailyPlan"
  ADD COLUMN IF NOT EXISTS "localDate" TEXT;

-- Backfill localDate using the user's timezone when possible.
UPDATE "DailyPlan" dp
SET "localDate" = to_char(
  (dp."date" AT TIME ZONE COALESCE(up."timeZone", 'Asia/Shanghai'))::date,
  'YYYY-MM-DD'
)
FROM "UserProfile" up
WHERE dp."userId" = up."userId"
  AND (dp."localDate" IS NULL OR dp."localDate" = '');

-- Fallback: if a DailyPlan row has no matching UserProfile, backfill using UTC date.
UPDATE "DailyPlan"
SET "localDate" = to_char(("date" AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD')
WHERE "localDate" IS NULL OR "localDate" = '';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "DailyPlan" WHERE "localDate" IS NULL OR "localDate" = '') THEN
    RAISE EXCEPTION 'DailyPlan.localDate backfill failed: null/empty remains';
  END IF;
END $$;

ALTER TABLE "DailyPlan"
  ALTER COLUMN "localDate" SET NOT NULL;

-- Remove old uniqueness rule (userId, date) if it exists.
DROP INDEX IF EXISTS "DailyPlan_userId_date_key";

-- Add localDate indexes/uniqueness (no-op if already exists).
CREATE INDEX IF NOT EXISTS "DailyPlan_localDate_idx" ON "DailyPlan"("localDate");

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM (
      SELECT "userId", "localDate", COUNT(*) AS c
      FROM "DailyPlan"
      GROUP BY "userId", "localDate"
      HAVING COUNT(*) > 1
    ) t
  ) THEN
    RAISE EXCEPTION 'DailyPlan has duplicate (userId, localDate) rows; resolve before adding unique index';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "DailyPlan_userId_localDate_key"
  ON "DailyPlan"("userId", "localDate");

COMMIT;

