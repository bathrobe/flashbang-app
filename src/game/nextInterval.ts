import { settings, type ConfidenceStep } from "./settings";
import { addDaysToDate } from "./learnerDate";

type NextIntervalInput = {
  wasCorrect: boolean;
  confidenceStep: ConfidenceStep;
  intervalDays: number;
  reviewCount: number; // first attempts made before this one
};

// The new interval after a FIRST attempt. Retries never call this.
export function getNextIntervalDays(input: NextIntervalInput): number {
  const { minimumDays, firstCorrectReviewDays, correctMultiplier, wrongRule } = settings.intervals;
  const { wasCorrect, confidenceStep, intervalDays, reviewCount } = input;

  if (wasCorrect && reviewCount === 0) return firstCorrectReviewDays;
  if (wasCorrect) return Math.max(minimumDays, intervalDays * correctMultiplier[confidenceStep]);
  if (wrongRule[confidenceStep] === "reset") return minimumDays;
  return Math.max(minimumDays, intervalDays / 2);
}

// Due date = today's learner date + the interval rounded to the nearest whole day.
export function getDueDate(today: string, intervalDays: number): string {
  return addDaysToDate(today, Math.round(intervalDays));
}
