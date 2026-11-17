"use server";

import { requireAdmin } from "@/server/access";
import { setQuestionStatus } from "@/content/setQuestionStatus";
import { questionIdInputShape, describeBadInput, type AuthorActionResult } from "./authorInputShapes";

// Unflags a question: flagged -> active, back in rotation.
export async function unflagQuestion(input: unknown): Promise<AuthorActionResult> {
  await requireAdmin({ calledFrom: "action" });
  const parsed = questionIdInputShape.safeParse(input);
  if (!parsed.success) return describeBadInput(parsed.error);
  return setQuestionStatus(parsed.data.questionId, "unflag");
}
