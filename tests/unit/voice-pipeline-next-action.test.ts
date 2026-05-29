import test from "node:test";
import assert from "node:assert/strict";
import { buildVoicePipelineNextAction } from "@/server/voice/pipeline-next-action";

test("voice pipeline next action asks for capture before a note exists", () => {
  const action = buildVoicePipelineNextAction({
    hasSelected: false,
    hasCoach: false,
    hasNote: false,
    hasCards: false,
    linkedCards: 0,
    reviewId: null,
    noteId: null,
  });

  assert.equal(action.label, "先保存 Voice Note");
  assert.equal(action.kind, "capture");
  assert.match(action.description, /录音、上传或粘贴 transcript/);
});

test("voice pipeline next action prioritizes coach after saving transcript", () => {
  const action = buildVoicePipelineNextAction({
    hasSelected: true,
    hasCoach: false,
    hasNote: false,
    hasCards: false,
    linkedCards: 0,
    reviewId: null,
    noteId: null,
  });

  assert.equal(action.label, "送 Coach 检查");
  assert.equal(action.kind, "coach");
  assert.equal(action.primaryButtonLabel, "送 Coach 检查");
  assert.match(action.description, /先检查概念混淆/);
});

test("voice pipeline next action recommends cards after coach review", () => {
  const action = buildVoicePipelineNextAction({
    hasSelected: true,
    hasCoach: true,
    hasNote: false,
    hasCards: false,
    linkedCards: 0,
    reviewId: "review-1",
    noteId: null,
  });

  assert.equal(action.label, "生成复习卡片");
  assert.equal(action.kind, "cards");
  assert.equal(action.href, null);
  assert.match(action.description, /把 Coach 反馈转成主动回忆/);
});

test("voice pipeline next action points to focused review after cards exist", () => {
  const action = buildVoicePipelineNextAction({
    hasSelected: true,
    hasCoach: true,
    hasNote: true,
    hasCards: true,
    linkedCards: 3,
    reviewId: "review-1",
    noteId: "note-1",
  });

  assert.equal(action.label, "复习这 3 张语音卡片");
  assert.equal(action.kind, "review");
  assert.equal(action.href, "/review?source=voice-note");
});
