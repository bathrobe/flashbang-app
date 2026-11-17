import { and, asc, eq, inArray } from "drizzle-orm";
import { getDoorProgress } from "@/game/levels";
import { database } from "@/server/db/client";
import { atom, atomProgress, lecture, lectureProgress } from "@/server/db/schema";

// Trial door progress ("4 of 7 atoms at Level 3") for each of the given lectures,
// in lecture order. Counts active atoms only; one with no progress row is at 0 XP.
// `isOpen` comes from door_opened_at: an opened door stays open whatever the counts.
export async function loadDoorProgress(userId: string, lectureIds: string[]) {
  if (lectureIds.length === 0) return [];

  const rows = await database
    .select({
      lectureId: lecture.id,
      lectureNumber: lecture.number,
      xp: atomProgress.xp,
      doorOpenedAt: lectureProgress.doorOpenedAt,
    })
    .from(atom)
    .innerJoin(lecture, eq(lecture.id, atom.lectureId))
    .leftJoin(atomProgress, and(eq(atomProgress.atomId, atom.id), eq(atomProgress.userId, userId)))
    .leftJoin(lectureProgress, and(eq(lectureProgress.lectureId, lecture.id), eq(lectureProgress.userId, userId)))
    .where(and(inArray(atom.lectureId, lectureIds), eq(atom.status, "active")))
    .orderBy(asc(lecture.number));

  const xpValuesByLecture = new Map<string, { lectureNumber: number; isOpen: boolean; xpValues: number[] }>();
  for (const row of rows) {
    if (!xpValuesByLecture.has(row.lectureId)) {
      xpValuesByLecture.set(row.lectureId, { lectureNumber: row.lectureNumber, isOpen: row.doorOpenedAt !== null, xpValues: [] });
    }
    xpValuesByLecture.get(row.lectureId)!.xpValues.push(row.xp ?? 0);
  }

  return [...xpValuesByLecture.values()].map(({ lectureNumber, isOpen, xpValues }) => ({
    lectureNumber,
    isOpen,
    ...getDoorProgress(xpValues),
  }));
}
