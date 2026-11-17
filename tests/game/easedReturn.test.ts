import { describe, expect, it } from "vitest";
import { getSessionCap, isEasedReturnToday, isReturningAfterGap } from "@/game/easedReturn";

describe("isReturningAfterGap", () => {
  it("is a return after seven days or more", () => {
    expect(isReturningAfterGap("2026-11-09", "2026-11-16")).toBe(true);
    expect(isReturningAfterGap("2026-11-06", "2026-11-16")).toBe(true);
  });

  it("is not a return after fewer than seven days", () => {
    expect(isReturningAfterGap("2026-11-10", "2026-11-16")).toBe(false);
    expect(isReturningAfterGap("2026-11-16", "2026-11-16")).toBe(false);
  });

  it("does not count someone who has never reviewed", () => {
    expect(isReturningAfterGap(null, "2026-11-16")).toBe(false);
  });
});

describe("isEasedReturnToday", () => {
  it("lasts only for the day it began", () => {
    expect(isEasedReturnToday("2026-11-16", "2026-11-16")).toBe(true);
    expect(isEasedReturnToday("2026-11-16", "2026-11-17")).toBe(false);
    expect(isEasedReturnToday(null, "2026-11-16")).toBe(false);
  });
});

describe("getSessionCap", () => {
  const easedToday = { easedReturnOn: "2026-11-16", today: "2026-11-16", all: false };

  it("is five minus the first attempts made today", () => {
    expect(getSessionCap({ ...easedToday, firstAttemptsToday: 0 })).toBe(5);
    expect(getSessionCap({ ...easedToday, firstAttemptsToday: 2 })).toBe(3);
  });

  it("never goes below zero", () => {
    expect(getSessionCap({ ...easedToday, firstAttemptsToday: 5 })).toBe(0);
    expect(getSessionCap({ ...easedToday, firstAttemptsToday: 8 })).toBe(0);
  });

  it("has no limit when the learner asks for everything", () => {
    expect(getSessionCap({ ...easedToday, firstAttemptsToday: 5, all: true })).toBeNull();
  });

  it("has no limit on any other day", () => {
    expect(getSessionCap({ ...easedToday, today: "2026-11-17", firstAttemptsToday: 0 })).toBeNull();
    expect(getSessionCap({ ...easedToday, easedReturnOn: null, firstAttemptsToday: 0 })).toBeNull();
  });
});
