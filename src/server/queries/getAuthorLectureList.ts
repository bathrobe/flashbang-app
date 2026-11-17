import { asc, eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, lecture, question } from "@/server/db/schema";

// The author page's front list: every lecture with its status and how many
// atoms and (not deleted) questions it holds. Admin only.
export async function getAuthorLectureList() {
  const [lectureRows, atomRows, questionRows] = await Promise.all([
    database.select().from(lecture).orderBy(asc(lecture.number)),
    database.select({ id: atom.id, lectureId: atom.lectureId }).from(atom),
    database
      .select({ lectureId: atom.lectureId, status: question.status })
      .from(question)
      .innerJoin(atom, eq(atom.id, question.mainAtomId)),
  ]);

  return lectureRows.map((lectureRow) => ({
    number: lectureRow.number,
    title: lectureRow.title,
    status: lectureRow.status,
    atomCount: atomRows.filter((atomRow) => atomRow.lectureId === lectureRow.id).length,
    questionCount: questionRows.filter(
      (questionRow) => questionRow.lectureId === lectureRow.id && questionRow.status !== "deleted",
    ).length,
  }));
}
