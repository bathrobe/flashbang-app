import { describe, expect, it } from "vitest";
import { getCloutChange, getCloutStakes } from "@/game/clout";
import { confidenceSteps, settings } from "@/game/settings";

describe("getCloutChange", () => {
  it("starts a new learner at 100", () => {
    expect(settings.clout.startingBalance).toBe(100);
  });

  it("gains 5, 10, 25 for a correct Guess, Hunch, Sure", () => {
    expect(getCloutChange("guess", true, 100)).toBe(5);
    expect(getCloutChange("hunch", true, 100)).toBe(10);
    expect(getCloutChange("sure", true, 100)).toBe(25);
  });

  it("loses 0, 5, 25 for a wrong Guess, Hunch, Sure", () => {
    expect(getCloutChange("guess", false, 100)).toBe(0);
    expect(getCloutChange("hunch", false, 100)).toBe(-5);
    expect(getCloutChange("sure", false, 100)).toBe(-25);
  });

  it("doubles the balance on a correct All in", () => {
    expect(getCloutChange("all_in", true, 100)).toBe(100);
    expect(getCloutChange("all_in", true, 340)).toBe(340);
  });

  it("gains at least 25 on a correct All in, even at a balance of zero", () => {
    for (const balance of [0, 1, 10, 24, 25, 26, 500]) {
      const gain = getCloutChange("all_in", true, balance);
      expect(gain).toBeGreaterThanOrEqual(25);
      expect(gain).toBeGreaterThanOrEqual(getCloutChange("sure", true, balance));
    }
    expect(getCloutChange("all_in", true, 0)).toBe(25);
  });

  it("sends the balance to zero on a wrong All in", () => {
    expect(getCloutChange("all_in", false, 340)).toBe(-340);
    expect(getCloutChange("all_in", false, 0)).toBe(0);
  });

  it("never takes the balance below zero", () => {
    for (const confidenceStep of confidenceSteps) {
      for (const balance of [0, 1, 4, 5, 24, 25, 100]) {
        const balanceAfter = balance + getCloutChange(confidenceStep, false, balance);
        expect(balanceAfter).toBeGreaterThanOrEqual(0);
      }
    }
    expect(getCloutChange("sure", false, 10)).toBe(-10);
  });
});

describe("getCloutStakes", () => {
  it("shows what the step would win and lose at the current balance", () => {
    expect(getCloutStakes("hunch", 100)).toEqual({ gainIfCorrect: 10, lossIfWrong: 5 });
    expect(getCloutStakes("sure", 10)).toEqual({ gainIfCorrect: 25, lossIfWrong: 10 });
    expect(getCloutStakes("all_in", 100)).toEqual({ gainIfCorrect: 100, lossIfWrong: 100 });
    expect(getCloutStakes("all_in", 0)).toEqual({ gainIfCorrect: 25, lossIfWrong: 0 });
  });
});
