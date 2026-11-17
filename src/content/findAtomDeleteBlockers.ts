import { and, eq, gt, inArray } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atomProgress, question, reviewEvent } from "@/server/db/schema";

// Why each atom may NOT be deleted, keyed by atom id. An atom missing from the
// map can be deleted. Two reasons:
// - a learner has XP on it (the PRD rule: retire it instead, which keeps the XP);
// - answers to its questions are recorded (the answer log keeps its rows forever).
export async function findAtomDeleteBlockers(atomIds: string[]): Promise<Map<string, string>> {
  const blockers = new Map<string, string>();
  if (atomIds.length === 0) return blockers;

  const [atomsWithXp, atomsAnsweredAsMain, atomsWithAnsweredQuestions] = await Promise.all([
    database
      .selectDistinct({ atomId: atomProgress.atomId })
      .from(atomProgress)
      .where(and(inArray(atomProgress.atomId, atomIds), gt(atomProgress.xp, 0))),
    database
      .selectDistinct({ atomId: reviewEvent.mainAtomId })
      .from(reviewEvent)
      .where(inArray(reviewEvent.mainAtomId, atomIds)),
    // A question may have moved to this atom after it was answered elsewhere.
    database
      .selectDistinct({ atomId: question.mainAtomId })
      .from(reviewEvent)
      .innerJoin(question, eq(reviewEvent.questionId, question.id))
      .where(inArray(question.mainAtomId, atomIds)),
  ]);

  for (const row of [...atomsAnsweredAsMain, ...atomsWithAnsweredQuestions]) blockers.set(row.atomId, "Answers to its questions are recorded. Retire it instead.");
  for (const row of atomsWithXp) blockers.set(row.atomId, "A learner has earned XP on it. Retire it instead.");
  return blockers;
}
