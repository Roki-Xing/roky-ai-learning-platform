export type VoiceReflectionTemplate = {
  id: string;
  label: string;
  prompt: string;
};

function prompt(lines: string[]) {
  return [
    "请用 60 秒说明：",
    ...lines.map((line, index) => `${index + 1}. ${line}`),
  ].join("\n");
}

const VOICE_REFLECTION_PROMPT = prompt([
  "我今天学的是...",
  "我理解为...",
  "我卡住的是...",
  "我想让 Coach 检查...",
]);

export const VOICE_REFLECTION_TEMPLATES: VoiceReflectionTemplate[] = [
  {
    id: "daily_understanding",
    label: "今日理解",
    prompt: VOICE_REFLECTION_PROMPT,
  },
  {
    id: "code_reasoning",
    label: "代码思路",
    prompt: VOICE_REFLECTION_PROMPT,
  },
  {
    id: "mistake_retell",
    label: "错题复述",
    prompt: VOICE_REFLECTION_PROMPT,
  },
  {
    id: "glossary_explanation",
    label: "术语解释",
    prompt: VOICE_REFLECTION_PROMPT,
  },
  {
    id: "project_retrospective",
    label: "项目复盘",
    prompt: VOICE_REFLECTION_PROMPT,
  },
  {
    id: "book_question",
    label: "读书疑问",
    prompt: VOICE_REFLECTION_PROMPT,
  },
  {
    id: "paper_reading",
    label: "论文阅读",
    prompt: VOICE_REFLECTION_PROMPT,
  },
  {
    id: "industry_observation",
    label: "行业观察",
    prompt: VOICE_REFLECTION_PROMPT,
  },
];

export const VOICE_REFLECTION_TEMPLATE = VOICE_REFLECTION_TEMPLATES[0]!.prompt;

export function buildVoiceReflectionTemplate() {
  return VOICE_REFLECTION_TEMPLATE;
}

export function buildVoiceReflectionTemplates() {
  return VOICE_REFLECTION_TEMPLATES;
}
