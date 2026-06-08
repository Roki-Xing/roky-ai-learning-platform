import { pickDailyTemplate, type DailyPlanTemplate } from "@/server/content/templates";
import {
  DAILY_PLAN_SCHEMA_VERSION,
  GeneratedDailyPlanSchema,
  type GeneratedDailyPlan,
} from "@/server/ai/schemas";
import { buildPersistedDailyGenerationOutput } from "@/server/ai/daily-generation-quality";
import type { CurriculumSignalSnapshot } from "@/server/curriculum/types";
import type { Prisma } from "@prisma/client";

type GenerationSource = "deepseek" | "template";

type UserProfileContext = {
  goal: string;
  level: string;
  dailyMinutes: number;
  language: string;
  difficulty: string;
  preferredAreas: unknown | null;
};

type CurriculumContext = {
  domain: string;
  domainSlug: string;
  topic: string;
  topicSlug: string;
  reason: string;
  codingFocus?: string;
  breadthFocus?: unknown;
  difficulty: string;
  estimatedMinutes: number;
  scoreBreakdown?: unknown;
  signalSnapshot?: CurriculumSignalSnapshot | null;
};

export const DEFAULT_DAILY_PLAN_AI_TIMEOUT_MS = 20_000;
export const DAILY_PLAN_PROMPT_VERSION = "daily-plan-v2.10-code-sketch-course-blocks";

export function dailyPlanAiTimeoutMs(value = process.env.DEEPSEEK_DAILY_TIMEOUT_MS) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_DAILY_PLAN_AI_TIMEOUT_MS;
  return Math.min(60_000, Math.max(5_000, parsed));
}

function toIssueSummary(err: unknown) {
  if (!(err instanceof Error)) return String(err);
  return err.message;
}

function stripBOM(s: string) {
  return s.startsWith("\uFEFF") ? s.slice(1) : s;
}

function stripToFirstJsonObject(s: string) {
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return s;
  return s.slice(start, end + 1);
}

// Best-effort JSON syntax cleanup for common LLM issues (e.g., trailing commas).
// This is NOT a full JSONC/JSON5 parser; it only fixes a small set of cases and then falls back to model repair.
function stripTrailingCommasOutsideStrings(s: string) {
  let out = "";
  let inString = false;
  let escape = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]!;

    if (inString) {
      out += ch;
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === "\\") {
        escape = true;
        continue;
      }
      if (ch === "\"") {
        inString = false;
      }
      continue;
    }

    if (ch === "\"") {
      inString = true;
      out += ch;
      continue;
    }

    if (ch === "}" || ch === "]") {
      // Remove a trailing comma right before a closing bracket.
      let j = out.length - 1;
      while (j >= 0 && /\s/.test(out[j]!)) j--;
      if (j >= 0 && out[j] === ",") {
        out = out.slice(0, j) + out.slice(j + 1);
      }
      out += ch;
      continue;
    }

    out += ch;
  }

  return out;
}

function parseJsonOrThrow(rawText: string) {
  const original = rawText;
  const cleaned = stripTrailingCommasOutsideStrings(stripToFirstJsonObject(stripBOM(original.trim())));

  try {
    return JSON.parse(cleaned) as unknown;
  } catch (e) {
    // If we already cleaned, surface the cleaned parse error. The caller may choose to invoke model repair.
    throw e;
  }
}

