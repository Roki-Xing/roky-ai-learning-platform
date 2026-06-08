import type { LearningStatusTone } from "@/components/learning/learning-status-badge";

export type VoiceCaptureStatus =
  | "idle"
  | "recording"
  | "recorded"
  | "file-selected"
  | "file-too-large"
  | "transcribing";

export type VoiceTranscriptionStatus = "success" | "manual_required" | null;

export type VoiceCaptureStatusPanel = {
  title: string;
  description: string;
  timerLabel: string;
  tone: LearningStatusTone;
  badgeLabel: string;
};

export function formatVoiceRecordingSeconds(total: number) {
  const safeTotal = Math.max(0, Math.floor(total));
  const mm = String(Math.floor(safeTotal / 60)).padStart(2, "0");
  const ss = String(safeTotal % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export function buildVoiceCaptureStatusPanel(input: {
  status: VoiceCaptureStatus;
  seconds: number;
  hasTranscript: boolean;
  lastResultStatus: VoiceTranscriptionStatus;
}): VoiceCaptureStatusPanel {
  const timerLabel = formatVoiceRecordingSeconds(input.seconds);

  if (input.status === "file-too-large") {
    return {
      title: "音频文件过大",
      description: "请换一个 20MB 以内的音频文件，或者直接把转写文本粘贴到下方。",
      timerLabel,
      tone: "danger",
      badgeLabel: "文件过大",
    };
  }

  if (input.status === "transcribing") {
    return {
      title: "正在转写",
      description: "转写完成后会自动填入转写文本；如果 provider 不可用，可以继续手动整理。",
      timerLabel,
      tone: "info",
      badgeLabel: "转写中",
    };
  }

  if (input.status === "recording") {
    return {
      title: "正在录音",
      description: "只讲一个概念、一个卡点或一段代码思路，先保持清晰，再交给 Coach 检查。",
      timerLabel,
      tone: "warning",
      badgeLabel: "录音中",
    };
  }

  if (input.lastResultStatus === "success" && input.hasTranscript) {
    return {
      title: "转写已填入转写文本",
      description: "先检查错字、术语和代码变量名，再保存语音笔记进入 Coach、笔记和复习卡片。",
      timerLabel,
      tone: "success",
      badgeLabel: "已转写",
    };
  }

  if (input.status === "recorded") {
    return {
      title: "录音已完成，准备转写",
      description: "停止后会自动转写并填入转写文本；如果 provider 不可用，可以继续手动补转写文本。",
      timerLabel,
      tone: "info",
      badgeLabel: "已录音",
    };
  }

  if (input.status === "file-selected") {
    return {
      title: "音频已选择",
      description: input.lastResultStatus === "manual_required"
        ? "当前需要手动粘贴转写文本；粘贴后仍然可以保存并送 Coach 检查。"
        : "点击自动转写到转写文本，或者直接在下方写出自己的理解。",
      timerLabel,
      tone: input.lastResultStatus === "manual_required" ? "warning" : "info",
      badgeLabel: input.lastResultStatus === "manual_required" ? "需手动整理" : "已选择音频",
    };
  }

  return {
    title: "准备说出理解",
    description: "把脑子里的想法说出来：今天学到什么、哪里卡住、代码为什么这样写。",
    timerLabel,
    tone: "neutral",
    badgeLabel: "待捕获",
  };
}
