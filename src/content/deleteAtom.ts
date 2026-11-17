import { eq, inArray, or } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, atomProgress, question, questionLink } from "@/server/db/schema";
import { findAtomDeleteBlockers } from "./findAtomDeleteBlockers";

// Removes an atom for good, with its questions and every link to it. Refused
// when a learner has XP on it or answers are recorded (see findAtomDeleteBlockers).
// Its progress rows hold no XP by then, so they go too (the database would
// otherwise refuse to delete an atom something still points at).
export async function deleteAtom(atomId: string): Promise<{ ok: true } | { ok: false; errors: string[] }> {
  const [existingAtom] = await database.select({ id: atom.id }).from(atom).where(eq(atom.id, atomId));
  if (!existingAtom) return { ok: false, errors: [`Atom ${atomId} does not exist`] };

  const blocker = (await findAtomDeleteBlockers([atomId])).get(atomId);
  if (blocker) return { ok: false, errors: [blocker] };

  await database.transaction(async (transaction) => {
    const atomQuestions = await transaction
      .select({ id: question.id })
      .from(question)
      .where(eq(question.mainAtomId, atomId));
    const questionIds = atomQuestions.map((row) => row.id);

    await transaction.delete(atomProgress).where(eq(atomProgress.atomId, atomId));
    const linkCondition = questionIds.length > 0
      ? or(eq(questionLink.atomId, atomId), inArray(questionLink.questionId, questionIds))
      : eq(questionLink.atomId, atomId);
    await transaction.delete(questionLink).where(linkCondition);
    if (questionIds.length > 0) await transaction.delete(question).where(inArray(question.id, questionIds));
    await transaction.delete(atom).where(eq(atom.id, atomId));
  });

  return { ok: true };
}
