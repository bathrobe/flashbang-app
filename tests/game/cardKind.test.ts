import { describe, expect, it } from "vitest";
import { getCardKind } from "@/game/cardKind";
import { isTrialDoorEarned } from "@/game/levels";

const today = "2026-11-16";

describe("getCardKind", () => {
  it("is a first attempt when due today or earlier, whatever the retry flag", () => {
    expect(getCardKind({ dueOn: today, retryPending: false }, today)).toBe("first");
    expect(getCardKind({ dueOn: "2026-11-10", retryPending: true }, today)).toBe("first");
  });

  it("is a retry when not due but a retry is pending", () => {
    expect(getCardKind({ dueOn: "2026-11-17", retryPending: true }, today)).toBe("retry");
  });

  it("is nothing when not due and no retry is pending", () => {
    expect(getCardKind({ dueOn: "2026-11-17", retryPending: false }, today)).toBeNull();
  });
});

describe("isTrialDoorEarned", () => {
  it("needs every atom at Level 3 (40 XP)", () => {
    expect(isTrialDoorEarned([40, 40, 52])).toBe(true);
    expect(isTrialDoorEarned([40, 39, 52])).toBe(false);
    expect(isTrialDoorEarned([])).toBe(false);
  });
});
