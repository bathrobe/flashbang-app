import { and, count, eq, inArray } from "drizzle-orm";
import { getSessionCap } from "@/game/easedReturn";
import { chooseNextSessionAtoms } from "@/game/nextSession";
import { database } from "@/server/db/client";
import type { DatabaseOrTransaction } from "@/server/db/transactionType";
import { atom, learnerState, lecture, reviewEvent } from "@/server/db/schema";
import { findDueAtoms } from "./dueAtoms";

type NextSessionOptions = {
  all?: boolean; // `/review?all=1`: lift the eased-return cap
  reader?: DatabaseOrTransaction; // a transaction, to see rows it changed but has not committed
  // submitAnswer counts before its own review_event row is written: it passes 1 for a first attempt.
  firstAttemptsNotYetLogged?: number;
};

// THE next session's atoms, in order. The session queue, the navbar badge,
// "Begin review (N)" and the count submitAnswer returns all come from here, so
// they always agree, including while the eased-return cap applies.
export async function findNextSessionAtoms(userId: string, today: string, options: NextSessionOptions = {}) {
  const reader = options.reader ?? database;
  const [dueAtoms, [stateRow]] = await Promise.all([
    findDueAtoms(userId, today, reader),
    reader.select({ easedReturnOn: learnerState.easedReturnOn }).from(learnerState).where(eq(learnerState.userId, userId)),
  ]);
  if (dueAtoms.length === 0) return { atomIds: [], leftForLater: 0 };

  const easedReturnOn = stateRow?.easedReturnOn ?? null;
  const firstAttemptsToday =
    easedReturnOn === today ? (await countFirstAttempts(reader, userId, today)) + (options.firstAttemptsNotYetLogged ?? 0) : 0;
  const cap = getSessionCap({ easedReturnOn, today, firstAttemptsToday, all: options.all ?? false });

  const atomPlaces = await reader
    .select({ atomId: atom.id, lectureNumber: lecture.number, position: atom.position })
    .from(atom)
    .innerJoin(lecture, eq(lecture.id, atom.lectureId))
    .where(inArray(atom.id, dueAtoms.map((dueAtom) => dueAtom.atomId)));
  const placeByAtomId = new Map(atomPlaces.map((place) => [place.atomId, place]));

  const waitingAtoms = dueAtoms.map((dueAtom) => ({
    ...dueAtom,
    lectureNumber: placeByAtomId.get(dueAtom.atomId)?.lectureNumber ?? 0,
    position: placeByAtomId.get(dueAtom.atomId)?.position ?? 0,
  }));
  return chooseNextSessionAtoms(waitingAtoms, today, cap);
}

// First attempts answered today. A flagged (voided) answer was undone, so it doesn't count.
async function countFirstAttempts(reader: DatabaseOrTransaction, userId: string, today: string) {
  const [row] = await reader
    .select({ firstAttempts: count() })
    .from(reviewEvent)
    .where(
      and(
        eq(reviewEvent.userId, userId),
        eq(reviewEvent.learnerDate, today),
        eq(reviewEvent.kind, "first"),
        eq(reviewEvent.voided, false),
      ),
    );
  return row?.firstAttempts ?? 0;
}
