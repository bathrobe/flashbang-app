// What flagging a question puts back when its answer is undone.
// XP and clout are reversed BY AMOUNT (so a later answer in between still
// counts); the schedule is restored from the snapshot taken just before.

type AnsweredEvent = {
  mainXpGained: number;
  linkedXpGained: { atomId: string; xp: number }[];
  cloutChange: number;
  before: { intervalDays: number; dueOn: string; reviewCount: number; retryPending: boolean; lastQuestionId: string | null };
};

type CurrentValues = {
  mainXp: number;
  linkedXpByAtomId: Record<string, number>; // only atoms that have a progress row
  clout: number;
};

// XP and clout never go below zero.
export function subtractNeverBelowZero(current: number, amount: number): number {
  return Math.max(0, current - amount);
}

export function undoAnswer(event: AnsweredEvent, current: CurrentValues) {
  const { intervalDays, dueOn, reviewCount, retryPending, lastQuestionId } = event.before;
  return {
    mainAtom: {
      xp: subtractNeverBelowZero(current.mainXp, event.mainXpGained),
      intervalDays,
      dueOn,
      reviewCount,
      retryPending,
      lastQuestionId,
    },
    linkedAtoms: event.linkedXpGained
      .filter((linked) => linked.atomId in current.linkedXpByAtomId)
      .map((linked) => ({ atomId: linked.atomId, xp: subtractNeverBelowZero(current.linkedXpByAtomId[linked.atomId], linked.xp) })),
    // A gain is taken back; a loss (including an All in wipe) is given back.
    clout: subtractNeverBelowZero(current.clout, event.cloutChange),
  };
}
