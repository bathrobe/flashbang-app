import { ensureAtomProgress } from "@/server/ensureAtomProgress";
import { getLearnerToday } from "./learnerToday";
import { findNextSessionAtoms } from "./nextSessionAtoms";

type SessionQueueOptions = {
  all?: boolean; // `/review?all=1`: skip the eased-return cap
  today?: string; // learner date; worked out from the saved time zone when left out
};

// The atom ids for one review session, in the order they will be shown.
// Ids only: the browser loads each card's question separately, one at a time.
// The order and the cap are decided in findNextSessionAtoms.
export async function getSessionQueue(userId: string, options: SessionQueueOptions = {}): Promise<string[]> {
  const today = options.today ?? (await getLearnerToday(userId));
  await ensureAtomProgress(userId, today);
  const { atomIds } = await findNextSessionAtoms(userId, today, { all: options.all });
  return atomIds;
}
