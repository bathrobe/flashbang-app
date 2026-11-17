import { z } from "zod";
import { confidenceSteps } from "@/game/settings";

// What the browser sends when the learner presses Confirm. Checked with Zod,
// because anything can arrive at a server action.
export const submitAnswerInputShape = z.object({
  // Made by the browser once per card showing; the same id on a resend means "the same answer".
  attemptId: z.string().min(1).max(100),
  questionId: z.string().min(1),
  chosenOptionIds: z.array(z.string().min(1)).min(1).max(10),
  confidenceStep: z.enum(confidenceSteps),
  // True inside `/review?all=1`, so the returned badge count ignores the eased-return cap.
  all: z.boolean().optional(),
});

export type SubmitAnswerInput = z.infer<typeof submitAnswerInputShape>;
