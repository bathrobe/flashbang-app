"use server";

import { requireAdmin } from "@/server/access";
import { updateQuestion } from "@/content/updateQuestion";
import { saveQuestionInputShape, describeBadInput, type AuthorActionResult } from "./authorInputShapes";

// Saves every field of one question. Shape errors refuse it; lint warnings come back with ok.
export async function saveQuestion(input: unknown): Promise<AuthorActionResult> {
  await requireAdmin({ calledFrom: "action" });
  const parsed = saveQuestionInputShape.safeParse(input);
  if (!parsed.success) return describeBadInput(parsed.error);
  return updateQuestion(parsed.data.questionId, parsed.data.fields);
}
