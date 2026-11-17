// Is this atom's card a first attempt, a retry, or not due at all?
// loadCard and submitAnswer both ask this, and must always agree: that is
// what stops a second tab from scoring the same review twice.

export type CardKind = "first" | "retry";

type ProgressForKind = { dueOn: string; retryPending: boolean };

// `today` is the learner date. Dates are "YYYY-MM-DD" strings, so comparing
// them as text compares them as dates. null = not due and no retry waiting.
export function getCardKind(progress: ProgressForKind, today: string): CardKind | null {
  if (progress.dueOn <= today) return "first";
  if (progress.retryPending) return "retry";
  return null;
}
