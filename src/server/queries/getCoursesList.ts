import { asc, count, eq, inArray } from "drizzle-orm";
import { database } from "@/server/db/client";
import { atom, course, lecture } from "@/server/db/schema";
import { findNextSessionAtoms } from "./nextSessionAtoms";
import { getLearnerToday } from "./learnerToday";

export type CourseCard = {
  slug: string;
  title: string;
  lecturer: string;
  lectureCount: number;
  publishedLectureCount: number;
  dueCount: number;
};

// Everything the courses view needs: today's date and one card per course.
export async function getCoursesList(userId: string, now: Date = new Date()) {
  const today = await getLearnerToday(userId, now);

  const [courseRows, publishedCounts, nextSession] = await Promise.all([
    database.select().from(course).orderBy(asc(course.title)),
    database
      .select({ courseId: lecture.courseId, publishedLectureCount: count() })
      .from(lecture)
      .where(eq(lecture.status, "published"))
      .groupBy(lecture.courseId),
    // The next session's atoms, not every due atom: during an eased return
    // this is the short count, so no backlog total is shown.
    findNextSessionAtoms(userId, today),
  ]);

  const dueCountByCourseId = await countDueAtomsByCourse(nextSession.atomIds);

  const courses: CourseCard[] = courseRows.map((courseRow) => ({
    slug: courseRow.slug,
    title: courseRow.title,
    lecturer: courseRow.lecturer,
    lectureCount: courseRow.lectureCount,
    publishedLectureCount:
      publishedCounts.find((row) => row.courseId === courseRow.id)?.publishedLectureCount ?? 0,
    dueCount: dueCountByCourseId.get(courseRow.id) ?? 0,
  }));

  return { today, courses };
}

// findDueAtoms gives atom ids for every course at once; this splits them by course.
async function countDueAtomsByCourse(dueAtomIds: string[]) {
  const dueCountByCourseId = new Map<string, number>();
  if (dueAtomIds.length === 0) return dueCountByCourseId;

  const rows = await database
    .select({ courseId: lecture.courseId, dueCount: count() })
    .from(atom)
    .innerJoin(lecture, eq(lecture.id, atom.lectureId))
    .where(inArray(atom.id, dueAtomIds))
    .groupBy(lecture.courseId);
  for (const row of rows) dueCountByCourseId.set(row.courseId, row.dueCount);
  return dueCountByCourseId;
}
