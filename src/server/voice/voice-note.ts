export {
  VOICE_REFLECTION_TEMPLATES,
  buildVoiceReflectionTemplates,
  buildVoiceReflectionTemplate,
} from "@/server/voice/reflection-template";

const VOICE_MODES = new Set([
  "free_thought",
  "today_lesson",
  "code_debug",
  "paper_reading",
  "industry_radar",
  "glossary_question",
]);

export function normalizeVoiceMode(value: string | null | undefined) {
  const mode = (value ?? "").trim();
  return VOICE_MODES.has(mode) ? mode : "free_thought";
}

export function voiceModeToCoachMode(mode: string) {
  switch (normalizeVoiceMode(mode)) {
    case "today_lesson":
      return "today_lesson";
    case "code_debug":
      return "code_reasoning";
    case "industry_radar":
      return "industry_radar";
    case "glossary_question":
      return "glossary_term";
    case "paper_reading":
      return "concept_question";
    case "free_thought":
    default:
      return "free_thought";
  }
}

function compact(text: string, max: number) {
  const oneLine = text.trim().replace(/\s+/g, " ");
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max - 1)}…`;
}

export function buildVoiceNoteTitle(args: { mode: string; transcript: string }) {
  return compact(`语音笔记 · ${normalizeVoiceMode(args.mode)} · ${args.transcript}`, 80);
}

export function buildVoiceCoachText(args: { mode: string; transcript: string }) {
  return [
    `Voice Note mode: ${normalizeVoiceMode(args.mode)}`,
    "请把下面这段语音转写当作我的原始思路来评审：",
    "",
    args.transcript.trim(),
  ].join("\n");
}

export function buildVoiceNoteMarkdown(args: {
  mode: string;
  transcript: string;
  thoughtReviewId?: string | null;
}) {
  return [
    `# ${buildVoiceNoteTitle({ mode: args.mode, transcript: args.transcript })}`,
    "",
    `- mode: ${normalizeVoiceMode(args.mode)}`,
    args.thoughtReviewId ? `- thoughtReviewId: ${args.thoughtReviewId}` : null,
    "",
    "## Transcript",
    "",
    args.transcript.trim(),
  ]
    .filter((x): x is string => typeof x === "string")
    .join("\n");
}
