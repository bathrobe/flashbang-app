import { describe, expect, it } from "vitest";
import { getFillFraction, planXpBarFill } from "@/components/feedback/planXpBarFill";

// Thresholds: Level 2 at 20, 3 at 40, 4 at 70, 5 at 110, then +50 each (6 at 160).
describe("planXpBarFill", () => {
  it("fills within one level when no threshold is passed", () => {
    expect(planXpBarFill(4, 16)).toEqual([
      { level: 1, levelStartXp: 0, nextLevelXp: 20, fromXp: 4, toXp: 16, endsInLevelUp: false },
    ]);
  });

  it("does not move when nothing was gained", () => {
    expect(planXpBarFill(25, 25)).toEqual([
      { level: 2, levelStartXp: 20, nextLevelXp: 40, fromXp: 25, toXp: 25, endsInLevelUp: false },
    ]);
  });

  it("exactly reaching a threshold fills to the end, then shows the new level empty", () => {
    expect(planXpBarFill(8, 20)).toEqual([
      { level: 1, levelStartXp: 0, nextLevelXp: 20, fromXp: 8, toXp: 20, endsInLevelUp: true },
      { level: 2, levelStartXp: 20, nextLevelXp: 40, fromXp: 20, toXp: 20, endsInLevelUp: false },
    ]);
  });

  it("crossing one threshold restarts from empty toward the next level", () => {
    expect(planXpBarFill(30, 46)).toEqual([
      { level: 2, levelStartXp: 20, nextLevelXp: 40, fromXp: 30, toXp: 40, endsInLevelUp: true },
      { level: 3, levelStartXp: 40, nextLevelXp: 70, fromXp: 40, toXp: 46, endsInLevelUp: false },
    ]);
  });

  it("crossing two thresholds levels up twice", () => {
    expect(planXpBarFill(15, 45)).toEqual([
      { level: 1, levelStartXp: 0, nextLevelXp: 20, fromXp: 15, toXp: 20, endsInLevelUp: true },
      { level: 2, levelStartXp: 20, nextLevelXp: 40, fromXp: 20, toXp: 40, endsInLevelUp: true },
      { level: 3, levelStartXp: 40, nextLevelXp: 70, fromXp: 40, toXp: 45, endsInLevelUp: false },
    ]);
  });

  it("above Level 5 each level spans 50 XP", () => {
    expect(planXpBarFill(150, 166)).toEqual([
      { level: 5, levelStartXp: 110, nextLevelXp: 160, fromXp: 150, toXp: 160, endsInLevelUp: true },
      { level: 6, levelStartXp: 160, nextLevelXp: 210, fromXp: 160, toXp: 166, endsInLevelUp: false },
    ]);
  });
});

describe("getFillFraction", () => {
  it("is the share of the level's span that is filled", () => {
    const [segment] = planXpBarFill(30, 35);
    expect(getFillFraction(segment, 20)).toBe(0);
    expect(getFillFraction(segment, 30)).toBe(0.5);
    expect(getFillFraction(segment, 40)).toBe(1);
  });
});
