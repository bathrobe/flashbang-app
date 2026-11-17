import { describe, expect, it } from "vitest";
import { getDaysBetween } from "@/game/learnerDate";
import { scoreAnswer } from "@/game/scoreAnswer";
import { confidenceSteps } from "@/game/settings";
import { makeScoreAnswerInput as makeInput } from "./makeScoreAnswerInput";

describe("scoreAnswer: level-ups", () => {
  it("reports a level-up for the main atom, a linked atom and the learner", () => {
    const result = scoreAnswer(
      makeInput({
        mainAtom: { xp: 30, intervalDays: 2.2, reviewCount: 2 }, // 30 + 12 crosses 40
        linkedAtoms: [
          { atomId: "crosses", xp: 15, weight: 0.5 }, // 15 + 6 crosses 20
          { atomId: "stays", xp: 0, weight: 0.5 },
        ],
        learnerTotalXp: 90, // 90 + 12 + 6 + 6 crosses 100
      }),
    );
    expect(result.mainAtom).toMatchObject({ levelBefore: 2, levelAfter: 3, leveledUp: true });
    expect(result.linkedAtoms.map((linkedAtom) => linkedAtom.leveledUp)).toEqual([true, false]);
    expect(result.learner).toEqual({ totalXpBefore: 90, totalXpAfter: 114, levelBefore: 1, levelAfter: 2, leveledUp: true });
  });

  it("reports no level-up when no threshold is crossed", () => {
    const result = scoreAnswer(makeInput({ mainAtom: { xp: 0, intervalDays: 1, reviewCount: 0 }, learnerTotalXp: 0 }));
    expect(result.mainAtom.leveledUp).toBe(false);
    expect(result.learner.leveledUp).toBe(false);
  });
});

// REQUIRED by the spec: guards the trial-door criterion when the numbers are retuned.
describe("replay: a learner who never misses", () => {
  it.each(confidenceSteps)("reaches Level 3 (40 XP) by day 14 answering %s every time", (confidenceStep) => {
    const startDate = "2026-11-16";
    // startLecture creates the atom with interval 1 day, due today.
    let atom = { xp: 0, intervalDays: 1, reviewCount: 0 };
    let dueOn = startDate;
    let dayReachedLevel3: number | null = null;

    while (getDaysBetween(startDate, dueOn) <= 14 && dayReachedLevel3 === null) {
      const result = scoreAnswer(makeInput({ confidenceStep, mainAtom: atom, today: dueOn, learnerTotalXp: atom.xp }));
      if (result.mainAtom.levelAfter >= 3) dayReachedLevel3 = getDaysBetween(startDate, dueOn);
      atom = { xp: result.mainAtom.xpAfter, intervalDays: result.schedule!.intervalDays, reviewCount: result.schedule!.reviewCount };
      dueOn = result.schedule!.dueOn;
    }

    expect(dayReachedLevel3).not.toBeNull();
    expect(dayReachedLevel3).toBeLessThanOrEqual(14);
    expect(atom.xp).toBeGreaterThanOrEqual(40);
  });
});
