import { and, eq, inArray } from "drizzle-orm";
import { undoAnswer } from "@/game/undoAnswer";
import { atomProgress, learnerState, reviewEvent } from "@/server/db/schema";
import type { DatabaseTransaction } from "@/server/db/transactionType";

type Learner = { userId: string; clout: number };

// Step 2 of flagQuestion: if `attemptId` is this learner's answer to THIS
// question and not yet undone, undo it. Anything else (another learner's
// attempt, another question, already voided) is ignored. The caller already
// holds the lock on the learner row, so progress rows are locked after it.
// The trial door is not touched: an opened door never re-locks.
export async function undoFlaggedAnswer(
  transaction: DatabaseTransaction,
  learner: Learner,
  questionId: string,
  attemptId: string,
) {
  const [event] = await transaction
    .select()
    .from(reviewEvent)
    .where(
      and(
        eq(reviewEvent.attemptId, attemptId),
        eq(reviewEvent.userId, learner.userId),
        eq(reviewEvent.questionId, questionId),
        eq(reviewEvent.voided, false),
      ),
    );
  if (!event) return false;

  // The event's own main atom (an author may have moved the question since).
  const [mainProgress] = await transaction
    .select({ xp: atomProgress.xp })
    .from(atomProgress)
    .where(and(eq(atomProgress.userId, learner.userId), eq(atomProgress.atomId, event.mainAtomId)))
    .for("update");
  if (!mainProgress) return false;

  const linkedAtomIds = event.linkedXpGained.map((linked) => linked.atomId);
  const linkedRows = linkedAtomIds.length
    ? await transaction
        .select({ atomId: atomProgress.atomId, xp: atomProgress.xp })
        .from(atomProgress)
        .where(and(eq(atomProgress.userId, learner.userId), inArray(atomProgress.atomId, linkedAtomIds)))
        .for("update")
    : [];

  const undone = undoAnswer(event, {
    mainXp: mainProgress.xp,
    linkedXpByAtomId: Object.fromEntries(linkedRows.map((row) => [row.atomId, row.xp])),
    clout: learner.clout,
  });

  await transaction.update(reviewEvent).set({ voided: true }).where(eq(reviewEvent.id, event.id));
  await transaction
    .update(atomProgress)
    .set(undone.mainAtom)
    .where(and(eq(atomProgress.userId, learner.userId), eq(atomProgress.atomId, event.mainAtomId)));
  for (const linked of undone.linkedAtoms) {
    await transaction
      .update(atomProgress)
      .set({ xp: linked.xp })
      .where(and(eq(atomProgress.userId, learner.userId), eq(atomProgress.atomId, linked.atomId)));
  }
  await transaction.update(learnerState).set({ clout: undone.clout }).where(eq(learnerState.userId, learner.userId));
  return true;
}
