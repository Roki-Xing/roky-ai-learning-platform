import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import { validateMilestoneLinks } from "@/server/projects/milestone-links";

async function createMilestoneLinkFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `projects-link-${suffix}`;
  const otherUserId = `projects-link-other-${suffix}`;

  const domain = await prisma.domain.create({
    data: {
      slug: `projects-link-domain-${suffix}`,
      name: "Projects Link Domain",
    },
  });
  const topic = await prisma.topic.create({
    data: {
      domainId: domain.id,
      slug: `projects-link-topic-${suffix}`,
      title: "Projects Link Topic",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Owned Project Lesson",
      summary: "A lesson owned by the current user (via DailyPlan).",
      contentMarkdown: "Owned body",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      examples: {},
      createdBy: "test",
    },
  });
  const otherLesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Other Project Lesson",
      summary: "A lesson owned by another user.",
      contentMarkdown: "Other body",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      examples: {},
      createdBy: "test",
    },
  });

  await prisma.userProfile.createMany({
    data: [{ userId }, { userId: otherUserId }],
  });
  await prisma.dailyPlan.create({
    data: {
      userId,
      lessonId: lesson.id,
      date: new Date("2026-05-25T00:00:00.000Z"),
      localDate: "2026-05-25",
      status: "completed",
      isTest: false,
      archivedAt: null,
    },
  });
  await prisma.dailyPlan.create({
    data: {
      userId: otherUserId,
      lessonId: otherLesson.id,
      date: new Date("2026-05-25T00:00:00.000Z"),
      localDate: "2026-05-25",
      status: "completed",
      isTest: false,
      archivedAt: null,
    },
  });

  const note = await prisma.note.create({
    data: {
      userId,
      lessonId: lesson.id,
      title: "Owned note",
      content: "This note belongs to the current user.",
    },
  });
  const otherNote = await prisma.note.create({
    data: {
      userId: otherUserId,
      lessonId: otherLesson.id,
      title: "Other user note",
      content: "This note belongs to a different user.",
    },
  });

  return { userId, otherUserId, lesson, otherLesson, note, otherNote };
}

test("validateMilestoneLinks accepts owned lessonId and noteId (trims whitespace)", async () => {
  const { userId, lesson, note } = await createMilestoneLinkFixture();

  const result = await validateMilestoneLinks({
    userId,
    lessonId: `  ${lesson.id}  `,
    noteId: ` ${note.id} `,
  });

  assert.equal(result.lessonId, lesson.id);
  assert.equal(result.noteId, note.id);
});

test("validateMilestoneLinks rejects lesson ids outside the current user's official plans", async () => {
  const { userId, otherLesson } = await createMilestoneLinkFixture();

  await assert.rejects(
    () =>
      validateMilestoneLinks({
        userId,
        lessonId: otherLesson.id,
        noteId: null,
      }),
    /Lesson not available for projects/,
  );
});

test("validateMilestoneLinks rejects note ids outside the current user", async () => {
  const { userId, otherNote } = await createMilestoneLinkFixture();

  await assert.rejects(
    () =>
      validateMilestoneLinks({
        userId,
        lessonId: null,
        noteId: otherNote.id,
      }),
    /Note not available for projects/,
  );
});

test("validateMilestoneLinks rejects lessons that exist only in test or archived plans", async () => {
  const { userId, lesson } = await createMilestoneLinkFixture();

  // Remove the official record, then add a test+archived plan referencing the same lesson.
  await prisma.dailyPlan.deleteMany({
    where: { userId, lessonId: lesson.id, isTest: false, archivedAt: null },
  });
  await prisma.dailyPlan.create({
    data: {
      userId,
      lessonId: lesson.id,
      date: new Date("2026-05-25T00:00:00.000Z"),
      localDate: "2026-05-25",
      status: "completed",
      isTest: true,
      archivedAt: new Date("2026-05-25T03:00:00.000Z"),
    },
  });

  await assert.rejects(
    () =>
      validateMilestoneLinks({
        userId,
        lessonId: lesson.id,
        noteId: null,
      }),
    /Lesson not available for projects/,
  );
});

