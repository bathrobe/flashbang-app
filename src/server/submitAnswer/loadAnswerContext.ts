import { and, eq, ne, sum } from "drizzle-orm";
import { getLearnerDate } from "@/game/learnerDate";
import { atom, atomProgress, learnerState, question, questionLink } from "@/server/db/schema";
import type { DatabaseTransaction } from "@/server/db/transactionType";
import type { SubmitAnswerInput } from "./submitAnswerInput";

export type AnswerContext = Awaited<ReturnType<typeof loadAnswerContext>>;

// Step 2 of submitAnswer: read (and lock) everything the answer needs.
// Throws when the answer can't be accepted at all.
export async function loadAnswerContext(transaction: DatabaseTransaction, userId: string, input: SubmitAnswerInput, now: Date) {
  // Lock the learner's row FIRST: every answer by this learner then waits its
  // turn here, so two tabs can't interleave clout or XP writes, and the locks
  // are always taken in the same order (no deadlock).
  await transaction.insert(learnerState).values({ userId }).onConflictDoNothing();
  const [learner] = await transaction.select().from(learnerState).where(eq(learnerState.userId, userId)).for("update");
  const today = getLearnerDate(now, learner.timeZone ?? "UTC"); // same rule as getLearnerToday

  const [questionRow] = await transaction.select().from(question).where(eq(question.id, input.questionId));
  if (!questionRow) throw new Error("That question doesn't exist.");
  if (questionRow.status !== "active") throw new Error("That question isn't in rotation.");

  // The main atom's progress, locked so two tabs can't both score a first attempt.
  const [main] = await transaction
    .select({ progress: atomProgress, sentence: atom.sentence, atomStatus: atom.status, lectureId: atom.lectureId })
    .from(atomProgress)
    .innerJoin(atom, eq(atom.id, atomProgress.atomId))
    .where(and(eq(atomProgress.userId, userId), eq(atomProgress.atomId, questionRow.mainAtomId)))
    .for("update", { of: atomProgress });
  if (!main) throw new Error("This atom's lecture hasn't been started.");

  // Linked atoms earn a share only if they are active and the learner has progress on them.
  const linkedAtoms = await transaction
    .select({
      atomId: questionLink.atomId,
      weight: questionLink.weight,
      xp: atomProgress.xp,
      sentence: atom.sentence,
      lectureId: atom.lectureId,
    })
    .from(questionLink)
    .innerJoin(atom, eq(atom.id, questionLink.atomId))
    .innerJoin(atomProgress, and(eq(atomProgress.atomId, questionLink.atomId), eq(atomProgress.userId, userId)))
    .where(
      and(eq(questionLink.questionId, questionRow.id), eq(atom.status, "active"), ne(questionLink.atomId, questionRow.mainAtomId)),
    )
    .orderBy(atom.position);

  // All of the learner's atom XP (retired atoms too), for the learner level.
  const [xpRow] = await transaction
    .select({ totalXp: sum(atomProgress.xp) })
    .from(atomProgress)
    .where(eq(atomProgress.userId, userId));

  return { learner, today, question: questionRow, main, linkedAtoms, learnerTotalXp: Number(xpRow?.totalXp ?? 0) };
}
