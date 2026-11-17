import { and, asc, eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, course, lecture, lectureProgress } from "@/server/db/schema";

// What the start-lecture step needs: the lecture, whether this learner has
// already started it, and its active atoms' sentences in order.
// Null when the course or lecture does not exist (the page turns that into a 404).
export async function getLectureStart(userId: string, courseSlug: string, lectureNumber: number) {
  const [lectureRow] = await database
    .select({ lectureId: lecture.id, number: lecture.number, title: lecture.title, status: lecture.status })
    .from(lecture)
    .innerJoin(course, eq(course.id, lecture.courseId))
    .where(and(eq(course.slug, courseSlug), eq(lecture.number, lectureNumber)));
  if (!lectureRow) return null;

  const [progressRow] = await database
    .select({ startedAt: lectureProgress.startedAt })
    .from(lectureProgress)
    .where(and(eq(lectureProgress.userId, userId), eq(lectureProgress.lectureId, lectureRow.lectureId)));

  const atomRows = await database
    .select({ atomId: atom.id, sentence: atom.sentence })
    .from(atom)
    .where(and(eq(atom.lectureId, lectureRow.lectureId), eq(atom.status, "active")))
    .orderBy(asc(atom.position));

  return { ...lectureRow, alreadyStarted: progressRow !== undefined, atoms: atomRows };
}
