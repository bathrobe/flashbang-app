import type { QuestionFormat } from "@/server/cardTypes";
import type { OptionLook } from "./OptionButton";

// After grading: how each option should look. Chosen and correct → "correct";
// chosen but not correct → "wrong"; correct but not chosen → "missed" on a
// multi-select, or simply shown as "correct" when there was one right answer.
// Options in none of these keep their resting look (so they are left out).
export function getGradedOptionLooks(
  format: QuestionFormat,
  chosenOptionIds: string[],
  correctOptionIds: string[],
): Record<string, OptionLook> {
  const lookByOptionId: Record<string, OptionLook> = {};
  for (const chosenId of chosenOptionIds) {
    lookByOptionId[chosenId] = correctOptionIds.includes(chosenId) ? "correct" : "wrong";
  }
  for (const correctId of correctOptionIds) {
    if (chosenOptionIds.includes(correctId)) continue;
    lookByOptionId[correctId] = format === "multi_select" ? "missed" : "correct";
  }
  return lookByOptionId;
}
