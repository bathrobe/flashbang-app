import { desc, eq } from "drizzle-orm";
import { isEasedReturnToday } from "@/game/easedReturn";
import { getLearnerDate } from "@/game/learnerDate";
import { database } from "@/server/db/client";
import { course, lecture, lectureProgress, learnerState } from "@/server/db/schema";

export type WelcomeBackLecture = { courseSlug: string; number: number; title: string };

// What the welcome-back message says, or null when it should not show: it
// shows on the day an eased return began, until the learner starts or dismisses it.
export async function getWelcomeBack(userId: string, now: Date = new Date()) {
  const [stateRow] = await database.select().from(learnerState).where(eq(learnerState.userId, userId));
  if (!stateRow) return null;

  const timeZone = stateRow.timeZone ?? "UTC";
  const today = getLearnerDate(now, timeZone);
  if (!isEasedReturnToday(stateRow.easedReturnOn, today)) return null;
  if (stateRow.welcomeDismissedOn === today) return null;

  const lectureColumns = { courseSlug: course.slug, number: lecture.number, title: lecture.title };
  const [[currentLecture], publishedLectures] = await Promise.all([
    // Where they are: the furthest lecture they have started.
    database
      .select(lectureColumns)
      .from(lectureProgress)
      .innerJoin(lecture, eq(lecture.id, lectureProgress.lectureId))
      .innerJoin(course, eq(course.id, lecture.courseId))
      .where(eq(lectureProgress.userId, userId))
      .orderBy(desc(lecture.number))
      .limit(1),
    database
      .select({ ...lectureColumns, publishedAt: lecture.publishedAt })
      .from(lecture)
      .innerJoin(course, eq(course.id, lecture.courseId))
      .where(eq(lecture.status, "published"))
      .orderBy(lecture.number),
  ]);

  // Published on a later learner day than their last review: new to them.
  const lastReviewOn = stateRow.lastReviewOn;
  const publishedSince: WelcomeBackLecture[] = publishedLectures
    .filter(({ publishedAt }) => publishedAt && lastReviewOn && getLearnerDate(publishedAt, timeZone) > lastReviewOn)
    .map(({ courseSlug, number, title }) => ({ courseSlug, number, title }));

  return { currentLecture: currentLecture ?? null, publishedSince };
}

export type WelcomeBackValues = NonNullable<Awaited<ReturnType<typeof getWelcomeBack>>>;
