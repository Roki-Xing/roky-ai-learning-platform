import { expect, test } from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import { execFileSync } from "node:child_process";
import { enterLearningApp, previewToken } from "@/../tests/e2e/helpers";

loadEnvConfig(process.cwd());

function deleteVoiceNote(voiceNoteId: string) {
  const script = String.raw`
    import { PrismaClient } from "@prisma/client";

    const voiceNoteId = process.env.E2E_VOICE_NOTE_ID;
    if (!voiceNoteId) throw new Error("Missing E2E_VOICE_NOTE_ID");
    const prisma = new PrismaClient();

    const voice = await prisma.voiceNote.findUnique({
      where: { id: voiceNoteId },
      select: { noteId: true, thoughtReviewId: true },
    });
    if (voice?.thoughtReviewId) {
      await prisma.reviewLog.deleteMany({
        where: { flashcard: { id: { startsWith: "thought:" + voice.thoughtReviewId + ":" } } },
      });
      await prisma.flashcard.deleteMany({
        where: { id: { startsWith: "thought:" + voice.thoughtReviewId + ":" } },
      });
      await prisma.misconception.deleteMany({
        where: { sourceKey: { startsWith: "thought:" + voice.thoughtReviewId + ":" } },
      });
      await prisma.thoughtReview.deleteMany({ where: { id: voice.thoughtReviewId } });
    }
    if (voice?.noteId) {
      await prisma.note.deleteMany({ where: { id: voice.noteId } });
    }
    await prisma.voiceNote.deleteMany({ where: { id: voiceNoteId } });
    await prisma.$disconnect();
  `;

  execFileSync(process.execPath, ["--import", "tsx", "--eval", script], {
    cwd: process.cwd(),
    env: { ...process.env, E2E_VOICE_NOTE_ID: voiceNoteId },
    stdio: "pipe",
  });
}

test("voice flow saves a manual transcript and shows the learning pipeline @interaction", async ({ page }) => {
  test.skip(Boolean(previewToken), "Preview Mode is read-only; mutation flow runs only in local Demo mode.");

  const marker = `e2e-voice-${Date.now()}`;
  let voiceNoteId: string | null = null;

  try {
    await enterLearningApp(page, "/voice?mode=free_thought");
    await expect(page.getByRole("heading", { name: "语音学习捕获" })).toBeVisible();

    const form = page.getByTestId("voice-note-form");
    await expect(form).toBeVisible();
    await expect(form.locator('select[name="mode"]')).toHaveValue("free_thought");

    await form
      .getByLabel("语音转写文本")
      .fill(`我用语音解释 Self-Attention 的 Q/K/V。${marker}`);
    await form.getByLabel("整理版").fill(`整理版：Q/K/V 是同一输入的三种投影。${marker}`);

    await Promise.all([
      page.waitForURL((url) => url.pathname === "/voice" && url.searchParams.has("voiceNoteId"), {
        timeout: 20_000,
      }),
      form.getByRole("button", { name: "保存并进入分析" }).click(),
    ]);

    voiceNoteId = new URL(page.url()).searchParams.get("voiceNoteId");
    expect(voiceNoteId).toBeTruthy();

    await expect(page.getByText("当前语音笔记")).toBeVisible();
    await expect(page.getByText("已捕获")).toBeVisible();
    await expect(page.getByText(marker).first()).toBeVisible();
    await expect(page.getByText("语音学习流水线")).toBeVisible();
    await expect(page.getByText("送 Coach 检查").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "送 Coach 检查" })).toBeEnabled();
    await expect(page.getByRole("button", { name: "整理成笔记" })).toBeEnabled();
  } finally {
    if (voiceNoteId) deleteVoiceNote(voiceNoteId);
  }
});

test("voice flow sends transcript to coach, creates cards, and opens focused review @interaction", async ({ page }) => {
  test.skip(Boolean(previewToken), "Preview Mode is read-only; mutation flow runs only in local Demo mode.");

  const marker = `e2e-voice-coach-${Date.now()}`;
  let voiceNoteId: string | null = null;

  try {
    await enterLearningApp(page, "/voice?mode=free_thought");
    await expect(page.getByRole("heading", { name: "语音学习捕获" })).toBeVisible();

    const form = page.getByTestId("voice-note-form");
    await expect(form).toBeVisible();
    await form.getByLabel("语音转写文本").fill(
      `我觉得 attention 就是把所有 token 平均一下。${marker}`,
    );

    await Promise.all([
      page.waitForURL((url) => url.pathname === "/voice" && url.searchParams.has("voiceNoteId"), {
        timeout: 20_000,
      }),
      form.getByRole("button", { name: "保存并进入分析" }).click(),
    ]);

    voiceNoteId = new URL(page.url()).searchParams.get("voiceNoteId");
    expect(voiceNoteId).toBeTruthy();

    await Promise.all([
      page.waitForURL(
        (url) =>
          url.pathname === "/coach" &&
          url.searchParams.has("reviewId") &&
          url.searchParams.get("source") === "voice-note" &&
          url.searchParams.get("voiceNoteId") === voiceNoteId,
        { timeout: 20_000 },
      ),
      page.getByRole("button", { name: "送 Coach 检查" }).click(),
    ]);

    const reviewId = new URL(page.url()).searchParams.get("reviewId");
    expect(reviewId).toBeTruthy();

    await expect(page.getByText("来自语音笔记")).toBeVisible();
    await expect(page.getByText("语音理解已进入 Coach review")).toBeVisible();
    await expect(page.getByText(marker).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "查看语音笔记" })).toBeVisible();
    await expect(page.getByRole("button", { name: "保存为 Note" })).toBeVisible();

    await Promise.all([
      page.waitForURL((url) => url.pathname === "/review" && url.searchParams.get("source") === "voice-note", {
        timeout: 20_000,
      }),
      page.getByRole("button", { name: "生成卡片" }).click(),
    ]);

    await expect(page.getByText("语音笔记复习")).toBeVisible();
    await expect(page.getByRole("heading", { name: /复习/ })).toBeVisible();
    await expect(page.getByText("语音笔记复习")).toBeVisible();
    await expect(page.getByText(marker).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "显示答案" })).toBeVisible();
  } finally {
    if (voiceNoteId) deleteVoiceNote(voiceNoteId);
  }
});
