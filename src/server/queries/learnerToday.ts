import { eq } from "drizzle-orm";
import { getLearnerDate } from "@/game/learnerDate";
import { database } from "@/server/db/client";
import { learnerState } from "@/server/db/schema";

// The learner's "today" (e.g. "2026-11-16"), worked out the same way as in
// getHudValues: their saved time zone, or UTC before the browser has reported one.
export async function getLearnerToday(userId: string, now: Date = new Date()): Promise<string> {
  const [stateRow] = await database
    .select({ timeZone: learnerState.timeZone })
    .from(learnerState)
    .where(eq(learnerState.userId, userId));
  return getLearnerDate(now, stateRow?.timeZone ?? "UTC");
}
