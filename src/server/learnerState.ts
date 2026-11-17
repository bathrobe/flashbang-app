import { eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { learnerState } from "@/server/db/schema";

// Plain functions that write the learner_state row. The server actions
// (actions/noteVisit.ts, actions/setSoundOn.ts) check access, then call these.
// Taking `userId` lets a script test them without a browser sign-in.

// Creates the learner's row on their first signed-in visit: clout 100, sound
// on (the column defaults). Does nothing when the row already exists.
export async function ensureLearnerState(userId: string) {
  await database.insert(learnerState).values({ userId }).onConflictDoNothing();
}

function isKnownTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone });
    return true;
  } catch {
    return false;
  }
}

// Saves the time zone the browser reported, which decides what "today" is.
// Returns whether it changed, so the page knows to reload its numbers.
export async function recordVisit(userId: string, timeZone: string) {
  if (!isKnownTimeZone(timeZone)) return { timeZoneChanged: false };

  await ensureLearnerState(userId);
  const [stateRow] = await database.select().from(learnerState).where(eq(learnerState.userId, userId));
  if (stateRow.timeZone === timeZone) return { timeZoneChanged: false };

  await database.update(learnerState).set({ timeZone }).where(eq(learnerState.userId, userId));
  return { timeZoneChanged: true };
}

export async function saveSoundOn(userId: string, soundOn: boolean) {
  await ensureLearnerState(userId);
  await database.update(learnerState).set({ soundOn }).where(eq(learnerState.userId, userId));
}
