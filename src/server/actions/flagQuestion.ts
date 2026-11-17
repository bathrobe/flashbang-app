"use server";

import { requireLearner } from "@/server/access";
import { flagQuestionForLearner, type FlagQuestionResult } from "@/server/flagQuestion/flagQuestionForLearner";
import { flagQuestionInputShape } from "@/server/flagQuestion/flagQuestionInput";

// The learner flagged a bad question. It leaves rotation at once, and an answer
// to it (attemptId, from the feedback panel) is undone; see flagQuestionForLearner.
export async function flagQuestion(input: unknown): Promise<FlagQuestionResult> {
  const user = await requireLearner();
  return flagQuestionForLearner(user.id, flagQuestionInputShape.parse(input));
}
