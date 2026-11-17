import { and, asc, eq } from "drizzle-orm";
import type { TodayEvent } from "@/game/summarizeToday";
import { database } from "@/server/db/client";
import { reviewEvent } from "@/server/db/schema";

// Every answer this learner gave on `today` (a learner date), voided ones left
// out. Reading the whole day, not one sitting, is what covers a resumed session.
export async function loadTodayEvents(userId: string, today: string): Promise<TodayEvent[]> {
  const rows = await database
    .select({
      mainAtomId: reviewEvent.mainAtomId,
      mainXpGained: reviewEvent.mainXpGained,
      linkedXpGained: reviewEvent.linkedXpGained,
      cloutChange: reviewEvent.cloutChange,
      before: reviewEvent.before,
      answeredAt: reviewEvent.answeredAt,
      voided: reviewEvent.voided,
    })
    .from(reviewEvent)
    .where(and(eq(reviewEvent.userId, userId), eq(reviewEvent.learnerDate, today), eq(reviewEvent.voided, false)))
    .orderBy(asc(reviewEvent.answeredAt));

  return rows.map(({ before, ...row }) => ({ ...row, mainXpBefore: before.xp }));
}
