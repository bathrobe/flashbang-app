import { describe, expect, it } from "vitest";
import { scoreAnswer } from "@/game/scoreAnswer";
import { confidenceSteps } from "@/game/settings";
import { makeScoreAnswerInput as makeInput } from "./makeScoreAnswerInput";

describe("scoreAnswer: XP", () => {
  it("gives 10 plus the confidence bonus for a correct first attempt", () => {
    const gained = confidenceSteps.map((confidenceStep) => scoreAnswer(makeInput({ confidenceStep })).mainAtom.xpGained);
    expect(gained).toEqual([10, 12, 14, 16]);
  });

  it("gives each linked atom round(main x weight), at least 1", () => {
    const linkedAtoms = [
      { atomId: "half", xp: 5, weight: 0.5 },
      { atomId: "third", xp: 0, weight: 0.3 },
      { atomId: "tiny", xp: 19, weight: 0.01 },
    ];
    const result = scoreAnswer(makeInput({ linkedAtoms }));
    expect(result.linkedAtoms.map((linkedAtom) => linkedAtom.xpGained)).toEqual([6, 4, 1]);
    expect(result.linkedAtoms[0]).toMatchObject({ atomId: "half", xpBefore: 5, xpAfter: 11 });
  });

  it("never decreases any XP, whatever the answer", () => {
    const linkedAtoms = [{ atomId: "linked", xp: 30, weight: 0.5 }];
    for (const kind of ["first", "retry"] as const) {
      for (const wasCorrect of [true, false]) {
        for (const confidenceStep of confidenceSteps) {
          const result = scoreAnswer(makeInput({ kind, wasCorrect, confidenceStep, linkedAtoms }));
          expect(result.mainAtom.xpAfter).toBeGreaterThanOrEqual(24);
          expect(result.linkedAtoms[0].xpAfter).toBeGreaterThanOrEqual(30);
          expect(result.learner.totalXpAfter).toBeGreaterThanOrEqual(50);
          if (!wasCorrect) expect(result.mainAtom.xpGained + result.linkedAtoms[0].xpGained).toBe(0);
        }
      }
    }
  });
});

describe("scoreAnswer: first attempts", () => {
  it("moves the interval, due date and review count", () => {
    const result = scoreAnswer(makeInput());
    expect(result.schedule?.intervalDays).toBeCloseTo(4.84);
    expect(result.schedule?.dueOn).toBe("2026-11-21");
    expect(result.schedule?.reviewCount).toBe(3);
    expect(result.clout).toEqual({ before: 100, after: 110, change: 10 });
  });

  it("on a wrong Sure: no XP, interval back to 1 day, clout down 25", () => {
    const result = scoreAnswer(makeInput({ wasCorrect: false, confidenceStep: "sure" }));
    expect(result.mainAtom.xpGained).toBe(0);
    expect(result.schedule).toEqual({ intervalDays: 1, dueOn: "2026-11-17", reviewCount: 3 });
    expect(result.clout).toEqual({ before: 100, after: 75, change: -25 });
  });

  it("never takes clout below zero", () => {
    for (const confidenceStep of confidenceSteps) {
      for (const clout of [0, 3, 20, 100]) {
        const result = scoreAnswer(makeInput({ wasCorrect: false, confidenceStep, clout }));
        expect(result.clout.after).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("gains at least 25 clout on a correct All in", () => {
    expect(scoreAnswer(makeInput({ confidenceStep: "all_in", clout: 0 })).clout.after).toBe(25);
    expect(scoreAnswer(makeInput({ confidenceStep: "all_in", clout: 10 })).clout.change).toBe(25);
    expect(scoreAnswer(makeInput({ confidenceStep: "all_in", clout: 100 })).clout.after).toBe(200);
  });
});

describe("scoreAnswer: retries", () => {
  it("a correct retry earns 3 XP and changes nothing else", () => {
    const linkedAtoms = [{ atomId: "linked", xp: 30, weight: 1 }];
    for (const confidenceStep of confidenceSteps) {
      const result = scoreAnswer(makeInput({ kind: "retry", confidenceStep, linkedAtoms }));
      expect(result.mainAtom.xpGained).toBe(3);
      expect(result.linkedAtoms[0].xpGained).toBe(0);
      expect(result.schedule).toBeNull();
      expect(result.clout).toEqual({ before: 100, after: 100, change: 0 });
      expect(result.learner.totalXpAfter).toBe(53);
    }
  });

  it("a wrong retry changes nothing at all", () => {
    for (const confidenceStep of confidenceSteps) {
      const result = scoreAnswer(makeInput({ kind: "retry", wasCorrect: false, confidenceStep }));
      expect(result.mainAtom.xpGained).toBe(0);
      expect(result.schedule).toBeNull();
      expect(result.clout.change).toBe(0);
    }
  });
});
