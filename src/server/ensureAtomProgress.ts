import { and, eq, isNull } from "drizzle-orm";
import { settings } from "@/game/settings";
import { database } from "@/server/db/client";
import { atom, atomProgress, lectureProgress } from "@/server/db/schema";

// An atom added to a lecture the learner has already started has no progress
// row yet (startLecture only made rows for the atoms that existed then). This
// makes the missing rows, due today, so the new atom joins the next session.
// `today` is the learner date, e.g. "2026-11-16". Safe to call on every visit.
export async function ensureAtomProgress(userId: string, today: string) {
  const atomsWithoutProgress = await database
    .select({ atomId: atom.id })
    .from(atom)
    .innerJoin(lectureProgress, and(eq(lectureProgress.lectureId, atom.lectureId), eq(lectureProgress.userId, userId)))
    .leftJoin(atomProgress, and(eq(atomProgress.atomId, atom.id), eq(atomProgress.userId, userId)))
    .where(and(eq(atom.status, "active"), isNull(atomProgress.atomId)));

  if (atomsWithoutProgress.length === 0) return;

  await database
    .insert(atomProgress)
    .values(
      atomsWithoutProgress.map(({ atomId }) => ({
        userId,
        atomId,
        xp: 0,
        intervalDays: settings.intervals.minimumDays,
        dueOn: today,
        reviewCount: 0,
      })),
    )
    .onConflictDoNothing();
}
