import { getCardKind } from "@/game/cardKind";
import { gradeAnswer } from "@/game/gradeAnswer";
import { scoreAnswer } from "@/game/scoreAnswer";
import type { SubmitAnswerResult } from "@/server/answerTypes";
import { database } from "@/server/db/client";
import type { DatabaseTransaction } from "@/server/db/transactionType";
import { findDueAtoms } from "@/server/queries/dueAtoms";
import { buildAnswerResult } from "./buildAnswerResult";
import { insertReviewEvent } from "./insertReviewEvent";
import { loadAnswerContext } from "./loadAnswerContext";
import { openDoorIfEarned } from "./openDoorIfEarned";
import { saveProgressChanges } from "./saveAnswer";
import { findStoredResult, isUniqueViolation } from "./storedResult";
import type { SubmitAnswerInput } from "./submitAnswerInput";

// The plain function behind the submitAnswer action (actions/submitAnswer.ts
// checks access and the input's shape, then calls this). Grades one answer and
// saves everything it changes in ONE transaction: all of it or none of it.
export async function submitAnswerForLearner(userId: string, input: SubmitAnswerInput, now: Date = new Date()): Promise<SubmitAnswerResult> {
  const storedResult = await findStoredResult(database, userId, input.attemptId);
  if (storedResult) return storedResult;

  try {
    return await database.transaction((transaction) => answerInTransaction(transaction, userId, input, now));
  } catch (error) {
    // Two identical submits raced: the loser's insert hit the unique attemptId. Give it the winner's result.
    if (isUniqueViolation(error)) {
      const winnersResult = await findStoredResult(database, userId, input.attemptId);
      if (winnersResult) return winnersResult;
    }
    throw error;
  }
}

async function answerInTransaction(transaction: DatabaseTransaction, userId: string, input: SubmitAnswerInput, now: Date): Promise<SubmitAnswerResult> {
  const context = await loadAnswerContext(transaction, userId, input, now);

  // Checked again now that we hold the learner's lock: an identical submit may have just finished.
  const storedResult = await findStoredResult(transaction, userId, input.attemptId);
  if (storedResult) return storedResult;

  // The two-tab guard: decide the kind exactly as loadCard does. Not due and no
  // retry waiting means this review was already done, so nothing is written.
  const kind = context.main.atomStatus === "active" ? getCardKind(context.main.progress, context.today) : null;
  if (!kind) return { kind: "not_due" };

  // Graded against the options stored on the question, never anything the browser says.
  const grade = gradeAnswer(context.question.options, input.chosenOptionIds);
  if (grade.unknownOptionIds.length > 0) throw new Error("That answer isn't one of the question's options.");

  const score = scoreAnswer({
    kind,
    wasCorrect: grade.wasCorrect,
    confidenceStep: input.confidenceStep,
    mainAtom: context.main.progress,
    linkedAtoms: context.linkedAtoms,
    clout: context.learner.clout,
    learnerTotalXp: context.learnerTotalXp,
    today: context.today,
  });

  await saveProgressChanges(transaction, context, kind, grade.wasCorrect, score);

  const lectureIdsThatGainedXp = [
    context.main.lectureId,
    ...context.linkedAtoms.map((linkedAtom) => linkedAtom.lectureId),
  ];
  const openedDoors = grade.wasCorrect ? await openDoorIfEarned(transaction, userId, lectureIdsThatGainedXp, now) : [];

  // Counted inside the transaction, so it already reflects this answer.
  const dueAtoms = await findDueAtoms(userId, context.today, transaction);

  const result = buildAnswerResult(context, kind, grade, score, { dueCount: dueAtoms.length, openedDoors });
  await insertReviewEvent(transaction, context, input, kind, score, result);
  return result;
}
