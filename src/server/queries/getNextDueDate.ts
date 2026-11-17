import { findEarliestDueDate } from "./dueAtoms";

// The date shown after "Nothing due. Next:". Null when nothing is scheduled.
// If something is due right now, this is today's date or an earlier one.
export async function getNextDueDate(userId: string): Promise<string | null> {
  return findEarliestDueDate(userId);
}
