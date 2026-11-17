import { and, eq, exists, inArray, or } from "drizzle-orm";
import type { QuestionAtoms } from "@/game/sessionMapEdges";
import { database } from "@/server/db/client";
import { question, questionLink } from "@/server/db/schema";

// Every ACTIVE question that involves at least one of today's atoms (as its
// main atom or a linked one), with all the atoms it involves. The session
// map turns these into lines with findSessionMapEdges.
export async function loadSessionMapQuestions(todayAtomIds: string[]): Promise<QuestionAtoms[]> {
  if (todayAtomIds.length === 0) return [];

  const linksToTodayAtom = exists(
    database
      .select({ questionId: questionLink.questionId })
      .from(questionLink)
      .where(and(eq(questionLink.questionId, question.id), inArray(questionLink.atomId, todayAtomIds))),
  );

  // A left join gives one row per (question, link), or one row with a null link.
  const rows = await database
    .select({ questionId: question.id, mainAtomId: question.mainAtomId, linkedAtomId: questionLink.atomId })
    .from(question)
    .leftJoin(questionLink, eq(questionLink.questionId, question.id))
    .where(and(eq(question.status, "active"), or(inArray(question.mainAtomId, todayAtomIds), linksToTodayAtom)));

  const questionsById = new Map<string, QuestionAtoms>();
  for (const row of rows) {
    if (!questionsById.has(row.questionId)) {
      questionsById.set(row.questionId, { mainAtomId: row.mainAtomId, linkedAtomIds: [] });
    }
    if (row.linkedAtomId) questionsById.get(row.questionId)!.linkedAtomIds.push(row.linkedAtomId);
  }
  return [...questionsById.values()];
}
