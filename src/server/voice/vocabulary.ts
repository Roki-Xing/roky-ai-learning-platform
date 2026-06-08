export const VOICE_AI_ACRONYMS = [
  "CoT",
  "SWE-bench",
  "RLHF",
  "DPO",
  "SFT",
  "LoRA",
  "QLoRA",
  "MoE",
  "RAG",
  "MMLU",
  "GPQA",
  "HumanEval",
  "ReAct",
  "ToT",
  "MCP",
  "BM25",
  "Reranker",
  "Embedding",
  "Vector Database",
] as const;

export function buildVoiceVocabularyPrompt() {
  return `Preserve these AI acronyms and technical terms. Terms: ${VOICE_AI_ACRONYMS.join(", ")}.`;
}
