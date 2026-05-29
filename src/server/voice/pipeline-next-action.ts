export type VoicePipelineNextActionKind = "capture" | "coach" | "note" | "cards" | "review";

export type VoicePipelineNextActionTone = "neutral" | "info" | "success" | "warning" | "danger";

export type VoicePipelineNextActionInput = {
  hasSelected: boolean;
  hasCoach: boolean;
  hasNote: boolean;
  hasCards: boolean;
  linkedCards: number;
  reviewId: string | null;
  noteId: string | null;
};

export type VoicePipelineNextAction = {
  kind: VoicePipelineNextActionKind;
  label: string;
  description: string;
  primaryButtonLabel: string;
  href: string | null;
  tone: VoicePipelineNextActionTone;
};

export function buildVoicePipelineNextAction(input: VoicePipelineNextActionInput): VoicePipelineNextAction {
  if (!input.hasSelected) {
    return {
      kind: "capture",
      label: "先保存 Voice Note",
      description: "先录音、上传或粘贴 transcript，保存后再把这段理解送进学习流水线。",
      primaryButtonLabel: "保存 Voice Note",
      href: null,
      tone: "warning",
    };
  }

  if (!input.hasCoach) {
    return {
      kind: "coach",
      label: "送 Coach 检查",
      description: "先检查概念混淆、缺失前提和表达漏洞，再决定是否沉淀成笔记或卡片。",
      primaryButtonLabel: "送 Coach 检查",
      href: null,
      tone: "info",
    };
  }

  if (!input.hasCards) {
    return {
      kind: "cards",
      label: "生成复习卡片",
      description: "把 Coach 反馈转成主动回忆卡片，让这次口语理解进入后续复习。",
      primaryButtonLabel: "生成复习卡片",
      href: null,
      tone: "info",
    };
  }

  if (!input.hasNote) {
    return {
      kind: "note",
      label: "补一条学习笔记",
      description: "卡片已经生成，再把这次语音内容整理成可回看的 Markdown 笔记。",
      primaryButtonLabel: "整理成笔记",
      href: null,
      tone: "neutral",
    };
  }

  const cardCount = Math.max(0, input.linkedCards);

  return {
    kind: "review",
    label: cardCount > 0 ? `复习这 ${cardCount} 张语音卡片` : "复习语音卡片",
    description: "语音内容已经完成沉淀，下一步用主动回忆确认自己真的记住了。",
    primaryButtonLabel: cardCount > 0 ? `复习这 ${cardCount} 张语音卡片` : "去复习",
    href: "/review?source=voice-note",
    tone: "success",
  };
}
