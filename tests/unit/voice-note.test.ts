import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  VOICE_REFLECTION_TEMPLATES,
  buildVoiceCoachText,
  buildVoiceNoteTitle,
  normalizeVoiceMode,
  voiceModeToCoachMode,
} from "@/server/voice/voice-note";
import { buildVoiceCoachReviewHref } from "@/server/voice/handoff";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { VoiceCapture } from "@/app/voice/ui/voice-capture";
import { VoiceWorkspaceForm } from "@/app/voice/ui/voice-workspace-form";

test("normalizeVoiceMode accepts documented modes and falls back safely", () => {
  assert.equal(normalizeVoiceMode("today_lesson"), "today_lesson");
  assert.equal(normalizeVoiceMode("code_debug"), "code_debug");
  assert.equal(normalizeVoiceMode("mistake_retell"), "mistake_retell");
  assert.equal(normalizeVoiceMode("book_question"), "book_question");
  assert.equal(normalizeVoiceMode("unknown"), "free_thought");
  assert.equal(normalizeVoiceMode(""), "free_thought");
});

test("voice modes map to Coach modes without falling back to free thought", () => {
  assert.equal(voiceModeToCoachMode("mistake_retell"), "mistake_retell");
  assert.equal(voiceModeToCoachMode("book_question"), "book_question");
  assert.equal(voiceModeToCoachMode("project_retrospective"), "code_reasoning");
});

test("buildVoiceNoteTitle creates a compact transcript title", () => {
  const title = buildVoiceNoteTitle({
    mode: "paper_reading",
    transcript: "今天我读了 Transformer 论文，主要困惑是 self-attention 的 Q/K/V 为什么要拆开。",
  });

  assert.match(title, /^语音笔记 · paper_reading · /);
  assert.ok(title.length <= 80);
});

test("buildVoiceCoachText preserves transcript and mode context", () => {
  const text = buildVoiceCoachText({
    mode: "code_debug",
    transcript: "我的 softmax 代码直接 return scores。",
  });

  assert.match(text, /Voice Note/);
  assert.match(text, /code_debug/);
  assert.match(text, /softmax/);
});

test("voice coach handoff points directly to the selected Coach review", () => {
  const href = buildVoiceCoachReviewHref({
    reviewId: "review 1",
    voiceNoteId: "voice/1",
  });

  assert.equal(href, "/coach?reviewId=review%201&source=voice-note&voiceNoteId=voice%2F1");
});

test("voice workspace form can default to today's lesson mode from completion handoff", () => {
  const markup = renderToStaticMarkup(
    React.createElement(VoiceWorkspaceForm, {
      modes: [
        ["free_thought", "自由想法"],
        ["today_lesson", "今日课程"],
      ],
      recentPlan: {
        lessonId: "lesson-1",
        localDate: "2026-05-29",
        title: "Transformer 架构入门",
      },
      defaultMode: "today_lesson",
      defaultLessonId: "lesson-1",
    }),
  );

  assert.match(markup, /关联：2026-05-29 \/ Transformer 架构入门/);
  assert.match(markup, /<option value="today_lesson" selected="">今日课程<\/option>/);
  assert.match(markup, /type="hidden" name="lessonId" value="lesson-1"/);
  assert.match(markup, /开始 60 秒反思/);
  assert.match(markup, /我今天学的是\.\.\./);
  assert.match(markup, /我理解为\.\.\./);
  assert.match(markup, /我卡住的是\.\.\./);
  assert.match(markup, /我想让 Coach 检查\.\.\./);
  assert.doesNotMatch(markup, /aria-label="Voice Note 模式"/);
  assert.match(markup, /aria-label="语音笔记模式"/);
  assert.match(markup, /<select[^>]+aria-label="语音笔记模式"[^>]+class="[^"]*min-h-11[^"]*"/);
  assert.doesNotMatch(markup, /class="h-9 rounded-md border bg-background px-3 text-sm outline-none"/);
  assert.doesNotMatch(markup, /aria-label="Transcript"/);
  assert.match(markup, /aria-label="语音转写文本"/);
  assert.match(markup, />转写文本</);
  assert.doesNotMatch(markup, />Transcript</);
  for (const label of ["开始 60 秒反思", "清空", "保存并进入分析"]) {
    const labelIndex = markup.indexOf(label);
    assert.notEqual(labelIndex, -1);
    const ctaWindow = markup.slice(Math.max(0, labelIndex - 260), labelIndex + 120);
    assert.match(ctaWindow, /min-h-11 w-full sm:w-auto/);
  }

  const reflectionTemplateSection = markup.slice(markup.indexOf("60 秒反思模板"));
  for (const label of ["今日理解", "代码思路", "错题复述", "术语解释", "项目复盘", "读书疑问", "论文阅读", "行业观察"]) {
    const labelIndex = reflectionTemplateSection.indexOf(label);
    assert.notEqual(labelIndex, -1);
    const templateWindow = reflectionTemplateSection.slice(Math.max(0, labelIndex - 260), labelIndex + 120);
    assert.match(templateWindow, /min-h-11/);
  }
  assert.doesNotMatch(
    markup,
    /class="rounded-md border bg-background px-3 py-2 text-left transition-colors hover:bg-muted\/50"/,
  );
});

