import { z } from "zod";

const JsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonValueSchema),
    z.record(z.string(), JsonValueSchema),
  ]),
);

export const DAILY_PLAN_SCHEMA_VERSION = "2.3";

const GuidedStepSchema = z
  .object({
    type: z.enum([
      "activation",
      "intuition",
      "concept",
      "example",
      "micro_question",
      "pseudocode",
      "coding",
      "quiz",
      "reflection",
    ]),
    title: z.string().min(1),
    content: z.string().min(1),
    question: z.string().min(1).optional(),
    expectedAnswer: z.string().min(1).optional(),
    hints: z.array(z.string().min(1)).optional().default([]),
  })
  .strict();

const QuizSingleChoiceSchema = z
  .object({
    type: z.literal("single_choice"),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    answer: z.number().int().nonnegative(),
    explanation: z.string().min(1),
  })
  .strict();

const QuizMultiChoiceSchema = z
  .object({
    type: z.literal("multi_choice"),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    answer: z.array(z.number().int().nonnegative()).min(1),
    explanation: z.string().min(1),
  })
  .strict();

const QuizTrueFalseSchema = z
  .object({
    type: z.literal("true_false"),
    question: z.string().min(1),
    answer: z.boolean(),
    explanation: z.string().min(1),
  })
  .strict();

const CodingExerciseSchema = z
  .object({
    language: z.enum(["python", "typescript"]).optional().default("python"),
    title: z.string().min(1),
    prompt: z.string().min(1),
    starterCode: z.string().min(1),
    referenceSolution: z.string().min(1),
    visibleTests: z
      .array(
        z
          .object({
            input: z.string().min(1),
            expectedOutput: z.string().min(1),
          })
          .strict(),
      )
      .min(1),
    expectedComplexity: z.string().min(1),
    commonBugs: z.array(z.string().min(1)).optional().default([]),
    hints: z.array(z.string().min(1)).optional().default([]),
  })
  .strict();

const GlossaryCardSchema = z
  .object({
    term: z.string().min(1),
    oneLine: z.string().min(1),
    definition: z.string().min(1),
    whyItMatters: z.string().min(1),
    relatedTerms: z.array(z.string().min(1)).optional().default([]),
    commonMistakes: z.array(z.string().min(1)).optional().default([]),
    selfCheckQuestion: z.string().min(1),
  })
  .strict();

const BreadthCardSchema = z
  .object({
    kind: z.enum(["person", "company", "paper", "benchmark", "tool", "concept"]),
    title: z.string().min(1),
    oneLine: z.string().min(1),
    whyItMatters: z.string().min(1),
    representativeWorks: z.array(z.string().min(1)).optional().default([]),
    relatedTerms: z.array(z.string().min(1)).optional().default([]),
    selfCheckQuestion: z.string().min(1),
  })
  .strict();

export const GeneratedDailyPlanSchema = z
  .object({
    schemaVersion: z.string().min(1),
    lesson: z.object({
      title: z.string().min(1),
      summary: z.string().min(1),
      contentMarkdown: z.string().min(1),
      objectives: z.array(z.string().min(1)).min(1),
      keyTerms: z.array(z.string().min(1)).min(1),
      guidedSteps: z.array(GuidedStepSchema).min(5),
    }),
    quiz: z.array(z.discriminatedUnion("type", [QuizSingleChoiceSchema, QuizMultiChoiceSchema, QuizTrueFalseSchema])).min(1),
    codingExercise: CodingExerciseSchema,
    glossary: GlossaryCardSchema,
    breadth: BreadthCardSchema,
    flashcards: z
      .array(
        z.object({
          front: z.string().min(1),
          back: z.string().min(1),
          type: z.string().min(1).optional(),
          tags: z.array(z.string().min(1)).optional(),
        }),
      )
      .min(1),
    reflectionPrompt: z.string().min(1).optional(),
    nextRecommendation: z.string().min(1).optional(),
  })
  .strict();

export type GeneratedDailyPlan = z.infer<typeof GeneratedDailyPlanSchema>;
