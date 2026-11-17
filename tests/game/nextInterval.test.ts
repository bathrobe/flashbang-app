import { describe, expect, it } from "vitest";
import { getDueDate, getNextIntervalDays } from "@/game/nextInterval";
import { confidenceSteps } from "@/game/settings";

describe("getNextIntervalDays", () => {
  it("gives 1 day after a correct answer on a never-reviewed atom, at every step", () => {
    for (const confidenceStep of confidenceSteps) {
      const input = { wasCorrect: true, confidenceStep, intervalDays: 1, reviewCount: 0 };
      expect(getNextIntervalDays(input)).toBe(1);
    }
  });

  it("multiplies by 1.5, 2.2, 2.8, 2.8 after a later correct answer", () => {
    const later = { wasCorrect: true, intervalDays: 2, reviewCount: 3 };
    expect(getNextIntervalDays({ ...later, confidenceStep: "guess" })).toBeCloseTo(3);
    expect(getNextIntervalDays({ ...later, confidenceStep: "hunch" })).toBeCloseTo(4.4);
    expect(getNextIntervalDays({ ...later, confidenceStep: "sure" })).toBeCloseTo(5.6);
    expect(getNextIntervalDays({ ...later, confidenceStep: "all_in" })).toBeCloseTo(5.6);
  });

  it("halves the interval after a wrong Guess or Hunch", () => {
    const wrong = { wasCorrect: false, intervalDays: 8, reviewCount: 3 };
    expect(getNextIntervalDays({ ...wrong, confidenceStep: "guess" })).toBe(4);
    expect(getNextIntervalDays({ ...wrong, confidenceStep: "hunch" })).toBe(4);
  });

  it("resets to 1 day after a wrong Sure or All in", () => {
    const wrong = { wasCorrect: false, intervalDays: 8, reviewCount: 3 };
    expect(getNextIntervalDays({ ...wrong, confidenceStep: "sure" })).toBe(1);
    expect(getNextIntervalDays({ ...wrong, confidenceStep: "all_in" })).toBe(1);
  });

  it("never goes below 1 day", () => {
    for (const confidenceStep of confidenceSteps) {
      for (const reviewCount of [0, 1]) {
        const input = { wasCorrect: false, confidenceStep, intervalDays: 1, reviewCount };
        expect(getNextIntervalDays(input)).toBe(1);
      }
    }
  });
});

describe("getDueDate", () => {
  it("adds the interval rounded to the nearest whole day", () => {
    expect(getDueDate("2026-11-16", 1)).toBe("2026-11-17");
    expect(getDueDate("2026-11-16", 2.2)).toBe("2026-11-18");
    expect(getDueDate("2026-11-16", 2.8)).toBe("2026-11-19");
    expect(getDueDate("2026-11-16", 1.5)).toBe("2026-11-18");
  });

  it("crosses month and year ends", () => {
    expect(getDueDate("2026-12-30", 4.84)).toBe("2027-01-04");
    expect(getDueDate("2028-02-28", 1)).toBe("2028-02-29");
  });
});
