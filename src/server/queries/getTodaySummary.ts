import { and, eq, inArray, sum } from "drizzle-orm";
import { findSessionMapEdges } from "@/game/sessionMapEdges";
import { summarizeToday } from "@/game/summarizeToday";
import { database } from "@/server/db/client";
import { atom, atomProgress, course, lecture, learnerState } from "@/server/db/schema";
import { findEarliestDueDate } from "./dueAtoms";
import { getLearnerToday } from "./learnerToday";
import { loadDoorProgress } from "./loadDoorProgress";
import { loadSessionMapQuestions } from "./loadSessionMapQuestions";
import { loadTodayEvents } from "./loadTodayEvents";
import { findNextSessionAtoms } from "./nextSessionAtoms";

// Everything the end screen shows, added up from today's answers. Null when
// the learner has answered nothing today. This file only loads rows; the
// adding-up is summarizeToday and findSessionMapEdges in src/game/.
export async function getTodaySummary(userId: string, now: Date = new Date()) {
  const today = await getLearnerToday(userId, now);
  const events = await loadTodayEvents(userId, today);
  if (events.length === 0) return null;

  const touchedAtomIds = [
    ...new Set(events.flatMap((event) => [event.mainAtomId, ...event.linkedXpGained.map((linked) => linked.atomId)])),
  ];

  const [atomRows, [stateRow], [xpRow], nextDueDate] = await Promise.all([
    database
      .select({
        atomId: atom.id,
        sentence: atom.sentence,
        xpNow: atomProgress.xp,
        lectureId: atom.lectureId,
        courseSlug: course.slug,
      })
      .from(atom)
      .innerJoin(atomProgress, and(eq(atomProgress.atomId, atom.id), eq(atomProgress.userId, userId)))
      .innerJoin(lecture, eq(lecture.id, atom.lectureId))
      .innerJoin(course, eq(course.id, lecture.courseId))
      .where(inArray(atom.id, touchedAtomIds)),
    database.select({ clout: learnerState.clout }).from(learnerState).where(eq(learnerState.userId, userId)),
    database.select({ totalXp: sum(atomProgress.xp) }).from(atomProgress).where(eq(atomProgress.userId, userId)),
    findEarliestDueDate(userId),
  ]);

  const totals = summarizeToday({
    events,
    atoms: atomRows,
    cloutNow: stateRow?.clout ?? 0,
    learnerTotalXpNow: Number(xpRow?.totalXp ?? 0),
  });

  const mapAtoms = [...totals.reviewedAtoms, ...totals.linkedOnlyAtoms];
  const mapAtomIds = mapAtoms.map((mapAtom) => mapAtom.atomId);
  const touchedLectureIds = [...new Set(atomRows.map((row) => row.lectureId))];
  const [mapQuestions, doorProgress, nextSession] = await Promise.all([
    loadSessionMapQuestions(mapAtomIds),
    loadDoorProgress(userId, touchedLectureIds),
    findNextSessionAtoms(userId, today),
  ]);

  return {
    today,
    ...totals,
    doorProgress,
    nextDueDate,
    // Due atoms the eased-return short session held back: "Keep going" offers them.
    keepGoingCount: nextSession.leftForLater,
    // The course of the first atom answered today: where "Back to the course" leads.
    courseSlug: atomRows.find((row) => row.atomId === events[0].mainAtomId)?.courseSlug ?? atomRows[0]?.courseSlug ?? null,
    map: {
      nodes: mapAtoms.map(({ atomId, sentence, levelNow }) => ({ atomId, sentence, level: levelNow })),
      edges: findSessionMapEdges(mapAtomIds, mapQuestions),
    },
  };
}

export type TodaySummary = NonNullable<Awaited<ReturnType<typeof getTodaySummary>>>;
