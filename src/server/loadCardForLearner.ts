import { and, eq, inArray, max } from "drizzle-orm";
import { pickQuestion } from "@/game/pickQuestion";
import { database } from "@/server/db/client";
import { atom, atomProgress, question, reviewEvent } from "@/server/db/schema";
import type { LoadCardResult } from "./cardTypes";
import { orderCardOptions } from "./orderCardOptions";

// The plain function behind the loadCard action (actions/loadCard.ts checks
// access, then calls this). `today` is the learner date, e.g. "2026-11-16".
export async function loadCardForLearner(userId: string, atomId: string, today: string): Promise<LoadCardResult> {
  const [progress] = await database
    .select({ dueOn: atomProgress.dueOn, retryPending: atomProgress.retryPending, reviewCount: atomProgress.reviewCount, lastQuestionId: atomProgress.lastQuestionId })
    .from(atomProgress)
    .innerJoin(atom, eq(atom.id, atomProgress.atomId))
    .where(and(eq(atomProgress.userId, userId), eq(atomProgress.atomId, atomId), eq(atom.status, "active")));

  // The server decides the kind (submitAnswer repeats this check). Dates are
  // "YYYY-MM-DD" strings, so comparing them as text compares them as dates.
  if (!progress) return { kind: "not_due" };
  const kind = progress.dueOn <= today ? "first" : progress.retryPending ? "retry" : null;
  if (!kind) return { kind: "not_due" };

  const activeQuestions = await database
    .select()
    .from(question)
    .where(and(eq(question.mainAtomId, atomId), eq(question.status, "active")));
  if (activeQuestions.length === 0) return { kind: "no_questions" };

  // When this learner last answered each question (voided answers don't count).
  const answeredRows = await database
    .select({ questionId: reviewEvent.questionId, lastAnsweredAt: max(reviewEvent.answeredAt) })
    .from(reviewEvent)
    .where(
      and(
        eq(reviewEvent.userId, userId),
        eq(reviewEvent.voided, false),
        inArray(reviewEvent.questionId, activeQuestions.map((activeQuestion) => activeQuestion.id)),
      ),
    )
    .groupBy(reviewEvent.questionId);

  const picked = pickQuestion({
    activeQuestions,
    reviewCount: progress.reviewCount,
    lastQuestionId: progress.lastQuestionId,
    lastAnsweredAtByQuestionId: Object.fromEntries(answeredRows.map((row) => [row.questionId, row.lastAnsweredAt])),
  });
  if (!picked) return { kind: "no_questions" };

  // Built field by field, never by spreading the row: the row holds which
  // options are correct and the explanation, and neither may reach the browser.
  const chosenQuestion = picked.question;
  return {
    kind,
    isNew: picked.isNew,
    questionId: chosenQuestion.id,
    format: chosenQuestion.format,
    prompt: chosenQuestion.prompt,
    options: orderCardOptions(chosenQuestion.format, chosenQuestion.options),
    image: chosenQuestion.imagePath
      ? { path: chosenQuestion.imagePath, credit: chosenQuestion.imageCredit, kind: chosenQuestion.imageKind }
      : null,
  };
}