test("voice capture renders one-tap mobile recording controls with automatic transcript handoff", () => {
  const markup = renderToStaticMarkup(
    React.createElement(VoiceCapture, {
      getMode: () => "today_lesson",
      onTranscript: () => undefined,
    }),
  );

  assert.match(markup, /一键录音/);
  assert.match(markup, /停止并转写/);
  assert.match(markup, /停止后自动转写并填入转写文本/);
  assert.doesNotMatch(markup, />recording</);
  assert.doesNotMatch(markup, /Transcript/);
  assert.match(markup, />录音计时</);
  assert.match(markup, /min-h-12/);
  assert.match(markup, /w-full sm:w-auto/);
  assert.match(markup, /class="[^"]*min-h-11[^"]*" id="voice-audio-file"/);
  assert.match(markup, /grid gap-2 sm:flex sm:flex-wrap sm:items-center/);
  assert.match(markup, /自动转写到转写文本/);
});

test("voice capture result badge localizes transcription status labels", () => {
  const source = readFileSync("src/app/voice/ui/voice-capture.tsx", "utf8");

  assert.match(source, /formatVoiceTranscriptionResultStatusLabel\(lastResult\.status\)/);
  assert.match(source, /"转写成功"/);
  assert.match(source, /"需手动整理"/);
  assert.doesNotMatch(source, /\{lastResult\.status\}/);
  assert.doesNotMatch(source, />manual_required</);
});

test("voice capture result detail hides provider and reason technical labels", () => {
  const source = readFileSync("src/app/voice/ui/voice-capture.tsx", "utf8");

  assert.match(source, /formatVoiceTranscriptionProviderLabel\(lastResult\.provider\)/);
  assert.match(source, /formatVoiceTranscriptionResultNote\(lastResult\)/);
  assert.match(source, /转写方式：/);
  assert.match(source, /提示：/);
  assert.doesNotMatch(source, /provider: \{lastResult\.provider\}/);
  assert.doesNotMatch(source, /reason: \{lastResult\.reason\}/);
  assert.doesNotMatch(source, /model: \$\{lastResult\.model\}/);
});

test("voice selected-note status area uses localized visible labels", () => {
  const source = readFileSync("src/app/voice/page.tsx", "utf8");

  assert.match(source, />已连接 Coach</);
  assert.match(source, />已保存笔记</);
  assert.match(source, />转写文本</);
  assert.doesNotMatch(source, />Coach linked</);
  assert.doesNotMatch(source, />Note saved</);
  assert.doesNotMatch(source, />Transcript</);
});

test("voice page keeps unknown mode fallback learner-friendly", () => {
  const source = readFileSync("src/app/voice/page.tsx", "utf8");

  assert.match(source, /function voiceModeLabel\(mode: string\)/);
  assert.match(source, /return MODE_LABELS\.get\(mode\) \?\? "语音反思";/);
  assert.match(source, /voiceModeLabel\(selected\.mode\)/);
  assert.match(source, /voiceModeLabel\(n\.mode\)/);
  assert.doesNotMatch(source, /MODE_LABELS\.get\(selected\.mode\) \?\? selected\.mode/);
  assert.doesNotMatch(source, /MODE_LABELS\.get\(n\.mode\) \?\? n\.mode/);
});

test("voice page header is learning-oriented for learners", () => {
  const source = readFileSync("src/app/voice/page.tsx", "utf8");

  assert.match(source, /title="说出你的理解"/);
  assert.match(source, /subtitle="不用整理，先说出来。Roky 会帮你转写、整理、检查和生成卡片。"/);
  assert.match(source, /badge="语音捕获"/);
  assert.doesNotMatch(source, /badge="Voice"/);
  assert.doesNotMatch(source, /title="语音学习捕获"/);
});

