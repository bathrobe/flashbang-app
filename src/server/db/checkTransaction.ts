import { eq } from "drizzle-orm";
import { database } from "./client";
import { course } from "./schema";

// Proves real transactions work through the Neon Pool driver (spec Open Issue 11).
// It inserts a throwaway course row, and always leaves the table as it found it.

async function throwawayRowExists(slug: string) {
  const rows = await database.select({ id: course.id }).from(course).where(eq(course.slug, slug));
  return rows.length > 0;
}

function insertThrowawayRow(transaction: Pick<typeof database, "insert">, slug: string) {
  return transaction
    .insert(course)
    .values({ slug, title: "Transaction check", lecturer: "Nobody", lectureCount: 0 });
}

export async function checkTransaction() {
  const slug = `transaction-check-${crypto.randomUUID()}`;
  const rollbackSignal = new Error("roll back on purpose");

  // 1. Insert inside a transaction, then throw: the row must not survive.
  let sawRowInsideTransaction = false;
  try {
    await database.transaction(async (transaction) => {
      await insertThrowawayRow(transaction, slug);
      const rows = await transaction.select().from(course).where(eq(course.slug, slug));
      sawRowInsideTransaction = rows.length === 1;
      throw rollbackSignal;
    });
  } catch (error) {
    if (error !== rollbackSignal) throw error;
  }
  const goneAfterRollback = !(await throwawayRowExists(slug));

  // 2. Insert inside a transaction and let it finish: the row must be there.
  await database.transaction(async (transaction) => {
    await insertThrowawayRow(transaction, slug);
  });
  const presentAfterCommit = await throwawayRowExists(slug);

  // 3. Clean up.
  await database.delete(course).where(eq(course.slug, slug));
  const cleanedUp = !(await throwawayRowExists(slug));

  const steps = { sawRowInsideTransaction, goneAfterRollback, presentAfterCommit, cleanedUp };
  const success = Object.values(steps).every(Boolean);
  return { success, ...steps };
}
