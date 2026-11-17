import { asc, eq, inArray } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, question, questionLink } from "@/server/db/schema";

// Everything a lecture holds: its atoms in order, and every question whose main
// atom is one of them, each with its linked atoms. Read-only.
export async function readLectureContent(lectureId: string) {
  const atoms = await database
    .select()
    .from(atom)
    .where(eq(atom.lectureId, lectureId))
    .orderBy(asc(atom.position));
  if (atoms.length === 0) return { atoms, questions: [] };

  const atomIds = atoms.map((row) => row.id);
  const questionRows = await database
    .select()
    .from(question)
    .where(inArray(question.mainAtomId, atomIds))
    .orderBy(asc(question.createdAt), asc(question.id));
  if (questionRows.length === 0) return { atoms, questions: [] };

  const questionIds = questionRows.map((row) => row.id);
  const linkRows = await database.select().from(questionLink).where(inArray(questionLink.questionId, questionIds));

  const questions = questionRows.map((row) => ({
    ...row,
    linkedAtoms: linkRows
      .filter((link) => link.questionId === row.id)
      .map((link) => ({ atomId: link.atomId, weight: link.weight })),
  }));

  return { atoms, questions };
}

export type LectureContent = Awaited<ReturnType<typeof readLectureContent>>;
