import { and, asc, eq } from "drizzle-orm";
import { getDoorProgress } from "@/game/levels";
import { database } from "@/server/db/client";
import { course, lecture, lectureProgress } from "@/server/db/schema";
import { findNextSessionAtoms } from "./nextSessionAtoms";
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
  door: CourseViewDoor | null; // only for a started lecture
};

// A started lecture's trial door. Counts are over its ACTIVE atoms. Once
// opened it stays open whatever the counts say (it can never re-lock).
export type CourseViewDoor = ReturnType<typeof getDoorProgress> & { isOpen: boolean; isUnveiled: boolean };

// Everything the course view needs. Null when no course has this slug
// (the page turns that into a 404).
export async function getCourseView(userId: string, courseSlug: string, now: Date = new Date()) {
  const [courseRow] = await database.select().from(course).where(eq(course.slug, courseSlug));
  if (!courseRow) return null;

  const today = await getLearnerToday(userId, now);

  const [lectureRows, nextSession] = await Promise.all([
    database
      .select({
        lectureId: lecture.id,
        number: lecture.number,
        title: lecture.title,
        status: lecture.status,
        startedAt: lectureProgress.startedAt,
        doorOpenedAt: lectureProgress.doorOpenedAt,
        doorUnveiledAt: lectureProgress.doorUnveiledAt,
      })
      .from(lecture)
      // A left join keeps every lecture; startedAt is null when this learner has not started it.
      .leftJoin(lectureProgress, and(eq(lectureProgress.lectureId, lecture.id), eq(lectureProgress.userId, userId)))
      .where(eq(lecture.courseId, courseRow.id))
      .orderBy(asc(lecture.number)),
    // The next session's atoms, not every due atom: during an eased return
    // this is the short count, so no backlog total is shown.
    findNextSessionAtoms(userId, today),
  ]);

  const startedLectureIds = lectureRows.filter((row) => row.startedAt !== null).map((row) => row.lectureId);
  const atoms = await loadStartedLectureAtoms(userId, startedLectureIds);
  const dueAtomIds = new Set(nextSession.atomIds);

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
      door:
        state === "started"
          ? {
              ...getDoorProgress(lectureAtoms.map((atomRow) => atomRow.xp)),
              isOpen: row.doorOpenedAt !== null,
              isUnveiled: row.doorUnveiledAt !== null,
            }
          : null,
    };
  });

  return {
    today,
    course: { slug: courseRow.slug, title: courseRow.title, lecturer: courseRow.lecturer },
    lectures,
  };
}
