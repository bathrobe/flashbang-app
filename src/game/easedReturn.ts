import { getDaysBetween } from "./learnerDate";
import { settings } from "./settings";

// The welcome-back rules. Dates are learner dates like "2026-11-16".

// Coming back after a gap: the last review was seven or more days ago.
// Someone who has never reviewed is new, not returning.
export function isReturningAfterGap(lastReviewOn: string | null, today: string): boolean {
  if (!lastReviewOn) return false;
  return getDaysBetween(lastReviewOn, today) >= settings.easedReturn.gapDays;
}

// The eased return lasts for the learner day it began on, and no longer.
export function isEasedReturnToday(easedReturnOn: string | null, today: string): boolean {
  return easedReturnOn === today;
}

type SessionCapInput = {
  easedReturnOn: string | null;
  today: string;
  firstAttemptsToday: number; // first attempts already answered today (not voided)
  all: boolean; // `/review?all=1`: the learner chose to keep going
};

// How many due atoms the next session may hold, or null for no limit.
// The short session is shared across the day: five first attempts in total,
// so after two answers only three remain, and a reload cannot reset it.
export function getSessionCap({ easedReturnOn, today, firstAttemptsToday, all }: SessionCapInput): number | null {
  if (all || !isEasedReturnToday(easedReturnOn, today)) return null;
  return Math.max(0, settings.easedReturn.shortSessionSize - firstAttemptsToday);
}
