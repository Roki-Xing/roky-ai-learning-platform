import test from "node:test";
import assert from "node:assert/strict";
import {
  buildLibraryPlanHref,
  buildLibraryPlanWhere,
  normalizeLibraryPlanFilters,
} from "@/server/library/plan-filter";

test("normalizeLibraryPlanFilters keeps governance filter fields", () => {
  const filters = normalizeLibraryPlanFilters({
    showTest: "true",
    showArchived: "1",
    source: " deepseek ",
    schemaVersion: " 2.3 ",
    status: " completed ",
    localDate: "2026-05-24",
  });

  assert.deepEqual(filters, {
    showTest: true,
    showArchived: true,
    source: "deepseek",
    schemaVersion: "2.3",
    status: "completed",
    localDate: "2026-05-24",
  });
});

test("buildLibraryPlanWhere defaults to active official plans and applies governance fields", () => {
  assert.deepEqual(
    buildLibraryPlanWhere({
      userId: "demo-user",
      filters: normalizeLibraryPlanFilters({}),
    }),
    {
      userId: "demo-user",
      isTest: false,
      archivedAt: null,
    },
  );

  assert.deepEqual(
    buildLibraryPlanWhere({
      userId: "demo-user",
      filters: normalizeLibraryPlanFilters({
        showTest: "1",
        showArchived: "1",
        source: "fallback",
        schemaVersion: "2.3",
        status: "planned",
        localDate: "2026-05-25",
      }),
    }),
    {
      userId: "demo-user",
      source: "fallback",
      schemaVersion: "2.3",
      status: "planned",
      localDate: "2026-05-25",
    },
  );
});

test("buildLibraryPlanHref preserves active filters when selecting a lesson", () => {
  const href = buildLibraryPlanHref({
    lessonId: "lesson-1",
    filters: normalizeLibraryPlanFilters({
      showTest: "1",
      source: "admin",
      schemaVersion: "2.3",
      status: "completed",
      localDate: "2026-05-24",
    }),
  });

  assert.equal(
    href,
    "/library?lessonId=lesson-1&showTest=1&source=admin&schemaVersion=2.3&status=completed&localDate=2026-05-24",
  );
});
