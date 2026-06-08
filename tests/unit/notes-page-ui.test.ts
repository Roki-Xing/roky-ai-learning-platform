import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NotesListPanel } from "@/app/notes/ui/notes-list-panel";

test("notes list highlights the selected voice note handoff target", () => {
  const markup = renderToStaticMarkup(
    React.createElement(NotesListPanel, {
      selectedNoteId: "note-voice-1",
      notes: [
        {
          id: "note-voice-1",
          title: "语音笔记 · 今日课程",
          content: "从 voice transcript 整理出来的笔记。",
          updatedAtLabel: "2026-05-30 09:30",
          lessonId: "lesson-1",
          lessonTitle: "Transformer 架构入门",
        },
        {
          id: "note-other",
          title: "普通笔记",
          content: "另一条笔记。",
          updatedAtLabel: "2026-05-29 09:30",
          lessonId: null,
          lessonTitle: null,
        },
      ],
    }),
  );

  assert.match(markup, /笔记列表/);
  assert.match(markup, /来自语音笔记的当前笔记/);
  assert.doesNotMatch(markup, /来自 Voice 的当前笔记/);
  assert.match(markup, /语音笔记 · 今日课程/);
  assert.match(markup, /href="\/notes\?noteId=note-voice-1"/);
  assert.match(markup, /border-indigo-200 bg-indigo-50/);
  assert.match(markup, /Transformer 架构入门/);
});
