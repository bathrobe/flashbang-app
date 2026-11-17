// Every number in the scoring rules lives here. Tuning the game is editing this file.

export const confidenceSteps = ["guess", "hunch", "sure", "all_in"] as const;
export type ConfidenceStep = (typeof confidenceSteps)[number];

export const settings = {
  xp: {
    correctFirstAttemptBase: 10,
    confidenceBonus: { guess: 0, hunch: 2, sure: 4, all_in: 6 },
    correctRetry: 3,
    minimumLinkedXp: 1,
  },

  levels: {
    // XP needed for Level 1, 2, 3, 4, 5 (position 0 is Level 1).
    atomXpThresholds: [0, 20, 40, 70, 110],
    xpPerLevelAboveTable: 50,
    learnerXpPerLevel: 100,
    trialDoorLevel: 3,
  },

  intervals: {
    minimumDays: 1,
    firstCorrectReviewDays: 1,
    correctMultiplier: { guess: 1.5, hunch: 2.2, sure: 2.8, all_in: 2.8 },
    // After a wrong first attempt: "half" halves the interval, "reset" sends it back to the minimum.
    wrongRule: { guess: "half", hunch: "half", sure: "reset", all_in: "reset" },
  },

  clout: {
    startingBalance: 100,
    correctGain: { guess: 5, hunch: 10, sure: 25 },
    wrongLoss: { guess: 0, hunch: 5, sure: 25 },
    // All in doubles the balance, but always wins at least this much (so it is worth something at 0).
    allInMinimumGain: 25,
  },

  easedReturn: {
    // Seven or more days since the last review counts as coming back after a gap.
    gapDays: 7,
    // While easing back in, a day's sessions together hold this many first attempts.
    shortSessionSize: 5,
  },

  learnerDay: {
    // The learner's day starts at 04:00, so a review at 1 a.m. counts as the day before.
    startHour: 4,
  },
};
