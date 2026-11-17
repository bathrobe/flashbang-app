import { and, eq } from "drizzle-orm";
import { getLearnerDate } from "@/game/learnerDate";
import { database } from "@/server/db/client";
import { atom, atomProgress, learnerState, question } from "@/server/db/schema";
import type { DatabaseTransaction } from "@/server/db/transactionType";
import { getHudValues } from "@/server/queries/getHudValues";
import { loadCardForLearner } from "@/server/loadCardForLearner";
import type { LoadCardResult } from "@/server/cardTypes";
import type { FlagQuestionInput } from "./flagQuestionInput";
import { undoFlaggedAnswer } from "./undoFlaggedAnswer";

export type FlagQuestionResult = {
  nextCard: LoadCardResult; // the same atom with another question, or "no_questions" (skip it)
  answerUndone: boolean;
  hud: { clout: number; learnerLevel: number; totalXp: number; dueCount: number }; // after the undo
};

// The plain function behind the flagQuestion action. The flag and the undo
// happen in ONE transaction; the next card and HUD are read after it commits.
export async function flagQuestionForLearner(userId: string, input: FlagQuestionInput, now: Date = new Date()): Promise<FlagQuestionResult> {
  const { mainAtomId, today, answerUndone } = await database.transaction((transaction) =>
    flagInTransaction(transaction, userId, input, now),
  );

  const [nextCard, hudValues] = await Promise.all([loadCardForLearner(userId, mainAtomId, today), getHudValues(userId, now, { all: input.all })]);
  const { clout, learnerLevel, totalXp, dueCount } = hudValues;
  return { nextCard, answerUndone, hud: { clout, learnerLevel, totalXp, dueCount } };
}

async function flagInTransaction(transaction: DatabaseTransaction, userId: string, input: FlagQuestionInput, now: Date) {
  // Same lock order as submitAnswer: the learner's row first, then progress rows.
  await transaction.insert(learnerState).values({ userId }).onConflictDoNothing();
  const [learner] = await transaction.select().from(learnerState).where(eq(learnerState.userId, userId)).for("update");
  const today = getLearnerDate(now, learner.timeZone ?? "UTC");

  // Only a question this learner could have been shown: in rotation (or already
  // flagged, e.g. a double click), on an active atom of a lecture they started.
  const [target] = await transaction
    .select({ status: question.status, mainAtomId: question.mainAtomId })
    .from(question)
    .innerJoin(atom, eq(atom.id, question.mainAtomId))
    .innerJoin(atomProgress, and(eq(atomProgress.atomId, atom.id), eq(atomProgress.userId, userId)))
    .where(and(eq(question.id, input.questionId), eq(atom.status, "active")));
  if (!target || (target.status !== "active" && target.status !== "flagged")) {
    throw new Error("That question can't be flagged.");
  }

  // Already flagged: keep the first flag's note, time and user.
  if (target.status === "active") {
    await transaction
      .update(question)
      .set({ status: "flagged", flagNote: input.note, flaggedAt: now, flaggedByUserId: userId, updatedAt: now })
      .where(eq(question.id, input.questionId));
  }

  const answerUndone = input.attemptId
    ? await undoFlaggedAnswer(transaction, learner, input.questionId, input.attemptId)
    : false;

  return { mainAtomId: target.mainAtomId, today, answerUndone };
}
