import { eq, inArray } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, lecture } from "@/server/db/schema";
import { ensureAtomProgress } from "@/server/ensureAtomProgress";
import { findDueAtoms } from "./dueAtoms";
import { getLearnerToday } from "./learnerToday";

type SessionQueueOptions = {
  // `/review?all=1`: skip the eased-return cap. The cap itself arrives with the
  // welcome-back flow (checklist item 19); until then every due atom is included.
  all?: boolean;
  today?: string; // learner date; worked out from the saved time zone when left out
};

// The atom ids for one review session, in the order they will be shown.
// Ids only: the browser loads each card's question separately, one at a time.
// Order: most overdue first; atoms waiting only for a retry (not due) go last.
// Ties keep lecture order, so a fresh lecture is reviewed in its own order.
export async function getSessionQueue(userId: string, options: SessionQueueOptions = {}): Promise<string[]> {
  const today = options.today ?? (await getLearnerToday(userId));
  await ensureAtomProgress(userId, today);

  const dueAtoms = await findDueAtoms(userId, today);
  if (dueAtoms.length === 0) return [];

  const atomPlaces = await database
    .select({ atomId: atom.id, lectureNumber: lecture.number, position: atom.position })
    .from(atom)
    .innerJoin(lecture, eq(lecture.id, atom.lectureId))
    .where(inArray(atom.id, dueAtoms.map((dueAtom) => dueAtom.atomId)));
  const placeByAtomId = new Map(atomPlaces.map((place) => [place.atomId, place]));
  const lectureOrder = (firstAtomId: string, secondAtomId: string) => {
    const firstPlace = placeByAtomId.get(firstAtomId);
    const secondPlace = placeByAtomId.get(secondAtomId);
    if (!firstPlace || !secondPlace) return 0;
    return firstPlace.lectureNumber - secondPlace.lectureNumber || firstPlace.position - secondPlace.position;
  };

  // Dates are "YYYY-MM-DD" strings, so comparing them as text compares them as dates.
  const isDue = (dueOn: string) => dueOn <= today;
  const sortedAtoms = [...dueAtoms].sort((first, second) => {
    const firstIsDue = isDue(first.dueOn);
    if (firstIsDue !== isDue(second.dueOn)) return firstIsDue ? -1 : 1;
    if (firstIsDue && first.dueOn !== second.dueOn) return first.dueOn < second.dueOn ? -1 : 1;
    return lectureOrder(first.atomId, second.atomId);
  });

  return sortedAtoms.map((dueAtom) => dueAtom.atomId);
}
