"use server";

import { requireAdmin } from "@/server/access";
import { setQuestionStatus } from "@/content/setQuestionStatus";
import { questionIdInputShape, describeBadInput, type AuthorActionResult } from "./authorInputShapes";

// Deletes a question: status "deleted"; the row and its answers remain.
export async function deleteQuestion(input: unknown): Promise<AuthorActionResult> {
  await requireAdmin({ calledFrom: "action" });
  const parsed = questionIdInputShape.safeParse(input);
  if (!parsed.success) return describeBadInput(parsed.error);
  return setQuestionStatus(parsed.data.questionId, "delete");
}
