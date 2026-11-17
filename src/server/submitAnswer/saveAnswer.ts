import { and, eq, sql } from "drizzle-orm";
import type { CardKind } from "@/game/cardKind";
import type { scoreAnswer } from "@/game/scoreAnswer";
import { atomProgress, learnerState } from "@/server/db/schema";
import type { DatabaseTransaction } from "@/server/db/transactionType";
import type { AnswerContext } from "./loadAnswerContext";

type Score = ReturnType<typeof scoreAnswer>;

// Steps 7 to 9 of submitAnswer: write the new XP, schedule and clout.
export async function saveProgressChanges(transaction: DatabaseTransaction, context: AnswerContext, kind: CardKind, wasCorrect: boolean, score: Score) {
  const userId = context.learner.userId;

  // Main atom. Only a first attempt moves the schedule (score.schedule is null for a retry).
  // A miss (first try or retry) leaves a retry pending; a correct answer clears it.
  await transaction
    .update(atomProgress)
    .set({
      xp: score.mainAtom.xpAfter,
      retryPending: !wasCorrect,
      lastQuestionId: context.question.id,
      ...(score.schedule && {
        intervalDays: score.schedule.intervalDays,
        dueOn: score.schedule.dueOn,
        reviewCount: score.schedule.reviewCount,
        lastReviewedOn: context.today,
      }),
    })
    .where(and(eq(atomProgress.userId, userId), eq(atomProgress.atomId, context.question.mainAtomId)));

  // Linked atoms only gain XP; their schedule never changes.
  for (const linked of score.linkedAtoms) {
    if (linked.xpGained === 0) continue;
    await transaction
      .update(atomProgress)
      .set({ xp: sql`${atomProgress.xp} + ${linked.xpGained}` })
      .where(and(eq(atomProgress.userId, userId), eq(atomProgress.atomId, linked.atomId)));
  }

  await transaction
    .update(learnerState)
    .set({ clout: score.clout.after, ...(kind === "first" && { lastReviewOn: context.today }) })
    .where(eq(learnerState.userId, userId));
}
