// How the review session's queue of atom ids changes after an answer.

// How many other cards come before a missed atom returns.
export const cardsBeforeRetry = 3;

// Takes the front atom off the queue. If it was missed, it goes back in three
// places later, or at the end when fewer than three cards remain. So a missed
// atom that is the only card left comes straight back.
export function getQueueAfterAnswer(queue: string[], frontAtomNeedsRetry: boolean): string[] {
  const [frontAtomId, ...remainingAtomIds] = queue;
  if (frontAtomId === undefined) return [];
  if (!frontAtomNeedsRetry) return remainingAtomIds;

  const insertAt = Math.min(cardsBeforeRetry, remainingAtomIds.length);
  return [...remainingAtomIds.slice(0, insertAt), frontAtomId, ...remainingAtomIds.slice(insertAt)];
}
