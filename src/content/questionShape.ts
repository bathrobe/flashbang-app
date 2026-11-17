import { z } from "zod";
import { findFormatRuleErrors } from "./questionFormatRules";

// The shape every question must have before it is saved, whether it comes from
// the content script or the author page. Options already carry their ids here
// (see assignOptionIds.ts).

export const questionFormats = ["multiple_choice", "multi_select", "true_false"] as const;
export const imageKinds = ["sourced", "generated"] as const;

const optionShape = z.object({
  id: z.string().min(1, "is missing"),
  text: z.string().trim().min(1, "is empty"),
  isCorrect: z.boolean("must be true or false"),
});

const linkedAtomShape = z.object({
  atomId: z.string().min(1, "is missing"),
  weight: z.number("must be a number").gt(0, "must be above 0").max(1, "must be at most 1"),
});

const questionFieldsShape = z.object({
  mainAtomId: z.string("is missing").min(1, "is missing"),
  format: z.enum(questionFormats, `must be one of: ${questionFormats.join(", ")}`),
  prompt: z.string("is missing").trim().min(1, "is empty"),
  options: z.array(optionShape, "must be a list"),
  explanation: z.string("is missing").trim().min(1, "is empty"),
  isIntroductory: z.boolean("must be true or false").default(false),
  linkedAtoms: z.array(linkedAtomShape, "must be a list").default([]),
  imagePath: z.string().trim().nullish(),
  imageCredit: z.string().trim().nullish(),
  imageKind: z.enum(imageKinds, `must be one of: ${imageKinds.join(", ")}`).nullish(),
});

export type CheckedQuestion = z.infer<typeof questionFieldsShape>;
export type CheckedOption = CheckedQuestion["options"][number];

export type QuestionShapeResult = { ok: true; question: CheckedQuestion } | { ok: false; errors: string[] };

// Returns the cleaned question, or every reason it is not valid, in plain words.
export function checkQuestionShape(candidate: unknown): QuestionShapeResult {
  const parsed = questionFieldsShape.safeParse(candidate);
  if (!parsed.success) {
    // "options.2.text is empty" reads better than Zod's own wording.
    const errors = parsed.error.issues.map((issue) => `${issue.path.join(".") || "question"} ${issue.message}`);
    return { ok: false, errors };
  }

  const errors = findFormatRuleErrors(parsed.data);
  return errors.length > 0 ? { ok: false, errors } : { ok: true, question: parsed.data };
}
