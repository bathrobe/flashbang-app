import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { database } from "@/server/db/client";
import { lectureProgress } from "@/server/db/schema";

// The plain function behind the markDoorUnveiled action: records that the
// trial door's unveiling has played, so it never plays again. Only touches a
// door that is open and not yet unveiled; any other call changes nothing.
// Returns whether it changed the row.
export async function markDoorUnveiledForLearner(userId: string, lectureId: string, now: Date = new Date()) {
  const changedRows = await database
    .update(lectureProgress)
    .set({ doorUnveiledAt: now })
    .where(
      and(
        eq(lectureProgress.userId, userId),
        eq(lectureProgress.lectureId, lectureId),
        isNotNull(lectureProgress.doorOpenedAt),
        isNull(lectureProgress.doorUnveiledAt),
      ),
    )
    .returning({ lectureId: lectureProgress.lectureId });
  return changedRows.length > 0;
}
