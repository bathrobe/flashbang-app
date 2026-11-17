import { and, asc, eq, inArray } from "drizzle-orm";
import { getLevelFromXp, getNextLevelXpThreshold } from "@/game/levels";
import { database } from "@/server/db/client";
import { atom, atomProgress } from "@/server/db/schema";

// One atom token's worth of data on the course view.
export type CourseViewAtom = {
  atomId: string;
  lectureId: string;
  sentence: string;
  xp: number;
  level: number;
  nextLevelXp: number; // the XP at which it reaches its next level
  dueOn: string | null; // null if it has no progress row yet
};

// The active atoms of the given lectures, in position order, with this learner's progress.
// Part of getCourseView; kept in its own file to keep both short.
export async function loadStartedLectureAtoms(userId: string, lectureIds: string[]): Promise<CourseViewAtom[]> {
  if (lectureIds.length === 0) return [];

  const rows = await database
    .select({
      atomId: atom.id,
      lectureId: atom.lectureId,
      sentence: atom.sentence,
      xp: atomProgress.xp,
      dueOn: atomProgress.dueOn,
    })
    .from(atom)
    // Left join: an atom added after the lecture was started has no progress row until
    // the next session creates it; it still shows, at 0 XP.
    .leftJoin(atomProgress, and(eq(atomProgress.atomId, atom.id), eq(atomProgress.userId, userId)))
    .where(and(inArray(atom.lectureId, lectureIds), eq(atom.status, "active")))
    .orderBy(asc(atom.position));

  return rows.map((row) => {
    const xp = row.xp ?? 0;
    return {
      atomId: row.atomId,
      lectureId: row.lectureId,
      sentence: row.sentence,
      xp,
      level: getLevelFromXp(xp),
      nextLevelXp: getNextLevelXpThreshold(xp),
      dueOn: row.dueOn ?? null,
    };
  });
}