test("voice learner-visible copy uses Chinese voice note wording", () => {
  const source = [
    readFileSync("src/app/voice/page.tsx", "utf8"),
    readFileSync("src/app/voice/ui/voice-capture-status.ts", "utf8"),
    readFileSync("src/app/voice/ui/voice-workspace-form.tsx", "utf8"),
    readFileSync("src/app/voice/ui/voice-learning-pipeline.tsx", "utf8"),
  ].join("\n");

  for (const expected of [
    "当前语音笔记",
    "语音笔记的价值",
    "还没有语音笔记",
    "最近语音笔记",
    "暂无历史语音笔记。",
    "保存语音笔记后",
    "这次语音笔记生成了",
  ]) {
    assert.match(source, new RegExp(expected));
  }

  assert.doesNotMatch(source, /当前 Voice Note/);
  assert.doesNotMatch(source, /还没有 Voice Note/);
  assert.doesNotMatch(source, /最近 Voice Notes/);
  assert.doesNotMatch(source, /暂无历史 Voice Note/);
  assert.doesNotMatch(source, />Voice Note</);
  assert.doesNotMatch(source, /Voice Note 的价值/);
  assert.doesNotMatch(source, /保存 Voice Note 后/);
  assert.doesNotMatch(source, /保存 Voice Note 进入/);
  assert.doesNotMatch(source, /这次 Voice Note 生成了/);
});

test("voice page header and learning-chain CTAs use mobile touch targets", () => {
  const source = readFileSync("src/app/voice/page.tsx", "utf8");

  assert.match(source, /const voicePageCtaClassName = "min-h-11 w-full sm:w-auto"/);
  assert.match(
    source,
    /<Button asChild size="sm" variant="secondary" className=\{voicePageCtaClassName\}>\s*<Link href="\/coach">打开 Coach<\/Link>/,
  );
  assert.match(
    source,
    /<Button asChild size="sm" variant="secondary" className=\{voicePageCtaClassName\}>\s*<Link href="\/review">去复习<\/Link>/,
  );
});

test("voice recent note links keep mobile touch targets", () => {
  const source = readFileSync("src/app/voice/page.tsx", "utf8");

  assert.match(
    source,
    /const voiceRecentNoteLinkClassName = "min-h-11 rounded-md border px-3 py-2 text-sm transition-colors";/,
  );
  assert.match(source, /className=\{\[\s*voiceRecentNoteLinkClassName,\s*selected\?\.id === n\.id/);
  assert.doesNotMatch(
    source,
    /"rounded-md border px-3 py-2 text-sm transition-colors",\s*selected\?\.id === n\.id/,
  );
});

test("voice reflection templates cover the eight learning reflection intents", () => {
  assert.deepEqual(
    VOICE_REFLECTION_TEMPLATES.map((template) => template.id),
    [
      "daily_understanding",
      "code_reasoning",
      "mistake_retell",
      "glossary_explanation",
      "project_retrospective",
      "book_question",
      "paper_reading",
      "industry_observation",
    ],
  );
  assert.deepEqual(
    VOICE_REFLECTION_TEMPLATES.map((template) => template.label),
    ["今日理解", "代码思路", "错题复述", "术语解释", "项目复盘", "读书疑问", "论文阅读", "行业观察"],
  );
  for (const template of VOICE_REFLECTION_TEMPLATES) {
    assert.match(template.prompt, /请用 60 秒说明/);
    assert.match(template.prompt, /1\. 我今天学的是\.\.\./);
    assert.match(template.prompt, /2\. 我理解为\.\.\./);
    assert.match(template.prompt, /3\. 我卡住的是\.\.\./);
    assert.match(template.prompt, /4\. 我想让 Coach 检查\.\.\./);
  }
});

test("voice workspace offers mistake and book learning modes", () => {
  const markup = renderToStaticMarkup(
    React.createElement(VoiceWorkspaceForm, {
      modes: [
        ["free_thought", "自由想法"],
        ["mistake_retell", "错题复述"],
        ["book_question", "读书疑问"],
      ],
      recentPlan: null,
      defaultMode: "book_question",
    }),
  );

  assert.match(markup, /<option value="mistake_retell">错题复述<\/option>/);
  assert.match(markup, /<option value="book_question" selected="">读书疑问<\/option>/);
  assert.match(markup, /今日理解/);
  assert.match(markup, /代码思路/);
  assert.match(markup, /错题复述/);
  assert.match(markup, /术语解释/);
  assert.match(markup, /项目复盘/);
  assert.match(markup, /读书疑问/);
  assert.match(markup, /论文阅读/);
  assert.match(markup, /行业观察/);
  assert.match(markup, /placeholder="我正在读第 X 页，我不理解的是\.\.\."/);
});

test("voice page exposes learning-oriented reflection modes", () => {
  const source = readFileSync("src/app/voice/page.tsx", "utf8");

  for (const expected of [
    '["today_lesson", "今日理解"]',
    '["code_debug", "代码思路"]',
    '["mistake_retell", "错题复述"]',
    '["glossary_question", "术语解释"]',
    '["project_retrospective", "项目复盘"]',
    '["book_question", "读书疑问"]',
    '["paper_reading", "论文阅读"]',
    '["industry_radar", "行业观察"]',
  ]) {
    assert.match(source, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
