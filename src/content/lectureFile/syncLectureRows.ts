import { eq, inArray, sql } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, atomProgress, question, questionLink, reviewEvent } from "@/server/db/schema";
import type { CardRow, QuestionRow } from "./buildLectureRows";

// Makes one lecture in the database match its lecture file.
// - A card or question in the file is added, or updated in place (same id, so
//   a learner's progress on it is kept).
// - A card or question no longer in the file is deleted for good, together
//   with the answers and progress recorded against it.

export type SyncPlan = { cardsToDelete: string[]; questionsToDelete: string[]; cardsInFile: number; questionsInFile: number };

export async function planLectureSync(lectureId: string, cards: CardRow[], questions: QuestionRow[]): Promise<SyncPlan> {
  const existingCards = await database.select({ id: atom.id }).from(atom).where(eq(atom.lectureId, lectureId));
  const existingCardIds = existingCards.map((row) => row.id);
  const existingQuestions = existingCardIds.length === 0 ? [] : await database
    .select({ id: question.id })
    .from(question)
    .where(inArray(question.mainAtomId, existingCardIds));

  const cardIdsInFile = new Set(cards.map((card) => card.id));
  const questionIdsInFile = new Set(questions.map((row) => row.id));
  return {
    cardsToDelete: existingCardIds.filter((id) => !cardIdsInFile.has(id)),
    questionsToDelete: existingQuestions.map((row) => row.id).filter((id) => !questionIdsInFile.has(id)),
    cardsInFile: cards.length,
    questionsInFile: questions.length,
  };
}

export async function applyLectureSync(lectureId: string, cards: CardRow[], questions: QuestionRow[], plan: SyncPlan) {
  const { cardsToDelete, questionsToDelete } = plan;
  await database.transaction(async (transaction) => {
    if (questionsToDelete.length > 0) {
      await transaction.delete(reviewEvent).where(inArray(reviewEvent.questionId, questionsToDelete));
      await transaction.update(atomProgress).set({ lastQuestionId: null }).where(inArray(atomProgress.lastQuestionId, questionsToDelete));
      await transaction.delete(questionLink).where(inArray(questionLink.questionId, questionsToDelete));
    }
    if (cardsToDelete.length > 0) {
      await transaction.delete(reviewEvent).where(inArray(reviewEvent.mainAtomId, cardsToDelete));
      await transaction.delete(atomProgress).where(inArray(atomProgress.atomId, cardsToDelete));
      await transaction.delete(questionLink).where(inArray(questionLink.atomId, cardsToDelete));
    }
    if (questionsToDelete.length > 0) await transaction.delete(question).where(inArray(question.id, questionsToDelete));
    if (cardsToDelete.length > 0) await transaction.delete(atom).where(inArray(atom.id, cardsToDelete));

    const keepNewValue = (columnName: string) => sql.raw(`excluded."${columnName}"`);
    await transaction
      .insert(atom)
      .values(cards.map((card) => ({ ...card, lectureId, status: "active" as const })))
      .onConflictDoUpdate({
        target: atom.id,
        set: {
          kind: keepNewValue("kind"), position: keepNewValue("position"), sentence: keepNewValue("sentence"),
          blurb: keepNewValue("blurb"), transcriptRef: keepNewValue("transcript_ref"), details: keepNewValue("details"),
        },
      });
    if (questions.length === 0) return;
    await transaction
      .insert(question)
      .values(questions.map((row) => ({ ...row, status: "active" as const })))
      .onConflictDoUpdate({
        target: question.id,
        set: {
          mainAtomId: keepNewValue("main_atom_id"), format: keepNewValue("format"), rung: keepNewValue("rung"),
          prompt: keepNewValue("prompt"), options: keepNewValue("options"), explanation: keepNewValue("explanation"),
          isIntroductory: keepNewValue("is_introductory"), updatedAt: new Date(),
        },
      });
  });
}
