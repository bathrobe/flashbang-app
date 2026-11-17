import { and, eq, isNull } from "drizzle-orm";
import { isTrialDoorEarned } from "@/game/levels";
import type { OpenedDoor } from "@/server/answerTypes";
import { atom, atomProgress, lecture, lectureProgress } from "@/server/db/schema";
import type { DatabaseTransaction } from "@/server/db/transactionType";

// Step 10 of submitAnswer: for each lecture whose atoms just gained XP, open
// its trial door if every active atom is now at the door level and the door
// isn't open yet. Returns the doors that opened with this answer (usually none;
// a linked atom can mean more than one lecture is checked).
export async function openDoorIfEarned(transaction: DatabaseTransaction, userId: string, lectureIds: string[], now: Date) {
  const openedDoors: OpenedDoor[] = [];

  for (const lectureId of new Set(lectureIds)) {
    const atomRows = await transaction
      .select({ xp: atomProgress.xp })
      .from(atom)
      .leftJoin(atomProgress, and(eq(atomProgress.atomId, atom.id), eq(atomProgress.userId, userId)))
      .where(and(eq(atom.lectureId, lectureId), eq(atom.status, "active")));
    if (!isTrialDoorEarned(atomRows.map((row) => row.xp ?? 0))) continue;

    // `door_opened_at is null` makes this a no-op once the door is open: it never re-opens or re-locks.
    const openedRows = await transaction
      .update(lectureProgress)
      .set({ doorOpenedAt: now })
      .where(and(eq(lectureProgress.userId, userId), eq(lectureProgress.lectureId, lectureId), isNull(lectureProgress.doorOpenedAt)))
      .returning({ lectureId: lectureProgress.lectureId });
    if (openedRows.length === 0) continue;

    const [lectureRow] = await transaction.select({ number: lecture.number }).from(lecture).where(eq(lecture.id, lectureId));
    openedDoors.push({ lectureId, lectureNumber: lectureRow.number });
  }

  return openedDoors;
}
