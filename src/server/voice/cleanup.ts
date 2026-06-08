const VOICE_TRANSCRIPT_CLEANUP_RULES = [
  { canonical: "Chain-of-Thought", patterns: [/\bchain of thought\b/gi] },
  { canonical: "SWE-bench", patterns: [/\bswe[\s-]?bench\b/gi, /\bswebench\b/gi] },
  { canonical: "HumanEval", patterns: [/\bhuman[\s-]?eval\b/gi, /\bhumaneval\b/gi] },
  { canonical: "QLoRA", patterns: [/\bq[\s-]?lora\b/gi, /\bqlora\b/gi] },
  { canonical: "Vector Database", patterns: [/\bvector database\b/gi] },
  { canonical: "BM25", patterns: [/\bbm[\s-]?25\b/gi] },
  { canonical: "RLHF", patterns: [/\brlhf\b/gi] },
  { canonical: "DPO", patterns: [/\bdpo\b/gi] },
  { canonical: "SFT", patterns: [/\bsft\b/gi] },
  { canonical: "LoRA", patterns: [/\blora\b/gi] },
  { canonical: "MoE", patterns: [/\bmoe\b/gi, /\bmixture of experts\b/gi] },
  { canonical: "RAG", patterns: [/\brag\b/gi] },
  { canonical: "MMLU", patterns: [/\bmmlu\b/gi] },
  { canonical: "GPQA", patterns: [/\bgpqa\b/gi] },
  { canonical: "ReAct", patterns: [/\breact\b/gi] },
  { canonical: "ToT", patterns: [/\btot\b/gi, /\btree of thoughts\b/gi] },
  { canonical: "MCP", patterns: [/\bm[\s-]?c[\s-]?p\b/gi, /\bmcp\b/gi] },
  { canonical: "CoT", patterns: [/\bcot\b/gi] },
  { canonical: "Reranker", patterns: [/\breranker\b/gi] },
  { canonical: "Embedding", patterns: [/\bembedding\b/gi] },
] as const;

export function cleanupVoiceTranscript(text: string) {
  let cleaned = text;
  for (const rule of VOICE_TRANSCRIPT_CLEANUP_RULES) {
    for (const pattern of rule.patterns) {
      cleaned = cleaned.replace(pattern, rule.canonical);
    }
  }
  return cleaned.trim();
}
