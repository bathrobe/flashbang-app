import { describe, expect, it } from "vitest";
import { addDaysToDate, getDaysBetween, getLearnerDate } from "@/game/learnerDate";

describe("getLearnerDate", () => {
  it("gives the calendar date in the learner's time zone", () => {
    // 20:00 UTC is 15:00 in New York (UTC-5 in November).
    expect(getLearnerDate(new Date("2026-11-16T20:00:00Z"), "America/New_York")).toBe("2026-11-16");
    // The same instant is already the 17th in Tokyo (05:00).
    expect(getLearnerDate(new Date("2026-11-16T20:00:00Z"), "Asia/Tokyo")).toBe("2026-11-17");
  });

  it("counts a review at 1 a.m. as the previous day", () => {
    // 06:00 UTC is 01:00 in New York.
    expect(getLearnerDate(new Date("2026-11-17T06:00:00Z"), "America/New_York")).toBe("2026-11-16");
  });

  it("starts the new day at exactly 04:00", () => {
    expect(getLearnerDate(new Date("2026-11-17T08:59:59Z"), "America/New_York")).toBe("2026-11-16");
    expect(getLearnerDate(new Date("2026-11-17T09:00:00Z"), "America/New_York")).toBe("2026-11-17");
  });

  it("treats just after midnight as the previous day, across a month end", () => {
    expect(getLearnerDate(new Date("2026-12-01T00:30:00Z"), "UTC")).toBe("2026-11-30");
    expect(getLearnerDate(new Date("2027-01-01T03:59:00Z"), "UTC")).toBe("2026-12-31");
  });

  it("works on the day the clocks go forward", () => {
    // 8 March 2026 in New York: 02:00 jumps to 03:00. 03:30 EDT is 07:30 UTC.
    expect(getLearnerDate(new Date("2026-03-08T07:30:00Z"), "America/New_York")).toBe("2026-03-07");
    expect(getLearnerDate(new Date("2026-03-08T08:00:00Z"), "America/New_York")).toBe("2026-03-08");
  });

  it("falls back to UTC for an unknown time zone", () => {
    expect(getLearnerDate(new Date("2026-11-16T20:00:00Z"), "Not/AZone")).toBe("2026-11-16");
  });
});

describe("date helpers", () => {
  it("adds and subtracts whole days", () => {
    expect(addDaysToDate("2026-11-16", 1)).toBe("2026-11-17");
    expect(addDaysToDate("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDaysToDate("2027-01-01", -1)).toBe("2026-12-31");
  });

  it("counts the days between two dates", () => {
    expect(getDaysBetween("2026-11-16", "2026-11-16")).toBe(0);
    expect(getDaysBetween("2026-11-16", "2026-11-23")).toBe(7);
    expect(getDaysBetween("2026-11-16", "2026-11-10")).toBe(-6);
  });
});
