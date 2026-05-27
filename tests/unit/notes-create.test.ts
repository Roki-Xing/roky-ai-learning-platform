import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import { createScopedNote } from "@/server/notes/create-note";

async function createNoteScopeFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `notes-scope-${suffix}`;
  const otherUserId = `notes-scope-other-${suffix}`;
  const domain = await prisma.domain.create({
    data: {
      slug: `notes-scope-domain-${suffix}`,
      name: "Notes Scope Domain",
    },
  });
  const topic = await prisma.topic.create({
    data: {
      domainId: domain.id,
      slug: `notes-scope-topic-${suffix}`,
      title: "Notes Scope Topic",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Owned Notes Lesson",
      summary: "A note-owned lesson.",
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
      title: "Other Notes Lesson",
      summary: "A note-unowned lesson.",
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

  return { userId, lesson, otherLesson };
}

test("createScopedNote links notes only to the current user's official lessons", async () => {
  const { userId, lesson } = await createNoteScopeFixture();

  const note = await createScopedNote({
    userId,
    lessonId: lesson.id,
    title: "Owned note",
    content: "This note is linked to an owned lesson.",
  });

  assert.equal(note.userId, userId);
  assert.equal(note.lessonId, lesson.id);
});

test("createScopedNote rejects lesson ids outside the current user's visible plans", async () => {
  const { userId, otherLesson } = await createNoteScopeFixture();

  await assert.rejects(
    createScopedNote({
      userId,
      lessonId: otherLesson.id,
      title: "Cross-user note",
      content: "This should not attach to another user's lesson.",
    }),
    /Lesson not available/,
  );

  const leaked = await prisma.note.findFirst({
    where: { userId, lessonId: otherLesson.id },
  });
  assert.equal(leaked, null);
});

test("createScopedNote still allows standalone notes without a lesson", async () => {
  const { userId } = await createNoteScopeFixture();

  const note = await createScopedNote({
    userId,
    lessonId: null,
    title: "Standalone note",
    content: "This note is not linked to a lesson.",
  });

  assert.equal(note.userId, userId);
  assert.equal(note.lessonId, null);
});
