import type { CardKind } from "@/game/cardKind";
import type { scoreAnswer } from "@/game/scoreAnswer";
import type { AnswerResult } from "@/server/answerTypes";
import { reviewEvent } from "@/server/db/schema";
import type { DatabaseTransaction } from "@/server/db/transactionType";
import type { AnswerContext } from "./loadAnswerContext";
import type { SubmitAnswerInput } from "./submitAnswerInput";

type Score = ReturnType<typeof scoreAnswer>;

// Step 6 of submitAnswer: the log row for this answer. `before` lets flagging
// undo it; `result` lets a repeat of this attemptId return the same answer.
// attempt_id is unique, so an identical submit that slipped past the earlier
// checks fails here and its whole transaction rolls back.
export async function insertReviewEvent(
  transaction: DatabaseTransaction,
  context: AnswerContext,
  input: SubmitAnswerInput,
  kind: CardKind,
  score: Score,
  result: AnswerResult,
) {
  const mainProgress = context.main.progress;
  await transaction.insert(reviewEvent).values({
    attemptId: input.attemptId,
    userId: context.learner.userId,
    questionId: context.question.id,
    mainAtomId: context.question.mainAtomId,
    kind,
    confidenceStep: input.confidenceStep,
    chosenOptionIds: result.chosenOptionIds,
    wasCorrect: result.wasCorrect,
    mainXpGained: score.mainAtom.xpGained,
    linkedXpGained: score.linkedAtoms
      .filter((linked) => linked.xpGained > 0)
      .map((linked) => ({ atomId: linked.atomId, xp: linked.xpGained })),
    cloutChange: score.clout.change,
    before: {
      xp: mainProgress.xp,
      intervalDays: mainProgress.intervalDays,
      dueOn: mainProgress.dueOn,
      reviewCount: mainProgress.reviewCount,
      retryPending: mainProgress.retryPending,
      lastQuestionId: mainProgress.lastQuestionId,
      clout: context.learner.clout,
    },
    result,
    learnerDate: context.today,
  });
}
