import { describe, expect, it } from "vitest";
import { summarizeToday, type TodayEvent } from "@/game/summarizeToday";

let minute = 0;
function makeEvent(overrides: Partial<TodayEvent>): TodayEvent {
  minute += 1;
  return {
    mainAtomId: "a",
    mainXpGained: 0,
    linkedXpGained: [],
    cloutChange: 0,
    mainXpBefore: 0,
    answeredAt: new Date(Date.UTC(2026, 10, 16, 10, minute)),
    voided: false,
    ...overrides,
  };
}

const atoms = [
  { atomId: "a", sentence: "Atom A", xpNow: 25 },
  { atomId: "b", sentence: "Atom B", xpNow: 6 },
  { atomId: "c", sentence: "Atom C", xpNow: 41 },
];

describe("summarizeToday", () => {
  it("lists linked-only atoms separately, working their level before back from XP now", () => {
    const summary = summarizeToday({
      events: [makeEvent({ mainAtomId: "a", mainXpGained: 12, mainXpBefore: 13, linkedXpGained: [{ atomId: "c", xp: 6 }] })],
      atoms,
      cloutNow: 110,
      learnerTotalXpNow: 72,
    });
    expect(summary.reviewedAtoms.map((gain) => gain.atomId)).toEqual(["a"]);
    expect(summary.linkedOnlyAtoms).toEqual([{ atomId: "c", sentence: "Atom C", xpGained: 6, levelBefore: 2, levelNow: 3 }]);
  });

  it("detects level-ups by comparing the level before the first event with the level now", () => {
    const summary = summarizeToday({
      events: [makeEvent({ mainAtomId: "a", mainXpGained: 12, mainXpBefore: 13 })],
      atoms,
      cloutNow: 100,
      learnerTotalXpNow: 72,
    });
    expect(summary.atomLevelUps).toEqual([{ atomId: "a", sentence: "Atom A", xpGained: 12, levelBefore: 1, levelNow: 2 }]);
    expect(summary.learnerLevelUp).toBeNull();
  });

  it("counts retry XP and adds the clout change of every answer", () => {
    const summary = summarizeToday({
      events: [
        makeEvent({ mainAtomId: "b", mainXpGained: 0, mainXpBefore: 3, cloutChange: -5 }),
        makeEvent({ mainAtomId: "b", mainXpGained: 3, mainXpBefore: 3 }),
        makeEvent({ mainAtomId: "a", mainXpGained: 14, mainXpBefore: 11, cloutChange: 25 }),
      ],
      atoms,
      cloutNow: 120,
      learnerTotalXpNow: 72,
    });
    expect(summary.reviewedAtoms.map((gain) => [gain.atomId, gain.xpGained])).toEqual([["b", 3], ["a", 14]]);
    expect(summary.clout).toEqual({ change: 20, balance: 120 });
    expect(summary.xpGainedToday).toBe(17);
  });

  it("ignores voided events", () => {
    const summary = summarizeToday({
      events: [makeEvent({ mainAtomId: "a", mainXpGained: 16, cloutChange: 25, voided: true })],
      atoms,
      cloutNow: 100,
      learnerTotalXpNow: 72,
    });
    expect(summary.reviewedAtoms).toEqual([]);
    expect(summary.clout.change).toBe(0);
  });

  it("takes linked XP received before an atom's first direct answer out of its starting level", () => {
    const summary = summarizeToday({
      events: [
        makeEvent({ mainAtomId: "a", mainXpGained: 16, mainXpBefore: 0, linkedXpGained: [{ atomId: "c", xp: 8 }] }),
        makeEvent({ mainAtomId: "c", mainXpGained: 3, mainXpBefore: 38 }),
      ],
      atoms,
      cloutNow: 100,
      learnerTotalXpNow: 99 + 27,
    });
    const atomC = summary.reviewedAtoms.find((gain) => gain.atomId === "c");
    expect(atomC).toMatchObject({ xpGained: 11, levelBefore: 2, levelNow: 3 });
    expect(summary.linkedOnlyAtoms).toEqual([]);
    expect(summary.learnerLevelUp).toEqual({ levelBefore: 1, levelNow: 2 });
  });
});
