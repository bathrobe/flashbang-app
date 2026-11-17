import { eq, sum } from "drizzle-orm";
import { getLearnerDate } from "@/game/learnerDate";
import { getLearnerLevel } from "@/game/levels";
import { settings } from "@/game/settings";
import { database } from "@/server/db/client";
import { atomProgress, learnerState } from "@/server/db/schema";
import { findNextSessionAtoms } from "./nextSessionAtoms";

// The numbers the navbar shows on every signed-in page.
export type HudValues = {
  clout: number;
  learnerLevel: number;
  totalXp: number;
  dueCount: number; // atoms the next session would hold
  soundOn: boolean;
};

// `now` is passed in so a script can ask "what would the navbar show on another day?"
// `all` counts every due atom, ignoring the eased-return cap (inside `/review?all=1`).
export async function getHudValues(userId: string, now: Date = new Date(), options: { all?: boolean } = {}): Promise<HudValues> {
  const [stateRow] = await database.select().from(learnerState).where(eq(learnerState.userId, userId));

  // Before the browser has reported a time zone (the very first page), use UTC.
  const today = getLearnerDate(now, stateRow?.timeZone ?? "UTC");

  const [[xpRow], nextSession] = await Promise.all([
    // Retired atoms still count toward the learner level, so no filter on atom status.
    database.select({ totalXp: sum(atomProgress.xp) }).from(atomProgress).where(eq(atomProgress.userId, userId)),
    findNextSessionAtoms(userId, today, { all: options.all }),
  ]);
  const totalXp = Number(xpRow?.totalXp ?? 0);

  return {
    clout: stateRow?.clout ?? settings.clout.startingBalance,
    learnerLevel: getLearnerLevel(totalXp),
    totalXp,
    dueCount: nextSession.atomIds.length,
    soundOn: stateRow?.soundOn ?? true,
  };
}