export function buildDailyPlanMessages(args: {
  localDate: string;
  timeZone: string;
  topicSlug: string;
  quizCount: number;
  flashcardCount: number;
  userProfile?: UserProfileContext | null;
  curriculum?: CurriculumContext | null;
}): Array<{ role: "system" | "user"; content: string }> {
  // Important for JSON mode: mention the word "json" explicitly.
  const system = [
    "You are a tutor that outputs valid json only.",
    "Do not output markdown. Do not wrap in code fences.",
    "Output MUST be a single JSON object that matches the required shape.",
    "All fields must be present. Arrays must have at least 1 item.",
    "Do NOT translate any JSON keys or enum values. Keys must match the example exactly.",
  ].join("\n");

  const example: GeneratedDailyPlan = {
    schemaVersion: DAILY_PLAN_SCHEMA_VERSION,
    lesson: {
      title: "Example Lesson Title",
      summary: "One-paragraph summary.",
      contentMarkdown:
        "# Title\n\n> 核心直觉：Explain the central intuition in one concrete sentence.\n\n> 常见误区：Name one misconception to avoid.\n\n> 重点：Name the one idea the learner must remember.\n\n> 例子卡：Give one compact concrete example or analogy.\n\n> 代码/伪代码：Show the minimal algorithm shape.\n\n> 图示：Describe a simple visual layout or mental diagram the learner can sketch.\n\n> 互动实验：Ask the learner to vary one input or parameter and predict what changes.\n\n> 自测卡：Ask one short retrieval question the learner can answer without notes.\n\nUse inline math like $a^T b$ and block math like:\n\n$$\n\\operatorname{softmax}(x_i)=\\frac{e^{x_i}}{\\sum_j e^{x_j}}\n$$",
      objectives: ["Objective 1"],
      keyTerms: ["Term 1"],
      guidedSteps: [
        {
          type: "activation",
          title: "Activation",
          content: "Write one sentence about what you already know.",
          question: "What do you already know?",
          expectedAnswer: "A short self-check answer.",
          hints: ["Keep it short."],
        },
        {
          type: "concept",
          title: "Core Concept",
          content: "Explain the key idea in 3-5 bullets.",
          hints: [],
        },
        {
          type: "example",
          title: "Worked Example",
          content: "Walk through one concrete example.",
          hints: [],
        },
        {
          type: "pseudocode",
          title: "Pseudocode",
          content: "Give simple pseudocode.",
          hints: [],
        },
        {
          type: "coding",
          title: "Coding",
          content: "Implement the core function in Python.",
          hints: [],
        },
      ],
    },
    quiz: [
      {
        type: "single_choice",
        question: "Example question?",
        options: ["A", "B"],
        answer: 0,
        explanation: "Why this is correct.",
      },
    ],
    codingExercise: {
      language: "python",
      title: "Example Coding Exercise",
      prompt: "Write a function...",
      starterCode: "def f(x):\n    # TODO\n    return x\n",
      referenceSolution: "def f(x):\n    return x\n",
      visibleTests: [{ input: "f(1)", expectedOutput: "1" }],
      expectedComplexity: "Time O(n), Space O(1)",
      commonBugs: ["Off-by-one errors"],
      hints: ["Start with a loop."],
    },
    glossary: {
      term: "Example Term",
      oneLine: "One-line definition.",
      definition: "Definition text (longer).",
      whyItMatters: "Why it matters.",
      relatedTerms: ["Related 1"],
      commonMistakes: ["Mistake 1"],
      selfCheckQuestion: "Self check question?",
    },
    breadth: {
      kind: "tool",
      title: "Example Tool",
      oneLine: "One-line summary.",
      whyItMatters: "Why it matters.",
      representativeWorks: ["Work 1"],
      relatedTerms: ["Related 1"],
      selfCheckQuestion: "Self check question?",
    },
    flashcards: [{ front: "Q?", back: "A." }],
    reflectionPrompt: "Write one sentence summary.",
    nextRecommendation: "Next topic suggestion.",
  };

  const outputLanguage =
    args.userProfile?.language?.toLowerCase().startsWith("en") ? "en-US" : "zh-CN";
  const dailyMinutes = args.userProfile?.dailyMinutes ?? 30;

  const preferredCodingLanguage =
    outputLanguage === "zh-CN"
      ? "Python（默认）"
      : "Python (default)";

  const codingLanguageRule = [
    "Coding exercise requirements:",
    `- Use Python by default (${preferredCodingLanguage}).`,
    "- Do NOT generate TypeScript unless explicitly requested by the user.",
    "- Provide starterCode and referenceSolution in the same language.",
    "- Provide 1-3 visibleTests with input and expectedOutput strings.",
  ].join("\n");

  const user = [
    "Generate a daily learning plan json for the following:",
    `- localDate: ${args.localDate}`,
    `- timeZone: ${args.timeZone}`,
    `- topicSlug: ${args.topicSlug}`,
    `- promptVersion: ${DAILY_PLAN_PROMPT_VERSION}`,
    `- schemaVersion: ${DAILY_PLAN_SCHEMA_VERSION}`,
    args.curriculum
      ? [
          "",
          "Curriculum planner decision:",
          `- selectedDomain: ${args.curriculum.domain} (${args.curriculum.domainSlug})`,
          `- selectedTopic: ${args.curriculum.topic} (${args.curriculum.topicSlug})`,
          `- selectionReason: ${args.curriculum.reason}`,
          `- difficulty: ${args.curriculum.difficulty}`,
          `- codingFocus: ${args.curriculum.codingFocus ?? "-"}`,
          `- breadthFocus: ${JSON.stringify(args.curriculum.breadthFocus ?? null)}`,
          "",
          "Planner signal snapshot:",
          JSON.stringify(args.curriculum.signalSnapshot ?? null, null, 2),
          "",
          "Use the planner signal snapshot to adapt emphasis:",
          "- active misconceptions and hard reviews should lower difficulty and add remediation steps.",
          "- low recent code submissions should increase Python implementation practice.",
          "- recentStudies should avoid repeating the same topic unless remediation is needed.",
        ].join("\n")
      : "",
    args.userProfile
      ? [
          "",
          "User profile:",
          `- goal: ${args.userProfile.goal}`,
          `- level: ${args.userProfile.level}`,
          `- dailyMinutes: ${args.userProfile.dailyMinutes}`,
          `- language: ${args.userProfile.language}`,
          `- difficulty: ${args.userProfile.difficulty}`,
          `- preferredAreas: ${JSON.stringify(args.userProfile.preferredAreas)}`,
        ].join("\n")
      : "",
    "",
    `Requirements:`,
    `- quiz must have exactly ${args.quizCount} questions`,
    `- flashcards must have exactly ${args.flashcardCount} cards`,
    `- quiz[i].type MUST be one of: single_choice | multi_choice | true_false`,
    `- for single_choice: options[] required, answer is number index`,
    `- for multi_choice: options[] required, answer is number[] indices`,
    `- for true_false: answer is boolean`,
    `- lesson.contentMarkdown must be readable and concise (<= 120 lines)`,
    "- lesson.contentMarkdown should include markdown blockquote course callouts rendered by LearningMarkdown:",
    "  > 核心直觉：one concrete intuition",
    "  > 常见误区：one common misconception",
    "  > 重点：one idea the learner must remember",
    "  > 例子卡：one compact concrete example or analogy",
    "  > 代码/伪代码：minimal code or pseudocode sketch, rendered as data-learning-callout=\"code_sketch\"",
    "  > 图示：one simple visual layout or mental diagram the learner can sketch",
    "  > 互动实验：one small parameter/input change the learner can try or predict",
    "  > 自测卡：one retrieval question the learner can answer without notes",
    "- when using formulas in lesson.contentMarkdown or guidedSteps, use markdown math syntax: inline $...$ and block $$...$$",
    "- use standard LaTeX math commands inside formulas. Do not use HTML for formulas",
    `- include 5-7 guidedSteps, each is an object with fields: type/title/content/question?/expectedAnswer?/hints[]`,
    `- target a ${dailyMinutes}-minute learning session`,
    `- keep all text in ${outputLanguage} except code blocks`,
    codingLanguageRule,
    "",
    "Return only json.",
    "",
    "Example json object (shape reference only):",
    JSON.stringify(example, null, 2),
  ].join("\n");

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

function buildRepairMessages(args: {
  rawModelOutput: string;
  errorSummary: string;
  localDate: string;
  timeZone: string;
  topicSlug: string;
  quizCount: number;
  flashcardCount: number;
  curriculum?: CurriculumContext | null;
}): Array<{ role: "system" | "user"; content: string }> {
  const system = [
    "You are a strict json repair tool.",
    "Return valid json only (single JSON object).",
    "Do not output markdown. Do not wrap in code fences.",
    "Do NOT translate any JSON keys or enum values. Keys must match the example/requirements exactly.",
  ].join("\n");

  const user = [
    "Fix the following model output into valid json with the required shape.",
    "The final output MUST be a single JSON object.",
    "",
    `Context: localDate=${args.localDate}, timeZone=${args.timeZone}, topicSlug=${args.topicSlug}`,
    `Requirements: quiz has exactly ${args.quizCount} questions; flashcards has exactly ${args.flashcardCount} cards`,
    `SchemaVersion must be ${DAILY_PLAN_SCHEMA_VERSION}`,
    "",
    "Required keys (must exist): schemaVersion, lesson, quiz, codingExercise, glossary, breadth, flashcards",
    "Allowed quiz types: single_choice | multi_choice | true_false",
    "",
    "Error summary:",
    args.errorSummary,
    "",
    "Invalid model output:",
    args.rawModelOutput.slice(0, 12_000),
    "",
    "Return only json.",
  ].join("\n");

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

async function tryGenerateWithDeepSeek(args: {
  userId: string;
  localDate: string;
  timeZone: string;
  topicSlug: string;
  userProfile?: UserProfileContext | null;
  curriculum?: CurriculumContext | null;
}) {
  const deepseekEnabled = Boolean(process.env.DEEPSEEK_API_KEY) && process.env.NODE_ENV !== "test";
  if (!deepseekEnabled) {
    return { source: "template" as const, tpl: pickDailyTemplate({ topicSlug: args.topicSlug }) };
  }

  const [{ prisma }, { deepseekChatJsonObject }] = await Promise.all([
    import("@/server/db"),
    import("@/server/ai/deepseek"),
  ]);

  const input = {
    localDate: args.localDate,
    timeZone: args.timeZone,
    topicSlug: args.topicSlug,
    quizCount: 3,
    flashcardCount: 3,
    userProfile: args.userProfile ?? null,
    curriculum: args.curriculum ?? null,
    promptVersion: DAILY_PLAN_PROMPT_VERSION,
    schemaVersion: DAILY_PLAN_SCHEMA_VERSION,
  };

  const job = await prisma.aiGenerationJob.create({
    data: {
      userId: args.userId,
      type: "daily_plan",
      status: "pending",
      input: input as Prisma.InputJsonValue,
    },
  });

  const updateJob = async (data: Partial<Prisma.AiGenerationJobUpdateInput>) => {
    await prisma.aiGenerationJob.update({ where: { id: job.id }, data });
  };
  const timeoutMs = dailyPlanAiTimeoutMs();
  const recentStudies = args.curriculum?.signalSnapshot?.recentStudies ?? [];

  const validate = (raw: unknown) => {
    const validated = GeneratedDailyPlanSchema.safeParse(raw);
    if (!validated.success) {
      const summary = validated.error.issues
        .slice(0, 8)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      throw new Error(`schema validation failed: ${summary}`);
    }
    return validated.data;
  };

  try {
    const primaryRes = await deepseekChatJsonObject({
      messages: buildDailyPlanMessages(input),
      // v4-pro may need more output tokens than v4-flash to finish a full JSON object
      // (otherwise JSON.parse will fail with truncated output).
      maxTokens: 6000,
      timeoutMs,
    });

    let primaryObj: unknown;
    try {
      primaryObj = parseJsonOrThrow(primaryRes.content);
    } catch (e) {
      // Keep a small snippet for debugging in /admin without flooding the DB.
      await updateJob({
        model: primaryRes.model,
        tokenUsage: (primaryRes.usage ?? null) as Prisma.InputJsonValue,
        output: { rawPrimary: primaryRes.content.slice(0, 8_000) } as Prisma.InputJsonValue,
      });

      const repairRes = await deepseekChatJsonObject({
        messages: buildRepairMessages({
          ...input,
          rawModelOutput: primaryRes.content,
          errorSummary: `JSON.parse failed: ${toIssueSummary(e)}`,
        }),
        maxTokens: 6000,
        timeoutMs,
      });

      const repairedObj = parseJsonOrThrow(repairRes.content);
      const repaired = validate(repairedObj);

      await updateJob({
        status: "success",
        output: {
          ...buildPersistedDailyGenerationOutput({
            tpl: repaired,
            source: "deepseek",
            topicSlug: args.topicSlug,
            recentStudies,
            generationRetries: 1,
            repairReason: "json_parse",
          }),
          rawPrimary: primaryRes.content.slice(0, 8_000),
        } as Prisma.InputJsonValue,
        model: repairRes.model,
        tokenUsage: (repairRes.usage ?? null) as Prisma.InputJsonValue,
      });

      return { source: "deepseek" as const, tpl: repaired, jobId: job.id };
    }

    try {
      const validated = validate(primaryObj);
      await updateJob({
        status: "success",
        output: buildPersistedDailyGenerationOutput({
          tpl: validated,
          source: "deepseek",
          topicSlug: args.topicSlug,
          recentStudies,
        }) as Prisma.InputJsonValue,
        model: primaryRes.model,
        tokenUsage: (primaryRes.usage ?? null) as Prisma.InputJsonValue,
      });
      return { source: "deepseek" as const, tpl: validated, jobId: job.id };
    } catch (e) {
      await updateJob({
        model: primaryRes.model,
        tokenUsage: (primaryRes.usage ?? null) as Prisma.InputJsonValue,
        output: { rawPrimary: primaryRes.content.slice(0, 8_000) } as Prisma.InputJsonValue,
      });

      const repairRes = await deepseekChatJsonObject({
        messages: buildRepairMessages({
          ...input,
          rawModelOutput: primaryRes.content,
          errorSummary: toIssueSummary(e),
        }),
        maxTokens: 6000,
        timeoutMs,
      });

      const repairedObj = parseJsonOrThrow(repairRes.content);
      const repaired = validate(repairedObj);

      await updateJob({
        status: "success",
        output: {
          ...buildPersistedDailyGenerationOutput({
            tpl: repaired,
            source: "deepseek",
            topicSlug: args.topicSlug,
            recentStudies,
            generationRetries: 1,
            repairReason: "schema_validation",
          }),
          rawPrimary: primaryRes.content.slice(0, 8_000),
        } as Prisma.InputJsonValue,
        model: repairRes.model,
        tokenUsage: (repairRes.usage ?? null) as Prisma.InputJsonValue,
      });

      return { source: "deepseek" as const, tpl: repaired, jobId: job.id };
    }
  } catch (e) {
    const fallbackTpl = pickDailyTemplate({ topicSlug: args.topicSlug });
    await updateJob({
      status: "error",
      error: toIssueSummary(e),
      output: buildPersistedDailyGenerationOutput({
        tpl: fallbackTpl,
        source: "template",
        topicSlug: args.topicSlug,
        recentStudies,
        generationRetries: 1,
        repairReason: "fallback_error",
        meta: { fallback: true, repairAttempted: true, error: toIssueSummary(e) },
      }) as Prisma.InputJsonValue,
    });
    return {
      source: "template" as const,
      tpl: fallbackTpl,
      jobId: job.id,
    };
  }
}

export async function generateDailyPlanTemplate(args: {
  userId: string;
  localDate: string;
  timeZone: string;
  topicSlug: string;
  userProfile?: UserProfileContext | null;
  curriculum?: CurriculumContext | null;
}): Promise<{ source: GenerationSource; tpl: DailyPlanTemplate; jobId?: string }> {
  const res = await tryGenerateWithDeepSeek(args);
  return res;
}
