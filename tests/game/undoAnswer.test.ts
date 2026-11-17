import { describe, expect, it } from "vitest";
import { subtractNeverBelowZero, undoAnswer } from "@/game/undoAnswer";

const before = { intervalDays: 2.2, dueOn: "2026-11-16", reviewCount: 2, retryPending: false, lastQuestionId: "q-old" };

describe("undoAnswer", () => {
  it("takes back main and linked XP and a clout gain, and restores the schedule", () => {
    const undone = undoAnswer(
      { mainXpGained: 14, linkedXpGained: [{ atomId: "a2", xp: 7 }], cloutChange: 25, before },
      { mainXp: 44, linkedXpByAtomId: { a2: 20 }, clout: 125 },
    );
    expect(undone.mainAtom).toEqual({ xp: 30, ...before });
    expect(undone.linkedAtoms).toEqual([{ atomId: "a2", xp: 13 }]);
    expect(undone.clout).toBe(100);
  });

  it("gives back a clout loss, including an All in wipe", () => {
    const wipe = undoAnswer({ mainXpGained: 0, linkedXpGained: [], cloutChange: -180, before }, { mainXp: 5, linkedXpByAtomId: {}, clout: 0 });
    expect(wipe.clout).toBe(180);
    expect(wipe.mainAtom.xp).toBe(5);
  });

  it("never goes below zero, and skips linked atoms with no progress row", () => {
    const undone = undoAnswer(
      { mainXpGained: 14, linkedXpGained: [{ atomId: "a2", xp: 7 }, { atomId: "gone", xp: 3 }], cloutChange: 25, before },
      { mainXp: 4, linkedXpByAtomId: { a2: 2 }, clout: 10 },
    );
    expect(undone.mainAtom.xp).toBe(0);
    expect(undone.linkedAtoms).toEqual([{ atomId: "a2", xp: 0 }]);
    expect(undone.clout).toBe(0);
  });
});

describe("subtractNeverBelowZero", () => {
  it("subtracts, floored at zero", () => {
    expect(subtractNeverBelowZero(10, 3)).toBe(7);
    expect(subtractNeverBelowZero(3, 10)).toBe(0);
  });
});
