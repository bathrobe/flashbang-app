// Which atoms the next review session holds, and in what order.

export type WaitingAtom = {
  atomId: string;
  dueOn: string; // learner date, "YYYY-MM-DD"
  retryPending: boolean;
  lectureNumber: number;
  position: number; // the atom's place within its lecture
};

// Order: most overdue first (earliest due date); ties keep lecture order, so a
// fresh lecture is reviewed in its own order. Atoms waiting only for a retry
// (not due) go last. `cap` (from getSessionCap) limits the due atoms only:
// a retry after a miss is never cut. `leftForLater` counts the due atoms the
// cap held back, which is what the end screen's "Keep going" offers.
export function chooseNextSessionAtoms(atoms: WaitingAtom[], today: string, cap: number | null) {
  const byLectureOrder = (first: WaitingAtom, second: WaitingAtom) =>
    first.lectureNumber - second.lectureNumber || first.position - second.position;

  // Dates are "YYYY-MM-DD" strings, so comparing them as text compares them as dates.
  const dueAtoms = atoms
    .filter((waitingAtom) => waitingAtom.dueOn <= today)
    .sort((first, second) => (first.dueOn === second.dueOn ? byLectureOrder(first, second) : first.dueOn < second.dueOn ? -1 : 1));
  const retryOnlyAtoms = atoms
    .filter((waitingAtom) => waitingAtom.dueOn > today && waitingAtom.retryPending)
    .sort(byLectureOrder);

  const keptDueAtoms = cap === null ? dueAtoms : dueAtoms.slice(0, cap);
  return {
    atomIds: [...keptDueAtoms, ...retryOnlyAtoms].map((waitingAtom) => waitingAtom.atomId),
    leftForLater: dueAtoms.length - keptDueAtoms.length,
  };
}
