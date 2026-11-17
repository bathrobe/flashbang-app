import { and, eq, exists, lte, min, or, sql } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, atomProgress, lectureProgress, question } from "@/server/db/schema";

// THE definition of "this atom can be reviewed" and "this atom is due".
// The navbar badge, the session queue and the welcome-back cap all use this
// file, so they can never disagree about what is waiting.

// A progress row can be reviewed when its atom is active, the learner has
// started the atom's lecture, and the atom has at least one active question.
function reviewableAtomCondition(userId: string) {
  const atomIsActiveInAStartedLecture = exists(
    database
      .select({ one: sql`1` })
      .from(atom)
      .innerJoin(lectureProgress, eq(lectureProgress.lectureId, atom.lectureId))
      .where(and(eq(atom.id, atomProgress.atomId), eq(atom.status, "active"), eq(lectureProgress.userId, userId))),
  );
  const anActiveQuestionExists = exists(
    database
      .select({ one: sql`1` })
      .from(question)
      .where(and(eq(question.mainAtomId, atomProgress.atomId), eq(question.status, "active"))),
  );
  return and(eq(atomProgress.userId, userId), atomIsActiveInAStartedLecture, anActiveQuestionExists);
}

// Atoms the next session would hold: due today or earlier, or waiting for a
// retry after a miss. `today` is a learner date such as "2026-11-16".
export async function findDueAtoms(userId: string, today: string) {
  const dueOrRetryPending = or(lte(atomProgress.dueOn, today), eq(atomProgress.retryPending, true));
  return database
    .select({ atomId: atomProgress.atomId, dueOn: atomProgress.dueOn, retryPending: atomProgress.retryPending })
    .from(atomProgress)
    .where(and(reviewableAtomCondition(userId), dueOrRetryPending));
}

// The earliest due date among everything the learner can review, or null when
// nothing is scheduled at all (no lecture started yet).
export async function findEarliestDueDate(userId: string): Promise<string | null> {
  const [row] = await database
    .select({ earliestDueOn: min(atomProgress.dueOn) })
    .from(atomProgress)
    .where(reviewableAtomCondition(userId));
  return row?.earliestDueOn ?? null;
}
