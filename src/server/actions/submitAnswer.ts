"use server";

import { requireLearner } from "@/server/access";
import type { SubmitAnswerResult } from "@/server/answerTypes";
import { submitAnswerForLearner } from "@/server/submitAnswer/submitAnswerForLearner";
import { submitAnswerInputShape } from "@/server/submitAnswer/submitAnswerInput";

// The learner pressed Confirm. The server grades and saves; see submitAnswerForLearner.
export async function submitAnswer(input: unknown): Promise<SubmitAnswerResult> {
  const user = await requireLearner();
  return submitAnswerForLearner(user.id, submitAnswerInputShape.parse(input));
}
