export type VoiceTranscriptAutofillResult = {
  nextTranscript: string;
  shouldFocusTranscript: boolean;
  notice: string;
};

export function resolveVoiceTranscriptAutofill(input: {
  currentTranscript: string;
  incomingTranscript: string;
}): VoiceTranscriptAutofillResult {
  const current = input.currentTranscript;
  const incoming = input.incomingTranscript.trim();

  if (!incoming) {
    return {
      nextTranscript: current,
      shouldFocusTranscript: false,
      notice: "没有可用转写，请手动粘贴或直接写下你的理解。",
    };
  }

  if (current.trim()) {
    return {
      nextTranscript: current,
      shouldFocusTranscript: true,
      notice: "已保留你手动输入的 Transcript，请对照转写结果检查是否需要补充。",
    };
  }

  return {
    nextTranscript: incoming,
    shouldFocusTranscript: true,
    notice: "转写已填入，请检查 Transcript 后保存。",
  };
}
