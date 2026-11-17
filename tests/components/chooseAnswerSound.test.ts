import { describe, expect, it } from "vitest";
import { chooseAnswerSound } from "@/components/feedback/chooseAnswerSound";

const plainCorrect = { wasCorrect: true, isAllInWipe: false, hasLevelUp: false, animate: true };

describe("chooseAnswerSound", () => {
  it("chimes for a correct answer and plays the soft sound for a wrong one", () => {
    expect(chooseAnswerSound(plainCorrect)).toBe("correct");
    expect(chooseAnswerSound({ ...plainCorrect, wasCorrect: false })).toBe("wrong");
  });

  it("plays the wipe sting instead of the wrong sound on an All in wipe", () => {
    expect(chooseAnswerSound({ ...plainCorrect, wasCorrect: false, isAllInWipe: true })).toBe("all-in-wipe");
  });

  it("leaves the level-up jingle to the bars when they animate", () => {
    expect(chooseAnswerSound({ ...plainCorrect, hasLevelUp: true })).toBe("correct");
  });

  it("plays the level-up jingle at once when the bars do not animate", () => {
    expect(chooseAnswerSound({ ...plainCorrect, hasLevelUp: true, animate: false })).toBe("level-up");
  });
});
