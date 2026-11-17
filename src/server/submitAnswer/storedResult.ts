import { and, eq } from "drizzle-orm";
import type { AnswerResult } from "@/server/answerTypes";
import { reviewEvent } from "@/server/db/schema";
import type { DatabaseOrTransaction } from "@/server/db/transactionType";

// Step 1 of submitAnswer: if this attemptId was already saved for this
// learner, the result it got back then (so a double click or a resend after a
// network failure changes nothing). Null when it hasn't been saved.
export async function findStoredResult(reader: DatabaseOrTransaction, userId: string, attemptId: string) {
  const [eventRow] = await reader
    .select({ result: reviewEvent.result })
    .from(reviewEvent)
    .where(and(eq(reviewEvent.attemptId, attemptId), eq(reviewEvent.userId, userId)));
  return eventRow ? (eventRow.result as AnswerResult) : null;
}

// Postgres's "unique_violation" error, which Drizzle wraps in its own error.
export function isUniqueViolation(error: unknown): boolean {
  const codeOf = (value: unknown) => (value as { code?: string } | undefined)?.code;
  return codeOf(error) === "23505" || codeOf((error as { cause?: unknown })?.cause) === "23505";
}
