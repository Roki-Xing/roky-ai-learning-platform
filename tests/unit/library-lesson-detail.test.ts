import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "@/server/db";
import {
  getLessonDetailNotes,
  resolveVisibleLibraryLessonId,
} from "@/server/library/lesson-detail";

async function createLibraryNotesFixture() {
  const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const userId = `library-notes-${suffix}`;
  const otherUserId = `library-notes-other-${suffix}`;
  const domain = await prisma.domain.create({
    data: {
      slug: `library-notes-domain-${suffix}`,
      name: "Library Notes Domain",
    },
  });
  const topic = await prisma.topic.create({
    data: {
      domainId: domain.id,
      slug: `library-notes-topic-${suffix}`,
      title: "Library Notes Topic",
    },
  });
  const lesson = await prisma.lesson.create({
    data: {
      topicId: topic.id,
      title: "Library Notes Lesson",
      summary: "A lesson for note filtering.",
      contentMarkdown: "Lesson body",
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
      title: "Other Lesson",
      summary: "A different lesson.",
      contentMarkdown: "Other body",
      difficulty: "standard",
      objectives: [],
      keyTerms: [],
      examples: {},
      createdBy: "test",
    },
  });
  await prisma.userProfile.create({ data: { userId } });
  await prisma.userProfile.create({ data: { userId: otherUserId } });
  await prisma.note.create({
    data: {
      userId,
      lessonId: lesson.id,
      title: "My lesson note",
      content: "This note belongs in the library lesson detail.",
      updatedAt: new Date("2026-05-25T02:00:00.000Z"),
    },
  });
  await prisma.note.create({
    data: {
      userId,
      lessonId: otherLesson.id,
      title: "Wrong lesson note",
      content: "This note should not appear.",
    },
  });
  await prisma.note.create({
    data: {
      userId: otherUserId,
      lessonId: lesson.id,
      title: "Other user note",
      content: "This note should not appear.",
    },
  });

  return { userId, lesson };
}

test("getLessonDetailNotes returns only current user's notes for the selected lesson", async () => {
  const { userId, lesson } = await createLibraryNotesFixture();

  const notes = await getLessonDetailNotes({ userId, lessonId: lesson.id });

  assert.equal(notes.length, 1);
  assert.equal(notes[0]?.title, "My lesson note");
  assert.match(notes[0]?.content ?? "", /library lesson detail/);
});

test("resolveVisibleLibraryLessonId only accepts lessons from the visible plan list", () => {
  const visibleLessonIds = ["lesson-a", "lesson-b"];

  assert.equal(
    resolveVisibleLibraryLessonId({
      requestedLessonId: "lesson-b",
      visibleLessonIds,
    }),
    "lesson-b",
  );
  assert.equal(
    resolveVisibleLibraryLessonId({
      requestedLessonId: "lesson-x",
      visibleLessonIds,
    }),
    "lesson-a",
  );
  assert.equal(
    resolveVisibleLibraryLessonId({
      requestedLessonId: null,
      visibleLessonIds: [],
    }),
    null,
  );
});
