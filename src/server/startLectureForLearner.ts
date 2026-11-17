import { and, eq } from "drizzle-orm";
import { settings } from "@/game/settings";
import { database } from "@/server/db/client";
import { atom, atomProgress, lecture, lectureProgress } from "@/server/db/schema";

type StartLectureResult = { ok: true; newAtomCount: number } | { ok: false; message: string };

// The plain function behind the startLecture action (actions/startLecture.ts
// checks access, then calls this). `today` is the learner date, e.g. "2026-11-16".
// Marks the lecture started and puts every active atom in the inbox, due today.
// Safe to call twice: rows that already exist are left alone, so a double
// click adds nothing and does not fail.
export async function startLectureForLearner(userId: string, lectureId: string, today: string): Promise<StartLectureResult> {
  const [lectureRow] = await database.select({ status: lecture.status }).from(lecture).where(eq(lecture.id, lectureId));
  if (!lectureRow) return { ok: false, message: "That lecture doesn't exist." };
  if (lectureRow.status !== "published") return { ok: false, message: "That lecture isn't open yet." };

  const activeAtoms = await database
    .select({ id: atom.id })
    .from(atom)
    .where(and(eq(atom.lectureId, lectureId), eq(atom.status, "active")));

  const insertedAtomRows = await database.transaction(async (transaction) => {
    await transaction.insert(lectureProgress).values({ userId, lectureId }).onConflictDoNothing();
    if (activeAtoms.length === 0) return [];
    return transaction
      .insert(atomProgress)
      .values(
        activeAtoms.map((activeAtom) => ({
          userId,
          atomId: activeAtom.id,
          xp: 0,
          intervalDays: settings.intervals.minimumDays,
          dueOn: today,
          reviewCount: 0,
        })),
      )
      .onConflictDoNothing()
      .returning({ atomId: atomProgress.atomId });
  });

  return { ok: true, newAtomCount: insertedAtomRows.length };
}
