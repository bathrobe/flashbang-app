import { inArray } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom } from "@/server/db/schema";
import type { CheckedQuestion } from "./questionShape";

// Checks the atoms a batch of questions names against the database:
// each main atom must be an atom of this lecture, and each linked atom must be
// a real atom (it may belong to an earlier lecture). Empty list = fine.
export async function findAtomErrors(lectureId: string, questions: CheckedQuestion[]): Promise<string[]> {
  const namedAtomIds = [
    ...new Set(
      questions.flatMap((question) => [
        question.mainAtomId,
        ...question.linkedAtoms.map((linkedAtom) => linkedAtom.atomId),
      ]),
    ),
  ];
  if (namedAtomIds.length === 0) return [];

  const foundAtoms = await database
    .select({ id: atom.id, lectureId: atom.lectureId })
    .from(atom)
    .where(inArray(atom.id, namedAtomIds));
  const lectureIdByAtomId = new Map(foundAtoms.map((row) => [row.id, row.lectureId]));

  const errors: string[] = [];
  questions.forEach((question, position) => {
    const questionName = `Question ${position + 1}`;
    const mainAtomLectureId = lectureIdByAtomId.get(question.mainAtomId);

    if (!mainAtomLectureId) {
      errors.push(`${questionName}: main atom ${question.mainAtomId} does not exist`);
    } else if (mainAtomLectureId !== lectureId) {
      errors.push(`${questionName}: main atom ${question.mainAtomId} belongs to a different lecture`);
    }

    for (const linkedAtom of question.linkedAtoms) {
      if (!lectureIdByAtomId.has(linkedAtom.atomId)) {
        errors.push(`${questionName}: linked atom ${linkedAtom.atomId} does not exist`);
      }
    }
  });

  return errors;
}
