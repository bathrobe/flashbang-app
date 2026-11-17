import { z } from "zod";

// What the author page's actions accept. The question's own fields are checked
// by src/content/questionShape.ts inside updateQuestion, so here they only
// need to be an object.
const id = z.string().min(1).max(100);

export const atomIdInputShape = z.object({ atomId: id });
export const questionIdInputShape = z.object({ questionId: id });
export const saveAtomInputShape = z.object({ atomId: id, sentence: z.string().max(2000) });
export const saveQuestionInputShape = z.object({ questionId: id, fields: z.record(z.string(), z.unknown()) });

export type AuthorActionResult = { ok: true; warnings?: string[] } | { ok: false; errors: string[] };

// One plain-word failure for input that is not even the right shape.
export function describeBadInput(error: z.ZodError): AuthorActionResult {
  return { ok: false, errors: error.issues.map((issue) => `${issue.path.join(".") || "input"}: ${issue.message}`) };
}
