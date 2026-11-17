import { describe, expect, it } from "vitest";
import { gradeAnswer } from "@/game/gradeAnswer";

const multiSelectOptions = [
  { id: "a", isCorrect: true },
  { id: "b", isCorrect: true },
  { id: "c", isCorrect: false },
  { id: "d", isCorrect: false },
];

describe("gradeAnswer", () => {
  it("is right only when the chosen set equals the correct set", () => {
    expect(gradeAnswer(multiSelectOptions, ["b", "a"]).wasCorrect).toBe(true);
    expect(gradeAnswer(multiSelectOptions, ["a"]).wasCorrect).toBe(false); // no partial credit
    expect(gradeAnswer(multiSelectOptions, ["a", "b", "c"]).wasCorrect).toBe(false);
  });

  it("counts a repeated id once", () => {
    const grade = gradeAnswer(multiSelectOptions, ["a", "a", "b"]);
    expect(grade.wasCorrect).toBe(true);
    expect(grade.chosenOptionIds).toEqual(["a", "b"]);
  });

  it("returns the correct ids and reports ids that are not on the question", () => {
    const grade = gradeAnswer(multiSelectOptions, ["a", "b", "zzz"]);
    expect(grade.correctOptionIds).toEqual(["a", "b"]);
    expect(grade.unknownOptionIds).toEqual(["zzz"]);
    expect(grade.wasCorrect).toBe(false);
  });

  it("grades true/false", () => {
    const trueFalse = [
      { id: "true", isCorrect: false },
      { id: "false", isCorrect: true },
    ];
    expect(gradeAnswer(trueFalse, ["false"]).wasCorrect).toBe(true);
    expect(gradeAnswer(trueFalse, ["true"]).wasCorrect).toBe(false);
  });
});
