import { eq } from "drizzle-orm";
import { isReturningAfterGap } from "@/game/easedReturn";
import { getLearnerDate } from "@/game/learnerDate";
import { database } from "@/server/db/client";
import { learnerState } from "@/server/db/schema";

// Plain functions for the welcome-back flow; the actions check access, then call these.

// On each signed-in visit: seven or more days since the last review starts an
// eased return for today. Safe to call many times. The first answer today
// moves last_review_on to today, which does not end it (it lasts all of
// today) and cannot start another one tomorrow (the gap is then one day).
// Returns whether it started just now, so the page knows to reload.
export async function startEasedReturnIfAway(userId: string, now: Date = new Date()): Promise<boolean> {
  const [stateRow] = await database.select().from(learnerState).where(eq(learnerState.userId, userId));
  if (!stateRow) return false;

  const today = getLearnerDate(now, stateRow.timeZone ?? "UTC");
  if (stateRow.easedReturnOn === today) return false;
  if (!isReturningAfterGap(stateRow.lastReviewOn, today)) return false;

  await database.update(learnerState).set({ easedReturnOn: today }).where(eq(learnerState.userId, userId));
  return true;
}

// "Start" or "Not now" on the welcome-back message: it is not shown again today.
export async function dismissWelcomeForLearner(userId: string, now: Date = new Date()) {
  const [stateRow] = await database
    .select({ timeZone: learnerState.timeZone })
    .from(learnerState)
    .where(eq(learnerState.userId, userId));
  if (!stateRow) return;

  const today = getLearnerDate(now, stateRow.timeZone ?? "UTC");
  await database.update(learnerState).set({ welcomeDismissedOn: today }).where(eq(learnerState.userId, userId));
}
