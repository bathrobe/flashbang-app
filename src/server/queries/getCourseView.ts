import { and, asc, eq } from "drizzle-orm";
import { database } from "@/server/db/client";
import { course, lecture, lectureProgress } from "@/server/db/schema";
import { findDueAtoms } from "./dueAtoms";
import { getLearnerToday } from "./learnerToday";
import { loadStartedLectureAtoms, type CourseViewAtom } from "./loadStartedLectureAtoms";

export type LectureState = "started" | "not_started" | "draft";

export type CourseViewLecture = {
  lectureId: string;
  number: number;
  title: string;
  state: LectureState;
  atoms: CourseViewAtom[]; // only filled for a started lecture
  dueCount: number;
};

// Everything the course view needs. Null when no course has this slug
// (the page turns that into a 404).
export async function getCourseView(userId: string, courseSlug: string, now: Date = new Date()) {
  const [courseRow] = await database.select().from(course).where(eq(course.slug, courseSlug));
  if (!courseRow) return null;

  const today = await getLearnerToday(userId, now);

  const [lectureRows, dueAtoms] = await Promise.all([
    database
      .select({
        lectureId: lecture.id,
        number: lecture.number,
        title: lecture.title,
        status: lecture.status,
        startedAt: lectureProgress.startedAt,
      })
      .from(lecture)
      // A left join keeps every lecture; startedAt is null when this learner has not started it.
      .leftJoin(lectureProgress, and(eq(lectureProgress.lectureId, lecture.id), eq(lectureProgress.userId, userId)))
      .where(eq(lecture.courseId, courseRow.id))
      .orderBy(asc(lecture.number)),
    findDueAtoms(userId, today),
  ]);

  const startedLectureIds = lectureRows.filter((row) => row.startedAt !== null).map((row) => row.lectureId);
  const atoms = await loadStartedLectureAtoms(userId, startedLectureIds);
  const dueAtomIds = new Set(dueAtoms.map((dueAtom) => dueAtom.atomId));

  const lectures: CourseViewLecture[] = lectureRows.map((row) => {
    const state: LectureState =
      row.status === "draft" ? "draft" : row.startedAt !== null ? "started" : "not_started";
    const lectureAtoms = state === "started" ? atoms.filter((atomRow) => atomRow.lectureId === row.lectureId) : [];
    return {
      lectureId: row.lectureId,
      number: row.number,
      title: row.title,
      state,
      atoms: lectureAtoms,
      dueCount: lectureAtoms.filter((atomRow) => dueAtomIds.has(atomRow.atomId)).length,
    };
  });

  return {
    today,
    course: { slug: courseRow.slug, title: courseRow.title, lecturer: courseRow.lecturer },
    lectures,
  };
}
