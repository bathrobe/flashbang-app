import { describe, expect, it } from "vitest";
import {
  getDoorProgress,
  getLearnerLevel,
  getLevelFromXp,
  getNextLearnerLevelXpThreshold,
  getNextLevelXpThreshold,
  getXpThresholdForLevel,
} from "@/game/levels";
import { settings } from "@/game/settings";

describe("atom levels", () => {
  it("uses the spec's thresholds: 0, 20, 40, 70, 110", () => {
    expect([1, 2, 3, 4, 5].map(getXpThresholdForLevel)).toEqual([0, 20, 40, 70, 110]);
  });

  it("puts Level 3 (the trial door level) at 40 XP", () => {
    expect(settings.levels.trialDoorLevel).toBe(3);
    expect(getLevelFromXp(39)).toBe(2);
    expect(getLevelFromXp(40)).toBe(3);
  });

  it("works out the level from XP at each edge", () => {
    expect(getLevelFromXp(0)).toBe(1);
    expect(getLevelFromXp(19)).toBe(1);
    expect(getLevelFromXp(20)).toBe(2);
    expect(getLevelFromXp(69)).toBe(3);
    expect(getLevelFromXp(70)).toBe(4);
    expect(getLevelFromXp(109)).toBe(4);
    expect(getLevelFromXp(110)).toBe(5);
  });

  it("needs 50 more XP for each level above Level 5", () => {
    expect(getXpThresholdForLevel(6)).toBe(160);
    expect(getXpThresholdForLevel(7)).toBe(210);
    expect(getLevelFromXp(159)).toBe(5);
    expect(getLevelFromXp(160)).toBe(6);
    expect(getLevelFromXp(210)).toBe(7);
  });

  it("gives the XP threshold of the next level", () => {
    expect(getNextLevelXpThreshold(0)).toBe(20);
    expect(getNextLevelXpThreshold(20)).toBe(40);
    expect(getNextLevelXpThreshold(45)).toBe(70);
    expect(getNextLevelXpThreshold(110)).toBe(160);
    expect(getNextLevelXpThreshold(165)).toBe(210);
  });
});

describe("learner level", () => {
  it("is 1 + floor(total XP / 100)", () => {
    expect(getLearnerLevel(0)).toBe(1);
    expect(getLearnerLevel(99)).toBe(1);
    expect(getLearnerLevel(100)).toBe(2);
    expect(getLearnerLevel(250)).toBe(3);
  });

  it("gives the total XP of the next learner level", () => {
    expect(getNextLearnerLevelXpThreshold(0)).toBe(100);
    expect(getNextLearnerLevelXpThreshold(100)).toBe(200);
    expect(getNextLearnerLevelXpThreshold(199)).toBe(200);
  });
});

describe("getDoorProgress", () => {
  it("counts the atoms at Level 3 out of all active atoms", () => {
    expect(getDoorProgress([0, 39, 40, 75])).toEqual({ doorLevel: 3, atomsAtDoorLevel: 2, atomCount: 4 });
  });

  it("is 0 of 0 for a lecture with no atoms", () => {
    expect(getDoorProgress([])).toEqual({ doorLevel: 3, atomsAtDoorLevel: 0, atomCount: 0 });
  });
});
